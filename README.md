# 🤖 RAG AI Assistant

A Retrieval-Augmented Generation (RAG) based AI assistant that answers user queries using uploaded documents. Built using FastAPI, Sentence Transformers, and Groq LLM API.

---

## 🚀 Features

* 📄 Upload documents (PDF/Text)
* 🔍 Semantic search using embeddings
* 🧠 Context-aware AI responses
* ⚡ FastAPI backend for high performance
* 🤖 Powered by LLM (Groq API)
* 📦 Lightweight and scalable architecture

---

## 🛠️ Tech Stack

* **Backend:** FastAPI
* **Embeddings:** Sentence Transformers (`all-MiniLM-L6-v2`)
* **LLM:** Groq API (LLaMA 3.1)
* **Language:** Python

---

## 🧠 How It Works (Architecture)

User Query
→ Embedding Model
→ Vector Similarity Search
→ Relevant Context Retrieval
→ LLM (Groq)
→ Final Response

---

## ⚙️ Setup Instructions

```bash
git clone https://github.com/Rajshekhar061/your-repo-name.git
cd your-repo-name

python -m venv venv
venv\Scripts\activate   # Windows

pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 📡 API Endpoints

### Upload Document

POST /upload

### Chat with AI

POST /chat

---

## 📸 Screenshots

(Add screenshots here after testing)

---

## 🌐 Demo

(Add deployed link here)

---

## 💡 Future Improvements

* 🧠 Chat memory (conversation history)
* ⚡ Streaming responses
* 📚 Multi-document support with vector DB (FAISS/Chroma)
* 🌍 Deployment with cloud services

---

## 👨‍💻 Author

Rajshekhar Singh
GitHub: https://github.com/Rajshekhar061
