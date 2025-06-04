export const en = {
	actions_files: {
		upload_error: 'Failed to upload file!',
		no_file_uploaded: 'No file uploaded',
		size_error: 'File size should be less than 5MB',
		type_error: 'File type should be JPEG, PNG, or SVG'
	},
	app_auth_login_page: {
		metadata_title: 'Login',
		card_title: 'Login to your account',
		card_description: 'An account will be created on first login.',
		username_label: 'Username',
		password_label: 'Password',
		login_button: 'Login',
		username_required: 'Username is required.',
		password_min_length: 'Password must be at least 6 characters.',
		login_error: 'Login failed!'
	},
	app_api_common: {
		unauthorized: 'Unauthorized'
	},
	app_dashboard_page: {
		metadata_title: 'Dashboard',
		start: 'Start',
		new_book: 'New Book',
		new_book_description: 'Structure your knowledge',
		recent_edits: 'Recent Edits'
	},
	app_dashboard_sidebar: {
		home: 'Home',
		books: 'Books',
		new_book: 'New Book',
		create: 'Create',
		name_placeholder: 'Name',
		create_success: 'Created successfully!',
		settings: 'Settings',
		copy_link: 'Copy Link',
		open_in_new_tab: 'Open in New Tab',
		delete: 'Delete',
		delete_success: 'Deleted successfully!',
		delete_error: 'Failed to delete!'
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
	app_dashboard_book_main_doc_page: {
		untitled: 'Untitled'
	},
	app_dashboard_book_main_layout: {
		home: 'Home',
		default_catalog_node_name: 'Untitled',
		new_document: 'Document',
		new_stack: 'Stack'
	},
	app_dashboard_book_management_sidebar: {
		book_management: 'Book Management',
		settings: 'Settings',
		book_info: 'Book Information'
	},
	app_dashboard_book_management_settings_page: {
		title: 'Book Information',
		label_name: 'Name',
		name_required: 'Please type the name of this book',
		label_slug: 'Slug',
		slug_required:
			'The custom path should contain at least two characters. Only letters, numbers, hyphen, underscore and dot are allowed.',
		slug_description: 'A short URL easy to access and spread',
		button_update_info: 'Update Info',
		update_success: 'Updated successfully!',
		update_error: 'Failed to update!'
	},
	app_dashboard_settings_page: {
		metadata_title: 'Settings',
		title: 'Site Settings',
		site_info: 'Site Info',
		label_logo: 'Logo',
		label_dark_logo: 'Dark Logo (Optional)',
		label_site_title: 'Site Title',
		label_site_description: 'Site Description',
		description_placeholder: 'A brief description of your website',
		label_keywords: 'Keywords',
		keywords_placeholder: 'notra, blog, website',
		button_update_info: 'Update Info',
		button_update_analytics: 'Update Analytics',
		edit_logo: 'Edit Logo',
		edit_dark_logo: 'Edit Dark Logo',
		update_success: 'Updated successfully!',
		update_error: 'Failed to update!',
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
		copyright: 'Copyright © {copyright}',
		powered_by:
			'Powered by <a href="https://notra.tech" target="_blank" rel="noopener noreferrer" class="font-bold hover:text-primary">Notra</a>'
	},
	components_image_cropper: {
		re_select: 'Re-select',
		cancel: 'Cancel',
		crop: 'Crop',
		max_size: 'Image size should be less than {size}MB'
	},
	services_account_settings: {
		get_account_error: 'Failed to get account!',
		create_account_error: 'Failed to create account!',
		login_error: 'Failed to login!'
	},
	services_book_service: {
		update_book_info_error: 'Failed to update book info!',
		create_book_error: 'Failed to create book!',
		delete_book_error: 'Failed to delete book!',
		get_books_error: 'Failed to get books!',
		get_book_error: 'Failed to get book!'
	},
	services_catalog_node_service: {
		get_catalog_nodes_error: 'Failed to get nodes!',
		new_stack_default_name: 'Stack',
		new_doc_default_name: 'Untitled Document',
		create_stack_error: 'Failed to create stack!',
		create_doc_error: 'Failed to create document!',
		delete_with_children_error: 'Failed to delete!',
		prepend_child_error: 'Failed to prepend child!',
		move_after_error: 'Failed to move after!',
		update_title_error: 'Failed to update title!'
	},
	services_doc_service: {
		get_recent_edits_error: 'Failed to get recent edits!',
		get_doc_meta_error: 'Failed to get document meta!',
		update_doc_title_error: 'Failed to update document title!',
		get_doc_error: 'Failed to get document!',
		update_doc_content_error: 'Failed to update document content!'
	},
	services_image: {
		upload_error: 'Failed to upload image!'
	},
	services_site_settings: {
		get_site_settings_error: 'Failed to get site settings!',
		update_site_settings_error: 'Failed to update site settings!'
	}
};
