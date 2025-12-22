import CoreApp from "./core/coreApp";
import LazyDisp from "./components/lazydisp";

const [d] = [document];

export default class CUSTOMIZE extends CoreApp {

  constructor(opt) {
    opt = Object.assign({
      // header: '.site-header',
      // pagetop: '.c-pagetop'
      // fixNavを指定すると、スクロール時に固定するクラスを付与する
      // fixNav : '[data-role="fixNav"]',
    },opt);

    // 上位クラスのコンストラクタ呼び出し
    super(opt);

    this.customInit();
  }

  customInit() {

    // イベント一覧
    d.addEventListener('app.beforeInit', () => false );
    d.addEventListener('app.beforeDomready', () => false );
    d.addEventListener('app.beforeWindowload', () => false );
    d.addEventListener('app.zip2addr', () => false );
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

    $(() => {
      // htmlデータ読み込み
      $('[data-load-html]').loadHtml();

      // カレントメニュー
      $('[data-plugin=currentMenu]').currentMenu({mode:0,default:999});

      Promise.all([window.load['loadHtml']]).then(() => this.hashscroll());
      Promise.all([window.load['loadHtml']]).then(() => new LazyDisp('[data-lazydisp]'));
    });
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