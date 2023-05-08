import View from './View.js';
import icons from 'url:../../img/icons.svg';
class paginationView extends View {
  _parentElement = document.querySelector('.pagination');
  addHandlerClick(handler){
    this._parentElement.addEventListener('click',function(e){
        const btn = e.target.closest('.btn--inline');
        // console.log(btn);
        if(!btn) return;
        const gotoPage =  +btn.dataset.goto; //converted to number?
        // console.log(gotoPage);

        handler(gotoPage);
    });
  }

  _generateMarkup(){
    const curPage = this.data.page;
    const nummpages = Math.ceil(this.data.results.length / this.data.resultsPerPage);
    // console.log(this.data.page);

    //page 1 and there are other pages
    if(curPage === 1 && nummpages > 1){
        return `
        <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
        ` ;
    }

    //page 1 and no other pages


    //last page
    if(curPage === nummpages && nummpages > 1){
        return `
        <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
        `;
    }
    

    //other page
    if(curPage < nummpages){
        return `
        <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
      
      <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
      <span>Page ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
        `;
    }

    //page 1 and no other pages
    return ``;
  }
}

export default new paginationView();
  