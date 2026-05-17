import os
from typing import List
from config.settings import settings

class KnowledgeBaseService:
    def __init__(self):
        self._embeddings = None
        self.persist_directory = "./chroma_db"
        self.vector_store = None

    @property
    def embeddings(self):
        if self._embeddings is None:
            try:
                from langchain_huggingface import HuggingFaceEmbeddings
                print("Initializing HuggingFaceEmbeddings (all-MiniLM-L6-v2)...")
                self._embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
            except ImportError as e:
                print("HuggingFaceEmbeddings not available. Dynamic import failed:", e)
                raise e
        return self._embeddings

    def index_documents(self):
        """
        Indexes local documentation and root README into ChromaDB.
        """
        try:
            from langchain_community.document_loaders import DirectoryLoader, TextLoader
            from langchain_text_splitters import RecursiveCharacterTextSplitter
            from langchain_community.vectorstores import Chroma
        except ImportError as e:
            print("Required indexing libraries not installed locally:", e)
            raise e

        loaders = [
            DirectoryLoader("../docs", glob="**/*.md", loader_cls=TextLoader, loader_kwargs={"encoding": "utf-8"}),
            TextLoader("../README.md", encoding="utf-8")
        ]
        
        docs = []
        for loader in loaders:
            try:
                docs.extend(loader.load())
            except Exception as e:
                print(f"Error loading documents: {e}")

        if not docs:
            print("No documents found to index.")
            return

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        splits = text_splitter.split_documents(docs)

        self.vector_store = Chroma.from_documents(
            documents=splits,
            embedding=self.embeddings,
            persist_directory=self.persist_directory
        )
        print(f"Indexed {len(splits)} chunks into {self.persist_directory}")

    def get_retriever(self):
        try:
            from langchain_community.vectorstores import Chroma
        except ImportError as e:
            print("Chroma is not installed in the active environment:", e)
            raise e

        if not self.vector_store:
            self.vector_store = Chroma(
                persist_directory=self.persist_directory,
                embedding_function=self.embeddings
            )
        return self.vector_store.as_retriever(search_kwargs={"k": 3})

knowledge_base = KnowledgeBaseService()

