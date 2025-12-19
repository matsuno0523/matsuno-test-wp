import ScrollObserver from "../core/scrollObserver";

const [d] = [document];

export default class LazyDisp extends ScrollObserver {
  constructor(selector,opt) {
    opt = Object.assign({
      // root: null, // ビューポートをルート要素とする
      // rootMargin: "20% 0px -20%", // ビューポートの中心を判定基準にする
      // threshold: 0 // 閾値は0
    }, opt)
    super(opt);
    this.init(selector);
  }

  init(selector){ // DOMContentLoaded
    d.dispatchEvent(new CustomEvent('Lazydisp.beforeInit', {detail: this}));
    d.querySelectorAll( selector ).forEach( elm => {
      elm.classList.add('lazyhide');
      elm.classList.add('lazyReady');
      setTimeout(() => elm.classList.remove('lazyReady'), 200 );
    });
    this.observeElement( selector );
  }

  intersectIn ( entry, object ) {
    const target = entry.target;
    target.classList.remove('lazyhide');
    if ( target.dataset.lazyAddclass != undefined ){
      target.classList.add( target.dataset.lazyAddclass );
    }
    object.unobserve(target);
  }

}