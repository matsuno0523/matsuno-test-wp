<?php
/**
 * Displays the site header.
 *
 * @package WordPress
 * @subpackage Twenty_Twenty_One
 * @since Twenty Twenty-One 1.0
 */
?>

<header>
  <div class="header-inner">
    <?php if( is_front_page() ) : ?>
      <h1 class="header-logo">
        <a href="/">
          <img src="/assets/img/logo@2x.png" alt="<?php bloginfo('name'); ?>">
        </a>
      </h1>
    <?php else : ?>
      <p class="header-logo">
        <a href="/">
          <img src="/assets/img/logo@2x.png" alt="<?php bloginfo('name'); ?>">
        </a>
      </p>
    <?php endif; ?>

    <button id="hamburger-btn" class="hamburger-icon" aria-label="メニューを開く">
      <span></span><span></span><span></span>
    </button>

    <?php
    wp_nav_menu( array(
      'theme_location' => 'header-gnav',
      'container' => 'nav',
      'container_id' => 'nav_wrap',
      'container_class'=> 'nav_wrap_item',
      'fallback_cb' => false, 
    ) );
    ?>
  </div>    
</header>
