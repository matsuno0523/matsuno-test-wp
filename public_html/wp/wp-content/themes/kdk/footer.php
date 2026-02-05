<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package WordPress
 * @subpackage Twenty_Twenty_One
 * @since Twenty Twenty-One 1.0
 */

?>
			</main><!-- #main -->
		</div><!-- #primary -->
	</div><!-- #content -->


  <footer>
    <section class="contact" id="contact">
      <div class="contact_wrap">
        <h2 class="contents_ttl">
          <strong>Contact</strong>
          <span>お問い合わせ</span>
        </h2>
        <p class="text">
          クレーンでお困りの方は、お気軽にご連絡ください。<br>
          専門スタッフが丁寧にご対応いたします。
        </p>
        <a href="tel:0534382330" class="tel">053-438-2330</a>
        <p class="time">受付時間　平日9:00-17:00</p>
      </div>
      <picture>
        <source srcset="/assets/img/avif/contact_image@2x.avif" type=" image/avif">
        <img src="/assets/img/contact_image@2x.png" alt="お待ちしています">
      </picture>
    </section>
    <div class="fotter_wrap">
      <picture>
        <source srcset="/assets/img/avif/footer_logo@2x.avif" type="image/avif">
        <img src="/assets/img/footer_logo@2x.png" loading="lazy" alt="株式会社KDK">
      </picture>
      <p class="name">
        株式会社KDK
      </p>

      <p class="address">
        〒433-8116 静岡県浜松市中央区西丘町1013<br>
        TEL. 053-438-2330（代）
      </p>

      <small>Copyright ©KDK 2025</small>
    </div>
  </footer>
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
