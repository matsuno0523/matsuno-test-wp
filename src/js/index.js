import Utility from "./class/utility";
import CUSTOMIZE from "./extended_class/customize";
import HOME from "./module/home";

// ユーティリティクラスのインスタンス化
const UTIL = new Utility();

// テンプレートインスタンス化（promise登録）
const TPL = new CUSTOMIZE();

// URLによる関数の実行
UTIL.loader( (request, path) => {
  switch( path ){
    case '/': HOME(); break
  }
  // switch( request ){}
});

// テンプレートインスタンスの初期化（イベント発火）
TPL.init();