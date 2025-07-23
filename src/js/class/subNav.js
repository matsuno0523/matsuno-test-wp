const [d] = [document];

export default class subNav {
  constructor(opt) {
    this.opt = Object.assign({
      subnavClass: 'rwd002-subnav',
      footerSubnavClass: 'rwd002-footer-subnav',
    }, opt);
  }

  /**
   * サブナビゲーション追加用メソッド
   * @param {string} navSelector // ナビゲーションセレクタ(opt.gnav or opt.fnav)
   * @param {string} key // data-key属性値
   * @param {array} itemlist // アイテムリスト
   */
  add (navSelector=this.opt.gnav, key, itemlist=false) {
    const Navs = d.querySelectorAll(navSelector);

    // Collapseボタンを追加する(itemlistのループで使用)
    const addCollapse = (elm,navKey) => {
      if( elm.dataset.collapse.toLowerCase() === 'true' ) {
        const Btn = d.createElement('button');
        const btnClass = () => {
          switch( navKey ) {
            case this.opt.gnav: return `${this.opt.subnavClass}__tgl`;
            case this.opt.fnav: return `${this.opt.footerSubnavClass}__tgl`;
          }
        };
        Btn.classList.add( btnClass() );
        Btn.type = 'button';
        Btn.dataset.plugin = 'collapse';
        elm.appendChild(Btn);
      }
    }

    // サブナビを追加する(itemlistのループで使用)
    const addItem = (elm,navKey) => {
      const tempEl = d.createElement('div');
      let innerHtml = '';
      let outerHtml = '';
      itemlist.forEach( item => {
        switch( navKey ) {
          case this.opt.gnav: {
            innerHtml += item.html || this.itemTemplate(item);
          } break;
          case this.opt.fnav: {
            innerHtml += item.footerHtml || this.footerItemTemplate(item);
          } break;
        }
      });
      switch( navKey ) {
        case this.opt.gnav: outerHtml = this.outerTemplate(innerHtml); break;
        case this.opt.fnav: outerHtml = this.footerOuterTemplate(innerHtml); break;
      }
      tempEl.insertAdjacentHTML('beforeend', outerHtml);
      elm.appendChild( tempEl.firstElementChild );
    }

    if( itemlist ) {
      Navs.forEach( Nav => {
        const menus = Nav.querySelectorAll(`[data-key="${key}"]`);
        menus.forEach( Menu => addCollapse(Menu, navSelector));
        menus.forEach( Menu => addItem(Menu, navSelector));
      });
    }
  }

  /**
   * サブナビゲーション追加：サブナビのアイテムを追加するメソッド
   * @param {object} item // サブナビゲーションのアイテム用オブジェクト
   * @returns String // サブナビゲーションのアイテムHTML
   */
  itemTemplate(item) {
    return `
      <li class="${this.opt.subnavClass}-item">
        <a href="${item.href}" class="${this.opt.subnavClass}-item__link"><span>${item.label}</span></a>
      </li>
    `;
  }
  
  /**
   * サブナビゲーション追加：サブナビの外包HTMLを生成するメソッド
   * @param {string} html // サブナビゲーションのアイテム用HTML
   * @returns String // サブナビゲーションの外包HTML
   */
  outerTemplate(html) {
    return `
      <div class="${this.opt.subnavClass}">
        <div class="${this.opt.subnavClass}__inner">
          <ul class="${this.opt.subnavClass}__list">${html}</ul>
        </div>
      </div>
    `;
  }

  /**
   * フッターサブナビゲーション追加：サブナビのアイテムを追加するメソッド
   * @param {object} item // サブナビゲーションのアイテム用オブジェクト
   * @returns String // サブナビゲーションのアイテムHTML
   */
  footerItemTemplate(item) {
    return `
      <li class="${this.opt.footerSubnavClass}-item">
        <a href="${item.href}" class="${this.opt.footerSubnavClass}-item__link"><span>${item.label}</span></a>
      </li>
    `;
  }

  /**
   * フッターサブナビゲーション追加：サブナビの外包HTMLを生成するメソッド
   * @param {string} html // サブナビゲーションのアイテム用HTML
   * @returns String // サブナビゲーションの外包HTML
   */
  footerOuterTemplate(html) {
    return `
      <div class="${this.opt.footerSubnavClass}">
        <div class="${this.opt.footerSubnavClass}__inner">
          <ul class="${this.opt.footerSubnavClass}__list">${html}</ul>
        </div>
      </div>
    `;
  }
}