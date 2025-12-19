import Utility from "./utils/utility";
import App from "./app";
import HOME from "./pages/home";

// ユーティリティクラスのインスタンス化
const UTIL = new Utility();

// テンプレートインスタンス化（promise登録）
const TPL = new App();

// URLによる関数の実行
UTIL.loader( (request, path) => {
  switch( path ){
    case '/': HOME(); break
  }
  // switch( request ){}
});

// テンプレートインスタンスの初期化（イベント発火）
TPL.init();