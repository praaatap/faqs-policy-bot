from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    groq_api_key: str
    chroma_path: str = "chroma_db"
    docs_path: str = "docs"
    model_name: str = "llama-3.3-70b-versatile"
    embed_model: str = "all-MiniLM-L6-v2"
    chunk_size: int = 500
    chunk_overlap: int = 50
    retriever_k: int = 4

    class Config:
        env_file = ".env"

settings = Settings()
