import numpy as np
import pandas as pd
from sklearn.datasets import fetch_20newsgroups
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity

class LSA:
    def __init__(self, n_components=100):
        self.n_components = n_components
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.svd = TruncatedSVD(n_components=n_components)
        self.documents = None
        self.document_term_matrix = None
        self.reduced_matrix = None

    def fit(self):
        newsgroups = fetch_20newsgroups(subset='all')
        self.documents = newsgroups.data
        self.document_term_matrix = self.vectorizer.fit_transform(self.documents)
        self.reduced_matrix = self.svd.fit_transform(self.document_term_matrix)

    def query(self, user_query):
        query_vector = self.vectorizer.transform([user_query])
        query_reduced = self.svd.transform(query_vector)
        similarities = cosine_similarity(query_reduced, self.reduced_matrix)
        return similarities.flatten()

    def get_top_documents(self, user_query, top_n=5):
        similarities = self.query(user_query)
        top_indices = np.argsort(similarities)[-top_n:][::-1]
        top_documents = []
        for i in top_indices:
            doc_number = int(i)  # Convert to a native Python int
            doc_content = self.documents[i]  # Get the actual document content
            similarity_score = float(similarities[i])  # Convert to a native Python float
            top_documents.append({
                "document_number": doc_number,
                "content": doc_content,
                "similarity": similarity_score,
            })
        return top_documents


lsa_model = LSA()
lsa_model.fit()
