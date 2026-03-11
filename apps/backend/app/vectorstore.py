from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from app.config import settings
import os

_stores: dict[str, Chroma] = {}

def get_vectorstore(company_id: str = "default", subject: str = "general") -> Chroma:
    key = f"{company_id}:{subject}"
    if key not in _stores:
        chroma_path = os.path.join(settings.chroma_path, company_id, subject)
        embeddings = HuggingFaceEmbeddings(model_name=settings.embed_model)
        _stores[key] = Chroma(
            persist_directory=chroma_path,
            embedding_function=embeddings
        )
    return _stores[key]

def get_retriever(company_id: str = "default", subject: str = "general"):
    db = get_vectorstore(company_id, subject)
    return db.as_retriever(search_kwargs={"k": settings.retriever_k})

def reset_vectorstore(company_id: str = "default", subject: str = "general"):
    key = f"{company_id}:{subject}"
    if key in _stores:
        del _stores[key]
