import RWD002 from "../class/rwd002";
import customDrawerNav from "./drawerNav";
import customFormConfirm from "./formConfirm";
import customSubNav from "./subNav";
import LazyDisp from "../class/lazydisp";

const [d] = [document];

export default class CUSTOMIZE extends RWD002 {

  constructor(opt) {
    opt = Object.assign({
      // fixNavを指定すると、スクロール時に固定するクラスを付与する
      // fixNav : '[data-role="fixNav"]',
    },opt);

    // 上位クラスのコンストラクタ呼び出し
    super(opt);

    // カスタム用drawerNavのインスタンス化
    this.drawerNav = new customDrawerNav(this.opt.drawerNav);

    // カスタム用サブナビ登録クラスのインスタンス化
    this.Subnav = new customSubNav(this.opt);

    // コメントフォーム用確認画面モーダルのインスタンス化
    this.formConfirm = new customFormConfirm(this.opt.formConfirm);

    this.customInit();
  }

  customInit() {

    // イベント一覧
    d.addEventListener('rwd002.beforeInit', () => false );
    d.addEventListener('rwd002.beforeDomready', () => false );
    d.addEventListener('rwd002.beforeWindowload', () => false );
    d.addEventListener('rwd002.zip2addr', () => false );
    d.addEventListener('drawerNav.beforeInit', () => false );
    d.addEventListener('collapseNav.beforeInit', () => false );
    d.addEventListener('Scroll.beforeInit', () => false );
    d.addEventListener('Scroll.scrollUp', () => false );
    d.addEventListener('Scroll.scrollDown', () => false );
    d.addEventListener('Lazydisp.beforeInit', () => false );

    // テンプレートインスタンスのプロミス
    this.promises.init.then( () => false );
    this.promises.domReady.then( () => false );
    this.promises.windowLoad.then( () => false );

    // テンプレートインスタンスの全非同期メソッドの完了時に実行
    this.promiseAll().then( () => false );

    // サブナビ登録サンプル
    d.addEventListener('rwd002.beforeDomready', () => {
      // this.customSubnav();
    });

    $(() => {
      // htmlデータ読み込み
      $('[data-load-html]').loadHtml();

      // カレントメニュー
      $('[data-plugin=currentMenu]').currentMenu({mode:0,default:999});

      Promise.all([window.load['loadHtml']]).then(() => this.hashscroll());
      Promise.all([window.load['loadHtml']]).then(() => new LazyDisp('[data-lazydisp]'));
    });
  }

  // サブメニュー追加サンプル(beforeDomreadyに登録して使用)
  customSubnav () {
    /**
     * サブナビ追加メソッド(グローバルナビとフッター)
     * ヘッダー・フッター内の[data-key]属性値をもつ要素すべてに対して、サブナビを追加する
     * 第一引数にセレクタを指定(rwd002.opt.gnav / rwd002.opt.fnav )
     * 第一引数にコンテンツ番号を指定(li[data-key])
     * アイテムの出力HTMLは"subnavItemTemplate"によって出力される
     * 第二引数の個別アイテムにHTMLを指定すると、デフォルトのHTMLを上書きする
     * 親要素liに[data-collapse="true"]を指定すると、サブナビを開閉するボタンを追加する
     */

    // header gnav用サブナビ追加
    this.Subnav.add(this.opt.gnav, 'content1', [
      // 標準出力
      { label: 'サブメニュー01', href: '#'},
      { label: 'サブメニュー02', href: '#'},
      { label: 'サブメニュー03', href: '#'},

      // カスタマイズHTMLも追加可能
      { html: `
        <li class="${this.Subnav.opt.subnavClass}-item">
          <a href="#" class="${this.Subnav.opt.subnavClass}-item__link"><span class="text">サブメニュー04</a>
        </li>`
      },
    ]);

    // footer nav用サブナビ追加
    this.Subnav.add(this.opt.fnav, 'content1', [
      { label: 'サブメニュー01', href: '#'},
      { label: 'サブメニュー02', href: '#'},
      { label: 'サブメニュー03', href: '#'},
    ]);
  }

  loading() {
    d.documentElement.classList.add( this.opt.loadingClass );
    d.documentElement.classList.add( 'is-pageload-available' );
    d.addEventListener('DOMContentLoaded', () => {
      d.documentElement.classList.remove( this.opt.loadingClass );
      d.documentElement.style.opacity = '';
    });
  }
}