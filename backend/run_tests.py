import json
import os
from models import ResumeImprover, PlagiarismChecker

ri = ResumeImprover()
pc = PlagiarismChecker()

# display Mistral configuration (if any)
print("Mistral URL:", os.getenv('MISTRAL_URL'))
print("Mistral Model:", os.getenv('MISTRAL_MODEL'))
print("Mistral API key provided:", bool(os.getenv('MISTRAL_API_KEY')))

text = "I am a results-driven professional with excellent communication skills. I worked for 5 years developing web apps and improved performance by 30%."
corpus = ["I am a skilled developer with experience in Python and JavaScript."]

print('=== ResumeImprover Output ===')
print(ri.improve(text))

print('\n=== PlagiarismChecker Output ===')
print(json.dumps(pc.check(text, corpus), indent=2))
