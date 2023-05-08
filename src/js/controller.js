// import { state } from './model';
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookMarksView from './views/bookMarksView.js';
import addRecipeView from './views/addRecipeView.js';
// import icons from 'url:../img/icons.svg'; //Parcel 1
// import icons from 'url:../img/icons.svg'; //Parcel 2 (non static files i.e. images,videos,etc)\
// console.log(icons);

//but the above was found to be not working , importing the first ways is whats found to be working even for parcel 2 >
// const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

if (module.hot) {
  //Parcel feature (suppose if a console log lone commented, normally page reloads but here only console shows changes and no reload donw. previous paage remains)
  module.hot.accept();
}

const controlReciepes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);
    if (!id) return;
    recipeView.renderSpinner();

    //0) Update side panel results view to mark the selecte recipe.
    // resultsView.render(model.getSearchResultsPage());
    resultsView.update(model.getSearchResultsPage()); //use update to not load the whole screen. we wrote the function to avoid reloading of images and only re render the changed elements
    
    //1)updating bookmarks view
    // debugger;
    bookMarksView.update(model.state.bookmarks);
    
    //2)Loading recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;
    // console.log(recipe);
    
    //3)rendering recipe
    recipeView.render(model.state.recipe);

    //TEST
    // controlServings();
  } catch (err) {
    // alert(err);
    recipeView.renderError();
    console.error(err);
  }
};
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //Load search results
    await model.loadSearchResults(query);

    //3) render search results

    //  console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
// controlSearchResults();

const controlPagination = function (gotoPage) {
  // console.log(gotoPage);
  //render new results
  resultsView.render(model.getSearchResultsPage(gotoPage));

  //render new pagination
  paginationView.render(model.state.search);
};

const controlServings = function (numServings) {
  //update the recipe servings (in state)
  model.updateServings(numServings);

  //update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //add or remove bookmarks
  if(!model.state.recipe.bookmarked) 
    model.addBookmark(model.state.recipe);
  else
    model.deleteBookmark(model.state.recipe.id);
  //uodate recipe view
    recipeView.update(model.state.recipe);

    //render bookmarks
    bookMarksView.render(model.state.bookmarks)
  };

const controlBookmarks = function(){
  bookMarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function(newRecipe){
  // console.log(newRecipe);
  //Upload new recipe data
  try{
//show uploading spinner
addRecipeView.renderSpinner();

   await model.uploadRecipe(newRecipe); 
   console.log(model.state.recipe); 

   //render recipe 
   recipeView.render(model.state.recipe);

   //success message
   addRecipeView.renderMessage();


   bookMarksView.render(model.state.bookmarks);


   //change url id
window.history.pushState(null,'',`#${model.state.recipe.id}`);
// window.history.back() //to go back to previous page.


   //close form window
   setTimeout(function() {
    addRecipeView.toggleWindow();
   },MODAL_CLOSE_SEC * 1000 );
  }
  catch(err){
console.error('-----',err)
addRecipeView.renderError(err.message);
  }
}

const init = function () {
  bookMarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlReciepes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  // controlServings();
  console.log('Git modifying test!!!');
};
init();
// controlReciepes();
