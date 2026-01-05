
import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = 'gemini-2.5-flash-image';

export const generateEverskiesStyle = async (imageBase64: string, mimeType: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const prompt = `
    Transform the character in the attached image into the iconic "Everskies" pixel art style. 
    Strictly follow these rules:
    1. Body Shape: Use the signature Everskies slim body base (tall, slender limbs, delicate proportions).
    2. Facial Features: Create large, expressive, anime-like eyes with soft highlights, a small delicate nose, and specific facial expression from the reference.
    3. Outfit & Hair: Replicate the hairstyle, clothing, and accessories from the provided image exactly, but adapted to the pixel art aesthetic.
    4. Shading: Use soft, layered pixel shading typical of high-quality pixel dolls.
    5. Background: Pure white background.
    6. Composition: One single complete character, centered in the frame.
    7. Style: High-fidelity pixel art, clean lines, no blur.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4",
        },
      }
    });

    let imageUrl = '';
    
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      throw new Error("The model did not return an image part.");
    }

    return imageUrl;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};
