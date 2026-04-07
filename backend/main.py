import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from routes.chat import router as chat_router
from routes.upload import router as upload_router

app = FastAPI(title="RAG AI Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Absolute path fix
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
frontend_path = os.path.join(BASE_DIR, "frontend")

app.mount("/static", StaticFiles(directory=frontend_path), name="static")

app.include_router(upload_router)
app.include_router(chat_router)

@app.get("/")
def serve_ui():
    return FileResponse(os.path.join(frontend_path, "index.html"))