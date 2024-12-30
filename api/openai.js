const axios = require("axios");
require("dotenv").config();

const generateCompletion = async (ingredients) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OpenAI API key.");
  }
  console.log('Triggering with ingredients: ', ingredients)

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful chef assistant." },
          {
            role: "user",
            content: `Create a pregnancy-safe recipe using the following ingredients: ${ingredients.join(
              ", "
            )}. Provide a step-by-step instruction and ingredients.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const recipe = response.data.choices[0].message.content.trim();
    console.log("Generated Recipe in generateCompletion:", recipe);
    return recipe;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error("Failed to generate recipe");
  }
};

module.exports = { generateCompletion };
