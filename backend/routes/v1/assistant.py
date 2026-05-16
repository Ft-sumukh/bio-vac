from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.assistant_service import assistant_service
from services.knowledge_base import knowledge_base

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    answer: str

@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(request: ChatRequest):
    try:
        answer = await assistant_service.get_response(request.message)
        return ChatResponse(answer=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/index")
async def index_knowledge_base():
    """
    Endpoint to manually trigger re-indexing of the knowledge base.
    """
    try:
        knowledge_base.index_documents()
        return {"message": "Knowledge base indexed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
