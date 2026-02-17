import joblib
from pathlib import Path

MODEL_DIR = Path(__file__).parent.parent.parent / "public" / "models"
MODEL_PATH = MODEL_DIR / "domain_classifier.pkl"
VEC_PATH = MODEL_DIR / "tfidf_vectorizer.pkl"

sample_tests = [
    ("Experienced software engineer with React and Node.", "Software Engineering"),
    ("Built ML models using pandas and scikit-learn.", "Data Science"),
    ("Focused on SEO, content strategy and social media.", "Marketing"),
    ("Financial analysis, portfolio and risk management.", "Finance"),
]

if __name__ == "__main__":
    if not MODEL_PATH.exists() or not VEC_PATH.exists():
        raise SystemExit("Model artifacts not found. Run `python3 backend/train_classifier.py` first.")

    clf = joblib.load(MODEL_PATH)
    vec = joblib.load(VEC_PATH)

    for text, expected in sample_tests:
        pred = clf.predict(vec.transform([text]))[0]
        print(f"Text: {text}\nPred: {pred}\nExpected: {expected}\n")
