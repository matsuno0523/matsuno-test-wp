<?php
/**
 * WordPress の基本設定
 *
 * このファイルは、インストール時に wp-config.php 作成ウィザードが利用します。
 * ウィザードを介さずにこのファイルを "wp-config.php" という名前でコピーして
 * 直接編集して値を入力してもかまいません。
 *
 * このファイルは、以下の設定を含みます。
 *
 * * MySQL 設定
 * * 秘密鍵
 * * データベーステーブル接頭辞
 * * ABSPATH
 *
 * @link http://wpdocs.sourceforge.jp/wp-config.php_%E3%81%AE%E7%B7%A8%E9%9B%86
 *
 * @package WordPress
 */

// 注意: 
// Windows の "メモ帳" でこのファイルを編集しないでください !
// 問題なく使えるテキストエディタ
// (http://wpdocs.sourceforge.jp/Codex:%E8%AB%87%E8%A9%B1%E5%AE%A4 参照)
// を使用し、必ず UTF-8 の BOM なし (UTF-8N) で保存してください。


// ** MySQL 設定 - この情報はホスティング先から入手してください。 ** //
/** WordPress のためのデータベース名 */
define('DB_NAME', 'enterDBname');

/** MySQL データベースのユーザー名 */
define('DB_USER', 'enterDBuser');

/** MySQL データベースのパスワード */
define('DB_PASSWORD', 'enterDBpass');

/** MySQL のホスト名 */
define('DB_HOST', 'localhost');

/** データベースのテーブルを作成する際のデータベースの文字セット */
define('DB_CHARSET', 'utf8');

/** データベースの照合順序 (ほとんどの場合変更する必要はありません) */
define('DB_COLLATE', '');

/**#@+
 * 認証用ユニークキー
 *
 * それぞれを異なるユニーク (一意) な文字列に変更してください。
 * {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org の秘密鍵サービス} で自動生成することもできます。
 * 後でいつでも変更して、既存のすべての cookie を無効にできます。これにより、すべてのユーザーを強制的に再ログインさせることになります。
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         ')M2&jZem%mTzb~FBU+j&%{B^#AbMHs9{OU+_avh+>J7Vs8rjRSh-Kw5_M8 `|00T');
define('SECURE_AUTH_KEY',  'Q&Z;rHawMS=,T[~VN%6ai2M.Tie?[BNOr#lv0H+Z6 ]]M+82deUi6*9{;(_`l8e}');
define('LOGGED_IN_KEY',    '+D,]fa%]EYDJ-T2UpTK~D5*sLtFfn[pqZ^+5R$FS(eq|Gt]fuH+wez0+>|mK7Tbe');
define('NONCE_KEY',        '4c?^r% MKnro9h{T^)tvQ{#)3$w6Q{>]:ILRqBA1]=^L6Zp:S+l{)!x#%Hxe{)j/');
define('AUTH_SALT',        'QbW35osKW]_ imz/kZgEhgTeT+xYV.Vm-]>-,.5T_J}6gDd{x^4xWnQsX=;LL)>b');
define('SECURE_AUTH_SALT', '-V-G0qOqR ypVasZXVp?he%b@@S.A>3WNA|Z-UPfW)>c^b/J=/wwr/zF8,a/l:6/');
define('LOGGED_IN_SALT',   '7N0V]* 7nZj6hEUbX(Zws6rP!@y/]6f Xp;B4R#P{X4Un]m1;Xa6 {[o7FDD;egC');
define('NONCE_SALT',       'S!1?$MN;vq>[fD6Eb@dPwz?r!vpIY4NC4zGF{7[KUX<Yu#qX]!IG3CaL,z]`wQP#');

/**#@-*/

/**
 * WordPress データベーステーブルの接頭辞
 *
 * それぞれにユニーク (一意) な接頭辞を与えることで一つのデータベースに複数の WordPress を
 * インストールすることができます。半角英数字と下線のみを使用してください。
 */
$table_prefix  = 'wp_';

/**
 * 開発者へ: WordPress デバッグモード
 *
 * この値を true にすると、開発中に注意 (notice) を表示します。
 * テーマおよびプラグインの開発者には、その開発環境においてこの WP_DEBUG を使用することを強く推奨します。
 *
 * その他のデバッグに利用できる定数については Codex をご覧ください。
 *
 * @link http://wpdocs.osdn.jp/WordPress%E3%81%A7%E3%81%AE%E3%83%87%E3%83%90%E3%83%83%E3%82%B0
 */

define('WP_DEBUG', false);

if($_SERVER['HTTPS'] == 'on'){
  define('WP_SITEURL', 'https://' . $_SERVER['HTTP_HOST'] . '/wp' );
  define('WP_HOME', 'https://' . $_SERVER['HTTP_HOST'] );
}else{
  define('WP_SITEURL', 'http://' . $_SERVER['HTTP_HOST'] . '/wp' );
  define('WP_HOME', 'http://' . $_SERVER['HTTP_HOST'] );
}

define('UPLOADS', '../uploads' );

/* 編集が必要なのはここまでです ! WordPress でブログをお楽しみください。 */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/wp/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
