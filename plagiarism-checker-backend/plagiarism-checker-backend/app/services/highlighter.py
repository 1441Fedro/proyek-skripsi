def find_common_ngrams(text1: str, text2: str, n: int = 5):
    def generate_ngrams(text):
        tokens = text.lower().split()
        return set([' '.join(tokens[i:i+n]) for i in range(len(tokens)-n+1)])
    
    ngrams1 = generate_ngrams(text1)
    ngrams2 = generate_ngrams(text2)
    return ngrams1 & ngrams2
