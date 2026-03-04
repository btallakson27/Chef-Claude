import React from 'react'
import IngredientsList from "./IngredientsList"
import ClaudeRecipe from "./ClaudeRecipe"

export default function Main(){

    const [ingredients, setIngredients] = React.useState([])
    const [recipe, setRecipe] = React.useState(
        () => localStorage.getItem("currentRecipe") || ""
    )   
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)

    // savedRecipes state initializes by reading from localStorage.
    // The function inside useState() is a "lazy initializer" — it only runs once on mount.
    // JSON.parse converts the stored string back into a JavaScript array.
    // If nothing is saved yet, localStorage.getItem returns null, so we fall back to [].
    const [savedRecipes, setSavedRecipes] = React.useState(
        () => JSON.parse(localStorage.getItem("savedRecipes")) || []
    )

    // NEW: showSaved controls whether the saved recipes section is visible or hidden.
    // It starts as false so saved recipes are not shown when the app first loads.
    const [showSaved, setShowSaved] = React.useState(false)

    async function getRecipe() {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch('https://chef-claude-repo.onrender.com/api/recipe', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ingredients }),
            })
            if (!response.ok) throw new Error("Something went wrong. Please try again.")
            const data = await response.json()
            setRecipe(data.recipe)
            localStorage.setItem("currentRecipe", data.recipe)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient").trim()
        if (!newIngredient) return
        if (ingredients.length >= 10) return
        if (ingredients.includes(newIngredient)) return
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
    }

    // saveRecipe adds the current recipe to savedRecipes state and
    // also writes the updated array to localStorage so it persists on refresh.
    // JSON.stringify converts the array to a string because localStorage
    // can only store strings, not JavaScript objects or arrays.
    function saveRecipe() {
        if (!recipe) return
        const updated = [...savedRecipes, recipe]
        setSavedRecipes(updated)
        localStorage.setItem("savedRecipes", JSON.stringify(updated))
    }

    return (
        <main>
            <form className="add-ingredient-form" action={addIngredient}>
                <input 
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button disabled={loading}>Add ingredient</button>
            </form>

            {error && <p className="error-message">{error}</p>}

            {ingredients.length > 0 && <IngredientsList
            ingredients={ingredients}
            getRecipe={getRecipe}
            />}

            {loading && <p className="loading-message">Chef Claude is cooking up your recipe...</p>}

            {/* The <> </> is a React Fragment — it lets us return two sibling elements
                (ClaudeRecipe and the buttons) without adding an extra div to the DOM.
                All three elements only appear when a recipe exists. */}
            {recipe && <>
                <ClaudeRecipe recipe={recipe} />
                <button onClick={saveRecipe}>Save Recipe</button>
                <button onClick={getRecipe} disabled={loading}>Try Another Recipe</button>
            </>}

            {/* NEW: This only renders if there is at least one saved recipe.
                The toggle button switches showSaved between true and false.
                "prev => !prev" is a shorthand that flips the current boolean value.
                The button label changes dynamically based on the current state
                so the user always knows what clicking it will do.
                The saved recipes section only renders when showSaved is true. */}
            {savedRecipes.length > 0 && (
                <>
                    <button onClick={() => setShowSaved(prev => !prev)}>
                        {showSaved ? "Hide Saved Recipes" : "Show Saved Recipes"}
                    </button>
                    {showSaved && (
                        <section className="saved-recipes">
                            <h2>Saved Recipes</h2>
                            {/* We map over the savedRecipes array and render a ClaudeRecipe
                                component for each one. The key prop is required by React whenever
                                you render a list — it helps React track which items changed. */}
                            {savedRecipes.map((r, i) => (
                                <ClaudeRecipe key={i} recipe={r} />
                            ))}
                        </section>
                    )}
                </>
            )}
        </main>
    )
}