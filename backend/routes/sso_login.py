import base64
import uuid
import os
import zlib
import urllib.parse
import random
import xmltodict
from datetime import datetime, timedelta

from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from dotenv import load_dotenv
from pydantic import BaseModel
from fastapi.responses import RedirectResponse
from services.user_repository import get_user_by_email, create_user


router = APIRouter()

SSO_TEMP_STORE = {}
SSO_TOKEN_TTL = 300  # 5 minutes


# ── helpers ────────────────────────────────────────────────────────────────────

def create_access_token(data: dict) -> str:
    # Replace with your real JWT logic
    import jwt
    import os
    return jwt.encode({**data, "type": "access"}, os.environ.get("SECRET_KEY", "secret"), algorithm="HS256")


def create_refresh_token(data: dict) -> str:
    import jwt
    import os
    return jwt.encode({**data, "type": "refresh"}, os.environ.get("SECRET_KEY", "secret"), algorithm="HS256")


def deflate_raw(data: bytes) -> bytes:
    compressor = zlib.compressobj(level=9, wbits=-15)
    compressed = compressor.compress(data)
    compressed += compressor.flush()
    return compressed


# ── models ─────────────────────────────────────────────────────────────────────

class SSOVerifyModel(BaseModel):
    token: str


# ── routes ─────────────────────────────────────────────────────────────────────

@router.get("/api/ValidateAzureAD")
async def validate_azure_ad():
    print("************************* Azure AD Login Triggered *************************")

    load_dotenv()

    tenant_id = os.environ["TENANT_ID"]
    number = random.randint(100000, 999999)
    unique_id = f"_{number}"
    issue_instant = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")

    sso_login_url = f"https://login.microsoftonline.com/{tenant_id}/saml2"
    sso_reply_url = os.environ["SSO_REPLY_URL"]

    application_base_url = "LoanDNAPlatform"

    xml = f"""<samlp:AuthnRequest
    xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
    xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
    ID="{unique_id}"
    Version="2.0"
    IssueInstant="{issue_instant}"
    Destination="{sso_login_url}"
    AssertionConsumerServiceURL="{sso_reply_url}"
    ForceAuthn="false">
    <saml:Issuer>{application_base_url}</saml:Issuer>
    <samlp:NameIDPolicy
        Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress"
        AllowCreate="true"/>
</samlp:AuthnRequest>"""

    xml_bytes = xml.encode("utf-8")
    deflated = deflate_raw(xml_bytes)
    base64_encoded = base64.b64encode(deflated).decode("utf-8")
    url_encoded = urllib.parse.quote(base64_encoded)

    relay_state = "IncomeCalculator"
    redirect_url = f"{sso_login_url}?SAMLRequest={url_encoded}&RelayState={urllib.parse.quote(relay_state)}"

    print(f"Redirecting to: {redirect_url}")
    return RedirectResponse(url=redirect_url)


@router.post("/api/SSOReplyURI", response_class=HTMLResponse)
async def sso_reply_uri(req: Request):

    print("Received SSO response at /api/SSOReplyURI")

    form = await req.form()
    saml_response = form.get("SAMLResponse")

    load_dotenv()

    if not saml_response:
        raise HTTPException(status_code=400, detail="Missing SAMLResponse")

    # ── Decode SAML ─────────────────────────────
    decoded_xml = base64.b64decode(saml_response).decode("utf-8")
    parsed = xmltodict.parse(decoded_xml)

    response = (
        parsed.get("samlp:Response")
        or parsed.get("saml2p:Response")
        or parsed.get("Response")
        or parsed.get("{urn:oasis:names:tc:SAML:2.0:protocol}Response")
    )

    if not response:
        raise HTTPException(status_code=400, detail="Invalid SAML response")

    assertion = (
        response.get("saml:Assertion")
        or response.get("saml2:Assertion")
        or response.get("Assertion")
        or response.get("{urn:oasis:names:tc:SAML:2.0:assertion}Assertion")
    )

    if not assertion:
        raise HTTPException(status_code=400, detail="SAML Assertion missing")

    # ── Extract Attributes ──────────────────────
    attr_stmt = (
        assertion.get("saml:AttributeStatement", {})
        or assertion.get("AttributeStatement", {})
    )

    attributes = (
        attr_stmt.get("saml:Attribute", [])
        or attr_stmt.get("Attribute", [])
    )

    if isinstance(attributes, dict):
        attributes = [attributes]

    # ── Extract Email ───────────────────────────
    sso_email = None

    for attr in attributes:
        name = attr.get("@Name", "")

        if "email" in name.lower() or "mail" in name.lower():
            value = (
                attr.get("saml:AttributeValue")
                or attr.get("AttributeValue")
            )

            if isinstance(value, dict):
                sso_email = value.get("#text")
            elif isinstance(value, str):
                sso_email = value
            elif isinstance(value, list):
                sso_email = value[0]

            if sso_email:
                break

    if not sso_email:
        raise HTTPException(status_code=400, detail="SSO email not found")

    #  Normalize email
    sso_email = sso_email.lower().strip()

    print("SSO Email:", sso_email)

    # ── JIT USER CREATION ───────────────────────
    user = get_user_by_email(sso_email)

    if not user:
        print("User not found. Creating new user...")
        user_id = create_user(sso_email)
        if user_id:
            print("User created successfully")
        else:
            print("User creation failed")
    else:
        print("Existing user login")

    # ── Create Temporary Token ──────────────────
    temp_token = str(uuid.uuid4())

    SSO_TEMP_STORE[temp_token] = {
        "email": sso_email,
        "expires": datetime.utcnow() + timedelta(seconds=SSO_TOKEN_TTL),
    }

    # ── Redirect Frontend ───────────────────────
    FRONTEND_URL = os.environ.get(
        "FRONTEND_URL",
        "http://localhost:3001"
    )

    frontend_url = f"{FRONTEND_URL}/sso?token={temp_token}"

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="refresh" content="0; url={frontend_url}">
    </head>
    <body>
        Redirecting...
        <script>
            window.location.href="{frontend_url}";
        </script>
    </body>
    </html>
    """

    return HTMLResponse(content=html_content)


@router.post("/sso-exchange")
async def sso_exchange(payload: SSOVerifyModel):
    token = payload.token
    print("token received for exchange:", token)
    if not token:
        raise HTTPException(status_code=400, detail="Token required")

    data = SSO_TEMP_STORE.pop(token, None)
    if not data or data["expires"] < datetime.utcnow():
        raise HTTPException(
            status_code=401, detail="Invalid or expired SSO token")

    token_data = {
        "sub": data["email"],
        "email": data["email"],
    }

    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "email": data["email"],
        "role": "User",
        "status": "active",
        "is_first_time_user": False,
    }
