
const Gemini_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

class GeminiError extends Error {
  constructor(message, statusCode = 502) {
    super(message)
    this.name = "GeminiError"
    this.statusCode = statusCode
  }
}

const getGeminiStatusCode = (message, responseStatus) => {
  const normalizedMessage = message.toLowerCase()

  if (normalizedMessage.includes("quota") || responseStatus === 429) {
    return 429
  }

  if (
    normalizedMessage.includes("high demand") ||
    normalizedMessage.includes("overloaded") ||
    normalizedMessage.includes("try again later") ||
    responseStatus === 503
  ) {
    return 503
  }

  return responseStatus >= 400 && responseStatus < 500 ? 400 : 502
}

export const generateGeminiResponse = async (prompt) => {

try {
    if (!process.env.GEMINI_API_KEY) {
      throw new GeminiError("Gemini API key is missing", 500)
    }

         const response = await fetch(`${Gemini_URL}?key=${process.env.GEMINI_API_KEY}`,{
        method:"POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          generationConfig: {
            responseMimeType: "application/json"
          },
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })

    })

    if (!response.ok) {
      const errorText = await response.text();
      let message = `Gemini API request failed with status ${response.status}`;

      try {
        const errorData = JSON.parse(errorText);
        message = errorData.error?.message || message;
      } catch {
        if (errorText) message = errorText;
      }

      throw new GeminiError(message, getGeminiStatusCode(message, response.status));
    }

    const data = await response.json()

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new GeminiError("No text returned from Gemini", 502);
    }

    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

      return (cleanText);



    } catch (error) {
        console.error("Gemini Fetch Error:", error.message);
    if (error instanceof GeminiError) {
      throw error
    }

    throw new GeminiError(error.message || "Gemini API fetch failed", 502);
    }
   
}
