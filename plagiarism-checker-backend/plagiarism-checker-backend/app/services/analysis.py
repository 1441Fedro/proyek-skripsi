from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from transformers import BertTokenizer, BertModel
import torch
import nltk
from nltk.util import ngrams
from collections import Counter

# TF-IDF + Cosine Similarity
def compute_tfidf_cosine_similarity(doc1: str, doc2: str) -> float:
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([doc1, doc2])
    cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
    return cosine_sim[0][0]

# BERT similarity
def compute_bert_similarity(doc1: str, doc2: str) -> float:
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    model = BertModel.from_pretrained('bert-base-uncased')

    inputs1 = tokenizer(doc1, return_tensors='pt', padding=True, truncation=True, max_length=512)
    inputs2 = tokenizer(doc2, return_tensors='pt', padding=True, truncation=True, max_length=512)

    with torch.no_grad():
        outputs1 = model(**inputs1)
        outputs2 = model(**inputs2)

    embeddings1 = outputs1.last_hidden_state.mean(dim=1)
    embeddings2 = outputs2.last_hidden_state.mean(dim=1)

    cosine_sim = torch.nn.functional.cosine_similarity(embeddings1, embeddings2)
    return cosine_sim.item()

# N-Gram similarity
def compute_ngram_similarity(doc1: str, doc2: str, n: int = 2) -> float:
    ngrams_doc1 = list(ngrams(doc1.split(), n))
    ngrams_doc2 = list(ngrams(doc2.split(), n))
    counter1 = Counter(ngrams_doc1)
    counter2 = Counter(ngrams_doc2)
    common_ngrams = counter1 & counter2
    total_ngrams = counter1 + counter2
    similarity = sum(common_ngrams.values()) / float(sum(total_ngrams.values()))
    return similarity
