import dotenv from "dotenv"

dotenv.config({ path: new URL("./.env", import.meta.url) })

import express from "express"
import cors from "cors"
import { getRecipeFromChefClaude } from "./ai.js"

const app = express()
app.use(express.json())
app.use(cors({
    origin: 'https://chef-claude-repo-1.onrender.com'
}))

app.post("/api/recipe", async (req, res) => {
  try {
    // NEW: destructure "variation" from the request body alongside ingredients.
    // variation is a random number sent from the frontend when "Try Another Recipe"
    // is clicked. It gets passed to getRecipeFromChefClaude so the prompt
    // can include an instruction to generate a different recipe.
    const { ingredients, variation } = req.body
    const recipe = await getRecipeFromChefClaude(ingredients, variation)
    res.json({ recipe })
  } catch (err) {
    res.status(500).json({ error: "Failed to generate recipe" })
  }
})

app.listen(3001, () => console.log("Server is up"))