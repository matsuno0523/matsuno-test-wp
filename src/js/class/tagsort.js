import { createApp, h } from 'vue';

const [ w, d, l ] = [ window, window.document, location]

/**
 * @class TAGSORT
 * @param {Object} opt オプション
 * @static TAGSORT.getContentName() コンテンツ名を取得
 * @static TAGSORT.getArticles()  記事リストを取得
 * @static TAGSORT.getCategories()  カテゴリリストを取得
 * @static TAGSORT.getTags()  全タグを取得
 * @static TAGSORT.datetostr()  日付を文字列に変換
 * @static TAGSORT.truncate() 文字列を指定文字数で省略
 */
export default class TAGSORT {
  constructor( opt = {} ) {
    this.opt = Object.assign({
      content: TAGSORT.getContentName(),
      event: {
        'beforeInit': new CustomEvent('tagsort.beforeInit', {detail: this}),
        'pageChange': new CustomEvent('tagsort.pageChange', {detail: this}),
        'afterRender': new CustomEvent('tagsort.afterRender', {detail: this})
      },
    },this.opt, opt);

    // 一覧用Vueオブジェクトオプション
    this.opt.list = Object.assign({
      el: '.rwd002-list-content',
      perpage: 20,
      itemTemplate: false,
      bodyLength: 100,
      addComponent: [], // 一覧用Vueオブジェクトにコンポーネント追加：要{name}
      addData: {}, // 一覧用Vueオブジェクトのdataプロパティ拡張
      addMethods: {}, // 一覧用Vueオブジェクトのmethodプロパティ拡張
      addMounted(){}, // 一覧用Vueのmountedの最後で実行
    }, this.opt.list );

    // paginationコンポーネントのVUEオブジェクト上書き
    this.opt.pagination = Object.assign({
      el: '.rwd002-pagination', // paginationのVUEオブジェクト上書き
      template: false, // テンプレートの上書き（falseでデフォルト表示）
    }, this.opt.pagination );

    this.opt.taglist = Object.assign({
      container: '.rwd002-container', // taglistを表示する基準の要素
      disp_list: 'both', // head / foot / both(true) / append / prepend
      disp_detail: 'foot', // head / foot / both(true) / append / prepend
      minimumTagAmount : 10, // タグの最低表示数
      hideUselessTags : 0, // 最低使用回数
      addAll: 'ALL', // カテゴリにALLを追加するか [ボタン名 / false]
      btnHtml: {
        open: `全てを表示<span class="plus"></span>`,
        close: `一部のみ表示<span class="minus"></span>`,
      }
    }, this.opt.taglist );

    this.opt.related = Object.assign({
      disp_detail: true,
      itemTemplate: false,
      sortType: 'tag', // or category
      amount: 4
    }, this.opt.related );
    
    // initというプロミスオブジェクトを作成し、initializeする。
    this.init = new Promise( (resolve, reject) => {
      this.initialize().then( res => {
        // 取得した記事やカテゴリデータはメンバ変数に格納する。
        const [ articles, categories ] = res;
        this.articles = articles;
        this.categories = categories;
        this.is_initialized = true;
        this.tags = TAGSORT.getTags( articles );
        this.list = new list( this.opt.list, this );
        this.pagination = new pagination( this.opt.pagination, this );
        this.taglist = new taglist( this.opt.taglist, this );
        this.related = new related( this.opt.related, this );
        d.dispatchEvent( this.opt.event.beforeInit );
        resolve( this, res );
      }).catch( reject );
    });
    
    // initialize()を実行したかどうかのフラグ
    this.is_initialized = false;
  }
  
  initialize () {
    // 記事データとカテゴリデータを取得し、整形が終わったらResolveする
    const optimize = (article,categories) => {
      const catobj_sonota = {id:'0',name:'その他',href:`/${this.opt.content}/?mode=list&cat=0`}
      if (String(article.category) === '0') {
        article.category = catobj_sonota;
      } else {
        const matchedCats = categories.filter( cat => String(article.category) === String(cat.id) );
        article.category = matchedCats.length > 0 ? matchedCats.shift() : catobj_sonota;
      }
      article.keywords = article.keywords || [];
      return article;
    }
    return new Promise( (resolve, reject) => {
      const articles = TAGSORT.getArticles({ content: this.opt.content }).catch( reject );
      const categories = TAGSORT.getCategories( this.opt.content ).catch( reject );
      Promise.all([ 
        articles.catch(err => console.error('エラーが発生しました', err)),
        categories.catch(err => console.error('エラーが発生しました', err))
      ]).then( res => {
        let [ articles, categories ] = res;
        articles = articles.map( article => optimize(article,categories) );
        return resolve([ articles, categories ]);
      });
    });
  }

  static getContentName () {
    return l.pathname.replace(/^\/(.*)\//,'$1') || undefined;
  }

  static getArticles ( params = {} ) {
    params = Object.assign({
      content : false,
      post_per_page : -1,
      post_status : 'publish',
      post_id : '',
      category_in : '',
      sort : 'DESC',
      exclude : ''
    }, params );

    return fetch(`/assets/api/getArticles/?${ new URLSearchParams(params) }`, { method: 'GET'})
    .then( res => {
      if( !res.ok ) throw new Error(res.statusText);
      else return res.json();
    });
  }

  /**
   * すべての記事からカテゴリ情報を取得する
   * @return {Array} カテゴリ情報の配列
   * @example { id: "1", href: "/menu1/?mode=list&cat=1", name: "テストカテゴリ", turn: "1"}
   */
  static getCategories ( content = false ) {
    return fetch(`/assets/api/getCategories/?content=${content}`, { method: 'GET'})
    .then( res => {
      if( !res.ok ) throw new Error(res.statusText);
      else return res.json();
    });
  }

  /**
   * すべての記事からタグ情報を取得する
   * @return {Array} タグ情報の配列
   * @example { slug: '%E3%82%BF%E3%82%B0%E5%90%8D', name: 'タグ名', count: 10 }
   * ・タグの使用回数をカウントする
   * ・URL用のSlugをもつ
   */
  static getTags ( articles ) {
    const tags = []
    articles.map( article => {
      if(article.keywords != null && article.keywords.length >= 1 ){
        article.keywords.map( tag => {
          const slug = encodeURI(tag)
          const targetTag = tags.find( tag => tag.slug === slug )
          if ( targetTag != undefined ) targetTag.count++
          else tags.push({ slug, name: tag, count: 1 })
        })
      }
    })
    tags.sort( (a,b) => b.count - a.count );
    return tags;
  }

  // 指定した記事のタグ情報を取得する
  get_the_tags ( post_id ) {
    const getKeywords = () => {
      let article = this.articles.filter( article => post_id == article.id );
      return (article.length)? article.shift().keywords : false;
    }
    if( this.is_initialized ) return getKeywords();
    return this.init.then( () => getKeywords() );
  }

  // 指定した記事のカテゴリ情報を取得する
  get_the_category ( post_id ) {
    const getCategory = () => {
      let article = this.articles.filter( article => post_id == article.id );
      return (article.length)? article.shift().category : false;
    }
    if( this.is_initialized ) return getCategory();
    return this.init.then( () => getCategory() );
  }

  render () {
    const render = () => {
      this.taglist.render();  // タグリストを表示
      if( this.is_list() ){
        this.list.render( this.articles );  // 記事一覧を表示
        this.pagination.render(); // ページネーションを表示
      }
      if( this.is_detail() ){
        this.related.render();  // 関連記事を表示
      }
      // render終了後にイベントを発火
      d.dispatchEvent( this.opt.event.afterRender );
    }

    // initが終了していたら各クラスのrenderを実行する。
    if( this.is_initialized ) render();
    else this.init.then( render );
  }

  // 現在のページが一覧だったらtrue
  is_list() {
    return (/^\?mode=list(&tag=[^&]+|&cat=[^&]+|&m=[^&]+)?(&page=[\d]+)?$/.test( l.search ) || /^\?page=[\d]+/.test( l.search ) || l.search == "");
  }

  // 現在のページが詳細だったらtrue
  is_detail() {
    return ( d.body.classList.contains('is--detail') || this.getParam('article') );
  }

  // URLパラメータから指定したキーの値を取得する
  getParam ( param ) {
    let params = ( new URL(l) ).searchParams;
    return param? params.get(param) : params;
  }

  // unixタイムスタンプを日付に変換する
  static datetostr(unixtime,format) {
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

  // 文字数を指定した数になるまで指定した文字列を省略する
  static truncate(value, length, omission) {
    if(!value.length) return '';
    var length = length ? parseInt(length, 10) : 20;
    var ommision = omission ? omission.toString() : '...';
  
    if (value.length <= length) {
      return value;
    }
    return value.substring(0, length) + ommision;
  }

}

// 一覧ページの差し替えクラス
class list {
  constructor ( opt, parent ) {
    this.parent = parent;
    this.opt = opt;
    this.itemTemplate = this.opt.itemTemplate || `
      <div class="rwd002-list-content is-list-12" :class="[ 'is-paged-' + paged ]">
        <div class="rwd002-list-content__inner">
          <transition-group tag="ul" class="rwd002-list-content__list" name="fade" mode="out-in">
            <li class="rwd002-list-content__item" v-for="( article, ind ) in pagedArticles" :key="article.id" :class="[ 'is-item-' + ind ]">
              <a :href="article.href" class="rwd002-list-content__link">
                <figure class="rwd002-list-content__thumb"><img :src="article.thumb" :alt="article.title" width="100%" loading="lazy" class="rwd002-list-content__thumb-img"></figure>
                <div class="rwd002-list-content__body">
                  <p class="date">{{ datetostr(article.date * 1000 ,"YYYY/MM/DD")}}</p>
                  <span class="cate" :class="'is-cat'+article.category.id" :data-href="article.category.href" v-if="article.category">{{ article.category.name }}</span>
                  <h5 class="title">{{ article.title }}</h5>
                  <p class="desc" v-if="article.desc.length">{{ article.desc }}</p>
                  <p class="body" v-if="article.body.length">{{ truncate(article.body, ${this.opt.bodyLength}) }}</p>
                </div><!-- /.rwd002-list-content__body -->
              </a>
              <!-- /.rwd002-list-content__link -->
            </li>
            <!-- /.rwd002-list-content__item -->
          </transition-group>
          <!-- /.rwd002-list-content__list -->
        </div>
        <!-- /.rwd002-list-content__inner -->
      </div>
      <!-- /.rwd002-list-content -->
    `;
  }

  render( articles ){
    const parent = this.parent;
    const listOpt = this.opt;
    const option = {
      name: 'list',
      el: listOpt.el,
      data() {
        return {
          articles,
          paged: 1,
          totalPage: 0,
          totalItem: articles.length,
        };
      },
      template: this.itemTemplate,
      computed: {
        pagedArticles () {
          return this.filterArticles().slice( (this.paged - 1) * listOpt.perpage, this.paged * listOpt.perpage)
        }
      },
      watch: {
        paged: val => parent.paginationInstance.paged = val
      },
      methods: {
        filterArticles () {
          return this.articles.filter( article => {
            let res = true
            const params = parent.getParam();
            params.forEach( (val,key) => {
              switch( key ){
                case 'tag':
                  res = ( article.keywords && article.keywords.indexOf( decodeURI( val ) ) != -1 );
                  break
                case 'cat':
                  res = ( parseInt( article.category.id ) == parseInt( val ) );
                  break
                case 'm':
                  res = ( TAGSORT.datetostr( (article.date * 1000), 'YYYY/MM' ).indexOf( val ) != -1 );
              }
            })
            return res
          })
        },
        pageChange (page) {
          this.paged = page;
  
          let suffix = '';
          if( parent.getParam('tag') ) {
            suffix = '?mode=list&tag='+parent.getParam('tag')+'&page=';
          } else if( parent.getParam('cat') ) {
            suffix = '?mode=list&cat='+parent.getParam('cat')+'&page=';
          } else {
            suffix = '?page='
          }
  
          w.history.pushState(
            { page },
            `Page${page}`,
            `${l.pathname}${suffix}${page}`
          );
          d.dispatchEvent( parent.opt.event.pageChange );
        },
        datetostr : TAGSORT.datetostr,
        truncate : TAGSORT.truncate
      },
      mounted () {
        this.totalPage = Math.ceil( this.filterArticles().length / listOpt.perpage );
        this.totalItem = this.filterArticles().length;
        if( parent.getParam('page') ) this.pageChange( parseInt( parent.getParam('page') ) );
        w.addEventListener('popstate', () => {
          if( parent.getParam('page') ) this.pageChange( parseInt( parent.getParam('page') ) )
        });
        listOpt.addMounted( this );
      },
    };
  
    // 追加data
    option.data = Object.assign( option.data , listOpt.addData );
  
    // 追加method
    option.methods = Object.assign( option.methods, listOpt.addMethods );

    const app = createApp( option );
    if( listOpt.addComponent.length ){
      listOpt.addComponent.forEach( (component,i) => {
        app.component( component.name || `customComponent-${i}` , component || {} );
      });
    }
    parent.listInstance = app.mount(listOpt.el);
  }
}

// ページネーションクラス
class pagination {
  constructor( opt, parent ) {
    this.parent = parent;
    this.opt = opt;
    opt.template = this.template = opt.template || `
      <div class="rwd002-pagination">
        <p class="rwd002-pagination__totalpages">{{ totalItem }}件中&nbsp;{{ ( (paged - 1) * perpage ) + 1 }}-{{ ( (paged - 1) * perpage ) + itemCount }}件を表示</p>
        <!-- /.rwd002-pagination__totalpages -->
        <div class="rwd002-pagination__pageNav">
          <a :href="suffix + prevPage" class="is-prev" :class="[is_first ? 'disable': '']" @click.prevent="prev"></a>
          <ul class="rwd002-pagination__pages">
            <li v-for="page in pagelist">
              <i v-if="page == '...'">{{page}}</i>
              <a v-if="page != paged && page != '...'" :href="suffix + page" @click.prevent="changePage(page)">{{page}}</a>
              <span v-if="page == paged">{{page}}</span>
            </li>
          </ul>
          <!-- /.rwd002-pagination__pages -->
          <a :href="suffix + nextPage" class="is-next" :class="[is_last ? 'disable': '']" @click.prevent="next"></a>
        </div>
        <!-- /.rwd002-pagination__pageNav -->
      </div>
    `;
  }

  render(){
    const parent = this.parent;
    const option = Object.assign({
      name: 'pagination',
      el: this.opt.el,
      data() {
        return {
          currentPage: parent.listInstance.paged,
          perpage: parent.opt.list.perpage,
          paged: parent.listInstance.paged,
          totalPage: parent.listInstance.totalPage,
          totalItem: parent.listInstance.totalItem,
          itemCount: parent.listInstance.pagedArticles.length,
          prevText: this.prevText || 'PREV',
          nextText: this.prevText || 'NEXT'
        };
      },
      template: this.template,
      methods:{
        prev () {
          this.currentPage = this.prevPage;
          parent.listInstance.pageChange( this.currentPage );
          w.scrollTo({ top:0, behavior: 'smooth' });
        },
        next () {
          this.currentPage = this.nextPage;
          parent.listInstance.pageChange( this.currentPage );
          w.scrollTo({ top:0, behavior: 'smooth' });
        },
        changePage (page) {
          this.currentPage = page;
          parent.listInstance.pageChange( this.currentPage );
          w.scrollTo({ top:0, behavior: 'smooth' });
        }
      },
      computed:{
        is_first () {
          return this.paged == 1
        },
        is_last () {
          return this.totalPage == this.paged
        },
        suffix () {
          let suffix = '';
          if( parent.getParam('tag') ) {
            suffix = '?mode=list&tag='+parent.getParam('tag')+'&page=';
          } else if( parent.getParam('cat') ) {
            suffix = '?mode=list&cat='+parent.getParam('cat')+'&page=';
          } else{
            suffix = '?page='
          }
          return suffix;
        },
        prevPage() {
          return Math.max(this.currentPage - 1, 1);
        },
        nextPage() {
          return Math.min(this.currentPage + 1, this.totalPage);
        },
        pagelist() {
          const disp_page_amt = 5
          const current_arr_amt = 3
          let pageArr = []
          if( this.totalPage <= disp_page_amt ) return this.totalPage
          let currentArr = new Array(current_arr_amt).fill(null).map((v,i) => {
            if( this.currentPage == 1 ) return this.currentPage + i
            if( this.currentPage == this.totalPage ) return this.currentPage - 2 + i
            return this.currentPage - 1 + i
          })
          if( currentArr[0] >= current_arr_amt ) currentArr.unshift('...') 
          if( currentArr[ currentArr.length - 1 ] <= this.totalPage - current_arr_amt ) currentArr.push('...') 
          let allPageArr = new Array(this.totalPage).fill(null).map((v,i) => i + 1)
          let edge_amt = Math.round( ( disp_page_amt - current_arr_amt ) / 2 )
          let edge_firstArr = allPageArr.slice( 0, edge_amt )
          let edge_endArr = allPageArr.slice( allPageArr.length - edge_amt )
          pageArr.push( ...edge_firstArr, ...currentArr, ...edge_endArr )
          pageArr = pageArr.filter( ( v, i, self ) => v == '...' || self.indexOf(v) === i )
          return pageArr
        }
      },
      mounted () {
        if( parent.getParam('page') ) this.currentPage = parseInt( parent.getParam('page') );
        w.addEventListener('popstate', () => {
          if( parent.getParam('page') ) this.currentPage = parseInt( parent.getParam('page') )
        });
      }
    }, this.opt );

    if( d.querySelector(this.opt.el) ){
      parent.paginationInstance = createApp( option ).mount(this.opt.el);
    }

  
  }
}

/**
 * taglist クラス
 * @param {Object} opt オプション
 * @param {Object} parent 呼び出し元のクラス（TAGSORT）
 */
export class taglist {
  constructor( opt, parent ) {
    this.parent = parent;
    this.opt = opt;
    this.template = opt.template || `
      <div class="rwd002-taglist">
        <catelist :cats="catlist" />
        <taglist :tags="taglist" :content="content" />
      </div>
      <!-- /.rwd002-taglist -->
    `;

    this.catComponent = {
      name: 'catelist',
      props: ['cats'],
      template: `
        <div class="rwd002-taglist__cats">
          <a :href="cat.href" class="rwd002-taglist__catBtn" v-for="cat in cats" :class="{ current : is_current(cat.id)}">{{ cat.name }}</a>
        </div>
      `,
      computed: {
        is_current () {
          const param = parent.getParam('cat');
          return cat => (cat === null && !param )? true : cat == param;
        } 
      },
    };

    this.tagComponent = {
      name: 'taglist',
      data() {
        return {
          isOpen: false,
          exist_secondary: false
        };
      },
      props: ['tags','content'],
      template: `
        <div class="rwd002-taglist__tags">
          <transition-group tag="div" name="fade" class="rwd002-taglist__list">
            <a :href="'/'+content+'/?mode=list&tag='+tag.slug" class="rwd002-taglist__tagBtn" v-for="(tag, ind) in tags" :key="thisName+'-'+ind" :class="{ current : is_current(tag.name), 'is-secondary' : is_secondary(ind, tag.count)}" v-show="!is_secondary(ind, tag.count) || isOpen">#{{ tag.name }}</a>
          </transition-group>
          <div class="rwd002-taglist__btnwrap" v-if="exist_secondary">
            <button class="rwd002-taglist__tglBtn" type="buton" @click="tglTaglist" v-html="btnHtml"></button>
          </div>
        </div>
      `,
      computed: {
        thisName () {
          return this.$root.$options.name;
        },
        btnHtml () {
          return this.isOpen ? opt.btnHtml.close : opt.btnHtml.open;
        },
        is_current () {
          return tag => tag == parent.getParam('tag');
        },
        is_secondary () {
          return (ind, cnt) => {
            if( ind >= opt.minimumTagAmount || cnt < opt.hideUselessTags ){
              if( !this.exist_secondary ) this.exist_secondary = true;
              return true;
            }
          };
        },
      },
      methods: {
        tglTaglist () {
          this.isOpen = !this.isOpen;
        }
      }
    };
    
  }

  insertContainer ( tag = `<taglist />`) {
    const container = d.querySelector( this.opt.container || '.rwd002-container');
    const dispPos = d.body.classList.contains('is--list') ? this.opt.disp_list : this.opt.disp_detail;
    if( !container ) return false;
    switch ( dispPos ){
      case 'head': {
        container.insertAdjacentHTML('beforebegin', tag);
        break;
      }
      case 'foot': {
        container.insertAdjacentHTML('afterend', tag);
        break;
      }
      case 'append': {
        container.insertAdjacentHTML('beforeend', tag);
        break;
      }
      case 'prepend': {
        container.insertAdjacentHTML('afterbegin', tag);
        break;
      }
      case 'both':
      case true: {
        container.insertAdjacentHTML('beforebegin', tag);
        container.insertAdjacentHTML('afterend', tag);
        break;
      }
    }
  }
  
  render(){
    this.insertContainer();
    const parent = this.parent;
    const opt = this.opt;
    const catAll = {
      href: '/'+parent.opt.content+'/?mode=list',
      id: null,
      name: opt.addAll
    };

    const option = {
      name: 'taglist',
      data() {
        return {
          catlist: (opt.addAll)? [catAll,...parent.categories] : parent.categories,
          taglist: parent.tags,
          content: parent.opt.content
        };
      },
      components: {
        'catelist': this.catComponent,
        'taglist': this.tagComponent
      },
      template: this.template
    };
    
    d.querySelectorAll('taglist').forEach( (obj,i) => {
      option.name = `taglist_${i+1}`;
      createApp( option ).mount(obj);
    });
  
  }
}

/**
 * taglist クラス
 * @param {Object} opt オプション
 * @param {Object} parent 呼び出し元のクラス（TAGSORT）
 * 
 * render()が実行されると、<related>タグが挿入され、そこでVue.jsを実行します。
 * 日付変換や文字数制限などはTAGSORTのメソッドを使用しています。
 * オプション[sortType]によって、タグのソート方法を変更できます。
 */
export class related {
  constructor( opt, parent ) {
    this.parent = parent;
    this.opt = opt;
    this.post_id = parent.getParam('article') || 1;
    this.this_cat = parent.get_the_category( this.post_id );
    this.this_tags = parent.get_the_tags( this.post_id );
    this.itemTemplate = opt.itemTemplate || `
      <div class="rwd002-related-content is-list-12" v-if="relatedArticles.length">
        <div class="rwd002-related-content__inner">
          <h3 class="rwd002-related-content__title">関連記事</h3>
          <!-- /.rwd002-related-content__title -->
          <ul class="rwd002-related-content__list">
            <li class="rwd002-related-content__item" v-for="( article, ind ) in relatedArticles" :key="article.id" :class="[ 'is-item-' + ind ]">
              <a :href="article.href" class="rwd002-related-content__link">
                <figure class="rwd002-related-content__thumb"><img :src="article.thumb" :alt="article.title" width="100%" loading="lazy" class="rwd002-related-content__thumb-img"></figure>
                <div class="rwd002-related-content__body">
                  <p class="date">{{ datetostr(article.date * 1000 ,"YYYY/MM/DD")}}</p>
                  <span class="cate" :class="'is-cat'+article.category.id" :data-href="article.category.href" v-if="article.category">{{ article.category.name }}</span>
                  <h5 class="title">{{ article.title }}</h5>
                  <p class="desc">{{ article.desc }}</p>
                  <p class="body">{{ truncate(article.body, ${this.opt.bodyLength}) }}</p>
                </div><!-- /.rwd002-related-content__body -->
              </a>
              <!-- /.rwd002-related-content__link -->
            </li>
            <!-- /.rwd002-related-content__item -->
          </ul>
          <!-- /.rwd002-related-content__list -->
        </div>
        <!-- /.rwd002-related-content__inner -->
      </div>
      <!-- /.rwd002-related-content -->
    `;
    
  }

  insertContainer ( tag = `<related />`) {
    const container = d.querySelector( this.opt.container || 'article.rwd002-detail');
    if( container && this.opt.disp_detail ) container.insertAdjacentHTML('afterend', tag);
  }

  relatedArticles ( articles ){
    return articles.filter( article => {
      if( article.id == this.post_id ) return false
      
      // 同カテゴリーの記事か、同タグの記事をフィルタする
      switch ( this.opt.sortType ) {
        case 'tag': {
          let related_tags = [...new Set( article.keywords )].filter( tag => {
            if( this.this_tags != null && this.this_tags.length ) return this.this_tags.includes( tag );
          });
          return (related_tags && related_tags.length >= 1);
        }
        case 'category': {
          return (article.category.id == this.this_cat.id);
        }
        default: return false;
      }
      
    })
    .slice( 0, this.opt.amount );
  } 

  render(){
    this.insertContainer();
    const parent = this.parent;
    const relatedArticles = this.relatedArticles(this.parent.articles);

    const option = {
      name: 'related',
      template: this.itemTemplate,
      data() {
        return {
          relatedArticles,
        };
      },
      methods:{
        datetostr: TAGSORT.datetostr,
        truncate : TAGSORT.truncate
      },
    };

    // 追加method
    option.methods = Object.assign( option.methods, this.opt.addMethods );
    
    d.querySelectorAll('related').forEach( (obj,i) => {
      option.name = `related_${i+1}`;
      createApp( option ).mount(obj);
    });
  }
}