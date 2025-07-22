<?php
class gpThemeSetting {
	function __construct(){
		add_action('admin_menu',array($this,'add_pages') );
	}
	function add_pages(){
		if ( version_compare( '3.8.*', get_bloginfo( 'version' ), '<=' ) ) {
			$icon = 'dashicons-welcome-widgets-menus';
		} else {
			$icon = '';
		}
		add_menu_page( 'テーマSEO設定', 'テーマ設定', 'level_7', 'theme-setting', array($this,'show_themeSetting'),$icon, 30 );
	}
	function show_themeSetting(){
		$posttype_name_list = get_post_types(array('_builtin'=>false,'public'=>true));
		global $wp_post_types;
		//$_POST['showtext_options'])があったら保存
		if ( isset($_POST['content_meta'])) {
			check_admin_referer('gpthemesetting');
			$opt = $_POST['content_meta'];
			update_option('content_meta', $opt);
			?><div class="updated fade"><p><strong><?php _e('Options saved.'); ?></strong></p></div><?php
		}
		?>
		<div class="wrap">
			<div id="icon-options-general" class="icon32"><br /></div><h2>テーマSEO設定</h2>
		<form action="" method="post">
		<?php
			wp_nonce_field('gpthemesetting');
			$opt = get_option('content_meta');
		?>
		<h3>コンテンツごとのキーワード・説明文設定(META : Keywords / Description)</h3>
		<?php foreach($posttype_name_list as $posttype):?>
		<table class="form-table">
			<tr valign="top">
				<th scope="row" rowspan="2"><label for="inputtext"><?php echo $wp_post_types[$posttype]->label?></label></th>
				<td>
					<strong>キーワード</strong><br>
					<input type="text" class="regular-text" name="content_meta[keyw][<?php echo $posttype;?>]" value="<?php  echo $opt['keyw'][$posttype] ?>"/>
				</td>
			</tr>
			<tr valign="top">
				<td>
					<strong>説明文</strong><br>
					<textarea name="content_meta[desc][<?php echo $posttype;?>]" rows="5" cols="70"><?php  echo $opt['desc'][$posttype] ?></textarea>
				</td>
			</tr>
		</table>
		<?php endforeach;?>
		<p class="submit"><input type="submit" name="Submit" class="button-primary" value="変更を保存" /></p>
		</form>
		<!-- /.wrap --></div>
		<?php
	}
}
$result = new gpThemeSetting;


if(function_exists("register_field_group"))
{
   register_field_group(array (
      'id' => 'acf_postseo',
      'title' => 'SEO管理',
      'fields' => array (
         array (
            'key' => 'field_desc',
            'label' => '説明文(META:Description)',
            'name' => 'post_description',
            'type' => 'textarea',
            'instructions' => 'この投稿の説明文(150文字程度)',
            'default_value' => '',
            'placeholder' => '',
            'maxlength' => '',
            'rows' => '',
            'formatting' => 'none',
         ),
         array (
            'key' => 'field_keyw',
            'label' => 'キーワード(META:Keywords)',
            'name' => 'post_keyword',
            'type' => 'text',
            'instructions' => 'この投稿のキーワード<br />(半角カンマ","で区切って入力してください 5キーワード程度)',
            'default_value' => '',
            'placeholder' => '',
            'prepend' => '',
            'append' => '',
            'formatting' => 'none',
            'maxlength' => '',
         ),
      ),
      'location' => array (
         array (
            array (
               'param' => 'post_type',
               'operator' => '!=',
               'value' => 'media',
               'order_no' => 0,
               'group_no' => 0,
            ),
         ),
        array (
          array (
            'param' => 'ef_taxonomy',
            'operator' => '==',
            'value' => 'all',
            'order_no' => 0,
            'group_no' => 1,
          ),
        ),
      ),
      'options' => array (
         'position' => 'normal',
         'layout' => 'meta_box',
         'hide_on_screen' => array (),
      ),
      'menu_order' => 10,
   ));
}
