import { Collapse } from 'bootstrap';

export default class collapseNav {
  constructor(querySelector){
    this.activeClass = 'is-active';
    this.btns = document.querySelectorAll(querySelector);
    this.init();
  }
  init() {
    document.dispatchEvent(new CustomEvent('collapseNav.beforeInit', {detail: this}));
    this.btns.forEach(btn => this.applyCollapse(btn));
  }

  applyCollapse(btn) {
    const bsCollapse = new Collapse(btn.nextElementSibling, {
      target: btn.nextElementSibling.classList.add('collapse'),
      toggle: false
    });
    btn.addEventListener('click', () => {
      this.toggleClass(btn, this.activeClass);
      bsCollapse.toggle();
    });
  }

  toggleClass (el, className) {
    if (el.classList) el.classList.toggle(className);
  }
}