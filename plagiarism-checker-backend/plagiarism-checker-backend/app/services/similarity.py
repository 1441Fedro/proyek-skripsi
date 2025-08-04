# 1. TF-IDF + Cosine Similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def tfidf_cosine_similarity(texts: list[str]) -> list:
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(texts)
    sim_matrix = cosine_similarity(tfidf_matrix)
    return sim_matrix.tolist()  # matriks NxN

# 2. BERT Similarity (Validasi)
from sentence_transformers import SentenceTransformer

bert_model = SentenceTransformer("paraphrase-MiniLM-L6-v2")

def bert_similarity(texts: list[str]) -> list:
    embeddings = bert_model.encode(texts)
    sim_matrix = cosine_similarity(embeddings)
    return sim_matrix.tolist()

# 3. N-Gram Overlap (Copy-Paste Detection)
from sklearn.feature_extraction.text import CountVectorizer

def ngram_similarity(texts: list[str], n: int = 5) -> list:
    vectorizer = CountVectorizer(ngram_range=(n, n), analyzer="word", binary=True)
    ngram_matrix = vectorizer.fit_transform(texts)
    sim_matrix = cosine_similarity(ngram_matrix)
    return sim_matrix.tolist()

# 4. Tambahkan kolom untuk mementukan plagiat berdasarkan bobot 50%, 30%, 20% (Fungsi Kombinasi (dengan bobot))
import numpy as np
def combined_score(tfidf: np.ndarray, bert: np.ndarray, ngram: np.ndarray, weights=(0.5, 0.3, 0.2)) -> np.ndarray:
    # Pastikan semuanya array
    tfidf = np.array(tfidf)
    bert = np.array(bert)
    ngram = np.array(ngram)
    # Kombinasi skor similarity
    combined_result = tfidf * weights[0] + bert * weights[1] + ngram * weights[2]
    return combined_result  # Matriks NxN

import numpy as np

def average_score(tfidf: list, bert: list, ngram: list) -> np.ndarray:
    tfidf = np.array(tfidf)
    bert = np.array(bert)
    ngram = np.array(ngram)
    return (tfidf + bert + ngram) / 3

# 5. Deteksi Plagiarisme Berdasarkan Threshold
def detect_plagiarism_treshold(combined_matrix: np.ndarray, threshold: float = 0.7) -> list[tuple[int, int, float, str]]:
    n = combined_matrix.shape[0]
    results = []
    for i in range(n):
        for j in range(i+1, n):  # hanya bagian atas matriks karena simetrik
            score = combined_matrix[i][j]
            label = "Ya" if score >= threshold else "Tidak"
            results.append((i, j, round(score, 4), label))
    return results

def detect_plagiarism_voting(tfidf: list, bert: list, ngram: list) -> list[tuple[int, int, float, str]]:
    tfidf = np.array(tfidf)
    bert = np.array(bert)
    ngram = np.array(ngram)
    n = tfidf.shape[0]
    results = []

    for i in range(n):
        for j in range(i + 1, n):
            tfidf_score = tfidf[i][j]
            bert_score = bert[i][j]
            ngram_score = ngram[i][j]

            votes = sum([
                tfidf_score >= 0.7,
                bert_score >= 0.8,
                ngram_score >= 0.6
            ])

            label = "Ya" if votes >= 2 or 1.0 in (tfidf_score, bert_score, ngram_score) else "Tidak"
            avg_score = (tfidf_score + bert_score + ngram_score) / 3

            results.append((i, j, round(avg_score, 4), label))

    return results

def detect_plagiarism_average(avg_matrix: np.ndarray, threshold: float = 0.7) -> list[tuple[int, int, float, str]]:
    n = avg_matrix.shape[0]
    results = []

    for i in range(n):
        for j in range(i + 1, n):
            score = avg_matrix[i][j]
            label = "Ya" if score >= threshold else "Tidak"
            results.append((i, j, round(score, 4), label))

    return results

# def detect_plagiarism_average(tfidf: list, bert: list, ngram: list, threshold: float = 0.7) -> list[tuple[int, int, float, str]]:
#     tfidf = np.array(tfidf)
#     bert = np.array(bert)
#     ngram = np.array(ngram)
#     n = tfidf.shape[0]
#     results = []

#     for i in range(n):
#         for j in range(i + 1, n):
#             avg_score = (tfidf[i][j] + bert[i][j] + ngram[i][j]) / 3
#             label = "Ya" if avg_score >= threshold else "Tidak"
#             results.append((i, j, round(avg_score, 4), label))

#     return results
# def combined_score(tfidf: np.ndarray, bert, ngram, weights=(0.3, 0.5, 0.2)):
#     combined_result = tfidf * weights[0] + bert * weights[1] + ngram * weights[2]
#     if combined_result >= 0.6:
#         plagiat = "Ya"
#     else:
#         plagiat = "Tidak"
#     return plagiat