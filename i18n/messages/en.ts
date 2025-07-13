export const en = {
	actions_files: {
		upload_error: 'Failed to upload file!',
		no_file_uploaded: 'No file uploaded',
		size_error: 'File size cannot exceed 5MB',
		type_error: 'File type should be JPEG, PNG or SVG'
	},
	app_auth_login_page: {
		metadata_title: 'Login',
		card_title: 'Login',
		card_description: 'First login will automatically create an account',
		username_label: 'Username',
		password_label: 'Password',
		login_button: 'Login',
		username_required: 'Please enter username',
		password_min_length: 'Please enter at least 6 characters password',
		login_error: 'Login failed!',
		no_account: "Don't have an account?",
		register_link: 'Sign up now',
		forgot_password: 'Forgot password?'
	},
	app_auth_register_page: {
		metadata_title: 'Register',
		card_title: 'Create Account',
		card_description: 'Create your new account',
		username_label: 'Username',
		email_label: 'Email (Optional)',
		password_label: 'Password',
		confirm_password_label: 'Confirm Password',
		register_button: 'Register',
		username_required: 'Please enter username',
		email_invalid: 'Please enter a valid email address',
		password_min_length: 'Please enter at least 6 characters password',
		password_mismatch: 'Passwords do not match',
		register_success: 'Registration successful! Please login',
		register_error: 'Registration failed!',
		have_account: 'Already have an account?',
		login_link: 'Sign in now'
	},
	app_auth_forgot_password_page: {
		metadata_title: 'Forgot Password',
		card_title: 'Reset Password',
		card_description:
			'Enter your email address and we will send you a reset link',
		email_label: 'Email Address',
		send_button: 'Send Reset Link',
		email_required: 'Please enter email address',
		email_invalid: 'Please enter a valid email address',
		send_success: 'Reset link has been sent to your email',
		send_error: 'Failed to send!',
		back_to_login: 'Back to login'
	},
	app_api_common: {
		unauthorized: 'Unauthorized'
	},
	app_dashboard_page: {
		metadata_title: 'Dashboard',
		welcome: 'Welcome to Notra',
		dashboard_description:
			'This is your personal dashboard where you can manage your content and settings.'
	},
	app_dashboard_sidebar: {
		home: 'Home',
		website_management: 'Website Management',
		websites: 'Websites',
		website_categories: 'Website Categories',
		website_tags: 'Website Tags',
		website_stats: 'Website Statistics',
		blog_management: 'Blog Management',
		posts: 'Posts',
		categories: 'Categories',
		tags: 'Tags',
		settings: 'More Settings'
	},
	app_dashboard_account_avatar: {
		settings: 'Settings',
		language: 'Language',
		theme_label: 'Theme',
		light: 'Light',
		dark: 'Dark',
		system: 'System',
		log_out: 'Log Out'
	},
	app_dashboard_settings_page: {
		metadata_title: 'Settings',
		title: 'Site Settings',
		site_info: 'Site Information',
		label_logo: 'Site Logo',
		label_dark_logo: 'Dark Mode Logo (Optional)',
		label_site_title: 'Site Title',
		label_site_description: 'Site Description',
		description_placeholder: 'A brief description of the website',
		label_keywords: 'Keywords',
		keywords_placeholder: 'notra, blog, website',
		label_copyright: 'Copyright',
		copyright_placeholder: 'Copyright © 2024-2025 Notra',
		button_update_info: 'Update Information',
		button_update_analytics: 'Update Analytics',
		edit_logo: 'Edit Logo',
		edit_dark_logo: 'Edit Dark Mode Logo',
		update_success: 'Update successful!',
		update_error: 'Update failed!',
		site_analytics: 'Site Analytics',
		label_google_analytics_id: 'Google Analytics ID'
	},
	app_dashboard_settings_sidebar: {
		back: 'Back',
		account: 'Account',
		profile: 'Profile',
		preferences: 'Preferences',
		site: 'Site',
		site_settings: 'Site Settings'
	},
	components_notra_footer: {
		powered_by:
			'Powered by <a href="https://notra.tech" target="_blank" rel="noopener noreferrer" class="font-bold hover:text-primary">Notra</a>'
	},
	components_navbar_auth: {
		login: 'Login',
		user: 'User',
		admin_panel: 'Admin Panel',
		settings: 'Settings',
		log_out: 'Log Out'
	},
	components_image_cropper: {
		re_select: 'Re-select',
		cancel: 'Cancel',
		crop: 'Crop',
		max_size: 'Image size cannot exceed {size}MB'
	},
	services_user: {
		get_user_error: 'Failed to get user!',
		create_user_error: 'Failed to create user!',
		login_error: 'Login failed!',
		username_exists: 'Username already exists!',
		email_exists: 'Email already registered!',
		email_not_found: 'Email not found!',
		reset_email_sent: 'Reset email sent!',
		reset_email_error: 'Failed to send reset email!',
		invalid_token: 'Invalid verification token!',
		email_verified: 'Email verified successfully!',
		verify_email_error: 'Email verification failed!'
	},
	services_image: {
		upload_error: 'Image upload failed!'
	},
	services_site_settings: {
		get_site_settings_error: 'Failed to get site settings!',
		update_site_settings_error: 'Failed to update site settings!'
	}
};
