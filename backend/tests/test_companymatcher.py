import pytest
from unittest.mock import patch

from backend.utils import CompanyMatcher


def test_clearbit_suggestions_success():
    # simulate Clearbit returning a couple of entries
    sample = [
        {"name": "Google", "domain": "google.com", "logo": "https://logo.clearbit.com/google.com"},
        {"name": "GitHub", "domain": "github.com"},  # no explicit logo field
    ]

    class DummyResponse:
        def raise_for_status(self):
            pass

        def json(self):
            return sample

    with patch("backend.utils.requests.get", return_value=DummyResponse()):
        matcher = CompanyMatcher()
        companies = matcher.get_matching_companies("goo")

    assert isinstance(companies, list)
    assert companies[0]["name"] == "Google"
    # first entry included an explicit logo in the mocked response
    assert companies[0]["logo"] == "https://logo.clearbit.com/google.com"
    # second entry had no explicit logo, so we synthesized one from domain
    assert companies[1]["logo"].endswith("github.com")
    assert companies[1]["website"] == "https://github.com"


def test_clearbit_fallback_to_static():
    # force requests.get to raise, triggering fallback to static DB
    with patch("backend.utils.requests.get", side_effect=Exception("network down")):
        matcher = CompanyMatcher()
        companies = matcher.get_matching_companies("Software Engineering")

    assert companies, "fallback database should return entries"
    # ensure the returned objects include the keys the frontend expects
    for c in companies:
        assert "website" in c
        assert "logo" in c
        assert "openRoles" in c
    # check one of the hardcoded names
    names = [c.get("name") for c in companies]
    assert "Google" in names or "Microsoft" in names


def test_skill_sorting_with_static_data():
    # even when Clearbit returns something, skill sorting should not crash
    # patch _fetch_clearbit_suggestions to return a static list with hiring_focus
    matcher = CompanyMatcher()

    def fake_fetch(query):
        return [
            {"name": "Acme Corp", "hiring_focus": ["Python", "AWS"], "logo": "", "website": ""},
            {"name": "Beta LLC", "hiring_focus": ["Java", "React"], "logo": "", "website": ""},
        ]

    matcher._fetch_clearbit_suggestions = fake_fetch
    companies = matcher.get_matching_companies("whatever", skills=["Python"])
    # Python skill should put Acme first
    assert companies[0]["name"] == "Acme Corp"
    assert companies[0]["skill_match_score"] == 1
