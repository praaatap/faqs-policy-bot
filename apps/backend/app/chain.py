from langchain_openai import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from app.vectorstore import get_retriever
from app.config import settings

# Store per-session memory: { session_id: memory }
session_memories: dict[str, ConversationBufferMemory] = {}

def get_memory(session_id: str) -> ConversationBufferMemory:
    if session_id not in session_memories:
        session_memories[session_id] = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            output_key="answer"
        )
    return session_memories[session_id]

def get_chain(session_id: str) -> ConversationalRetrievalChain:
    llm = ChatOpenAI(
        model=settings.model_name,
        temperature=0,
        openai_api_key=settings.openai_api_key
    )
    memory = get_memory(session_id)
    retriever = get_retriever()

    chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=retriever,
        memory=memory,
        return_source_documents=True,
        output_key="answer"
    )
    return chain

def clear_session(session_id: str):
    if session_id in session_memories:
        del session_memories[session_id]

def get_history(session_id: str):
    memory = session_memories.get(session_id)
    if not memory:
        return []
    messages = memory.chat_memory.messages
    return [
        {"role": "human" if i % 2 == 0 else "ai", "content": m.content}
        for i, m in enumerate(messages)
    ]
