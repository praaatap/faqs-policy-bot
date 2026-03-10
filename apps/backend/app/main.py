from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models import QueryRequest, QueryResponse
from app.rag import get_rag_chain
from dotenv import load_dotenv

load_dotenv()
app = FastAPI(title="FAQ Chatbot API")

app.add_middleware(CORSMiddleware, allow_origins=["*"],
                   allow_methods=["*"], allow_headers=["*"])

rag_chain = get_rag_chain()

@app.get("/")
def health():
    return {"status": "running"}

@app.post("/chat", response_model=QueryResponse)
async def chat(req: QueryRequest):
    result = rag_chain({"question": req.question})
    return QueryResponse(answer=result["answer"], sources=result["sources"])
