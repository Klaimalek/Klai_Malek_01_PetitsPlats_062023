import factoryRecipeCard from './factory/factoryRecipe.js';
import recipesArray from './factory/data/recipes.js';

/**
 * Permet d'afficher les cartes recettes
 * @param recipesArray
 */
// recherche by tag
let researchtag = [];
let currentTag = '';

function displayRecipeCards(recipesArray) {
  const recipesSection = document.getElementById('cards-recipe');

  const ingredients = [];
  const appliances = [];
  const ustensils = [];

  resetRecipesCardsSection();

  getTotalNumberRecipe(recipesArray);

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
      searchByTag(researchtag, recipesFiltered);
    } else {
      displayRecipeCards(recipesArray);
    }
  });
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
      if (!sectionTags.outerText.includes(event.target.innerText)) {
        const itemTextClicked = event.target.innerText;
        const tagElement = document.createElement('div');
        tagElement.classList.add('tag');
        tagElement.setAttribute('id', 'tag-libelle-cross');
        const tagLibelle = document.createElement('p');
        tagLibelle.classList.add('tag__libelle');
        tagLibelle.textContent = itemTextClicked;
        const closeTagIcon = document.createElement('i');
        closeTagIcon.classList.add('tag__cross', 'fa-solid', 'fa-close');
        closeTagIcon.setAttribute('id', 'closeTag');
        closeTagIcon.addEventListener('click', deleteTags);
        tagElement.appendChild(tagLibelle);
        tagElement.appendChild(closeTagIcon);
        sectionTags.appendChild(tagElement);
        currentTag = event.target.innerText;
        // ajout tag dans tableau
        researchtag.push(event.target.innerText);
        // supprimer les doublons
        researchtag = Array.from(new Set(researchtag));
        researchtag.filter((x, i) => researchtag.indexOf(x) === i);
        console.log('researchtag', researchtag);
        // appel fonction recherche
        searchByTag(researchtag, recipesArray);
      }
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
      // filter les trois lites
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

  // recherche en se basant sur les tags
  searchByTag(researchtag);
  return {
    researchtag: researchtag,
  };
}
function searchByTag(researchtag, recipesFilter = []) {
  let FilterDishList = [];
  if (!recipesFilter) {
    recipesFilter = recipesArray;
  }
  for (let item_1 of researchtag) {
    for (let item_2 of recipesFilter) {
      // filtre par appareil
      if (item_2.appliance.toLowerCase() === item_1.toLowerCase()) {
        FilterDishList.push(item_2);
      }

      // filtre par ingrédient
      item_2.ingredients.filter((el) => {
        if (el.ingredient.toLowerCase() === item_1.toLowerCase()) {
          FilterDishList.push(item_2);
        }
      });
      // filtre par ustensils
      item_2.ustensils.filter((el) => {
        if (el.toLowerCase() == item_1.toLowerCase()) {
          FilterDishList.push(item_2);
        }
      });
      // mise à jour des recette
      UpdateRecipeCards(FilterDishList);
      getTotalNumberRecipe(FilterDishList);
      //displayRecipeCards(FilterDishList);
    }
  }
  /*
  for (let i = 0; i < researchtag.length; i++) {
    for (let j = 0; j <  recipesFilter.length; j++) {
      // filtre par appareil
      if (
        recipesFilter[j].appliance.toLowerCase() ===
        researchtag[i].toLowerCase()
      ) {
        FilterDishList.push( recipesFilter[j]);
      }
      
      // filtre par ingrédient
      recipesFilter[j].ingredients.filter((el) => {
        if (el.ingredient.toLowerCase() === researchtag[i].toLowerCase()) {
          FilterDishList.push( recipesFilter[j]);
        }
      });
      // filtre par ustensils
       recipesFilter[j].ustensils.filter((el) => {
        if (el.toLowerCase() == researchtag[i].toLowerCase()) {
          FilterDishList.push(recipesFilter[j]);
        }
      });
      // mise à jour des recette
     UpdateRecipeCards(FilterDishList);
     //displayRecipeCards(FilterDishList);
     
    }
    
  }
  */
}
function UpdateRecipeCards(recipesArray) {
  const recipesSection = document.getElementById('cards-recipe');
  resetRecipesCardsSection();
  recipesArray.forEach((recipe) => {
    const recipeModel = factoryRecipeCard(recipe);
    const recipeCardDOM = recipeModel.getRecipeCard();
    recipesSection.appendChild(recipeCardDOM);
  });
}

// supprimer les tag
function deleteTags(event) {
  const target = event.target.closest('.tag');
  target.remove();
  const index = researchtag.indexOf(currentTag);
  if (index > -1) {
    researchtag.splice(index, 1);
  }
  if (researchtag.length == 0) {
    displayRecipeCards(recipesArray);
  }
}

function handleDeleteTags() {}

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
// supprimer les doublons
function uniq(a) {
  return Array.from(new Set(a.map((element) => element.toLowerCase())));
}
// calculer la somme totale ses recettes
function getTotalNumberRecipe(recipesArray) {
  let sumRecipe = 0;
  let numberRecipe = 0;
  const totalNumber = document.getElementsByClassName('number');
  /*console.log(totalNumber);
  recipesArray.forEach((recipe) => {
    numberRecipe = Number(recipe.id);
  });
  console.log(numberRecipe);*/
  if (recipesArray != undefined) {
    totalNumber[0].innerHTML = recipesArray.length;
  }
}
getTotalNumberRecipe();
(function init() {
  displayRecipeCards(recipesArray);
  handleFiltersDropdown();
  handleGlobalSearch();
})();
