import fitz
from typing import List


def extract_text_from_pdf(file_path: str) -> str:
    """Extract all readable text from a PDF using PyMuPDF."""
    document = fitz.open(file_path)
    text = []
    for page in document:
        page_text = page.get_text()
        if page_text:
            text.append(page_text)
    return "\n".join(text).strip()


def chunk_text(text: str, chunk_size: int, overlap: int) -> List[str]:
    """Split a long text into overlapping chunks for embedding and retrieval."""
    words = text.split()
    if not words:
        return []

    chunks = []
    start = 0
    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunk = " ".join(words[start:end]).strip()
        if chunk:
            chunks.append(chunk)
        if end == len(words):
            break
        start += chunk_size - overlap
    return chunks
