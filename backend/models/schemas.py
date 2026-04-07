from typing import List
from pydantic import BaseModel


class UploadResponse(BaseModel):
    doc_id: str
    filename: str
    chunk_count: int
    message: str


class ChatRequest(BaseModel):
    question: str
    doc_id: str


class ChatResponse(BaseModel):
    answer: str
    sources: List[str]
