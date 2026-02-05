<?php
/**
 * Category Archive Template: category.php
 */
get_header(); 

$paged = max( 1, get_query_var( 'paged' ) );

global $wp_query;
$total_posts = $wp_query->found_posts;

$posts_per_page = get_option( 'posts_per_page' );

$start_count = ( $posts_per_page * ( $paged - 1 ) ) + 1;
$end_count   = min( $start_count + $wp_query->post_count - 1, $total_posts );
?>

<h1 class="contents_ttl">
    <strong>News</strong>
    <span>お知らせ</span>
</h1>

<!-- カテ一覧 -->
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

<?php if ( have_posts() ) : ?>
    <!-- 記事一覧 -->
    <ul class="topics_contents topics_contents_block">
        <?php
        while ( have_posts() ) : the_post();
            get_template_part( 'template-parts/content/content', 'post-item' );
        endwhile;
        ?>
    </ul>

    <!-- ページネーション -->
    <div class="pagination-section">
        <p class="post-count-display">
            <?php 
            echo esc_html( "{$total_posts}件中{$start_count}-{$end_count}件表示" );
            ?>
        </p>
        <div class="pagination-section_page">
            <div class="pagination-section_page_wrap">
            <?php
            $big = 999999999;
            echo paginate_links( array(
                'base'    => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
                'format'  => '?paged=%#%',
                'current' => max( 1, $paged ),
                'total'   => $wp_query->max_num_pages,
                'prev_text' => 'Prev',
                'next_text' => 'Next'
            ) );
            ?>
            </div>
        </div>
    </div>

<?php else : ?>
    <p>このカテゴリーには投稿がありません。</p>
<?php endif; ?>

<?php get_footer(); ?>