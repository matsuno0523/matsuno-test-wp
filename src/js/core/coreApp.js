import lity from "lity";
import smoothscroll from "smoothscroll-polyfill";
import LazyDisp from "../components/lazydisp";
import ScrollDir from "../components/scrollDir";
import FirstViewEndObserver from "../components/FirstViewEndObserver";
import $ from 'jquery';

const [w,d,l,mq] = [window, document, location, window.matchMedia( "(max-width: 1023px)" ) ];

export default class CoreApp {
  constructor(opt) {
    // settings
    this.opt = Object.assign({
      loading: true,
      loadingClass: 'is-loading',
      gnav: '[data-role="globalNav"]',
      fnav: '[data-role="footerNav"]',
      lazydisp: '[data-lazydisp]',
      csspreload: 'link[rel="preload"][as="style"]',
      fixNav : false,
      header: '.l-header',
      pagetop: '.js-pagetop',
      viewport: {
        mq: w.matchMedia('screen and (min-width:1195px)'),
        content_device: 'width=device-width,initial-scale=1',
        content_scale: 'width=1280'
      },
      hashscroll: {
        pagetopHash: '#pagetop',
        mq: w.matchMedia('(max-width:899px)')
      },
      zip2addr: '[data-plugin="zip2addr"]'
    }, opt);

    // Promiseオブジェクトを生成、実行
    this.promises = {
      init: new Promise((resolve) => this.initResolver = resolve),
      domReady: new Promise((resolve) => {
        d.addEventListener('DOMContentLoaded', () => {
          this.domReady();
          resolve(this);
        }, {once: true});
      }),
      windowLoad: new Promise((resolve) => {
        w.addEventListener('load', () => {
          this.windowLoad();
          resolve(this);
        }, {once: true});
      }),
    };

    // スクロール方向を判定するインスタンス
    this.ScrollDir = new ScrollDir();

  }

  init() {
    // イベント発火
    d.dispatchEvent(new CustomEvent('app.beforeInit', {detail: this}));

    // ページローディングエフェクト
    if( this.opt.loading ) this.loading();

    // initの解決
    this.initResolver(this);

    // Viewportの書き換え
    this.viewport();
  }
  
  domReady() {
    // イベント発火
    d.dispatchEvent(new CustomEvent('app.beforeDomready', {detail: this}));

    // LazyDisp開始
    this.LazyDisp = new LazyDisp(this.opt.lazydisp);

    // FixNav
    if( this.opt.fixNav ) this.fixNav( this.opt.fixNav );
    
    // Pagetop
    this.pagetop ();

    // pagetopなどhashスクロール
    this.hashscroll();

    // lightbox
    $(d).on('click', 'a[rel="lightbox"]', lity);

    // 郵便番号から住所を取得
    this.zip2addr();
  }

  windowLoad() {
    // イベント発火
    d.dispatchEvent(new CustomEvent('app.beforeWindowload', {detail: this}));

    // スタイル遅延ロード開始
    this.csspreload();
  }

  promiseAll() {
    return Promise.all( Object.values(this.promises) );
  }

  loading() {
    d.documentElement.style.opacity = "0";
    d.documentElement.classList.add( this.opt.loadingClass );
    d.documentElement.classList.add( 'is-pageload-available' );
    w.addEventListener('load', () => {
      d.documentElement.classList.remove( this.opt.loadingClass );
      d.documentElement.style.opacity = '';
    });
  }

  fixNav (selector) {
    // fixnavがある場合にクラスをトグルする
    const elm = d.querySelector(selector);
    d.addEventListener('Scroll.scrollUp', () => elm.classList.add('is-active') );
    d.addEventListener('Scroll.scrollDown', () => elm.classList.remove('is-active') );
  }

  hashscroll(top = 0) {
    smoothscroll.polyfill();
    let { pagetopHash, mq } = this.opt.hashscroll;
    // pagetopハッシュの処理
    const scroll = () => {
      if( !l.hash ) return;
      if( l.hash === pagetopHash ) {
        w.history.replaceState(null, '', l.pathname + l.search);
      }else{
        const hash = decodeURI(l.hash);
        const targetElement = d.querySelector(hash);
        const headerElement = d.querySelector(this.opt.header);
        // 画面上部から要素までの距離
        const rectTop = (targetElement)? targetElement.getBoundingClientRect().top : 0;
        // スクロール位置に持たせるバッファ
        const buffer = (mq.matches)? headerElement.offsetHeight : 0;
        top = rectTop + w.pageYOffset - buffer;
      }
      w.scrollTo({ top, behavior: 'smooth' });
    }
    scroll();
    w.addEventListener('hashchange', scroll );
  }

  viewport () {
    // viewportの内容を変更
    const { mq, content_device, content_scale } = this.opt.viewport;
    const meta = d.querySelector('meta[name="viewport"]');
    const mqListener = e => {
      if (e.matches) {
        meta.setAttribute('content', content_scale);
      } else {
        meta.setAttribute('content', content_device);
      }
    };
    mq.addEventListener("change", mqListener);

    // 初期化処理
    mqListener(mq);
  }

  zip2addr () {
    const btns = d.querySelectorAll(this.opt.zip2addr);
    const Zenkaku2Hankaku = str => str.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
    const applyAddr = (res, pref, addr) => {
      pref.value = res.address1;
      addr.value = res.address2 + res.address3;
    }
    const getAddr = btn => {
      const apiurl = new URL('https://zipcloud.ibsnet.co.jp/api/search');
      const container = btn.closest('.js-form-item');
      let zip = container.querySelector('[name="GetAdrsZip"]').value;
      const pref = container.querySelector('[name="GetAdrsPref"]');
      const addr = container.querySelector('[name="GetAdrs"]');
      zip = Zenkaku2Hankaku( zip ).replace(/(-|−|ー)/g, '');
      apiurl.searchParams.append('zipcode', Zenkaku2Hankaku(zip));
      fetch(apiurl.href).then( res => res.json() ).then(res => {
        // 住所が正しく取得できた場合
        if( res.results && res.results.length > 0 ) applyAddr(res.results[0], pref, addr);
        // イベント発火
        d.dispatchEvent(new CustomEvent('app.zip2addr', {detail: {btn, res}}));
      });
    }
    btns.forEach( btn => btn.addEventListener('click', () => getAddr(btn) ) );
  }

  csspreload() {
    const links = d.querySelectorAll( this.opt.csspreload );
    links.forEach( link => link.rel = "stylesheet" );
  }

  pagetop () { 
    if ( !mq.matches ) {
      const pagetop = d.querySelector(this.opt.pagetop);
      new FirstViewEndObserver(pagetop);
    }
  }

}