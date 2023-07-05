function factoryRecipeCard(data) {
    const {id, name, image, ingredients, time, description} = data;

    function getCardRecipeHeader() {
        const headerCardRecipe = `<span class="recipe-time">${time}min</span>
            <div class="recipe-header">
                <img src="/assets/images/${image}" alt="image-recette">
            </div>`

        return headerCardRecipe;
    }

    function getCardDescription() {
        let recipeIngredients = '';

        ingredients.forEach((elt) => {
            const ingredientName = elt.ingredient;
            const ingredientQuantity = elt.quantity ? elt.quantity : "-";
            const ingredientUnit = elt.unit ? elt.unit : "";

            recipeIngredients += `
                <li class="recipe-content__ingredients--item">
                    <h4 class="recipe-content__ingredients--item-title">${ingredientName}</h4>
                    <p class="recipe-content__ingredients--item-value">
                        ${ingredientQuantity} ${ingredientUnit}
                    </p>
                </li>`;
        });

        return `
            <div class="recipe-content">
                <h2 class="recipe-content__title">${name}</h2>
                <div class="recipe-content__description">
                    <h3 class="recipe-content__description--title">Recette</h3>
                    <p class="recipe-content__description--text">
                        ${description.length > 255 ? description.slice(0, 255) + '...' : description}
                    </p>
                </div>
                <div class="recipe-content__ingredients">
                    <h3 class="recipe-content__ingredients--title">Ingrédients</h3>
                    <ul class="recipe-content__ingredients--items">
                        ${recipeIngredients}
                    </ul>
                </div>
            </div>`;
    }

    function getRecipeCard() {
        const articleRecipe = document.createElement('article');
        articleRecipe.classList.add("recipe");
        articleRecipe.setAttribute('data-id', id);
        articleRecipe.innerHTML += getCardRecipeHeader();
        articleRecipe.innerHTML += getCardDescription();

        return articleRecipe;
    }

    return {getRecipeCard};
}

export default factoryRecipeCard;
