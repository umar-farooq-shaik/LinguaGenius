import fetch from "node-fetch";

// Function to translate text using Google Gemini API
export async function translateText(
  text: string,
  fromLang: string,
  toLang: string
): Promise<string> {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY || "";
    
    if (!apiKey) {
      throw new Error("Missing Gemini API key. Set GEMINI_API_KEY environment variable.");
    }

    // Create prompt for translation
    const prompt = `Translate the following text from ${fromLang === "auto" ? "the detected language" : fromLang} to ${toLang}. Return only the translated text without any additional explanation or context:
    
    ${text}`;

    // Make request to Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
          generationConfig: {
            temperature: 0.1,
            topK: 32,
            topP: 1,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    // Handle API errors
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${errorText}`);
    }

    // Parse response
    const data = await response.json();
    
    // Extract translated text from response
    const translatedText = data.candidates[0].content.parts[0].text.trim();
    
    return translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
}

// Function to detect the language of text using Gemini API
export async function detectLanguage(text: string): Promise<string> {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY || "";
    
    if (!apiKey) {
      throw new Error("Missing Gemini API key. Set GEMINI_API_KEY environment variable.");
    }

    // Create prompt for language detection
    const prompt = `Detect the language of the following text. Return only the ISO 639-1 language code (such as 'en', 'es', 'fr', etc.) without any explanation:
    
    ${text}`;

    // Make request to Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
          generationConfig: {
            temperature: 0.1,
            topK: 32,
            topP: 1,
            maxOutputTokens: 64,
          },
        }),
      }
    );

    // Handle API errors
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${errorText}`);
    }

    // Parse response
    const data = await response.json();
    
    // Extract language code from response
    const languageCode = data.candidates[0].content.parts[0].text.trim().toLowerCase();
    
    // Make sure we have a valid 2-letter language code
    if (languageCode.length !== 2) {
      throw new Error(`Invalid language code received: ${languageCode}`);
    }
    
    return languageCode;
  } catch (error) {
    console.error("Language detection error:", error);
    throw error;
  }
}
