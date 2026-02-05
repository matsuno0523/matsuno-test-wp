<?php
$content = get_the_content();
$categories = get_the_category();
$first_category = ! empty( $categories ) ? $categories[0] : null;
$thumbnail_url = has_post_thumbnail() 
    ? get_the_post_thumbnail_url( get_the_ID(), 'large' ) 
    : '/assets/img/noimage.jpg';
?>

<li>
    <a href="<?php the_permalink(); ?>" id="post-<?php the_ID(); ?>" <?php post_class('sample_class'); ?>>
        <figure>
            <img src="<?php echo esc_url($thumbnail_url); ?>" alt="<?php echo esc_attr(get_the_title()); ?>" width="1024" height="683" loading="lazy">
        </figure>
        <div class="topics_wrap_item">
            <?php if ( $first_category ) : ?>
                <p class="category_name">【<?php echo esc_html( $first_category->name ); ?>】</p>
            <?php endif; ?>
            <div class="topics_wrap_item_ttl"><?php the_title(); ?></div>
            <p class="date"><?php the_time( get_option( 'date_format' ) ); ?></p>
        </div>
    </a>
</li>
