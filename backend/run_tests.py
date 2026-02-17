import json
from models import ResumeImprover, PlagiarismChecker

ri = ResumeImprover()
pc = PlagiarismChecker()

text = "I am a results-driven professional with excellent communication skills. I worked for 5 years developing web apps and improved performance by 30%."

print('=== ResumeImprover Output ===')
print(json.dumps(ri.analyze_resume(text, domain='Software Engineering'), indent=2))

print('\n=== PlagiarismChecker Output ===')
print(json.dumps(pc.check_plagiarism(text), indent=2))
