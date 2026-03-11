from langchain_groq import ChatGroq
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from app.vectorstore import get_retriever
from app.config import settings

session_memories: dict[str, ConversationBufferMemory] = {}

def get_memory(key: str) -> ConversationBufferMemory:
    if key not in session_memories:
        session_memories[key] = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            output_key="answer"
        )
    return session_memories[key]

def get_chain(
    session_id: str,
    company_id: str = "default",
    subject: str = "general"
) -> ConversationalRetrievalChain:

    memory_key = f"{session_id}:{company_id}:{subject}"
    memory = get_memory(memory_key)
    retriever = get_retriever(company_id, subject)

    llm = ChatGroq(
        model=settings.model_name,
        temperature=0,
        api_key=settings.groq_api_key
    )

    return ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=retriever,
        memory=memory,
        return_source_documents=True,
        output_key="answer"
    )

def clear_session(session_id: str):
    keys_to_delete = [k for k in session_memories if k.startswith(session_id)]
    for k in keys_to_delete:
        del session_memories[k]

def get_history(session_id: str):
    memory = session_memories.get(session_id)
    if not memory:
        return []
    messages = memory.chat_memory.messages
    return [
        {"role": "human" if i % 2 == 0 else "ai", "content": m.content}
        for i, m in enumerate(messages)
    ]
