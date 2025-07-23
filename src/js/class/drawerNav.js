export default class drawerNav {

  constructor(selector) {
    this.activeClass = 'is-active';
    this.selector = selector;
  }

  init() {
    const selector = this.selector;
    document.dispatchEvent(new CustomEvent('drawerNav.beforeInit', {detail: this}));
    this.btns = document.querySelectorAll(selector);
    if( this.btns ){
      this.btns.forEach( btn => this.applyNav(btn) );
    }
  }

  applyNav (btn) {
    const Targets = document.querySelectorAll(btn.dataset.target);

    // ボタンをクリックしたらメニューのクラスをトグル
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleClass(e.currentTarget, this.activeClass);
      Targets.forEach( target => this.toggleClass(target, this.activeClass) );
    });

    // メニュー要素のfirstChild以外をクリックしたら閉じる
    Targets.forEach( target => {
      const childrole = target.firstElementChild.dataset.role;
      target.addEventListener('click', e => {
        if(!e.target.closest(`[data-role="${childrole}"]`)) {
          this.dismiss(btn, this.activeClass);
          this.dismiss(target, this.activeClass);
        }
      })
    });
  }

  toggleClass (el, className) {
    if (el.classList) el.classList.toggle(className);
  }

  dismiss (el, className){
    if (el.classList) el.classList.remove(className);
  }
}