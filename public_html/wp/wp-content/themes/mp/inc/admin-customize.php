<?php
/*
This file handles the admin area and functions.
You can use this file to make changes to the
dashboard. Updates to this page are coming soon.
It's turned off by default, but you can call it
via the functions file.

Developed by: Eddie Machado
URL: http://themble.com/bones/

Special Thanks for code & inspiration to:
@jackmcconnell - http://www.voltronik.co.uk/
Digging into WP - http://digwp.com/2010/10/customize-wordpress-dashboard/


  - removing some default WordPress dashboard widgets
  - an example custom dashboard widget
  - adding custom login css
  - changing text in footer of admin


*/

/************* DASHBOARD WIDGETS *****************/

// disable default dashboard widgets
function disable_default_dashboard_widgets() {
  global $wp_meta_boxes;
  // unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_right_now']);    // Right Now Widget
  unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_activity']);        // Activity Widget
  unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_recent_comments']); // Comments Widget
  unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_incoming_links']);  // Incoming Links Widget
  unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_plugins']);         // Plugins Widget

  unset($wp_meta_boxes['dashboard']['side']['core']['dashboard_quick_press']);    // Quick Press Widget
  unset($wp_meta_boxes['dashboard']['side']['core']['dashboard_recent_drafts']);     // Recent Drafts Widget
  unset($wp_meta_boxes['dashboard']['side']['core']['dashboard_primary']);           //
  unset($wp_meta_boxes['dashboard']['side']['core']['dashboard_secondary']);         //

  // remove plugin dashboard boxes
  unset($wp_meta_boxes['dashboard']['normal']['core']['yoast_db_widget']);           // Yoast's SEO Plugin Widget
  unset($wp_meta_boxes['dashboard']['normal']['core']['rg_forms_dashboard']);        // Gravity Forms Plugin Widget
  unset($wp_meta_boxes['dashboard']['normal']['core']['bbp-dashboard-right-now']);   // bbPress Plugin Widget

  /*
  have more plugin widgets you'd like to remove?
  share them with us so we can get a list of
  the most commonly used. :D
  https://github.com/eddiemachado/bones/issues
  */
}

/*
Now let's talk about adding your own custom Dashboard widget.
Sometimes you want to show clients feeds relative to their
site's content. For example, the NBA.com feed for a sports
site. Here is an example Dashboard Widget that displays recent
entries from an RSS Feed.

For more information on creating Dashboard Widgets, view:
http://digwp.com/2010/10/customize-wordpress-dashboard/
*/

// RSS Dashboard Widget
function mp_rss_dashboard_widget() {
  if ( function_exists( 'fetch_feed' ) ) {
    // include_once( ABSPATH . WPINC . '/feed.php' );               // include the required file
    $feed = fetch_feed( 'http://feeds.feedburner.com/wpcandy' );        // specify the source feed
    if (is_wp_error($feed)) {
      $limit = 0;
      $items = 0;
    } else {
      $limit = $feed->get_item_quantity(7);                        // specify number of items
      $items = $feed->get_items(0, $limit);                        // create an array of items
    }
  }
  if ($limit == 0) echo '<div>The RSS Feed is either empty or unavailable.</div>';   // fallback message
  else foreach ($items as $item) { ?>

  <h4 style="margin-bottom: 0;">
    <a href="<?php echo $item->get_permalink(); ?>" title="<?php echo mysql2date( __( 'j F Y @ g:i a', 'bonestheme' ), $item->get_date( 'Y-m-d H:i:s' ) ); ?>" target="_blank">
      <?php echo $item->get_title(); ?>
    </a>
  </h4>
  <p style="margin-top: 0.5em;">
    <?php echo substr($item->get_description(), 0, 200); ?>
  </p>
  <?php }
}

// calling all custom dashboard widgets
function mp_custom_dashboard_widgets() {
  wp_add_dashboard_widget( 'mp_rss_dashboard_widget', __( 'Recently on Themble (Customize on admin.php)', 'bonestheme' ), 'mp_rss_dashboard_widget' );
  /*
  Be sure to drop any other created Dashboard Widgets
  in this function and they will all load.
  */
}


// removing the dashboard widgets
add_action( 'wp_dashboard_setup', 'disable_default_dashboard_widgets' );
// adding any custom widgets
// add_action( 'wp_dashboard_setup', 'mp_custom_dashboard_widgets' );


/************* CUSTOM LOGIN PAGE *****************/

// calling your own login css so you can style it

//Updated to proper 'enqueue' method
//http://codex.wordpress.org/Plugin_API/Action_Reference/login_enqueue_scripts
function mp_login_css() {

  // カスタム用ログインCSSがある場合は読み込む
  $customLoginCss = '/assets/css/login.css';

  if( file_exists(get_stylesheet_directory().$customLoginCss) ){
    wp_enqueue_style( 'custom_login_css', get_stylesheet_directory_uri() . $customLoginCss, false );
  }
}

// changing the logo link from wordpress.org to your site
function mp_login_url() {  return home_url(); }

// changing the alt text on the logo to show your site name
function mp_login_title() { return get_option( 'blogname' ); }

// calling it only on the login page
add_action( 'login_enqueue_scripts', 'mp_login_css', 10 );
add_filter( 'login_headerurl', 'mp_login_url' );
add_filter( 'login_headertext', 'mp_login_title' );


/************* CUSTOMIZE ADMIN *******************/

/*
I don't really recommend editing the admin too much
as things may get funky if WordPress updates. Here
are a few funtions which you can choose to use if
you like.
*/

// Custom Backend Footer
function mp_custom_admin_footer() {
  if(defined('CUSTOM_THEME_AUTHOR')){
    _e( '<span id="footer-thankyou">Developed by <a href="'.CUSTOM_THEME_AUTHOR_URL.'" target="_blank">'.CUSTOM_THEME_AUTHOR.'</a></span>.', 'bonestheme' );
  }else{
    _e( '<span id="footer-thankyou">Developed by <a href="http://www.mpcreative.jp" target="_blank">MP Creative</a></span>.', 'bonestheme' );
  }
}

// adding it to the admin area
add_filter( 'admin_footer_text', 'mp_custom_admin_footer' );

// remove wordPress logo from admin-bar
function hide_admin_logo() {
  global $wp_admin_bar;
  $wp_admin_bar->remove_menu( 'wp-logo' );
}
add_action( 'wp_before_admin_bar_render', 'hide_admin_logo' );

// 管理画面カスタマイズJS/CSS読み込み
function custom_admin_style(){
  // register admin stylesheet
  wp_register_style( 'admin-stylesheet', get_template_directory_uri() . '/css/admin-style.css', array(), '', 'all' );
  // enqueue styles and scripts
  wp_enqueue_style( 'admin-stylesheet' );
}
function custom_admin_scripts(){
  //adding scripts file in the footer
  wp_register_script( 'admin-js', get_template_directory_uri() . '/js/admin-script.js', array( 'jquery' ), '', true );
  wp_enqueue_script( 'admin-js' );

}
add_action( 'admin_print_styles', 'custom_admin_style' );
add_action( 'admin_print_scripts', 'custom_admin_scripts' );

//カスタム投稿タイプの投稿数をダッシュボードに表示する
function custom_post_dashboard() {
  $glances = array();
  $args = array(
    'public'   => true,  // Showing public post types only
    '_builtin' => false  // Except the build-in wp post types (page, post, attachments)
  );
  // Getting your custom post types
  $post_types = get_post_types($args, 'object', 'and');
  foreach ($post_types as $post_type)
  {
    // Counting each post
    $num_posts = wp_count_posts($post_type->name);
    // Number format
    $num   = number_format_i18n($num_posts->publish);
    // Text format
    $text  = _n($post_type->labels->singular_name, $post_type->labels->name, intval($num_posts->publish));
    // If use capable to edit the post type
    if (current_user_can('edit_posts'))
    {
      // Show with link
      $glance = '<a class="'.$post_type->name.'-count" href="'.admin_url('edit.php?post_type='.$post_type->name).'">'.$num.'件の'.$text.'</a>';
    }
    else
    {
      // Show without link
      $glance = '<span class="'.$post_type->name.'-count">'.$num.'件の'.$text.'</span>';
    }
    // Save in array
    $glances[] = $glance;
  }
  // return them
  return $glances;
}
add_filter('dashboard_glance_items', 'custom_post_dashboard');


//投稿一覧の項目非表示とサムネイル欄表示
function custom_columns($columns) {
  $columns['thumbnail'] = __('Thumbnail');
  unset($columns['author']);
  unset($columns['comments']);
  return $columns;
}
function add_column($column_name, $post_id) {
  $posttype_name_list = get_post_types(array('_builtin'=>false,'public'=>true));
  //アイキャッチ取得
  if ( 'thumbnail' == $column_name) {
    $thum = get_the_post_thumbnail($post_id, array(80,80), 'thumbnail');
  }

  //使用していない場合「なし」を表示
  if ( isset($stitle) && $stitle ) {
    echo esc_attr($stitle);
  } else if ( isset($thum) && $thum ) {
    echo $thum;
  } else if ( isset($pcategory) && $pcategory ) {
    echo $pcategory;
  } else {
    echo __('None');
  }
}
add_filter( 'manage_posts_columns', 'custom_columns' );
add_filter( 'manage_pages_columns', 'custom_columns' );
add_action( 'manage_posts_custom_column', 'add_column', 10, 2 );
add_action( 'manage_pages_custom_column', 'add_column', 10, 2 );

//管理者と、そうでないときの管理画面メニュー
function remove_menus () {
    global $menu;
  if (!current_user_can('level_10')){
    //unset($menu[2]);//ダッシュボード
    //unset($menu[4]);//メニューの線1
    //unset($menu[10]);//メディア
    //unset($menu[20]);//ページ
    unset($menu[59]);//メニューの線2
    // unset($menu[60]);//テーマ
    unset($menu[65]);//プラグイン
    //unset($menu[70]);//プロフィール
    unset($menu[75]);//ツール
    // unset($menu[80]);//設定
    unset($menu[90]);//メニューの線3
  }
    unset($menu[5]);//投稿
    unset($menu[15]);//リンク
    unset($menu[25]);//コメント

}
add_action('admin_menu', 'remove_menus');


//管理者でないときに本体のアップデートを表示させない
if (!current_user_can('level_10')){
  add_filter( 'pre_site_transient_update_core', function( $a ) {
    return null;
  } );
}

//一般設定画面に項目を追加
function add_general_custom_sections() {
  // add_settings_field( 'キー', 'ラベル', 'コールバック関数', 'general' )で項目を追加
  // サイトのデフォルトDescription設定
  add_settings_field( 'default_description', 'META：ディスクリプション', 'default_description', 'general' );
  register_setting( 'general', 'default_description' );

  // サイトのデフォルトKeywords設定
  add_settings_field( 'default_keywords', 'META：キーワード', 'default_keywords', 'general' );
  register_setting( 'general', 'default_keywords' );

  // 追加メタタグ設定
  add_settings_field( 'add_custom_meta', '追加メタタグ', 'add_custom_meta', 'general' );
  // register_setting( 'general', 'キー' )で値を保存
  register_setting( 'general', 'add_custom_meta' );

  //Viewport設定
  add_settings_field( 'viewport', 'Viewport設定', 'viewport', 'general' );
  register_setting( 'general', 'viewport' );

  //Newマーク表示期間設定
  add_settings_field( 'new_period', 'NEWマーク表示日数', 'new_period', 'reading' );
  register_setting( 'reading', 'new_period' );

}
function default_keywords( $args ) {
  $default_keywords = get_option( 'default_keywords' ) ?: get_bloginfo('name');
  ?>
  <input type="text" class="regular-text" name="default_keywords" id="default_keywords" value="<?php echo esc_attr( $default_keywords ); ?>" />
  <?php
}
function default_description( $args ) {
  $default_description = get_option( 'default_description' ) ?: get_bloginfo('name').'のウェブサイトです。';
  ?>
  <textarea name="default_description" id="default_description" rows="5" cols="70"><?php echo esc_attr( $default_description ); ?></textarea>
  <?php
}
function add_custom_meta( $args ) {
  $add_custom_meta = get_option( 'add_custom_meta' ) ?: '<!-- Google Analytics code here -->';
  ?>
  <textarea name="add_custom_meta" id="add_custom_meta" rows="5" cols="70"><?php echo esc_attr( $add_custom_meta ); ?></textarea>
  <?php
}
function viewport( $args ) {
  $viewport = get_option( 'viewport' ) ?: 'width=device-width';
  ?>
  <input type="text" class="regular-text code" name="viewport" id="viewport" value="<?php echo esc_attr( $viewport ); ?>" />
  <?php
}
function new_period( $args ) {
  $new_period = get_option( 'new_period' ) ?: 7 ;
  ?>
  <input type="number" class="small-text" name="new_period" id="new_period" value="<?php echo esc_attr( $new_period ); ?>" />
  <?php
}
// admin_initアクションにフック
add_action( 'admin_init', 'add_general_custom_sections' );
//Googleanalyticsをwp-headにフック
add_action('wp_head', function() {
  echo get_option("add_custom_meta") . PHP_EOL;
});

?>
