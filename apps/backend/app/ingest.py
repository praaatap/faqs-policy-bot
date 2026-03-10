import os
import logging
from langchain_community.document_loaders import TextLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from app.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def load_documents():
    documents = []
    for filename in os.listdir(settings.docs_path):
        filepath = os.path.join(settings.docs_path, filename)
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

def ingest_docs():
    documents = load_documents()
    if not documents:
        logger.warning("No documents found to ingest.")
        return

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap
    )
    chunks = splitter.split_documents(documents)

    embeddings = OpenAIEmbeddings(openai_api_key=settings.openai_api_key)
    db = Chroma.from_documents(
        chunks,
        embeddings,
        persist_directory=settings.chroma_path
    )
    db.persist()
    logger.info(f"✅ Ingested {len(chunks)} chunks from {len(documents)} documents")
    return len(chunks)

if __name__ == "__main__":
    ingest_docs()
