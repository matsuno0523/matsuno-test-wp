import 'intersection-observer' //polyfill

const [d] = [document];

export default class ScrollObserver {

  constructor(opt) {
    this.opt = Object.assign({
      root: null, // ビューポートをルート要素とする
      rootMargin: "20% 0px -20%", // ビューポートの中心を判定基準にする
      threshold: 0 // 閾値は0
    }, opt);
  }

  // スクロールの交差を監視
  observeElement (selector) { // DOMContentLoaded
    // Observerのインスタンス化
    this.observer = new IntersectionObserver( this.callback.bind(this), this.opt);
    // 指定した要素の監視を開始
    d.querySelectorAll(selector).forEach( target => this.observer.observe(target) );
  }

  callback (entries, object) {
    entries.forEach( entry => {
      if (entry.isIntersecting) this.intersectIn( entry, object );
      else this.intersectOut( entry, object );
    })
  }

  intersectIn ( entry, object ) {
    return entry, object;
  }

  intersectOut ( entry, object ) {
    return entry, object;
  }

}