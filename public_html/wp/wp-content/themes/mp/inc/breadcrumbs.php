<?php

/**
 * パンくずリストの配列を取得します。
 */
function get_breadcrumbs_items( $top, $exclude_categorys ) {
    global $wp_query;
    global $post;

    $breadcrumbs = array();

    if ( $top ) {
        $breadcrumbs[] = array( 'title' => $top, 'link' => home_url( '/' ) );
    }
    if ( is_category() ) {
        // カテゴリー
        $cat = get_queried_object();
        if ( $cat->parent != 0 ) {
            $ancestors = array_reverse( get_ancestors( $cat->cat_ID, 'category' ) );
            foreach ( $ancestors as $ancestor ) {
                if ( !in_array( $ancestor, $exclude_categorys ) ) {
                    $breadcrumbs[] = array( 'title' => get_cat_name( $ancestor ), 'link' => get_category_link( $ancestor ) );
                }
            }
        }
        $breadcrumbs[] = array( 'title' => $cat->cat_name, 'link' => false );
    } else if ( is_tag() ) {
        // タグ
        $tag_id = get_query_var( 'tag_id' );
        $tag_properties = get_tag( $tag_id );
        if ( $tag_properties ) {
            $breadcrumbs[] = array( 'title' => $tag_properties->name, 'link' => get_tag_link( $tag_id ) );
        } else {
            $breadcrumbs[] = array( 'title' => __( 'Tagname is empty' ), 'link' => false );
        }
    } elseif ( is_tax() ) {
        // タクソノミー
        $query_obj = get_queried_object();
        $post_types = get_taxonomy( $query_obj->taxonomy )->object_type;
        $cpt = $post_types[0];
        $breadcrumbs[] = array( 'title' => get_post_type_object( $cpt )->label, 'link' => get_post_type_archive_link( $cpt ) );
        $taxonomy = get_query_var( 'taxonomy' );
        $term = get_term_by( 'slug', get_query_var( 'term' ), $taxonomy );
        if ( is_taxonomy_hierarchical( $taxonomy ) && $term->parent != 0 ) {
            $ancestors = array_reverse( get_ancestors( $term->term_id, $taxonomy ) );
            foreach ( $ancestors as $ancestor_id ) {
                $ancestor = get_term( $ancestor_id, $taxonomy );
                $breadcrumbs[] = array( 'title' => $ancestor->name, 'link' => get_term_link( $ancestor, $term->slug ) );
            }
        }
        $breadcrumbs[] = array( 'title' => $term->name, 'link' => false );
    } elseif ( is_post_type_archive() ) {
        // カスタム投稿タイプのアーカイブ
        $cpt = get_query_var( 'post_type' );
        $breadcrumbs[] = array( 'title' => get_post_type_object( $cpt )->label, 'link' => false );
    } elseif ( is_archive() ) {
        // アーカイブ
        $breadcrumbs[] = array( 'title' => get_the_time( __( 'F, Y' ) ), 'link' => false );
    } elseif ( is_single() ) {
        // 投稿ページ
        $post_type = get_post_type( $post->ID );
        if ( $post_type == 'post' ) {
            $categories = get_the_category( $post->ID );
            $category = $categories[0];
            if ( $category -> parent != 0 ) {
                $ancestors = array_reverse(get_ancestors( $category -> cat_ID, 'category' ));
                foreach($ancestors as $ancestor){
                    $breadcrumbs[] = array( 'title' => get_cat_name($ancestor), 'link' => get_category_link($ancestor) );
                }
            }
        } else {
            // カスタム投稿タイプ
            $post_type_object = get_post_type_object( $post->post_type );
            if ( $post_type_object->has_archive !== false ) {
                $breadcrumbs[] = array( 'title' => $post_type_object->labels->name, 'link' => get_post_type_archive_link( get_post_type() ) );
            }
        }
        $strtitle = the_title( '', '', false );
        if ( !isset( $strtitle ) || $strtitle == '' )
            $strtitle = $post->ID;
        $breadcrumbs[] = array( 'title' => $strtitle, 'link' => false );
    } elseif ( is_page() && !is_front_page() ) {
        // 固定ページ
        $post = $wp_query->get_queried_object();
        if ( $post->post_parent == 0 ) {
            $breadcrumbs[] = array( 'title' => get_the_title( '', '', true ), 'link' => false );
        } else {
            $ancestors = array_reverse( get_post_ancestors( $post->ID ) );
            array_push( $ancestors, $post->ID );
            foreach ( $ancestors as $ancestor ) {
                $strtitle = get_the_title( $ancestor );
                if ( !isset( $strtitle ) || $strtitle == '' ) {
                    $strtitle = $post->ID;
                }
                if ( $ancestor != end( $ancestors ) ) {
                    $breadcrumbs[] = array( 'title' => strip_tags( apply_filters( 'single_post_title', $strtitle ) ), 'link' => get_permalink( $ancestor ) );
                } else {
                    $breadcrumbs[] = array( 'title' => strip_tags( apply_filters( 'single_post_title', $strtitle ) ), 'link' => false );
                }
            }
        }
    } elseif ( is_search() ) {
        // 検索結果
        $breadcrumbs[] = array( 'title' => __( 'Search Results' ), 'link' => false );
    } elseif ( is_404() ) {
        // 404
        $breadcrumbs[] = array( 'title' => __( '404' ), 'link' => false );
    } else {
        // その他
        if( wp_title( '', false ) != "" ){
            $breadcrumbs[] = array( 'title' => wp_title( '', false ), 'link' => false );
        }
    }

    $breadcrumbs = apply_filters( 'make_breadcrumbs', $breadcrumbs);

    return $breadcrumbs;
}

/**
 * パンくずリストを取得します。
 */
function get_breadcrumbs( $args = array() ) {
    $defaults = array(
        'before' => '<nav role="navigation">',
        'after' => '</nav>',
        'top' => 'TOP',
        'exclude_categorys' => array(),
        'makeBreadcrumbs' => array()
    );
    $args = wp_parse_args( $args, $defaults );

    if( empty($args['makeBreadcrumbs']) ){
        $items = get_breadcrumbs_items( $args['top'], $args['exclude_categorys'] );
    }else{
        $items = $args['makeBreadcrumbs'];
    }

    $html = $args['before'];
    $html .= '<ul class="p-breadcrumbs__list">';
    foreach ( $items as $item ) {
        if ( $item['link'] ) {
            $html .= '<li itemtype="http://data-vocabulary.org/Breadcrumb" itemscope="" class="p-breadcrumbs__item"><a href="' . $item['link'] . '" itemprop="url" class="p-breadcrumbs__link"><span itemprop="title">' . $item['title'] . '</span></a></li>';
        } else {
            $html .= '<li itemtype="http://data-vocabulary.org/Breadcrumb" itemscope="" class="p-breadcrumbs__item"><span itemprop="title">' . $item['title'] . '</span></li>';
        }
    }
    $html .= '</ul>';
    $html .= $args['after'] . "\n";
    return $html;
}

/**
 * パンくずリストを表示します。
 */
function breadcrumbs( $args= array() ) {
    echo get_breadcrumbs( $args );
}
