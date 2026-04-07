import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY is required. Set it in .env")

CHUNK_SIZE = 500
CHUNK_OVERLAP = 50
TOP_K_RESULTS = 5
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
UPLOAD_DIR = "storage/uploads"
FAISS_INDEX_DIR = "storage/faiss_index"

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR.parent / "storage" / "uploads"
FAISS_INDEX_DIR = BASE_DIR.parent / "storage" / "faiss_index"

CHUNK_SIZE = 500
CHUNK_OVERLAP = 50
TOP_K_RESULTS = 5
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
FAISS_INDEX_DIR.mkdir(parents=True, exist_ok=True)
