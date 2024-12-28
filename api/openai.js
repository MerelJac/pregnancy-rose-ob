const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const openai = new OpenAI({
  // apiKey: process.env.OPENAI_API_KEY,

});

console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);
console.log("NODE_ENV:", process.env.NODE_ENV);


const generateCompletion = async (ingredients) => {
  if (!ingredients || ingredients.length === 0) {
    throw new Error("No ingredients provided.");
  }

  const prompt = `Create a pregnancy-safe recipe using the following ingredients: ${ingredients.join(
    ", "
  )}. Provide a step-by-step instruction.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo", // Or "gpt-4o-mini"
    messages: [
      { role: "system", content: "You are a helpful chef assistant." },
      { role: "user", content: prompt },
    ],
    max_tokens: 150, // Adjust as needed
  });


  return completion.choices[0].message.content.trim();
};

module.exports = { generateCompletion };
