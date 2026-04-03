async function simulateAnalysis(file) {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await fetch('http://localhost:8000/api/analyze-resume', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to fetch analysis');
    }

    const data = await response.json();
    return {
        domain: data.domain,
        confidence: data.confidence,
        skills: data.skills,
    };
}