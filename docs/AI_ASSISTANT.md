# Bio-Vac AI Assistant (RAG Pipeline)

This guide explains how to set up, train, and run the integrated AI assistant for the BI-VAC platform.

## Architecture
- **Backend**: FastAPI with LangChain and ChromaDB.
- **LLM**: GPT-4 (via OpenAI API).
- **Embeddings**: text-embedding-3-small (OpenAI).
- **Frontend**: Next.js (Portal) with a custom React Chat component.

## Setup Instructions

### 1. Environment Variables
Ensure your `.env` file (in the root or backend folder) contains:
```env
OPENAI_API_KEY=sk-your-key-here
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Backend Dependencies
Install the new AI-related dependencies:
```bash
cd backend
pip install -r requirements.txt
```

### 3. Knowledge Base Indexing
Before the assistant can answer questions accurately, you must index the platform's knowledge.
Run the following command (or use the API endpoint):
```bash
# Via cURL
curl -X POST http://localhost:8000/api/v1/assistant/index
```
This will crawl `docs/` and `README.md` to create a vector database in `backend/chroma_db`.

## Features
- **Semantic Search**: Uses embeddings to find the most relevant scientific context.
- **Hallucination Prevention**: Strictly instructed to use provided context or admit ignorance.
- **Modern UI**: Glassmorphism design with Dark Mode support and typing animations.
- **Context-Aware**: Remembers the conversation history for multi-turn dialogues.

## Deployment
When deploying to Vercel or similar:
1. Set the `OPENAI_API_KEY` in environment variables.
2. Ensure the `backend/chroma_db` directory is either persisted (using a volume) or re-indexed on startup.
3. For serverless deployments, consider using a cloud vector DB like Pinecone.

---
*Authored by the Bio-Vac AI Assistant Engine.*
