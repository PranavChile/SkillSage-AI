import pytest
from backend.utils import TextProcessor


def test_calculate_readability_score_basic():
    text = (
        "This is a simple sentence. It should return a readability score and a grade level. "
        "The function should handle multiple sentences and words properly."
    )

    result = TextProcessor.calculate_readability_score(text)

    assert isinstance(result, dict)
    assert "score" in result
    assert "grade_level" in result
    assert isinstance(result["grade_level"], (str, float, int))
    assert "level" in result
    assert "word_count" in result
    assert result["word_count"] > 0
    assert 0 <= result["score"] <= 100


def test_calculate_readability_score_empty():
    result = TextProcessor.calculate_readability_score("")
    assert result["score"] == 0
    assert result["level"] in ["Poor", "Needs Improvement"] or result["grade_level"] == "N/A"