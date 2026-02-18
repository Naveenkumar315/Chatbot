from llama_index.core import SimpleDirectoryReader, VectorStoreIndex, StorageContext
from llama_index.readers.file import PDFReader
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.vector_stores.qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from llama_index.core.node_parser import SentenceSplitter
import os
import time
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

BASE_DIR = r"C:/Naveen/chatbot_docs"


ALLOWED_EXTS = {".pdf", ".txt"}
FILE_EXTRACTOR = {
    ".pdf": PDFReader()
}

# --- 1️⃣ Load docs for ONE country (India or US) ---


def load_country_documents(base_dir: str, country_name: str):
    """
    base_dir: global base dir (C:/.../chatbot_docs)
    country_name: "India" or "US"
    """
    documents = []

    country_root = os.path.join(base_dir, country_name)

    for root, dirs, files in os.walk(country_root):
        # Filter to allowed extensions only
        selected_files = []
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in ALLOWED_EXTS:
                selected_files.append(os.path.join(root, f))

        if not selected_files:
            continue

        # Category = path under the country folder, e.g. "HR_policy", "HR_policy/Leave"
        rel_dir_under_country = os.path.relpath(root, country_root)
        if rel_dir_under_country == ".":
            category = "General"
        else:
            category = rel_dir_under_country.replace("\\", "/")

        document_type = category.replace(
            "_", " ").title() if category != "General" else "General"

        reader = SimpleDirectoryReader(
            input_files=selected_files,
            recursive=False,
            file_extractor=FILE_EXTRACTOR,
            required_exts=list(ALLOWED_EXTS),
        )

        docs = reader.load_data()

        for doc in docs:
            # Explicit country
            doc.metadata["country"] = country_name
            doc.metadata["category"] = category
            doc.metadata["document_type"] = document_type

            # relative_path always from GLOBAL base dir so you keep "India/..." / "US/..."
            full_path = doc.metadata.get("file_path", "")
            if full_path:
                rel_path = os.path.relpath(full_path, base_dir)
                doc.metadata["relative_path"] = rel_path.replace("\\", "/")

        documents.extend(docs)

    return documents


# --- 2️⃣ Index a set of documents into one Qdrant collection ---
def index_documents_to_qdrant(
    collection_name: str,
    documents,
    embed_model,
    qdrant_client: QdrantClient,
):
    logger.info(
        f"==== Indexing {len(documents)} docs into collection '{collection_name}' ====")

    # Delete existing collection (optional)
    try:
        qdrant_client.delete_collection(collection_name=collection_name)
        logger.info(f"Deleted existing collection '{collection_name}'")
    except Exception as e:
        logger.info(
            f"Collection '{collection_name}' did not exist or could not be deleted: {e}")

    vector_store = QdrantVectorStore(
        client=qdrant_client,
        collection_name=collection_name,
    )
    storage_context = StorageContext.from_defaults(vector_store=vector_store)

    node_parser = SentenceSplitter(chunk_size=512, chunk_overlap=50)
    logger.info("Starting node parsing...")
    nodes = node_parser.get_nodes_from_documents(documents)
    total_nodes = len(nodes)
    logger.info(
        f"Created {total_nodes} nodes (chunks) from {len(documents)} documents")

    # Batch insert with progress logs
    BATCH_SIZE = 128
    LOG_INTERVAL_SEC = 120
    last_log_time = time.time()

    logger.info("Starting batch insert into Qdrant...")

    for i in range(0, total_nodes, BATCH_SIZE):
        batch = nodes[i: i + BATCH_SIZE]

        texts = [node.get_content() for node in batch]
        embeddings = embed_model.get_text_embedding_batch(texts)

        for node, emb in zip(batch, embeddings):
            node.embedding = emb

        vector_store.add(batch)

        now = time.time()
        if now - last_log_time >= LOG_INTERVAL_SEC:
            inserted = min(i + BATCH_SIZE, total_nodes)
            logger.info(
                f"Inserted {inserted}/{total_nodes} nodes into '{collection_name}'...")
            last_log_time = now

    logger.info(
        f"Finished inserting all {total_nodes} nodes into '{collection_name}'")

    # Build an index wrapper from this vector store
    index = VectorStoreIndex.from_vector_store(
        vector_store=vector_store,
        storage_context=storage_context,
        embed_model=embed_model,
    )

    # Sanity check count
    resp = qdrant_client.count(collection_name=collection_name, exact=True)
    logger.info(
        f"Points in Qdrant collection '{collection_name}': {resp.count}")

    return index


if __name__ == "__main__":
    # Shared embedding model + Qdrant client
    embed_model = HuggingFaceEmbedding(model_name="local_bge_embeddings")
    qdrant_client = QdrantClient(host="localhost", port=6333)

    # --- India ---
    india_docs = load_country_documents(BASE_DIR, "India")
    print(f"Loaded {len(india_docs)} India documents")
    india_index = index_documents_to_qdrant(
        collection_name="india_policies",
        documents=india_docs,
        embed_model=embed_model,
        qdrant_client=qdrant_client,
    )

    # --- US ---
    us_docs = load_country_documents(BASE_DIR, "US")
    print(f"Loaded {len(us_docs)} US documents")
    us_index = index_documents_to_qdrant(
        collection_name="us_policies",
        documents=us_docs,
        embed_model=embed_model,
        qdrant_client=qdrant_client,
    )

    logger.info("✅ Both India and US policy collections are ready!")
