<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package WordPress
 * @subpackage Twenty_Twenty_One
 * @since Twenty Twenty-One 1.0
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<header class="entry-header">
		<div class="entry-meta">
			<?php
				$categories = get_the_category();
				if ( ! empty( $categories ) ) {
					$first_category = $categories[0];
					echo '<a href="' . esc_url( get_category_link( $first_category->term_id ) ) . '">' . esc_html( $first_category->name ) . '</a>';
				}
			?>
		</div>

		<?php the_title( '<h1>', '</h1>' ); ?>
		
		<?php $thumbnail_url = get_the_post_thumbnail_url( get_the_ID(), 'full' ); ?>
		<?php if ( ! empty( $thumbnail_url ) ) : ?>
		<figure>
			<img src="<?php echo esc_url($thumbnail_url); ?>" alt="<?php echo esc_attr(get_the_title()); ?>">
		</figure>
		<?php endif; ?>
		
	</header>

	<div class="entry-content">
		<?php the_content(); ?>
	</div><!-- .entry-content -->

</article><!-- #post-<?php the_ID(); ?> -->
