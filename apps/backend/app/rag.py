from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQAWithSourcesChain

CHROMA_PATH = "chroma_db"

def get_rag_chain():
    embeddings = OpenAIEmbeddings()
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embeddings)
    retriever = db.as_retriever(search_kwargs={"k": 4})

    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    chain = RetrievalQAWithSourcesChain.from_chain_type(llm=llm, retriever=retriever)
    return chain
