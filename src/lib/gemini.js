const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = 'gemini-1.5-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

/**
 * Ask Gemini to evaluate a speaking/writing exercise answer.
 * Returns structured feedback in Czech with English corrections.
 */
export async function getExerciseFeedback({ userAnswer, promptCzech, exampleAnswer, targetWords = [] }) {
  const prompt = `
Jsi přátelský lektor angličtiny pro české studenty. Zkontroluj následující anglický text, který napsal český student.

ZADÁNÍ CVIČENÍ (česky): ${promptCzech}

ODPOVĚĎ STUDENTA: ${userAnswer}

VZOROVÁ ODPOVĚĎ (pro referenci): ${exampleAnswer}

${targetWords.length > 0 ? `CÍLOVÁ SLOVÍČKA (která měl student použít): ${targetWords.join(', ')}` : ''}

Vrať zpětnou vazbu v následujícím JSON formátu (nic jiného, jen JSON):
{
  "overallScore": číslo 1-10,
  "summary": "Krátké celkové hodnocení v češtině (1-2 věty, povzbudivé)",
  "grammarErrors": [
    {
      "original": "chybná fráze ze studentova textu",
      "corrected": "správná verze",
      "explanation": "vysvětlení chyby v češtině"
    }
  ],
  "vocabularySuggestions": [
    {
      "original": "slovo/fráze studenta",
      "better": "lepší alternativa",
      "explanation": "proč je to lepší, v češtině"
    }
  ],
  "targetWordsUsed": ["seznam cílových slov která student skutečně použil"],
  "positives": ["co student udělal dobře, v češtině, 1-3 body"]
}

Pokud student neudělal žádné gramatické chyby, vrať prázdné pole grammarErrors.
Pokud je text příliš krátký (méně než 5 slov), vrať overallScore: 0 a summary: "Text je příliš krátký na hodnocení."
`.trim();

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error: ${response.status} — ${err}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Prázdná odpověď od Gemini');

  return JSON.parse(text);
}
