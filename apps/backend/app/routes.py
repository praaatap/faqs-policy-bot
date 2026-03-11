import shutil, os
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from app.chain import get_chain, clear_session, get_history
from app.ingest import ingest_docs
from app.vectorstore import reset_vectorstore
from app.config import settings

router = APIRouter()

class ChatRequest(BaseModel):
    question: str
    session_id: str = "default"
    company_id: str = "default"
    subject: str = "general"

class ChatResponse(BaseModel):
    answer: str
    sources: list[str]
    session_id: str

@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        chain = get_chain(req.session_id, req.company_id, req.subject)
        result = chain({"question": req.question})
        sources = list({
            doc.metadata.get("source", "Unknown")
            for doc in result.get("source_documents", [])
        })
        return ChatResponse(
            answer=result["answer"],
            sources=sources,
            session_id=req.session_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    company_id: str = "default",
    subject: str = "general"
):
    allowed = (".pdf", ".md", ".txt")
    if not file.filename.endswith(allowed):
        raise HTTPException(status_code=400, detail="Only PDF, MD, TXT allowed")

    docs_path = os.path.join(settings.docs_path, company_id, subject)
    os.makedirs(docs_path, exist_ok=True)

    file_path = os.path.join(docs_path, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    count = ingest_docs(company_id, subject)
    reset_vectorstore(company_id, subject)

    return {"message": f"✅ {file.filename} uploaded", "chunks_ingested": count}

@router.post("/ingest")
async def trigger_ingest(company_id: str = "default", subject: str = "general"):
    count = ingest_docs(company_id, subject)
    reset_vectorstore(company_id, subject)
    return {"message": "✅ Done", "chunks_ingested": count}

@router.get("/history/{session_id}")
async def get_chat_history(session_id: str):
    return {"session_id": session_id, "history": get_history(session_id)}

@router.delete("/clear/{session_id}")
async def clear_chat(session_id: str):
    clear_session(session_id)
    return {"message": f"✅ Session {session_id} cleared"}
