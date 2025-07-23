const [d] = [document];

export default class GET_ARTICLES {
  constructor (selector,opt) {
    this.opt = Object.assign({
      amount: -1,
      status: 'publish',
      cat: '',
      articles: '',
      sort: 'DESC',
      exclude: '',
    },opt);
    this.containers = d.querySelectorAll(selector);
    this.promises = [];
  }

  makeItem (item,content) {
    return `
      <li class="block-${content}-item">
        <a href="${item.href}" class="block-${content}-item__link">
          <figure class="block-${content}-item__img">
            <img src="${item.thumb}" alt="${item.title}" width="100%" loading="lazy">
          </figure>
          <div class="block-${content}-item__body">
            <h3 class="subject">${item.title.str_truncate(24)}</h3>
          </div>
        </a>
      </li>`;
  }

  fetchCategories (content) {
    return fetch(`/assets/api/getCategories/?content=${content}`);
  }

  fetchArticles (opt){
    return fetch(`/assets/api/getArticles/?${ new URLSearchParams(opt)}`);
  }

  is_new (date,d) {
    return ( new Date() - (1000*60*60*24*d) <= date )? true : false;
  }

  datetostr(date,format) {
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

  optimizeArticle (item,categories,data) {
    // カテゴリIDをオブジェクトに変換
    item.category = categories.filter(cat => cat.id == item.category).shift();
    if(!item.category) item.category = {id:'0',name:'その他',href:`/${data.content}/?mode=list&cat=0`};
    // NEWマーク判定
    item.is_new = this.is_new(item.date*1000,data.newDuration||14);
    // 日付表記変換
    const d = new Date(item.date*1000);
    item.date = this.datetostr(d,data.dateFormat||'YYYY.MM.DD');
    return item
  }

  render () {
    this.containers.forEach(container => {
      if( !container.hasAttribute('data-plugin') || container.getAttribute('data-plugin') !== 'getArticles' || !container.hasAttribute('data-content') ) return;
      let opt = {
        content: container.dataset.content,
        post_per_page: container.dataset.amount||this.opt.amount,
        post_status: container.dataset.status||this.opt.status,
        category_in: container.dataset.cat||this.opt.cat,
        post_id: container.dataset.articles||this.opt.articles,
        sort: container.dataset.sort||this.opt.sort,
        exclude: container.dataset.exclude||this.opt.exclude,
      };

      const getContentData = Promise.all([
        this.fetchArticles(opt),
        this.fetchCategories(opt.content),
      ]).then( res => Promise.all(res.map(r=>r.json())) );

      this.promises.push( getContentData );
      
      getContentData.then(res => {
        let [articles,categories] = res;

        // 記事データ整形
        articles = articles.map(item => this.optimizeArticle(item,categories,container.dataset));
        
        container.innerHTML = "";
        articles.forEach(item => container.insertAdjacentHTML('beforeend', this.makeItem(item,opt.content)) );
      });
    });
    return Promise.all( this.promises );
  }
}