import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function sendMessageToOpenAI(text: string, systemPrompt: string, language: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" }
    });

    return response.choices[0].message.content;
  } catch (error) {
    throw new Error(`OpenAI API Error: ${error.message}`);
  }
}

export async function sendImageToOpenAI(imageUrl: string, language: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert mechanic. Analyze the image and provide detailed technical insights about the mechanical components shown. Identify any visible issues or potential problems."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this image of a vehicle or engine component."
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    return response.choices[0].message.content;
  } catch (error) {
    throw new Error(`OpenAI Vision API Error: ${error.message}`);
  }
}
