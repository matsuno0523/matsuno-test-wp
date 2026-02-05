<?php
/**
 * Template Name: Blog/News Index
 */
get_header(); 

$paged = max( 1, get_query_var( 'paged' ), get_query_var( 'page' ) );
$args = array(
    'post_type'      => 'post',
    'posts_per_page' => get_option( 'posts_per_page' ),
    'paged'          => $paged,
);
$the_query = new WP_Query( $args );

$total_posts = $the_query->found_posts;
$posts_per_page = $the_query->query_vars['posts_per_page'];
$start_count = ( $posts_per_page * ( $paged - 1 ) ) + 1;
$end_count = min( $start_count + $the_query->post_count - 1, $total_posts );
?>

<h1 class="contents_ttl">
    <strong>News</strong>
    <span>お知らせ</span>
</h1>

<!-- カテゴリー一覧 -->
<?php get_template_part( 'template-parts/content/content', 'cat-list' ); ?>

<!-- パンくず -->
<nav class="breadcrumbs">
    <ul>
        <li>
            <a href="<?php echo esc_url(home_url('/')); ?>">TOP</a>
        </li>
        <li>
            <a href="/news/">お知らせ</a>
        </li>
        <?php if ( is_category() ) : ?>
        <li>
            <span><?php single_cat_title(); ?></span>
        </li>
        <?php endif; ?>
    </ul>
</nav>

<?php if ( $the_query->have_posts() ) : ?>
    <!-- 記事一覧 -->
    <ul class="topics_contents topics_contents_block">
        <?php while ( $the_query->have_posts() ) : $the_query->the_post(); ?>
            <?php get_template_part( 'template-parts/content/content', 'post-item' ); ?>
        <?php endwhile; ?>
    </ul>

    <!-- ページネーション -->
    <div class="pagination-section">
        <p class="post-count-display">
            <?php echo esc_html( "{$total_posts}件中{$start_count}-{$end_count}件表示" ); ?>
        </p>
        <div class="pagination-section_page">
            <div class="pagination-section_page_wrap">
            <?php
            echo paginate_links( array(
                'base'      => str_replace( 999999999, '%#%', esc_url( get_pagenum_link( 999999999 ) ) ),
                'format'    => '?paged=%#%',
                'current'   => $paged,
                'total'     => $the_query->max_num_pages,
                'prev_text' => '<svg class="icon_arrow" width="13" height="9" viewBox="0 0 13 9" xmlns="http://www.w3.org/2000/svg"><g stroke-miterlimit="10"><path d="M7.398.368l4.419 4.058-4.419 4.058M11.818 4.426H0"/></g></svg>',
                'next_text' => '<svg class="icon_arrow" width="13" height="9" viewBox="0 0 13 9" xmlns="http://www.w3.org/2000/svg"><g stroke-miterlimit="10"><path d="M7.398.368l4.419 4.058-4.419 4.058M11.818 4.426H0"/></g></svg>'
            ) );
            ?>
            </div>
        </div>
    </div>
    <?php wp_reset_postdata(); ?>

<?php else : ?>
    <p>投稿がありません。</p>
<?php endif; ?>

<?php get_footer(); ?>