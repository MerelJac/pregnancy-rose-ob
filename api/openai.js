const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateCompletion = async (ingredients) => {
  if (!ingredients || ingredients.length === 0) {
    throw new Error("No ingredients provided.");
  }

  const prompt = `Create a pregnancy-safe recipe using the following ingredients: ${ingredients.join(
    ", "
  )}. Provide a step-by-step instruction.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a helpful chef assistant." },
      { role: "user", content: prompt },
    ],
    max_tokens: 150,
  });

  return completion.choices[0].message.content.trim();
};

module.exports = { generateCompletion };
