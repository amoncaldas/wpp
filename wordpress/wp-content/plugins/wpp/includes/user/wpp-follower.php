<?php

/**
 * Class FamMail
 *
 * Description for class FamMail
 * WordPress options used: email_sender_name, email_sender_email, skip_email_sending_notification, deactivate_news_sending
 *
 * @author: Amon Caldas
*/


class WppFollower  {
	public static $default_language = "pt-br";

	// Defining follower values and keys
	public static $follower_post_type = "follower";
	public static $follower_initial_post_status = "pending";
	public static $follower_email = "email";
	public static $ip = "ip";
	public static $user_agent = "user_agent";
	public static $activated = "activated";
	public static $mail_list = "mail_list";	

	function __construct () {
		add_action('init', array($this, 'register_custom_types'), 10);
	}

	/**
	 * Register custom types section and lang
	 *
	 * @return void
	 */
	public function register_custom_types () {
		$follower_args = array (
			'name' => self::$follower_post_type,
			'label' => 'Followers',
			'singular_label' => 'Follower',
			"description"=> "Emails about to be sent to newsletter subscribers",
			'public' => false,
			'publicly_queryable' => false,
			'show_ui' => true,
			'show_in_nav_menus' => true,
			'show_in_rest' => false,
			'map_meta_cap' => true,
			'has_archive' => false,
			'exclude_from_search' => true,
			'capability_type' => array(self::$follower_post_type, self::$follower_post_type."s"),
			'hierarchical' => false,
			'rewrite' => true,
			'rewrite_withfront' => false,	
			'show_in_menu' => true,
			'supports' => 
			array (
				0 => 'title',
				3 => 'revisions',
			),
		);

		register_post_type(self::$follower_post_type , $follower_args );
	}

	/**
	 * Deactivate a follower from so that it stops receiving news letter
	 *
	 * @param Integer $follower_id
	 * @return String already_deactivated|deactivated|not_found
	 */
	static function deactivate_follower ($follower_id) {
		$follower = get_post($follower_id);

		if ($follower) {
			if ($follower->post_status === "trash") {
				return "already_deactivated";
			}
			wp_trash_post($follower_id);
			$message = "Name: ". $follower->post_title."<br/><br/>";
			$message .= "Email: ". get_post_meta($follower_id, self::$follower_email, true);
			WppMailer::notify_admin("Follower opt out", $message, self::$default_language);
			return "deactivated";
		}
		return "not_found";
	}

	/**
	 * Register or upate a subscriber to receive news letters
	 *
	 * @param String $name
	 * @param String $email
	 * @param String $mail_list
	 * @param String $lang
	 * @return String updated|already_exists|created
	 */
	static function register_follower ($name, $email, $mail_list, $lang) {
		// Check if the user is already a subscriber
		$args = (
			array(
				"post_type"=> self::$follower_post_type, 
				"post_status"=> array("publish", "pending"),
				'meta_query' => array(
					array(
						'key'=> self::$follower_email,
						'value'=> $email
					)
				)
			)
		);
		$existing_followers = get_posts($args);

		if (count($existing_followers) > 0) {
			$existing_follower = $existing_followers[0];
			if ($existing_follower->post_status === "publish") {
				update_post_meta($existing_follower->ID, self::$activated, 1);
				return "updated";
			} else {
				return "already_exists";
			}
		} else {
			$follower_id = wp_insert_post(
				array(
					"post_type"=> self::$follower_post_type, 
					"post_status"=> self::$follower_initial_post_status,
					"post_author"=> 1, // 1 is always the admin, the first user created
					"post_title"=> strip_tags($name), 
					"meta_input"=> array(
						self::$ip => get_request_ip(),
						self::$follower_email => strip_tags($email),
						self::$user_agent => $_SERVER['HTTP_USER_AGENT'],
						self::$activated => 0,
						self::$mail_list => $mail_list
					)
				)
			);
			$term = get_term_by('slug', $lang, LOCALE_TAXONOMY_SLUG);
			if ($term) {
				$term_arr = [$term->term_id];
				wp_set_post_terms($follower_id, $term_arr, LOCALE_TAXONOMY_SLUG);
			}
			return $follower_id;
		}
	}

	/**
		* Get follower id by email
		*
		* @param String $email
		* @return Integer $id
		*/
	static function get_follower_unsubscribe_link ($email, $follower_id = null) {
		if (!$follower_id) {
			// Check if the user is already a subscriber
			$args = (
				array(
					"post_type"=> self::$follower_post_type, 
					"post_status"=> array("publish", "pending"),
					'meta_query' => array(
						array(
							'key'=> self::$follower_email,
							'value'=> $email
						)
					)
				)
			);
			$existing_followers = get_posts($args);
			if (count($existing_followers) > 0) {
				$existing_follower = $existing_followers[0];
				$follower_id = $existing_follower->ID;
			}
		}

		$uri = "/unsubscribe/$follower_id/$email";		
		$router_mode = get_option("wpp_router_mode");
		if ($router_mode === "hash") {
			$uri = "/#$uri";
		}
		$unsubscribe_link = network_home_url($uri); 
		return $unsubscribe_link;		
	}
}
?>
