require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/analyze', async (req, res) => {
  const { frames, textBlocks } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key missing' });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a user‑experience and ethical‑design expert. You will receive UI content extracted from selected Figma frames (including frame names and all visible text). Your task is to identify any deceptive (dark) patterns and explain them thoroughly.'
          },
          {
            role: 'user',
            content:
              `Frame Names:\n${frames.map((f,i) => `${i+1}. ${f}`).join("\n")}\n\n` +
              `Extracted Text:\n${textBlocks.join("\n\n")}\n\n` +
              `Please analyze this UI content and produce an output that meets these requirements:\n\n` +
              `— **First line:** A comma‑separated list of the deceptive patterns you detected (or “No deceptive patterns detected” if none).\n\n` +
              `1. **Detected Deceptive Patterns**\n` +
              `   - For each pattern, provide:\n` +
              `     • **Name** (e.g. "Roach Motel", "Confirmshaming").\n` +
              `     • **Frame Reference** (use the frame number above).\n` +
              `     • **Evidence**: Which UI elements (buttons, text, layout) qualify it as that pattern.\n\n` +
              `2. **UX Path & Wording Analysis**\n` +
              `   - Discuss navigation paths, button placement, labels, consent prompts, etc.\n` +
              `   - Highlight any confusing or misleading choices (e.g. pre‑checked opt‑ins).\n\n` +
              `3. **Prevention & Ethical Alternatives**\n` +
              `   - For each pattern, suggest a clear redesign using user‑centered principles.\n\n` +
              `**Additional instructions:**\n` +
              `- Be objective and thorough.\n` +
              `- If no patterns are found, state that explicitly and explain why.\n` +
              `- When multiple frames are involved, also note any multi‑step or continuity‑based deception.\n`
          }
        ],
        temperature: 0.3
      })
    });
    const data = await response.json();
    const text = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '⚠️ No response.';
    res.json({ result: text });
  } catch (err) {
    console.error('OpenAI error:', err);
    res.status(500).json({ error: 'Error contacting OpenAI.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
