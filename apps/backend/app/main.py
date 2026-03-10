import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router

logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="Company FAQ Chatbot API",
    description="RAG-powered chatbot for company policies and FAQs",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
def health():
    return {"status": "🚀 FAQ Chatbot API is running"}
