import asyncio
from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from pydantic import BaseModel
from fastapi.responses import HTMLResponse
from fastapi.responses import RedirectResponse
import random
from datetime import datetime
from fastapi.security import HTTPBearer
import zlib
import base64
import urllib.parse

import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Range", "Accept-Ranges",
                    "Content-Length", "Content-Type"],
)

security = HTTPBearer()


def get_current_user(token=Depends(security)):
    # decode JWT
    return "naveenkumarm572@gmail.com"


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


class QueryRequest(BaseModel):
    question: str
    country: str


@app.post("/query")
async def get_pdf_sources(payload: QueryRequest):
    """Return hardcoded PDF source"""

    print('question', payload.question)
    print('country', payload.country)
    await asyncio.sleep(1.5)
    return {
        "answer": "The dress code encourages a casual yet professional appearance. For men, acceptable attire includes business casual clothing such as collared shirts (button-downs or polos), slacks, khakis, chinos, or dress pants, closed-toe shoes like loafers or oxfords, and sweaters or blazers layered over collared shirts. For women, acceptable attire includes business casual options like blouses, smart casual dresses, professional tops, slacks, khakis, chinos, or skirts that are knee-length or longer, closed-toe shoes such as flats or low heels, and cardigans or blazers worn over blouses. Unacceptable attire includes slippers, flip-flops, excessively casual sandals, shorts, half pants, or skirts above mid-thigh length, torn or distressed clothing, round-neck T-shirts without collars, graphic tees, and any clothing that is excessively casual, provocative, or inappropriate for a professional setting, including sweatpants or gym attire.",
        "sources": [
            {
                "path": "India/ChatBOT/Employee_Handbook/CAPL - Employee Handbook - 2025.pdf",
                "file": "CAPL - Employee Handbook - 2025.pdf",
                "page": "27",
                "country": "India",
                "fullpath": "C:\\Users\\LDNA40015\\Documents\\ChatDoc\\sample.pdf"
            },
            {
                "path": "India/ChatBOT/Employee_Handbook/CAPL - Employee Handbook - 2025.pdf",
                "file": "CAPL - Employee Handbook - 2025.pdf",
                "page": "27",
                "country": "India",
                "fullpath": "C:\\Users\\LDNA40004\\downloads\\chatbot_docs\\India\\ChatBOT\\Employee_Handbook\\CAPL - Employee Handbook - 2025.pdf"
            }
        ],
        "timing": {
            "key search time": 0.18,
            "search response time": 4.96,
            "total time taken": 5.15
        },
        "collection_used": "india_policies"
    }


class ReactionRequest(BaseModel):
    messageId: int
    emoji: str
    action: str


@app.post("/api/reaction")
def add_reaction(payload: ReactionRequest, user=Depends(get_current_user)):
    print("User:", user)
    print("Message:", payload.messageId)
    print("Emoji:", payload.emoji)
    print("Action:", payload.action)
    return {"status": "ok"}


@app.get("/api/messages")
def get_messages(page: int = 1, limit: int = 20):
    print("Pagination hit:", page, limit)

    # Replace with DB query
    return []


@app.get("/ValidateAzureAD")
async def login():
    print("************************* Azure AD Login Triggered *************************")

    tenant_id = "171e44f2-8514-4bcc-b505-9621c9721066"
    number = random.randint(100000, 999999)
    unique_id = f"_{number}"
    issue_instant = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")

    sso_login_url = f"https://login.microsoftonline.com/{tenant_id}/saml2"
    sso_reply_url = "http://localhost:4000/api/SSOReplyURI"

    # http://incomeanalyzer/api/SSOReplyURI
    # http://localhost:4000/api/SSOReplyURI
    # http://localhost:4000/api/SSOReplyURI

    # application_base_url = "LoanDNAPlatform"
    # application_base_url = "IncomeCalculator"
    application_base_url = "LoanDNA_Platform_SSO"

    xml = f"""<samlp:AuthnRequest
    xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
    xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
    ID="{unique_id}"
    Version="2.0"
    IssueInstant="{issue_instant}"
    Destination="{sso_login_url}"
    AssertionConsumerServiceURL="{sso_reply_url}"
    ForceAuthn="true">
    <saml:Issuer>{application_base_url}</saml:Issuer>
    <samlp:NameIDPolicy
        Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress"
        AllowCreate="true"/>
</samlp:AuthnRequest>"""

    def deflate_raw(data: bytes) -> bytes:
        compressor = zlib.compressobj(level=9, wbits=-15)
        compressed = compressor.compress(data)
        compressed += compressor.flush()
        return compressed

    xml_bytes = xml.encode("utf-8")
    deflated = deflate_raw(xml_bytes)
    base64_encoded = base64.b64encode(deflated).decode("utf-8")
    url_encoded = urllib.parse.quote(base64_encoded)

    relay_state = "LoanDNA_Platform_SSO"
    redirect_url = f"{sso_login_url}?SAMLRequest={url_encoded}&RelayState={urllib.parse.quote(relay_state)}"

    print(f"Redirecting to: {redirect_url}")

    return RedirectResponse(url=redirect_url)

# --- SSO Callback Endpoint ---


@app.post("/api/SSOReplyURI")
async def SSOReplyURI(req: Request):
    print("Callback hit:", req.url)
    form = await req.form()
    # app_name = form.get("RelayState")
    # print(app_name)
    print('req ================> ', form)
    frontend_url = "http://localhost:5174/chat"

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="refresh" content="0; url={frontend_url}">
        <title>Redirecting...</title>
    </head>
    <body>
        <p>Redirecting to chat...</p>
        <script>
            window.location.href = "{frontend_url}";
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
