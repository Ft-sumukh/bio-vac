from typing import List, Dict, Any
from langchain_openai import ChatOpenAI
from langchain_classic.chains import ConversationalRetrievalChain
from langchain_classic.memory import ConversationBufferMemory
from .knowledge_base import knowledge_base

class AssistantService:
    def __init__(self):
        self.llm = ChatOpenAI(model_name="gpt-4", temperature=0.2)
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            output_key="answer"
        )
        
        self.system_prompt = """
        You are the Bio-Vac AI Assistant, a professional and scientific guide for the BI-VAC platform.
        Your goal is to help users understand biotechnology, vaccines, and healthcare research.
        
        Rules:
        1. Be concise but informative.
        2. Use beginner-friendly explanations for complex concepts.
        3. If you do not have enough information from the provided context, say so. Do not make up facts.
        4. Never provide specific medical advice or prescriptions. Encourage consulting a professional for emergencies.
        5. Maintain a friendly and scientific tone.
        6. Always base your answers on the provided context where possible.
        """

    async def get_response(self, question: str, chat_history: List[Dict[str, str]] = None) -> str:
        retriever = knowledge_base.get_retriever()
        
        chain = ConversationalRetrievalChain.from_llm(
            llm=self.llm,
            retriever=retriever,
            memory=self.memory,
            verbose=True,
            return_source_documents=True
        )

        # In a real production app, you might want to handle chat_history more explicitly
        # But LangChain's memory handles it if we reuse the same instance or pass it in.
        
        result = await chain.ainvoke({"question": question})
        return result["answer"]

assistant_service = AssistantService()
