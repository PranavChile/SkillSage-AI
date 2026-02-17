import json
import os
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib

DATA_PATH = Path(__file__).parent / "data" / "domain_samples.json"
MODEL_DIR = Path(__file__).parent.parent / "public" / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

if __name__ == "__main__":
    print("Loading training data from:", DATA_PATH)
    with open(DATA_PATH, "r") as f:
        samples = json.load(f)

    texts = []
    labels = []
    for domain, examples in samples.items():
        for ex in examples:
            texts.append(ex)
            labels.append(domain)

    # Expand dataset slightly by simple data augmentation (lowercasing is enough for now)
    texts = [t for t in texts]
    labels = labels

    # Split
    # For small sample datasets avoid stratify (ensures split succeeds on tiny datasets)
    X_train, X_test, y_train, y_test = train_test_split(texts, labels, test_size=0.2, random_state=42)

    # Vectorize
    print("Training TF-IDF vectorizer...")
    vectorizer = TfidfVectorizer(ngram_range=(1,2), max_features=10000, min_df=1)
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    # Train base classifier
    print("Training base classifier (LogisticRegression)...")
    base_clf = LogisticRegression(max_iter=1000, class_weight='balanced', random_state=42)
    base_clf.fit(X_train_vec, y_train)

    # Calibrate probabilities for better confidence estimates (sigmoid is robust on small data)
    try:
        from sklearn.calibration import CalibratedClassifierCV
n        print("Calibrating classifier probabilities...")
        clf = CalibratedClassifierCV(base_estimator=base_clf, cv=3, method='sigmoid')
        clf.fit(X_train_vec, y_train)
    except Exception as e:
        print(f"Calibration failed ({e}), using base classifier without calibration")
        clf = base_clf

    # Evaluate
    y_pred = clf.predict(X_test_vec)
    acc = accuracy_score(y_test, y_pred)
    print(f"Validation accuracy: {acc:.3f}")
    print("Classification report:\n", classification_report(y_test, y_pred))

    # Save artifacts
    model_path = MODEL_DIR / "domain_classifier.pkl"
    vec_path = MODEL_DIR / "tfidf_vectorizer.pkl"
    print(f"Saving model to: {model_path}")
    joblib.dump(clf, model_path)
    print(f"Saving vectorizer to: {vec_path}")
    joblib.dump(vectorizer, vec_path)

    print("Training complete.")

    print("Training complete.")
