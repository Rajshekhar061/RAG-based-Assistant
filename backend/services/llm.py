from groq import Groq
from config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

def get_answer(question: str, context_chunks: list[str]) -> str:
    context = "\n\n".join(context_chunks)
    
    prompt = f"""Answer the question based ONLY on the context below.
If the answer is not in the context, say "I couldn't find that in the uploaded document."

Context:
{context}

Question: {question}
"""
    
    response = client.chat.completions.create(
        model="llama3-8b-8192",  # free & fast
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1000,
    )
    
    return response.choices[0].message.content