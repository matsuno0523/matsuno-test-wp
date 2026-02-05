<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package WordPress
 * @subpackage Twenty_Twenty_One
 * @since Twenty Twenty-One 1.0
 */

get_header();

/* Start the Loop */
while ( have_posts() ) :
	the_post();

	get_template_part( 'template-parts/content/content-single' );

	// ページナビゲーション
	echo '<div class="pagination-section_page_wrap">';
    if ( get_previous_post_link() ) :
        ?>
        <div class="nav-links previous">
            <?php 
            previous_post_link( 
                '%link', 
                '<p class="meta-nav"><svg class="icon_arrow" width="13" height="9" viewBox="0 0 13 9" xmlns="http://www.w3.org/2000/svg"><g stroke-miterlimit="10"><path d="M7.398.368l4.419 4.058-4.419 4.058M11.818 4.426H0"/></g></svg>' . esc_html__( 'Prev', 'twentytwentyone' ) . '</p>' 
            ); 
            ?>
        </div>
        <?php
    endif;
    ?>
    <div class="nav-links back">
        <a href="<?php echo esc_url( get_permalink( get_option( 'page_for_posts' ) ) ); ?>">
            <?php esc_html_e( '一覧へ戻る', 'twentytwentyone' ); ?>
        </a>
    </div>
    <?php
    if ( get_next_post_link() ) :
        ?>
        <div class="nav-links next">
            <?php 
            next_post_link( 
                '%link', 
                '<p class="meta-nav">' . esc_html__( 'Next', 'twentytwentyone' ) . '<svg class="icon_arrow" width="13" height="9" viewBox="0 0 13 9" xmlns="http://www.w3.org/2000/svg"><g stroke-miterlimit="10"><path d="M7.398.368l4.419 4.058-4.419 4.058M11.818 4.426H0"/></g></svg></p>' 
            ); 
            ?>
        </div>
        <?php
    endif;
	echo '</div>';	
endwhile;

get_footer();
