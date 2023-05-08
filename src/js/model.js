import { API_URL, RES_PER_PAGE,KEY } from './config';
// import { getJSON,sendJSON } from './helper';
import {AJAX} from './helper'
import recipeView from './views/recipeView';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
  // bookmarked: false;
};

const createRecipeObject = function(data){
  const { recipe } = data.data;
    return{
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      image: recipe.image_url,
      sourceUrl: recipe.source_Url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      ...(recipe.key && {key: recipe.key}),//if first part(key) is empty nothing happens but if ot has something destructuring happens,
    };
}

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    // console.log(res,data);
   state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    // var a = recipe.ingredients;
    // recipe.ingredients.map(ing =>{
    //   consol e.log(ing);
    // });
    // console.log(state.recipe);
  } catch (err) {
    // console.error(`${err}---------`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    // console.log(data);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && {key: rec.key}),
      };
    });
    state.search.page = 1;
  } catch (err) {
    // console.error(`${err}---------`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; //0;
  const end = page * state.search.resultsPerPage; //9;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  // console.log('new servings:', newServings);
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    //new quantity = oldQuantity * new servings / old servings// 2 * 8 / 4 = 4
  });
  state.recipe.servings = newServings;
};

const persisteBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //Add bookmark
  console.log('ADD');
  state.bookmarks.push(recipe);

  //mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persisteBookmarks();
};

export const deleteBookmark = function (id) {
  //Delete bookmark
  console.log('DELETE');
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  console.log(state.bookmarks);
  //recipe not bookmarked
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
  persisteBookmarks();
};
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

// clearBookmarks();
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

export const uploadRecipe = async function (newRecipe) {
  console.log('recipe object',newRecipe);
  // const ingredients = Object.entries(newRecipe).filter(
  //   entry => entry[0].startsWith('ingredient') && entry[1] !== ''
  // ).map(ing =>{
  //   const[quantity,unit,description] = ing[1].replaceAll(' ','').split(',');
  //   return {quantity:quantity?+quantity:null,unit,description};
  // });
  try{
    const ingredients = Object.entries(newRecipe).filter(
      entry => entry[0].startsWith('ingredient') && entry[1] !== ''
      ).map(ing =>{
        const ingArr = ing[1].split(',').map(el => el.trim());
        if(ingArr.length !== 3) throw new Error('incorrect ingredient format');
        const[quantity,unit,description] = ingArr;
        
        return {quantity:quantity?+quantity:null,unit,description};
      });
      console.log('ingredients:',ingredients);
      const recipe = {
        title: newRecipe.title,
        source_url: newRecipe.sourceUrl,
        image_url: newRecipe.image,
        publisher: newRecipe.publisher,
        cooking_time: +newRecipe.cookingTime,
        servings: +newRecipe.servings,
        ingredients
      };
      console.log(recipe);
      const data = await AJAX(`${API_URL}?key=${KEY}`,recipe);
    console.log(data);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
    }
    catch(err){
      throw err;
    }
};
