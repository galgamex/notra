export const zh = {
	actions_files: {
		upload_error: '上传文件失败！',
		no_file_uploaded: '未上传文件',
		size_error: '文件大小不能超过5MB',
		type_error: '文件类型应为JPEG、PNG或SVG'
	},
	app_auth_login_page: {
		metadata_title: '登录',
		card_title: '登录',
		card_description: '首次登录会自动创建账户',
		username_label: '用户名',
		password_label: '密码',
		login_button: '登录',
		username_required: '请输入用户名',
		password_min_length: '请输入至少6个字符的密码',
		login_error: '登录失败！',
		no_account: '还没有账户？',
		register_link: '立即注册',
		forgot_password: '忘记密码？'
	},
	app_auth_register_page: {
		metadata_title: '注册',
		card_title: '注册账户',
		card_description: '创建您的新账户',
		username_label: '用户名',
		email_label: '邮箱（可选）',
		password_label: '密码',
		confirm_password_label: '确认密码',
		register_button: '注册',
		username_required: '请输入用户名',
		email_invalid: '请输入有效的邮箱地址',
		password_min_length: '请输入至少6个字符的密码',
		password_mismatch: '两次输入的密码不一致',
		register_success: '注册成功！请登录',
		register_error: '注册失败！',
		have_account: '已有账户？',
		login_link: '立即登录'
	},
	app_auth_forgot_password_page: {
		metadata_title: '忘记密码',
		card_title: '重置密码',
		card_description: '输入您的邮箱地址，我们将发送重置链接',
		email_label: '邮箱地址',
		send_button: '发送重置链接',
		email_required: '请输入邮箱地址',
		email_invalid: '请输入有效的邮箱地址',
		send_success: '重置链接已发送到您的邮箱',
		send_error: '发送失败！',
		back_to_login: '返回登录'
	},
	app_api_common: {
		unauthorized: '未登录'
	},
	app_dashboard_page: {
		metadata_title: '工作台',
		welcome: '欢迎使用 Notra',
		dashboard_description: '这是您的个人工作台，您可以在这里管理您的内容和设置。'
	},
	app_dashboard_sidebar: {
		home: '首页',
		blog_management: '文章管理',
		posts: '文章列表',
		categories: '分类列表',
		tags: '标签列表',
		settings: '更多设置'
	},
	app_dashboard_account_avatar: {
		settings: '设置',
		language: '语言',
		theme_label: '主题',
		light: '浅色',
		dark: '深色',
		system: '跟随系统',
		log_out: '退出登录'
	},
	app_dashboard_settings_page: {
		metadata_title: '设置',
		title: '站点设置',
		site_info: '站点信息',
		label_logo: '站点 Logo',
		label_dark_logo: '深色模式 Logo (可选)',
		label_site_title: '站点标题',
		label_site_description: '站点描述',
		description_placeholder: '网站的简短描述',
		label_keywords: '关键词',
		keywords_placeholder: 'notra, 博客, 网站',
		label_copyright: '版权信息',
		copyright_placeholder: '版权所有 © 2024-2025 Notra',
		button_update_info: '更新信息',
		button_update_analytics: '更新分析配置',
		edit_logo: '编辑 Logo',
		edit_dark_logo: '编辑深色模式 Logo',
		update_success: '更新成功！',
		update_error: '更新失败！',
		site_analytics: '站点分析',
		label_google_analytics_id: '谷歌分析 ID'
	},
	app_dashboard_settings_sidebar: {
		back: '返回',
		account: '账户',
		profile: '个人信息',
		preferences: '偏好设置',
		site: '站点',
		site_settings: '站点设置'
	},
	components_notra_footer: {
		powered_by:
			'本网站由 <a href="https://notra.tech" target="_blank" rel="noopener noreferrer" class="font-bold hover:text-primary">Notra</a> 提供技术支持'
	},
	components_navbar_auth: {
		login: '登录',
		user: '用户',
		admin_panel: '管理后台',
		settings: '设置',
		log_out: '退出登录'
	},
	components_image_cropper: {
		re_select: '重新选择',
		cancel: '取消',
		crop: '裁剪',
		max_size: '图片尺寸不能超过 {size}MB'
	},
	services_user: {
		get_user_error: '获取用户失败！',
		create_user_error: '创建用户失败！',
		login_error: '登录失败！',
		username_exists: '用户名已存在！',
		email_exists: '邮箱已被注册！',
		email_not_found: '邮箱不存在！',
		reset_email_sent: '重置邮件已发送！',
		reset_email_error: '发送重置邮件失败！',
		invalid_token: '无效的验证令牌！',
		email_verified: '邮箱验证成功！',
		verify_email_error: '邮箱验证失败！'
	},
	services_image: {
		upload_error: '图片上传失败！'
	},
	services_site_settings: {
		get_site_settings_error: '获取站点设置失败！',
		update_site_settings_error: '更新站点设置失败！'
	}
};
