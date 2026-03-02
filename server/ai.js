// server/ai.js
import dotenv from "dotenv"
dotenv.config({ path: new URL("./.env", import.meta.url) })

import Anthropic from "@anthropic-ai/sdk"

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests
a recipe they could make with some or all of those ingredients. You don't need to use
every ingredient they mention in your recipe. The recipe can include additional ingredients
they didn't mention, but try not to include too many extra ingredients. Format your response
in markdown to make it easier to render to a web page.
`.trim()

// ✅ TEMP DEBUG — remove later
console.log(
  "Anthropic key loaded in ai.js?",
  !!process.env.ANTHROPIC_API_KEY
)

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// ✅ DEFINE THE FUNCTION
async function getRecipeFromChefClaude(ingredientsArr) {
  const ingredientsString = ingredientsArr.join(", ")

  try {
    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      temperature: 0.7,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
        },
      ],
    })

    return msg.content
      .filter(block => block.type === "text")
      .map(block => block.text)
      .join("\n")
  } catch (err) {
    console.error("Claude API error:", err)
    throw err
  }
}

// ✅ EXPORT IT (this is what index.js imports)
export { getRecipeFromChefClaude }
