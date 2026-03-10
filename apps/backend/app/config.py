from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    openai_api_key: str
    chroma_path: str = "chroma_db"
    docs_path: str = "docs"
    model_name: str = "gpt-4o"
    chunk_size: int = 500
    chunk_overlap: int = 50
    retriever_k: int = 4

    class Config:
        env_file = ".env"

settings = Settings()

