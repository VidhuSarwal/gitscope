import chromadb
import json
import hashlib
from chromadb.config import Settings

class CacheService:
    _client = None
    _collection = None

    @classmethod
    def _get_collection(cls):
        if cls._client is None:
            # Persistent storage for cache
            cls._client = chromadb.PersistentClient(path="./chroma_db")
        
        if cls._collection is None:
            cls._collection = cls._client.get_or_create_collection(name="file_analysis_cache")
        
        return cls._collection

    @staticmethod
    def get_analysis(content_hash: str):
        collection = CacheService._get_collection()
        results = collection.get(ids=[content_hash])
        
        if results and results["documents"]:
            # Return the first match (should be unique by ID)
            return json.loads(results["documents"][0])
        return None

    @staticmethod
    def save_analysis(content_hash: str, analysis: dict, content: str = "", cache_type: str = "file_analysis"):
        collection = CacheService._get_collection()
        # Store the analysis JSON string as the document
        collection.upsert(
            ids=[content_hash],
            documents=[json.dumps(analysis)],
            metadatas=[{"type": cache_type}] 
        )

    @staticmethod
    def compute_hash(content: str) -> str:
        return hashlib.sha256(content.encode('utf-8')).hexdigest()
