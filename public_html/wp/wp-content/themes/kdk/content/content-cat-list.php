<?php
$archive_url = get_post_type_archive_link('post');
if (!$archive_url) {
    $archive_url = home_url('/news/'); 
}

$is_all_active = is_front_page() || is_home();
if ( is_category() ) {
    $is_all_active = false;
}

?>
<div class="category-list">
    <ul>
        <li>
            <a href="<?php echo esc_url($archive_url); ?>" class="<?php echo $is_all_active ? 'active' : ''; ?>">ALL</a>
        </li>
        
        <?php
        $categories = get_categories( array(
            'orderby'    => 'name',
            'order'      => 'ASC',
            'hide_empty' => true,
            'taxonomy'   => 'category',
            'exclude'    => 1, 
        ) );

        if ( ! empty( $categories ) ) :
            foreach ( $categories as $category ) :
                $category_link = get_category_link( $category->term_id );
                $is_cat_active = is_category( $category->term_id );
        ?>
            <li>
                <a href="<?php echo esc_url( $category_link ); ?>" class="<?php echo $is_cat_active ? 'active' : ''; ?>">
                    <?php echo esc_html( $category->name ); ?>
                </a>
            </li>
        <?php
            endforeach;
        endif;
        ?>
    </ul>
</div>