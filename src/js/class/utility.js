const [w,d,l] = [window,document,location];
export default class Utility {
  
  constructor () {
    this.init();
  }

  init() {
    /******
     * 文字数制限(プロトタイプ拡張)
     */
    String.prototype.str_truncate = function(figure,suffix='...'){
      const textLength = this.length,
            textTrim = this.substr(0, figure)
      if (figure < textLength) return textTrim + suffix
      else if (figure >= textLength) return textTrim
    }

    // ポップアップウインドウ
    $(d).on('click','[data-plugin="openwindow"]',function(e){
      e.preventDefault();
      var $this = $(this),
          data = $this.data(),
          size = 'width='+(data.width||600)+', height='+(data.height||500)+',';
      w.open(this.href,(data.title||'share this site'),size+"menubar=no, toolbar=no, scrollbars=yes");
    });

    // カレントメニュープラグイン
    // [option]
    // - currentClass: str
    //     カレントメニューに付与するクラス名設定(def:'current')
    // - item: jquery selector
    //     クラスを付与するアイテム(def:'a')
    // - mode: 0|1
    //     0:完全一致か1:ディレクトリマッチか(def:0)
    // - default: num
    //     見つからなかった場合のデフォルトメニュー位置(def:0)
    // - url: str
    //     現在のURLを偽装する場合に変更できます(def:location.pathname+location.search)
    // [戻り値]
    // jQuery Object
    $.fn.currentMenu = function(option){
      return this.each(function(){
        var opt = $.extend(true,{
              currentClass: 'current',
              item: 'a', // loop item
              mode: 0, // 0: parfectMatch, 1:directoryMatch
              default: 0,
              url: location.pathname+location.search
            },option,$(this).data()),
            addCurrent = function(dom){
              $(dom).addClass(opt.currentClass);
            };
        $(opt.item,this).each(function(){
          var href = this.getAttribute('href') || $(this).children('a').attr('href'),
              url = opt.url;
          if( opt.mode !== 0 ){
            href = href.replace(/^\/([^/]+)\/(.*)?/,'/$1/');
            url = url.replace(/^\/([^/]+)\/(.*)?/,'/$1/');
          }
          if( url == href ) addCurrent(this);
        });
        // fallback
        if( $('.'+opt.currentClass,this).length == 0 ) addCurrent( $(opt.item,this).eq(opt.default) );
      });
    }

    // HTML読み込みプラグイン(ES5対応/slot対応)
    $.fn.loadHtml = function(option){
      w.load = w.load || {};
      var g_opt = $.extend({
        src: '/assets/html/',
        extention: '.html',
        timestamp:''
      },option);
      var defs = [];
      if( !w.load['loadHtml'] ) w.load['loadHtml'] = new $.Deferred;
      this.each(function(){
        w.load = w.load||{};
        var $this = $(this),
            opt = $.extend(true,{},g_opt,$this.data()),
            request_url = opt.src + opt.loadHtml + opt.extention,
            slot_html = $this.html();
        w.load[ opt.name ? opt.name : opt.loadHtml ] = new $.Deferred;
        defs.push( w.load[ opt.name ? opt.name : opt.loadHtml ].promise() )
        $.get(request_url+(opt.timestamp?'?ts='+opt.timestamp:''),function(html){
          $this.replaceWith(html);
          console.info('%c%s%c is loaded','font-weight: bold',this.url,'');
          w.load[ opt.name ? opt.name : opt.loadHtml ].resolve( html, slot_html != '&nbsp;' ? slot_html : null );
          $(w).trigger($this.data().loadHtml+'.load');
        });
      });
      $.when.apply( $, defs ).then(function() {
        w.load['loadHtml'].resolve();
      });
      return this;
    };
  }
  

  // query_stringを定義
  query_string (param) {
    if(!l.search) return false
    let params = l.search.substr(1).split('&')
    params.map( v => { const p=v.split('=');params[p[0]]=p[1]})
    return params[param]
  }

  addScript (attrs) {
    const [s] = [document,'script']
    const f=d.getElementsByTagName(s)[0],j=d.createElement(s)
    Object.keys(attrs).forEach(a=>j.setAttribute(a,attrs[a]))
    f.parentNode.insertBefore(j,f)
  }

  addStylesheet (attrs) {
    const [s] = [document,'link']
    const f=d.getElementsByTagName(s)[0],j=d.createElement(s)
    j.rel="stylesheet"
    Object.keys(attrs).forEach(a=>j.setAttribute(a,attrs[a]))
    f.parentNode.appendChild(j)
  }

  datetostr (unixtime,format) {
    const date = new Date( unixtime )
    const month = ["january","february","march","april","may","june","july","august","september","october","november","december"]
    const weekday = ["日", "月", "火", "水", "木", "金", "土"]
    const weekday_en = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    format = format
      .replace(/YYYY/g, date.getFullYear())
      .replace(/MMMM/g, month[date.getMonth()])
      .replace(/MMM/g, month[date.getMonth()].slice(3))
      .replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2))
      .replace(/DD/g, ('0' + date.getDate()).slice(-2))
      .replace(/D/g, date.getDate())
      .replace(/dddd/g, weekday_en[date.getDay()])
      .replace(/ddd/g, weekday_en[date.getDay()].slice(3))
      .replace(/dd/g, weekday[date.getDay()])
      .replace(/hh/g, ('0' + date.getHours()).slice(-2))
      .replace(/mm/g, ('0' + date.getMinutes()).slice(-2))
      .replace(/ss/g, ('0' + date.getSeconds()).slice(-2))
    return format
  }

  /*****
   * URLによる読み込み分岐
   */
  loader (loaderSwitch) {
    // 条件分岐のためのURL正規化
    let mode, key, id;
    mode = this.query_string('mode');
    id = this.query_string('article');
    if( mode == 'detail' ) key = 'article'
    else if( mode == 'list' && id ) key = 'cat'
    let path = l.pathname.replace('main.php','')
    let request = ( mode && key && id )? path + `?mode=${mode}&${key}=${id}`: path
    loaderSwitch( request, path )
  }
}