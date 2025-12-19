const [w, d] = [window, document ]

export default class ScrollDir {

  constructor(opt) {
    this.opt = Object.assign({
      mq: w.matchMedia('(max-width: 900px)'),
    }, opt);
    this.init();
  }

  init() {
    d.dispatchEvent(new CustomEvent('Scroll.beforeInit', {detail: this}));
    this.scrollDir();
  }
  
  // スクロール方向の判定
  scrollDir () {
    let lastpos = 0
    let timer = null
    let FPS = 1000 / 60
    
    const scrollFunc = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if( !this.opt.mq.matches ) return false
        let pos = w.pageYOffset || d.documentElement.scrollTop
        if( pos < lastpos ) this.scrollUp();
        else this.scrollDown();
        lastpos = pos
      }, FPS)
    }
    w.addEventListener('scroll', () => scrollFunc.call(this) )
  }

  scrollUp(){
    d.dispatchEvent(new CustomEvent('Scroll.scrollUp', {detail: this}));
  }

  scrollDown() {
    d.dispatchEvent(new CustomEvent('Scroll.scrollDown', {detail: this}));
  }
}
