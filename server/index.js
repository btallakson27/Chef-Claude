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
    const { ingredients } = req.body
    const recipe = await getRecipeFromChefClaude(ingredients)
    res.json({ recipe })
  } catch (err) {
    res.status(500).json({ error: "Failed to generate recipe" })
  }
})

app.listen(3001, () => console.log("Server is up"))