import recipesArray from './factory/data/recipes.js';
import factoryRecipeCard from './factory/factoryRecipe.js';
function displayData(recipesArray) {
    
  const recipesSection = Array.from(document.querySelectorAll('cards-recipe'));
  recipesArray.forEach((recipe) => {
    const recipeModel = factoryRecipeCard(recipe);
    const recipeCardDOM = recipeModel.getRecipeCard();
    recipesSection.appendChild(recipeCardDOM);
  });
}
displayData();
