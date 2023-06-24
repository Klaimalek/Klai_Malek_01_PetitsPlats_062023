 function factoryRecipeCard(data){
    const {name,image, ingredients, time, description }=data;
    getCardRecipeHeader()=>{
        const CardRecipeHeader=`
        <div class='article-recipe'>
          <div class='header-card'>
             <img class='image-recipe' src='' alt='${data.name}'></img>
             <h2 class='title-card-recipe'>${name}</h2>
             <p class='time-recipe'>${time} min</p>
         </div>
        </div>`;
        return CardRecipeHeader;
    }
    getCardDescription()=>{
        let recipeIngredients = "";
        ingredients.forEach((elt) => {
            const NameRecipe = elt.ingredient;
            const quantityRecipe = elt.quantity ? element.quantity : "";
            const unitRecipe = elt.unit ? element.unit : "";
      
            recipeIngredients  += `
              <li class="item-ingredient-recipe-card">
                  <p class="ingredient-name-card">${NameRecipe}:</p>
                  <p class="ingredient-quantity-card">${quantityRecipe} ${unitRecipe}</p>
              </li>
              `;
          });
        const articleCardRecipeDescription=`
        <div class='informations-card'>
          <h6 class='subtitle'>RECETTE</h6>
          <p class ='description-card'>${description}
          </p>
          <ul class='list-ingredients'>${recipeCardIngredients}
          </ul>
        </div>
        `;
        returnarticleCardRecipeDescription;
    }
    getRecipeCard()=>{
        const articleRecipe = document.createElement('article');
         articleRecipe.className += "article-recipe";
         articleRecipe.innerHTML += getRecipeCardHeaderDOM();
         articleRecipe.innerHTML += getRecipeCardDescDOM();

    return articleRecipe ;
    }
    return {getRecipeCard};
}
export default factoryRecipeCard;