# RAG AI Assistant

A production-ready Retrieval-Augmented Generation (RAG) application built with Python and FastAPI. Users upload PDF documents and ask questions. The assistant answers using only the content from the uploaded PDF.

## Architecture

```
rag-ai-assistant/
├── backend/
│   ├── main.py               # FastAPI app entry point
│   ├── config.py             # Environment variables & settings
│   ├── routes/
│   │   ├── upload.py         # PDF upload & processing endpoint
│   │   └── chat.py           # Chat/query endpoint
│   ├── services/
│   │   ├── pdf_parser.py     # Extract text from PDFs using PyMuPDF
│   │   ├── embedder.py       # Generate embeddings using sentence-transformers
│   │   ├── vector_store.py   # FAISS index: add, save, load, search
│   │   └── llm.py            # Call Claude API with context + question
│   ├── models/
│   │   └── schemas.py        # Pydantic models for request/response
│   └── requirements.txt
├── frontend/
│   └── index.html            # Single-file UI: upload + chat interface
├── storage/
│   ├── uploads/              # Uploaded PDF files
│   └── faiss_index/          # Saved FAISS index + metadata
├── .env.example
└── README.md
```

## Features

- PDF upload and text extraction with PyMuPDF
- Chunking with overlap to preserve context boundaries
- Local vector search using FAISS
- Embeddings with `sentence-transformers` (`all-MiniLM-L6-v2`)
- Anthropic Claude API integration for answer generation
- Vanilla HTML/CSS/JS frontend with drag-and-drop support
- Persistent per-document FAISS indexes across restarts

## Setup

1. Clone or download the repository.
2. Create and activate a Python virtual environment:

```bash
python -m venv venv
venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Copy `.env.example` to `.env` and set your Claude API key:

```text
CLAUDE_API_KEY=your_claude_api_key_here
```

5. Start the FastAPI server from the `backend` folder:

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

6. Open `frontend/index.html` in your browser or use a local static server.

## Usage

1. Upload a PDF document using the left panel.
2. Wait for indexing to complete.
3. Enter a question in the chat panel and submit.
4. Receive an answer based strictly on the uploaded document content.

## Notes

- The app only accepts `.pdf` files.
- Each upload creates a unique `doc_id` and stores a separate FAISS index.
- The frontend is plain HTML/CSS/JavaScript with no build step required.

## Tech Stack

- Backend: Python, FastAPI
- Embeddings: `sentence-transformers`
- Vector DB: `faiss-cpu`
- PDF parsing: `PyMuPDF`
- LLM: Anthropic Claude API
- Frontend: Vanilla HTML, CSS, JavaScript
