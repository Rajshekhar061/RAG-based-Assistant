from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from config import CHUNK_SIZE, CHUNK_OVERLAP, UPLOAD_DIR
from models.schemas import UploadResponse
from services.embedder import get_embeddings
from services.pdf_parser import chunk_text, extract_text_from_pdf
from services.vector_store import VectorStore

router = APIRouter()


@router.post("/upload", response_model=UploadResponse)
async def upload_pdf(file: UploadFile = File(...)) -> UploadResponse:
    """Accept a PDF upload, extract text, create embeddings, and persist a FAISS index."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only PDF files are allowed.")

    doc_id = str(uuid4())
    save_path = UPLOAD_DIR / f"{doc_id}.pdf"
    content = await file.read()
    save_path.write_bytes(content)

    text = extract_text_from_pdf(str(save_path))
    if not text.strip():
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Uploaded PDF contains no extractable text.")

    chunks = chunk_text(text, CHUNK_SIZE, CHUNK_OVERLAP)
    embeddings = get_embeddings(chunks)

    vector_store = VectorStore(doc_id)
    vector_store.add_documents(chunks, embeddings)

    return UploadResponse(
        doc_id=doc_id,
        filename=file.filename,
        chunk_count=len(chunks),
        message="PDF uploaded and indexed successfully.",
    )
