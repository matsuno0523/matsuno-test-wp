import subNav from "../class/subNav";

export default class customSubNav extends subNav {
  constructor(opt) {
    super(opt);
  }

  // デフォルトのサブメニューアイテムHTMLをカスタム（上書き）
  itemTemplate (item) { return `
  <li class="${this.opt.subnavClass}-item is-custom">
    <a href="${item.href}" class="${this.opt.subnavClass}-item__link"><span>${item.label}</span></a>
  </li>
  `;}

  // デフォルトのサブメニュー外包HTMLをカスタム（上書き）
  outerTemplate (html) { return `
  <div class="${this.opt.subnavClass} is-custom">
    <div class="${this.opt.subnavClass}__inner">
      <ul class="${this.opt.subnavClass}__list">${html}</ul>
    </div>
  </div>
  `;}

  // フッターサブナビ個別アイテム用テンプレートの上書き（指定しない場合はヘッダーと共通）
  footerItemTemplate (item) { return `
  <li class="${this.opt.footerSubnavClass}-item">
    <a href="${item.href}" class="${this.opt.footerSubnavClass}-item__link"><span>${item.label}</span></a>
  </li>
  `;}
  
  // フッターサブナビ用テンプレートの上書き（指定しない場合はヘッダーと共通）
  footerOuterTemplate (html) { return `
  <div class="${this.opt.footerSubnavClass}">
    <div class="${this.opt.footerSubnavClass}__inner">
      <ul class="${this.opt.footerSubnavClass}__list">${html}</ul>
    </div>
  </div>
  `;}
}