import View from './View.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'Cant fine recipe for search.';
  _message = '';
  _generateMarkup() {
    console.log(this.data);
    return this.data.map(result => previewView.render(result,false)).join('');
  }
}

export default new ResultsView();
