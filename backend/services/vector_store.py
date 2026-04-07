import json
from pathlib import Path
from typing import List

import faiss
import numpy as np

from config import FAISS_INDEX_DIR


class VectorStore:
    def __init__(self, doc_id: str):
        self.doc_id = doc_id
        self.index_path = Path(FAISS_INDEX_DIR) / f"{doc_id}.index"
        self.meta_path = Path(FAISS_INDEX_DIR) / f"{doc_id}.json"
        self.index = None
        self.metadata = {"chunks": []}

        if self.index_path.exists() and self.meta_path.exists():
            self.load_index()

    def _ensure_index(self, dim: int):
        if self.index is None:
            self.index = faiss.IndexFlatL2(dim)
        elif self.index.d != dim:
            raise ValueError("Embedding dimension mismatch for FAISS index.")

    def add_documents(self, chunks: List[str], embeddings: np.ndarray):
        if embeddings.ndim == 1:
            embeddings = embeddings.reshape(1, -1)
        embeddings = embeddings.astype(np.float32)

        self._ensure_index(embeddings.shape[1])
        self.index.add(embeddings)
        self.metadata["chunks"].extend(chunks)
        self.save_index()

    def save_index(self):
        if self.index is None:
            raise ValueError("Cannot save FAISS index before it is created.")
        faiss.write_index(self.index, str(self.index_path))
        self.meta_path.write_text(json.dumps(self.metadata, ensure_ascii=False), encoding="utf-8")

    def load_index(self):
        self.index = faiss.read_index(str(self.index_path))
        self.metadata = json.loads(self.meta_path.read_text(encoding="utf-8"))

    def search(self, query_embedding: np.ndarray, top_k: int) -> List[str]:
        if self.index is None:
            raise ValueError("FAISS index has not been loaded.")

        if query_embedding.ndim == 1:
            query_embedding = query_embedding.reshape(1, -1)
        query_embedding = query_embedding.astype(np.float32)

        distances, indices = self.index.search(query_embedding, top_k)
        results = []
        for idx in indices[0]:
            if idx < 0 or idx >= len(self.metadata["chunks"]):
                continue
            results.append(self.metadata["chunks"][idx])
        return results
