<?php
// ファイルの読み込み
function kdk_enqueue_scripts() {
    wp_enqueue_style( 'twentytwentyone-style', get_template_directory_uri() . '/style.css' );

    wp_enqueue_style( 'kdk-child-style',
        get_stylesheet_directory_uri() . '/style.css',
        array( 'twentytwentyone-style' ),
        wp_get_theme()->get('Version')
    );

    wp_enqueue_style( 'kdk-custom-css',
        home_url('/assets/css/customize.css?ts=20260128'),
        array( 'kdk-child-style' ),
        '1.0.0'
    );

    wp_enqueue_script( 'kdk-custom-js',
        home_url('/assets/js/customize.js?ts=20260123'),
        array( 'jquery' ),
        '1.0.0',
        true
    );
}
add_action( 'wp_enqueue_scripts', 'kdk_enqueue_scripts' );

// 既存のWPのファビコン読み込みの無効化
remove_action( 'wp_head', 'wp_site_icon' );
remove_action( 'admin_head', 'wp_site_icon' );
// favicon.icoの適応
function output_local_ico_favicon() {
    $theme_uri = get_stylesheet_directory_uri();
    $favicon_url = $theme_uri . '/favicon.ico';
    echo '<link rel="icon" href="' . esc_url( $favicon_url ) . '" type="image/x-icon">';
}

add_action( 'wp_head', 'output_local_ico_favicon' );
add_action( 'admin_head', 'output_local_ico_favicon' );

// 管理画面コメントメニュー削除
function remove_comments_menu_from_admin() {
    remove_menu_page( 'edit-comments.php' );
}
add_action( 'admin_menu', 'remove_comments_menu_from_admin' );

// ヘッダーメニュー追加
function register_my_menus() {
	register_nav_menus(
		array(
			'header-gnav' => __( 'ヘッダーナビゲーション' )
		)
	);
}
add_action( 'init', 'register_my_menus' );