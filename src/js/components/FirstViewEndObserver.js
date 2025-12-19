import ScrollObserver from '../core/scrollObserver';

const [ d ] = [document]

export default class FirstViewEndObserver extends ScrollObserver {
  //newしたときに実行される
  constructor(elm=d.querySelector('.js-pagetop'),opt={}) {
    opt = Object.assign({  
      rootMargin: "0%",
    }, opt);
    super(opt);
    this.$observeElement = $('<div/>');
    this.$observeElement.css({
      'position':'absolute',
      'top':'0',
      'left':'0',
      'display': 'block',
      'width':'0',
      'height':'100vh',
      'pointer-events': 'none',
      'visibility': 'hidden',
      'z-index': '-1'
    });
    this.$observeElement.appendTo('#allbox');
    this.pagetopBlock = elm;
    this.observeElement()
  }

  observeElement () {
    this.observer = new IntersectionObserver( this.callback.bind(this), this.opt);
    this.observer.observe( this.$observeElement[0] );
  }
  intersectIn ( ) {
    this.pagetopBlock.classList.add('hidden');
  }
  intersectOut ( ) {
    this.pagetopBlock.classList.remove('hidden');
  }
}