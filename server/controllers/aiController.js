const { GoogleGenerativeAI } = require('@google/generative-ai');

// Models tried in priority order — falls back when per-model quota is exhausted
const MODELS = ['gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-2.5-flash'];

const SYSTEM_PROMPT =
  'You are a professional interior designer. Provide practical and structured design recommendations in valid JSON format only.';

const buildPrompt = (roomType, dimensions, budget, style) =>
  `${SYSTEM_PROMPT}

Room Type: ${roomType}
Dimensions: Width ${dimensions.width}m x Length ${dimensions.length}m x Height ${dimensions.height}m
Budget: $${budget}
Style Preference: ${style}

Return ONLY a valid JSON object with exactly this structure, no markdown, no extra text:
{
  "layoutSuggestion": "string describing optimal layout",
  "colorScheme": "string describing color palette",
  "furnitureList": ["item 1", "item 2", "item 3"],
  "budgetBreakdown": "string describing how to allocate the budget",
  "lightingSuggestion": "string describing lighting recommendations"
}`;

exports.getDesignSuggestions = async (req, res, next) => {
  try {
    const { roomType, dimensions, budget, style } = req.body;

    if (!roomType || !dimensions || !budget || !style) {
      return res.status(400).json({ message: 'roomType, dimensions, budget, and style are required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'GEMINI_API_KEY is not set in server/.env' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const prompt = buildPrompt(roomType, dimensions, budget, style);

    let rawText = null;
    let lastError = null;

    for (const modelName of MODELS) {
      try {
        console.log(`[AI] Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        rawText = result.response.text().trim();
        console.log(`[AI] Success with model: ${modelName}`);
        break;
      } catch (err) {
        lastError = err;
        const is429 = err.status === 429 || (err.message && err.message.includes('429'));
        if (is429) {
          console.warn(`[AI] ${modelName} quota exceeded, trying next model...`);
          continue;
        }
        throw err;
      }
    }

    if (!rawText) {
      const retryMatch = lastError?.message?.match(/retry in (\d+)/i);
      const seconds = retryMatch ? retryMatch[1] : null;
      return res.status(429).json({
        message: `Gemini free-tier daily quota exhausted.${seconds ? ` Retry in ~${seconds}s.` : ''} To fix: open https://aistudio.google.com → your project → enable billing. Or wait until the quota resets tomorrow.`,
        retryAfter: seconds ? parseInt(seconds) : null
      });
    }

    // Strip markdown code fences if present
    let jsonText = rawText;
    const fenceMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (fenceMatch) jsonText = fenceMatch[1];

    let suggestions;
    try {
      suggestions = JSON.parse(jsonText);
    } catch {
      const start = jsonText.indexOf('{');
      const end = jsonText.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        suggestions = JSON.parse(jsonText.substring(start, end + 1));
      } else {
        return res.status(502).json({ message: 'AI returned an unreadable response. Please try again.' });
      }
    }

    res.json({ success: true, suggestions });
  } catch (error) {
    console.error('[AI] Unhandled error:', error.status, error.message);

    if (error.status === 429 || (error.message && error.message.includes('429'))) {
      return res.status(429).json({ message: 'Gemini quota exceeded. Please wait a minute and try again.' });
    }
    if (error.status === 400 || (error.message && error.message.includes('API_KEY'))) {
      return res.status(500).json({ message: 'Invalid Gemini API key. Check GEMINI_API_KEY in server/.env' });
    }

    next(error);
  }
};
