/*
 * Install the OpenAI SDK
 *
 * $ npm install openai
 */

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

const model = "grok-2-latest";

const generationConfig = {
  temperature: 1,
  top_p: 0.95,
  max_tokens: 8192,
  response_format: { type: "json_object" },
};

// Create a function to simulate the chat session
export const generateVideoScript = async (prompt) => {
  try {
    // Initial system message to set the context
    const messages = [
      {
        role: "system",
        content: "You are an expert video script writer. You create engaging, informative scripts with clear scene descriptions."
      },
      {
        role: "user",
        content: "write a script to generate a 30 seconds video on a topic:interesting historical story along with AI image prompt in realistic format for each scene and give me result in JSON format with imagePrompt and contextText as field"
      },
      {
        role: "assistant",
        content: JSON.stringify([
          {
            "imagePrompt": "A bustling medieval marketplace with people haggling over goods, brightly colored fabrics, and a large stone building in the background.",
            "contextText": "In the bustling medieval marketplace of Bruges, a young woman named Agnes worked tirelessly at her stall, selling her beautiful hand-woven tapestries. Agnes was known for her artistry and her kind heart, but she yearned for more than just a life of weaving."
          },
          {
            "imagePrompt": "A portrait of Agnes, a young woman with determined eyes and a hint of sadness in her expression, wearing a simple but elegant dress.",
            "contextText": "She dreamt of becoming a scholar, but in those times, education was reserved for men. Undeterred, she secretly learned to read and write, borrowing books from the local monastery and studying late into the night."
          },
          {
            "imagePrompt": "A dimly lit room with a flickering candle, Agnes hunched over a book with a quill in her hand, her face illuminated by the light.",
            "contextText": "Agnes's passion for knowledge burned brighter than any candle. She devoured every book she could find, her mind expanding with each page she turned."
          },
          {
            "imagePrompt": "A grand cathedral interior, with stained-glass windows casting colorful light, a young woman in a simple dress standing among a group of monks, her face filled with awe and wonder.",
            "contextText": "One day, a traveling scholar arrived at the monastery, bringing with him a collection of ancient texts. Agnes, with her insatiable thirst for knowledge, boldly approached him, seeking to learn more."
          },
          {
            "imagePrompt": "A close-up shot of an ancient manuscript, illuminated by candlelight, a young woman's hand tracing the lines with her finger, her expression one of fascination.",
            "contextText": "The scholar, impressed by Agnes's intelligence and her unwavering determination, took her under his wing. He shared his knowledge with her, opening up a world of possibilities."
          },
          {
            "imagePrompt": "Agnes, now dressed in scholarly robes, standing confidently in front of a large audience, delivering a lecture with passion and eloquence.",
            "contextText": "Agnes eventually became a respected scholar herself, breaking down barriers and inspiring other women to pursue their dreams. Her story, a testament to the power of ambition and knowledge, continues to resonate through the ages."
          }
        ])
      },
      {
        role: "user",
        content: prompt
      }
    ];

    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: generationConfig.temperature,
      top_p: generationConfig.top_p,
      max_tokens: generationConfig.max_tokens,
      response_format: generationConfig.response_format,
    });

    // Parse the JSON response
    const responseText = completion.choices[0].message.content;
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error generating video script:", error);
    throw error;
  }
};
