// backend/index.js
const express = require('express');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(bodyParser.json({ limit: '1mb' }));

// Update this to your local Mistral server endpoint
const LOCAL_MISTRAL_URL = 'http://localhost:8000/v1/completions';

// Helper: craft LLM prompt
function buildPrompt(resumeText) {
  return `
You are an expert resume reviewer and career coach. Analyze the resume content provided and produce a JSON array of suggested improvements.
Return only JSON that parses to an array of suggestion objects with fields:
  - category (skills|experience|format|keywords)
  - priority (high|medium|low)
  - title
  - description
  - suggestion
  - impact

Resume content:
${resumeText}

Output example:
[
  {
    "category":"skills",
    "priority":"high",
    "title":"Add more cloud skills",
    "description":"You mention backend work but no cloud platform; many jobs require AWS/GCP experience.",
    "suggestion":"Add a 'Cloud & DevOps' section listing AWS/GCP experience and projects.",
    "impact":"Increases match for cloud-focused roles."
  }
]
`;
}

app.post('/api/mistral/resume-improvements', async (req, res) => {
  const { resumeText, model = 'mistral-1' } = req.body;
  if (!resumeText) return res.status(400).json({ error: 'resumeText required' });

  try {
    const payload = {
      model,
      messages: [
        { role: 'system', content: 'You are a helpful resume coach that emits JSON suggestions only.' },
        { role: 'user', content: buildPrompt(resumeText) }
      ],
      max_tokens: 800,
      temperature: 0.2,
      n: 1,
    };

    const response = await fetch(LOCAL_MISTRAL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Mistral local API error', response.status, text);
      return res.status(500).json({ error: 'LLM request failed', details: text });
    }

    const json = await response.json();
    let assistantOutput = '';

    if (json.choices && json.choices[0] && json.choices[0].message) {
      assistantOutput = json.choices[0].message.content;
    } else if (json.output) {
      assistantOutput = JSON.stringify(json.output);
    } else {
      assistantOutput = JSON.stringify(json);
    }

    const cleaned = assistantOutput.replace(/```json|```/g, '').trim();
    let suggestions = [];

    try {
      suggestions = JSON.parse(cleaned).map(s => ({
        category: s.category || 'skills',
        priority: s.priority || 'medium',
        title: s.title || (s.suggestion ? s.suggestion.slice(0, 60) : 'Suggestion'),
        description: s.description || '',
        suggestion: s.suggestion || '',
        impact: s.impact || '',
      }));
    } catch (parseErr) {
      console.error('Failed to parse assistant output as JSON', parseErr);
      suggestions = [{
        category: 'format',
        priority: 'low',
        title: 'LLM output (unstructured)',
        description: 'The LLM returned unstructured text; see suggestion below.',
        suggestion: cleaned,
        impact: 'Manual review required',
      }];
    }

    return res.json({ suggestions });
  } catch (err) {
    console.error('Server error', err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
