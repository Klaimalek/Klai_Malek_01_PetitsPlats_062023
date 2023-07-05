import factoryRecipeCard from './factory/factoryRecipe.js';
import recipesArray from './factory/data/recipes.js';

/**
 * Permet d'afficher les cartes recettes
 * @param recipesArray
 */

function displayRecipeCards(recipesArray) {
  const recipesSection = document.getElementById('cards-recipe');

  const ingredients = [];
  const appliances = [];
  const ustensils = [];

  resetRecipesCardsSection();

  recipesArray.forEach((recipe) => {
    const recipeModel = factoryRecipeCard(recipe);
    const recipeCardDOM = recipeModel.getRecipeCard();
    recipesSection.appendChild(recipeCardDOM);

    ingredients.push(...recipe.ingredients);
    ustensils.push(...recipe.ustensils);
    appliances.push(recipe.appliance);
  });

  hydrateApplianceFilter(appliances);
  hydrateIngredientsFilter(
    ingredients.map((ingredient) => ingredient.ingredient)
  );
  hydrateUstensilsFilter(ustensils);
}

/** remplir la liste des ingédients */
function hydrateIngredientsFilter(ingredientsList) {
  let ingredientsListString = '';
  const dropdownFilterListIngredients =
    document.getElementById('ingredients-list');

  if (ingredientsList.length > 0) {
    uniq(ingredientsList).forEach((ingredientName) => {
      ingredientsListString += `
            <li class="dropdown-filter__list--item">${ingredientName}</li>
        `;
    });
  }

  dropdownFilterListIngredients.innerHTML = ingredientsListString;
}
/** remplir la liste des appareils */
function hydrateApplianceFilter(appliances) {
  let applianceListString = '';
  const dropdownFilterListAppliance = document.getElementById('appareils-list');

  if (appliances.length > 0) {
    uniq(appliances).forEach((appliance) => {
      applianceListString += `
            <li class="dropdown-filter__list--item">${appliance}</li>
        `;
    });
  }

  dropdownFilterListAppliance.innerHTML = applianceListString;
}
/** remplir la liste des instensils */
function hydrateUstensilsFilter(ustensilsList) {
  let ustensilsListString = '';
  const dropdownFilterListUstensils =
    document.getElementById('ustensiles-list');

  if (ustensilsList.length > 0) {
    uniq(ustensilsList).forEach((utensil) => {
      ustensilsListString += `
            <li class="dropdown-filter__list--item">${utensil}</li>
        `;
    });
  }

  dropdownFilterListUstensils.innerHTML = ustensilsListString;
}
/**
 * gérer la liste roulante: afficher et masquer la liste des ingédients, des appareils et des
 ustensils à l'aide de fleche  
 */
function handleFiltersDropdown() {
  const dropdownFilters = document.querySelectorAll('.dropdown-filter');
  dropdownFilters.forEach(function (dropdownFilter) {
    const arrow = dropdownFilter.querySelector('.fa-chevron-down');
    const listItem = dropdownFilter.querySelector('.dropdown-filter__list');
    const input = dropdownFilter.querySelector('.dropdown-filter__input');

    arrow.addEventListener('click', function (event) {
      const parent = event.target.closest('.dropdown-filter');
      const dropdownContent = parent.querySelector('.dropdown-filter__content');

      if (dropdownContent.classList.contains('open')) {
        dropdownContent.classList.remove('open');
        dropdownContent.classList.add('close');
      } else {
        dropdownContent.classList.remove('close');
        dropdownContent.classList.add('open');
      }
    });
    /** afficher les tags */
    listItem.addEventListener('click', function (event) {
      const sectionTags = document.querySelector('.section-tags');
      const itemTextClicked = event.target.innerText;

      const tag = `<div class="tag">
                <p class="tag__libelle">${itemTextClicked}</p>
                <i class="tag__cross fa-solid fa-close"></i>
            </div>`;

      sectionTags.innerHTML += tag;
    });

    input.addEventListener('input', function (event) {
      const ingredientsTemp = [];
      const ustensilsTemp = [];
      const appliancesTemp = [];
      const arrayOfFiltredIng = [];
      const arrayOfFiltredus = [];
      const arrayOfFiltredap = [];

      const valueToSearch = event.target.value.toLowerCase();
      const parent = event.target.closest('.dropdown-filter__content');

      const containerList = parent.querySelector('.dropdown-filter__list');

      //__ TODO : Faire le systeme qui permet de filtrer les ingredients
      recipesArray.forEach((recipe) => {
        ingredientsTemp.push(...recipe.ingredients);
        ustensilsTemp.push(...recipe.ustensils);
        appliancesTemp.push(recipe.appliance);
      });

      ingredientsTemp.forEach((word) => {
        let resultFilter = word.ingredient
          .toLowerCase()
          .includes(valueToSearch.toLowerCase());
        if (resultFilter) {
          arrayOfFiltredIng.push(word.ingredient);
        }
      });
      hydrateIngredientsFilter(arrayOfFiltredIng);

      ustensilsTemp.forEach((word) => {
        let resultFilter = word
          .toLowerCase()
          .includes(valueToSearch.toLowerCase());
        if (resultFilter) {
          arrayOfFiltredus.push(word);
        }
      });
      hydrateUstensilsFilter(arrayOfFiltredus);

      appliancesTemp.forEach((word) => {
        let resultFilter = word
          .toLowerCase()
          .includes(valueToSearch.toLowerCase());
        if (resultFilter) {
          arrayOfFiltredap.push(word);
        }
      });
      hydrateApplianceFilter(arrayOfFiltredap);
    });
  });
}

/** filtrer en basant sur la barre de recherche globale */
function handleGlobalSearch() {
  const searchInput = document.getElementById('search-form-input');

  searchInput.addEventListener('input', function (event) {
    const inputValue = event.target.value.toLowerCase();
    const tagsIsUsed = document.querySelector('.section-tags');

    if (inputValue.length >= 3) {
      const recipesFiltered = recipesArray.filter((recipe) => {
        const matchIngredient = recipe.ingredients.find((ingredient) =>
          ingredient.ingredient.includes(inputValue)
        );

        return !!(
          recipe.name.includes(inputValue.toLowerCase()) ||
          recipe.description.includes(inputValue.toLowerCase()) ||
          matchIngredient
        );
      });

      displayRecipeCards(recipesFiltered);
    }
  });
}

function resetFiltersSection() {
  const dropdownFilterListIngredients =
    document.getElementById('ingredients-list');
  const dropdownFilterListUstensils = document.getElementById('appareils-list');
  const dropdownFilterListAppliance =
    document.getElementById('ustensiles-list');

  dropdownFilterListIngredients.innerHTML = null;
  dropdownFilterListUstensils.innerHTML = null;
  dropdownFilterListAppliance.innerHTML = null;
}

function resetRecipesCardsSection() {
  const recipesSection = document.getElementById('cards-recipe');

  recipesSection.innerHTML = null;
}

function uniq(a) {
  return Array.from(new Set(a.map((element) => element.toLowerCase())));
}

(function init() {
  displayRecipeCards(recipesArray);
  handleFiltersDropdown();
  handleGlobalSearch();
})();
