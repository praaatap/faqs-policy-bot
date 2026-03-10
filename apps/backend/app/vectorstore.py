from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from app.config import settings

_db = None

def get_vectorstore():
    global _db
    if _db is None:
        embeddings = OpenAIEmbeddings(openai_api_key=settings.openai_api_key)
        _db = Chroma(
            persist_directory=settings.chroma_path,
            embedding_function=embeddings
        )
    return _db

def get_retriever():
    db = get_vectorstore()
    return db.as_retriever(search_kwargs={"k": settings.retriever_k})

def reset_vectorstore():
    global _db
    _db = None  # Force reload after new ingestion
