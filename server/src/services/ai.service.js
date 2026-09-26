export async function generateFitnessAdvice({ type, payload }) {

  if (!process.env.GEMINI_API_KEY) {
    return fallback(type, payload);
  }

  const prompt =
    type === "recommend"
      ? `You are a careful fitness planning assistant. Create a concise, structured weekly workout recommendation for age ${payload.age}, goal ${payload.goal}, experience ${payload.experience}. Include warmup, exercises, sets/reps or time, recovery, and safety notes. Avoid medical diagnosis.`
      : `You are a fitness analytics assistant. Analyze total workouts ${payload.totalWorkouts}, average duration ${payload.averageDuration} minutes, and calories burned ${payload.totalCalories}. Return strengths, trends, 3 actionable improvements, and a motivational summary. Avoid medical diagnosis.`;

  // 👇 REPLACE THE OLD GEMINI CODE WITH THIS

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `gemini-3.6-flash:generateContent`;

  const maxRetries = 3;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },

        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();

        return (
          data.candidates?.[0]?.content?.parts?.[0]?.text ||
          fallback(type, payload)
        );
      }

      const errorText = await response.text();

      console.error(
        `Gemini attempt ${attempt + 1} failed:`,
        response.status,
        errorText
      );

      if (response.status !== 503 && response.status !== 429) {
        throw new Error(
          `Gemini API failed with status ${response.status}`
        );
      }

      if (attempt < maxRetries - 1) {
        const delay = 2000 * Math.pow(2, attempt);

        console.log(
          `Retrying Gemini in ${delay / 1000}s...`
        );

        await new Promise((resolve) =>
          setTimeout(resolve, delay)
        );
      }

    } catch (error) {

      console.error("Gemini request error:", error);

      if (attempt === maxRetries - 1) {
        return fallback(type, payload);
      }
    }
  }

  return fallback(type, payload);
}


function fallback(type, p) {

  if (type === "recommend") {
    return `Weekly plan for a ${p.experience} athlete focused on ${p.goal}: 3 strength sessions, 2 light cardio/recovery sessions, 1 mobility day and 1 full rest day. Start each session with 5–10 minutes of warm-up. Increase volume gradually and stop if you feel unusual pain, dizziness or breathing difficulty.`;
  }

  return `You completed ${p.totalWorkouts} workouts with an average duration of ${p.averageDuration} minutes and ${p.totalCalories} calories recorded. Keep consistency, gradually progress training load, and schedule recovery. Track duration and perceived effort together for a clearer progress picture.`;
}