<?php
function add_custom_post() {
  global $custom_post_types;

  foreach( $custom_post_types as $post_type => $val){

    $posttype_labels = array(
      'name' => 'コンテンツ',
      'singular_name' => '投稿',
      'all_items' => '投稿一覧',
      'add_new' => '新規追加',
      'add_new_item' => '新規投稿を追加',
      'edit' => '編集',
      'edit_item' => '投稿の編集',
      'new_item' => '新規投稿',
      'view_item' => '投稿を表示',
      'search_items' => '投稿を検索',
      'not_found' =>  '投稿が見つかりませんでした。',
      'not_found_in_trash' => 'ゴミ箱内に投稿が見つかりませんでした。',
      'parent_item_colon' => ''
    );
    if(isset($val['labels'])) $posttype_labels = array_merge( $posttype_labels, $val['labels'] );

    $posttype_args = array( 'labels' => $posttype_labels,
      'description' => __( 'This is the example custom post type', 'bonestheme' ),
      'public' => true,
      'publicly_queryable' => true,
      'exclude_from_search' => false,
      'show_ui' => true,
      'query_var' => true,
      'menu_position' => 5,
      'menu_icon' => 'dashicons-admin-page',
      'rewrite' => array( 'slug' => $post_type, 'with_front' => false ),
      'has_archive' => true,
      'capability_type' => 'post',
      'hierarchical' => false,
      'supports' => array( 'title', 'editor', 'author', 'thumbnail', 'excerpt', 'trackbacks', 'custom-fields', 'comments', 'revisions', 'sticky')
    );

    if(isset($val['args'])) $posttype_args = array_merge( $posttype_args, $val['args'] );
    register_post_type( $post_type, $posttype_args );

    if(isset($val['taxonomies'])){
      foreach($val['taxonomies'] as $tax_key => $tax_val){
        // now let's add custom categories (these act like categories)
        $tax_labels = array(
          'name' => 'カテゴリ',
          'singular_name' => 'カテゴリ',
          'search_items' =>  'カテゴリを検索',
          'all_items' => 'すべてのカテゴリ',
          'parent_item' => '親カテゴリ',
          'parent_item_colon' => '親カテゴリ',
          'edit_item' => 'カテゴリを編集',
          'update_item' => 'カテゴリを更新',
          'add_new_item' => '新規カテゴリを追加',
          'new_item_name' => '新規カテゴリ名'
        );
        if(isset($tax_val['labels'])) $tax_labels = array_merge( $tax_labels, $tax_val['labels'] );

        $tax_args = array(
          'hierarchical' => true,     /* if this is true, it acts like categories */
          'labels' => $tax_labels,
          'show_admin_column' => true,
          'show_ui' => true,
          'query_var' => true,
          'rewrite' => array( 'slug' => $tax_key ),
        );

        if(isset($tax_val['args'])) $tax_args = array_merge($tax_args,$tax_val['args']);
        register_taxonomy( $tax_key, array( $post_type ), $tax_args );

      }
    }

    // // now let's add custom tags (these act like categories)
    // register_taxonomy( 'custom_tag',
    //   array('custom_type'), /* if you change the name of register_post_type( 'custom_type', then you have to change this */
    //   array('hierarchical' => false,    /* if this is false, it acts like tags */
    //     'labels' => array(
    //       'name' => __( 'Custom Tags', 'bonestheme' ), /* name of the custom taxonomy */
    //       'singular_name' => __( 'Custom Tag', 'bonestheme' ), /* single taxonomy name */
    //       'search_items' =>  __( 'Search Custom Tags', 'bonestheme' ), /* search title for taxomony */
    //       'all_items' => __( 'All Custom Tags', 'bonestheme' ), /* all title for taxonomies */
    //       'parent_item' => __( 'Parent Custom Tag', 'bonestheme' ), /* parent title for taxonomy */
    //       'parent_item_colon' => __( 'Parent Custom Tag:', 'bonestheme' ), /* parent taxonomy title */
    //       'edit_item' => __( 'Edit Custom Tag', 'bonestheme' ), /* edit custom taxonomy title */
    //       'update_item' => __( 'Update Custom Tag', 'bonestheme' ), /* update title for taxonomy */
    //       'add_new_item' => __( 'Add New Custom Tag', 'bonestheme' ), /* add new title for taxonomy */
    //       'new_item_name' => __( 'New Custom Tag Name', 'bonestheme' ) /* name title for taxonomy */
    //     ),
    //     'show_admin_column' => true,
    //     'show_ui' => true,
    //     'query_var' => true,
    //   )
    // );

  }

}

  // adding the function to the Wordpress init
  if(isset($custom_post_types)){
    add_action( 'init', 'add_custom_post');
  }
  function mp_rewrite_flush() {
    flush_rewrite_rules();
  }
  add_action( 'after_switch_theme', 'mp_rewrite_flush' );
?>
