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

// REMOVED: debug console.log that checked if API key was loaded.
// This was only needed during initial setup and should not stay in production code.

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// NEW: added "variation" as a second parameter so the function knows
// whether the user clicked "Try Another Recipe" or is generating one for the first time.
async function getRecipeFromChefClaude(ingredientsArr, variation) {
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
          // NEW: if variation is present (meaning "Try Another Recipe" was clicked),
          // we append an extra instruction asking Claude for a different recipe.
          // The ternary operator checks if variation is defined — if so, it adds the
          // extra sentence, if not, it adds an empty string so the prompt stays the same.
          content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!${variation !== undefined ? " Please suggest a different recipe than you might have before." : ""}`,
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

export { getRecipeFromChefClaude }