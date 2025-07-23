const [d] = [document];

const domReady = TPL => false;

const jqInit = () => false;

export default function HOME () {
  // テンプレートが用意したDOMContentLoaded（テンプレートインスタンスが引数に入る）
  d.addEventListener('rwd002.beforeDomready', e => domReady(e.detail) );
  
  $(() => jqInit());
}