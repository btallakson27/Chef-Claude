export default function IngredientsList(props) {
    
    const ingredientsListItems = props.ingredients.map(ingredient => (
        <li key={ingredient}>
            {ingredient}
            {/* NEW: each ingredient now has a Remove button next to it.
                onClick passes the specific ingredient name to removeIngredient
                so only that ingredient gets removed from the list. */}
            <button onClick={() => props.removeIngredient(ingredient)}>Remove</button>
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