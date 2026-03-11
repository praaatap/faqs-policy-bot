import os
import logging
from langchain_community.document_loaders import TextLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from app.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_embeddings():
    return HuggingFaceEmbeddings(model_name=settings.embed_model)

def load_documents(docs_path: str = None):
    path = docs_path or settings.docs_path
    documents = []
    for filename in os.listdir(path):
        filepath = os.path.join(path, filename)
        try:
            if filename.endswith(".pdf"):
                loader = PyPDFLoader(filepath)
            elif filename.endswith((".md", ".txt")):
                loader = TextLoader(filepath, encoding="utf-8")
            else:
                continue
            documents.extend(loader.load())
            logger.info(f"Loaded: {filename}")
        except Exception as e:
            logger.error(f"Failed to load {filename}: {e}")
    return documents

def ingest_docs(company_id: str = "default", subject: str = "general"):
    docs_path = os.path.join(settings.docs_path, company_id, subject)
    chroma_path = os.path.join(settings.chroma_path, company_id, subject)

    if not os.path.exists(docs_path):
        logger.warning(f"No docs folder found at {docs_path}")
        return 0

    documents = load_documents(docs_path)
    if not documents:
        logger.warning("No documents found.")
        return 0

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap
    )
    chunks = splitter.split_documents(documents)

    embeddings = get_embeddings()
    db = Chroma.from_documents(chunks, embeddings, persist_directory=chroma_path)
    db.persist()
    logger.info(f"✅ Ingested {len(chunks)} chunks into {chroma_path}")
    return len(chunks)

if __name__ == "__main__":
    # Default ingest
    ingest_docs()
