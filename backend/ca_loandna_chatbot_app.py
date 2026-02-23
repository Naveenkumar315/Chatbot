# uvicorn ca_loandna_chatbot_app:app --host 0.0.0.0 --port 8003


from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from llama_index.vector_stores.qdrant import QdrantVectorStore
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from qdrant_client import QdrantClient
from llama_index.core import VectorStoreIndex, StorageContext
# from langchain_ollama import OllamaLLM
from llama_index.llms.azure_openai import AzureOpenAI
# from langchain_openai import AzureChatOpenAI
import time
import os
import warnings
from pydantic import PydanticDeprecatedSince20
from pathlib import Path
from routes.sso_login import router as sso_router
from fastapi.security import HTTPBearer
from services.db_service import get_db
from services.chat_service import get_or_create_conversation, save_message, save_reaction, save_sources
from services.db_initializer import initialize_database


warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", message=".*validate_default.*")

llm = 'llama3'
llm = 'azureOpenAI'
llm = 'mistral'
llm = 'qwen'

# FastAPI app
app = FastAPI()


@app.on_event("startup")
def startup_event():
    initialize_database()


app.include_router(sso_router)

security = HTTPBearer()


# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001",
                   "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Range", "Accept-Ranges",
                    "Content-Length", "Content-Type"],
)

# Load LLM and index at startup
print("🔄 Initializing chatbot...")
start_time = time.time()

llm = AzureOpenAI(
    api_key="46c387a4d08e43939514bf855bcb8e15",
    azure_endpoint="https://capl-ldna-oai.openai.azure.com/",
    api_version="2024-12-01-preview",
    deployment_name="gpt-35-turbo",
    temperature=0
)


# 1️⃣ Setup LLM
# llm = OllamaLLM(model="llama3.3", base_url="http://172.171.36.187")


# 2️⃣ Setup embedding and Qdrant client (same as loader!)
embed_model = HuggingFaceEmbedding(model_name="local_bge_embeddings")
qdrant_client = QdrantClient(host="localhost", port=6333)

# --- India collection ---
india_vector_store = QdrantVectorStore(
    client=qdrant_client,
    collection_name="india_policies",   # 👈 match your loader
)
india_storage_context = StorageContext.from_defaults(
    vector_store=india_vector_store)
india_index = VectorStoreIndex.from_vector_store(
    vector_store=india_vector_store,
    storage_context=india_storage_context,
    embed_model=embed_model,
)

# --- US collection ---
us_vector_store = QdrantVectorStore(
    client=qdrant_client,
    collection_name="us_policies",      # 👈 match your loader
)
us_storage_context = StorageContext.from_defaults(vector_store=us_vector_store)
us_index = VectorStoreIndex.from_vector_store(
    vector_store=us_vector_store,
    storage_context=us_storage_context,
    embed_model=embed_model,
)

print("✅ India and US indexes loaded from Qdrant")

end_time = time.time()
startup_duration = end_time - start_time
print(f"✅ App startup time: {startup_duration:.2f} seconds")


# Request model
class QueryRequest(BaseModel):
    question: str
    country: str | None = None   # "India" or "US"
    user_email: str


@app.get("/")
async def health_check():
    return {"status": "ok", "message": "Chatbot backend is running!"}

# Endpoint to receive chatbot queries


@app.post("/query")
async def chatbot_query(req: QueryRequest, conn=Depends(get_db)):
    print("Question received:", req.question)
    question = req.question
    country = (req.country or "").strip().upper()
    user_email = req.user_email

    # Decide which index to use based on country
    if country == "INDIA":
        active_index = india_index
        active_collection = "india_policies"
    elif country == "US":
        active_index = us_index
        active_collection = "us_policies"
    else:
        # Fallback – you can choose a default or raise an error
        active_index = india_index
        active_collection = "india_policies"

    print(
        f"[DEBUG] Using collection: {active_collection} for country={country}")

    conversation_id = get_or_create_conversation(
        conn,
        user_email
    )
    # print(f"[DEBUG] Conversation ID: {conversation_id} for user: {user_email}")
    save_message(
        conn,
        conversation_id,
        "user",
        question
    )
    conn.commit()

    # Build a query engine for the chosen index
    query_engine = active_index.as_query_engine(llm=llm)

    # Measure overall time
    overall_start = time.time()

    # 1️⃣ Retrieval (embeddings done internally)
    embed_start = time.time()
    retrieved_docs = active_index.as_retriever(
        similarity_top_k=3).retrieve(question)
    embed_end = time.time()

    print(
        f"[DEBUG] Retrieved {len(retrieved_docs)} nodes from {active_collection}")
    for nd in retrieved_docs:
        m = nd.node.metadata
        print("   -", m.get("relative_path", m.get("file_path", "Unknown")),
              "page:", m.get("page_label", "N/A"))

    # 2️⃣ LLM response
    llm_start = time.time()
    response = query_engine.query(question)
    llm_end = time.time()
    overall_end = time.time()

    # Prepare source documents for response
    sources = []
    for i, node in enumerate(response.source_nodes):
        meta = node.node.metadata
        file_path = meta.get("file_path", "Unknown")
        file_name = os.path.basename(file_path)
        # prefer relative if available
        rel_path = meta.get("relative_path", file_path)
        page = meta.get("page_label", "N/A")

        sources.append({
            "path": rel_path,
            "file": file_name,
            "page": page,
            "country": meta.get("country", country or "Unknown"),
            "fullpath": file_path,
        })

    bot_message_id = save_message(
        conn, conversation_id, "bot", str(response), active_collection
    )
    save_sources(conn, bot_message_id, sources)
    conn.commit()

    return JSONResponse({
        "answer": str(response),
        "message_id": bot_message_id,
        "sources": sources,
        "timing": {
            "key search time": round(embed_end - embed_start, 2),
            "search response time": round(llm_end - llm_start, 2),
            "total time taken": round(overall_end - overall_start, 2),
        },
        "collection_used": active_collection,
    })


@app.get("/api/pdf")
async def get_pdf(directory: str, filename: str):
    # strips "../../", keeps only "file.pdf"
    safe_filename = Path(filename).name
    safe_directory = Path(directory).resolve()  # resolves directory

    file_path = (safe_directory / safe_filename).resolve()

    try:
        if not file_path.exists():
            raise HTTPException(
                status_code=404,
                detail=f"PDF not found: {file_path}"
            )

        return FileResponse(
            file_path,
            media_type="application/pdf",
            filename=safe_filename
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class ReactionRequest(BaseModel):
    message_id: int
    reaction: str
    user_email: str
    action: str      # "add" or "remove"


@app.post("/api/reaction")
def add_reaction(req: ReactionRequest, conn=Depends(get_db)):
    print(f"Received reaction request: {req}")
    save_reaction(
        conn,
        req.message_id,
        req.user_email,
        req.reaction,
        req.action        # ← was missing
    )
    conn.commit()
    return {"status": "success", "message": "Reaction saved"}


if __name__ == "__main__":
    uvicorn.run("ca_loandna_chatbot_app:app",
                host="localhost", port=5000, reload=True)
