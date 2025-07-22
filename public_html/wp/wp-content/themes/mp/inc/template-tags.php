<?php
/**
 * Custom template tags for this theme.
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package default_theme_frame
 */


//dump()
function dump($var) {
  echo '<pre style="position:fixed;max-width:30%;max-height:30%;overflow:auto;bottom:0;right:10px;background:#FFF;-moz-box-shadow:0 0 5px #666;-webkit-box-shadow:0 0 5px #666;display:inline-block;padding:10px;text-align:left;color:#333;">';
  var_dump($var);
  echo '</pre>';
}

// A better title
// http://www.deluxeblogtips.com/2012/03/better-title-meta-tag.html
function rw_title( $title, $sep, $seplocation ) {
  global $page, $paged;

  // Don't affect in feeds.
  if ( is_feed() ) return $title;

  // Add the blog's name
  if ( 'right' == $seplocation ) {
    $title .= get_bloginfo( 'name' );
  } else {
    $title = get_bloginfo( 'name' ) . $title;
  }

  // Add the blog description for the home/front page.
  $site_description = get_bloginfo( 'description', 'display' );

  if ( $site_description && ( is_home() || is_front_page() ) ) {
    $title .= " {$sep} {$site_description}";
  }

  // Add a page number if necessary:
  if ( $paged >= 2 || $page >= 2 ) {
    $title .= " {$sep} " . sprintf( __( 'Page %s', 'dbt' ), max( $paged, $page ) );
  }

  return $title;

} // end better title

//サイトタイトル出力
function site_title(){
  global $post;
  $query_obj = get_queried_object();
  if($query_obj!==NULL){
    $term = get_taxonomy($query_obj->taxonomy);
    $post_type = get_query_var( 'post_type' );
    if(!$post_type) $post_type = $term->object_type[0];
    $post_type_obj = get_post_type_object( $post_type );
    if( !is_home() || is_paged() ){ //トップページ以外
      if(is_single() || is_page()){
        echo strip_tags($post->post_title).' | ';
      }
      if( is_404() ){
        echo '404 Not found. | ';
      }elseif( is_page() ){
        if($post->parent != 0){ //親ページがあったら
          $ancestors = $post->ancestor;
          foreach($ancestors as $ancestor){ //親ページの数だけ繰り返す
            get_the_title($ancestor).' | ';
          }
        }
      }else{  //カスタム投稿タイプのリストとposttypeが一致したら投稿タイプ名を出力
        if(!get_query_var('taxonomy')){
          echo esc_html($post_type_obj->label).' | ';
        }else{
          echo get_queried_object()->name.' | ';
          echo esc_html($post_type_obj->label).' | ';
        }
      }
    }
  }
  bloginfo('name');
}

// テーマパスを返す関数
function themepath(){
  echo get_stylesheet_directory_uri();
}

// META:Descriptionを取得する
function get_description(){
  $content_meta = get_option('content_meta');
  $post_type = get_query_var( 'post_type' );
  if(is_tax()){
    global $wp_query;
    $taxonomy = key($wp_query->query);
    $this_term = get_term_by('slug',get_query_var($taxonomy),$taxonomy );
    $term_meta = get_option('cat_'.intval($this_term->term_id));
  }
  if(is_page() || is_single() ){
    if(function_exists("the_field")) the_field('post_description');
  }elseif($post_type && !is_tax()){
    echo $content_meta['desc'][$post_type];
  }elseif(is_tax() || is_category()){
    if(function_exists("the_field")) the_field('post_description');
  }else{
    echo get_option( 'default_description' );
  }
}

// META:Keywordsを取得する
function get_keywords(){
  $content_meta = get_option('content_meta');
  $post_type = get_query_var( 'post_type' );
  if(is_tax()){
    global $wp_query;
    $taxonomy = key($wp_query->query);
    $this_term = get_term_by('slug',get_query_var($taxonomy),$taxonomy );
    $term_meta = get_option('cat_'.intval($this_term->term_id));
  }
  if(is_page() || is_single() ){
    if(function_exists("the_field")) the_field('post_keywords');
  }elseif($post_type && !is_tax()){
    echo $content_meta['keyw'][$post_type];
  }elseif(is_tax() || is_category()){
    if(function_exists("the_field")) the_field('post_keywords');
  }else{
    echo get_option( 'default_keywords' );
  }
}

//RSSセット
function custom_post_rss_set($query) {
    $posttype_name_list = get_post_types(array('_builtin'=>false,'public'=>true));
    $custom_type_list = array_keys($posttype_name_list);
    if(is_feed()){
      $query->set('post_type',$custom_type_list);
      return $query;
    }
}



if ( ! function_exists( 'mp_posted_on' ) ) :
/**
 * Prints HTML with meta information for the current post-date/time and author.
 */
function mp_posted_on() {
	$time_string = '<time class="entry-date published updated" datetime="%1$s">%2$s</time>';
	if ( get_the_time( 'U' ) !== get_the_modified_time( 'U' ) ) {
		$time_string = '<time class="entry-date published" datetime="%1$s">%2$s</time><time class="updated" datetime="%3$s">%4$s</time>';
	}

	$time_string = sprintf( $time_string,
		esc_attr( get_the_date( 'c' ) ),
		esc_html( get_the_date() ),
		esc_attr( get_the_modified_date( 'c' ) ),
		esc_html( get_the_modified_date() )
	);

	$posted_on = sprintf(
		esc_html_x( 'Posted on %s', 'post date', 'mp' ),
		'<a href="' . esc_url( get_permalink() ) . '" rel="bookmark">' . $time_string . '</a>'
	);

	$byline = sprintf(
		esc_html_x( 'by %s', 'post author', 'mp' ),
		'<span class="author vcard"><a class="url fn n" href="' . esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ) . '">' . esc_html( get_the_author() ) . '</a></span>'
	);

	echo '<span class="posted-on">' . $posted_on . '</span><span class="byline"> ' . $byline . '</span>'; // WPCS: XSS OK.

}
endif;

if ( ! function_exists( 'mp_entry_footer' ) ) :
/**
 * Prints HTML with meta information for the categories, tags and comments.
 */
function mp_entry_footer() {
	// Hide category and tag text for pages.
	if ( 'post' === get_post_type() ) {
		/* translators: used between list items, there is a space after the comma */
		$categories_list = get_the_category_list( esc_html__( ', ', 'mp' ) );
		if ( $categories_list && mp_categorized_blog() ) {
			printf( '<span class="cat-links">' . esc_html__( 'Posted in %1$s', 'mp' ) . '</span>', $categories_list ); // WPCS: XSS OK.
		}

		/* translators: used between list items, there is a space after the comma */
		$tags_list = get_the_tag_list( '', esc_html__( ', ', 'mp' ) );
		if ( $tags_list ) {
			printf( '<span class="tags-links">' . esc_html__( 'Tagged %1$s', 'mp' ) . '</span>', $tags_list ); // WPCS: XSS OK.
		}
	}

	if ( ! is_single() && ! post_password_required() && ( comments_open() || get_comments_number() ) ) {
		echo '<span class="comments-link">';
		comments_popup_link( esc_html__( 'Leave a comment', 'mp' ), esc_html__( '1 Comment', 'mp' ), esc_html__( '% Comments', 'mp' ) );
		echo '</span>';
	}

	edit_post_link(
		sprintf(
			/* translators: %s: Name of current post */
			esc_html__( 'Edit %s', 'mp' ),
			the_title( '<span class="screen-reader-text">"', '"</span>', false )
		),
		'<span class="edit-link">',
		'</span>'
	);
}
endif;

/**
 * Returns true if a blog has more than 1 category.
 *
 * @return bool
 */
function mp_categorized_blog() {
	if ( false === ( $all_the_cool_cats = get_transient( 'mp_categories' ) ) ) {
		// Create an array of all the categories that are attached to posts.
		$all_the_cool_cats = get_categories( array(
			'fields'     => 'ids',
			'hide_empty' => 1,
			// We only need to know if there is more than one category.
			'number'     => 2,
		) );

		// Count the number of categories that are attached to the posts.
		$all_the_cool_cats = count( $all_the_cool_cats );

		set_transient( 'mp_categories', $all_the_cool_cats );
	}

	if ( $all_the_cool_cats > 1 ) {
		// This blog has more than 1 category so mp_categorized_blog should return true.
		return true;
	} else {
		// This blog has only 1 category so mp_categorized_blog should return false.
		return false;
	}
}

/**
 * Flush out the transients used in mp_categorized_blog.
 */
function mp_category_transient_flusher() {
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	// Like, beat it. Dig?
	delete_transient( 'mp_categories' );
}
add_action( 'edit_category', 'mp_category_transient_flusher' );
add_action( 'save_post',     'mp_category_transient_flusher' );
