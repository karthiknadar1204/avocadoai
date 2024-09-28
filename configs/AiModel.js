/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  

export const chatSession = model.startChat({
      generationConfig,
   // safetySettings: Adjust safety settings
   // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [
        {
          role: "user",
          parts: [
            {text: "write a script to generate a 30 seconds video on a topic:interesting historical story along with AI image prompt in realistic format for each scene and give me result in JSON format with imagePrompt and contextText as field"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n[\n  {\n    \"imagePrompt\": \"A bustling medieval marketplace with people haggling over goods, brightly colored fabrics, and a large stone building in the background.\",\n    \"contextText\": \"In the bustling medieval marketplace of Bruges, a young woman named Agnes worked tirelessly at her stall, selling her beautiful hand-woven tapestries. Agnes was known for her artistry and her kind heart, but she yearned for more than just a life of weaving.\"\n  },\n  {\n    \"imagePrompt\": \"A portrait of Agnes, a young woman with determined eyes and a hint of sadness in her expression, wearing a simple but elegant dress.\",\n    \"contextText\": \"She dreamt of becoming a scholar, but in those times, education was reserved for men. Undeterred, she secretly learned to read and write, borrowing books from the local monastery and studying late into the night.\"\n  },\n  {\n    \"imagePrompt\": \"A dimly lit room with a flickering candle, Agnes hunched over a book with a quill in her hand, her face illuminated by the light.\",\n    \"contextText\": \"Agnes's passion for knowledge burned brighter than any candle. She devoured every book she could find, her mind expanding with each page she turned.\"\n  },\n  {\n    \"imagePrompt\": \"A grand cathedral interior, with stained-glass windows casting colorful light, a young woman in a simple dress standing among a group of monks, her face filled with awe and wonder.\",\n    \"contextText\": \"One day, a traveling scholar arrived at the monastery, bringing with him a collection of ancient texts. Agnes, with her insatiable thirst for knowledge, boldly approached him, seeking to learn more.\"\n  },\n  {\n    \"imagePrompt\": \"A close-up shot of an ancient manuscript, illuminated by candlelight, a young woman's hand tracing the lines with her finger, her expression one of fascination.\",\n    \"contextText\": \"The scholar, impressed by Agnes's intelligence and her unwavering determination, took her under his wing. He shared his knowledge with her, opening up a world of possibilities.\"\n  },\n  {\n    \"imagePrompt\": \"Agnes, now dressed in scholarly robes, standing confidently in front of a large audience, delivering a lecture with passion and eloquence.\",\n    \"contextText\": \"Agnes eventually became a respected scholar herself, breaking down barriers and inspiring other women to pursue their dreams. Her story, a testament to the power of ambition and knowledge, continues to resonate through the ages.\"\n  }\n]\n```\n\n**Explanation:**\n\nThis JSON structure contains 6 objects, each representing a scene in the 30-second video.\n\n* **imagePrompt:** This field provides a detailed description for an AI image generator to create a visually appealing image that corresponds to the scene. It incorporates elements of the narrative and focuses on creating a realistic setting and visual representation of the story.\n* **contextText:** This field contains the narrative text for each scene. It's written in a clear and concise manner, aiming to be easily understood and engaging.\n\n**Using the JSON:**\n\nThis JSON can be used to:\n\n* **Generate images:** Feed the image prompts to an AI image generator like Midjourney, DALL-E, or Stable Diffusion to produce visuals for each scene.\n* **Create a video:** Combine the generated images with the context text to create a 30-second video using video editing software. The text can be used as narration or displayed on screen.\n\n**Further Development:**\n\nThis script can be expanded to:\n\n* Include additional scenes and context text to tell a more detailed story.\n* Incorporate music, sound effects, and transitions to enhance the video.\n* Use different AI image generation tools to explore different styles and aesthetics.\n* Customize the narrative and images to fit a specific historical story or theme. \n"},
          ],
        },
      ],
});
