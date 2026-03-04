export default function IngredientsList(props) {
    
    const ingredientsListItems = props.ingredients.map(ingredient => (
        // NEW: added "ingredient-item" class to each li so we can target it in CSS
        // for the hover effect that reveals the remove button
        <li key={ingredient} className="ingredient-item">
            {ingredient}
            {/* NEW: changed button text to ✕ for a cleaner look.
                Added "remove-ingredient-btn" class for CSS styling.
                The button is invisible by default and only appears on hover
                via the CSS opacity transition on .ingredient-item:hover */}
            <button 
                className="remove-ingredient-btn"
                onClick={() => props.removeIngredient(ingredient)}
            >✕</button>
        </li>
    ))
    return (
        <section className="ingredients-list-container">
            <h2>Ingredients on hand</h2>
            <ul className="ingredients-list" aria-live="polite">{ingredientsListItems}</ul>
            {props.ingredients.length > 2 && <div className="get-recipe-container">
                <div>
                    <h3>Ready for a recipe?</h3>
                    <p>Generate a recipe from your list of ingredients.</p>
                </div>
                <button onClick={props.getRecipe}>Get a recipe</button>
            </div>}
        </section>
    )
}