from fastapi import APIRouter, HTTPException, status

from config import TOP_K_RESULTS
from models.schemas import ChatRequest, ChatResponse
from services.embedder import get_embeddings
from services.llm import get_answer
from services.vector_store import VectorStore

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """Embed the user question, query the FAISS store, and return an LLM answer."""
    vector_store = VectorStore(request.doc_id)
    if vector_store.index is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found or not indexed.")

    question_embedding = get_embeddings([request.question])
    relevant_chunks = vector_store.search(question_embedding, TOP_K_RESULTS)

    if not relevant_chunks:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No relevant document context found for this question.")

    answer = get_answer(request.question, relevant_chunks)
    return ChatResponse(answer=answer, sources=relevant_chunks)
