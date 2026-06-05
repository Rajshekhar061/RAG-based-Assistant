from typing import List
import numpy as np

from ..config import EMBEDDING_MODEL


class Embedder:
    _model = None

    @classmethod
    def get_model(cls):
        if cls._model is None:
            # Lazy import to reduce startup memory usage
            from sentence_transformers import SentenceTransformer

            cls._model = SentenceTransformer(EMBEDDING_MODEL)

        return cls._model


def get_embeddings(texts: List[str]) -> np.ndarray:
    """
    Generate embeddings for a list of text chunks.
    """
    model = Embedder.get_model()

    embeddings = model.encode(
        texts,
        show_progress_bar=False,
        convert_to_numpy=True,
    )

    return embeddings.astype(np.float32)