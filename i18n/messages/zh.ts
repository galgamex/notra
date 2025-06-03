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
		login_error: '登录失败！'
	},
	app_api_common: {
		unauthorized: '未登录',
		request_body_empty: '请求体为空'
	},
	app_dashboard_page: {
		metadata_title: '工作台',
		start: '开始',
		new_book: '新建知识库',
		new_book_description: '使用知识库整理知识',
		recent_edits: '最近编辑'
	},
	app_dashboard_sidebar: {
		home: '首页',
		books: '知识库',
		new_book: '新建知识库',
		create: '新建',
		name_placeholder: '知识库名称',
		create_success: '创建成功！',
		settings: '更多设置',
		copy_link: '复制链接',
		open_in_new_tab: '在新标签页打开',
		delete: '删除',
		delete_success: '删除成功！',
		delete_error: '删除失败！'
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
	app_dashboard_book_main_doc_page: {
		untitled: '无标题'
	},
	app_dashboard_book_main_layout: {
		home: '首页',
		default_catalog_node_name: '无标题',
		new_document: '文档',
		new_stack: '分组'
	},
	app_dashboard_book_management_sidebar: {
		book_management: '知识库管理',
		settings: '设置',
		book_info: '知识库信息'
	},
	app_dashboard_book_management_settings_page: {
		title: '知识库信息',
		label_name: '名称',
		name_required: '请输入知识库名称',
		label_slug: '路径',
		slug_required:
			'访问路径至少 2 个字符，只能输入小写字母、数字、横线、下划线和点',
		slug_description: '一个短小易记的 URL 地址有助于访问和传播',
		button_update_info: '更新信息',
		update_success: '更新成功！',
		update_error: '更新失败！'
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
	components_image_cropper: {
		re_select: '重新选择',
		cancel: '取消',
		crop: '裁剪',
		max_size: '图片尺寸不能超过 {size}MB'
	},
	services_account_settings: {
		get_account_error: '获取账户失败！',
		create_account_error: '创建账户失败！',
		login_error: '登录失败！'
	},
	services_book_service: {
		update_book_info_error: '更新知识库信息失败！',
		create_book_error: '创建知识库失败！',
		delete_book_error: '删除知识库失败！',
		get_books_error: '获取知识库失败！',
		get_book_error: '获取知识库失败！'
	},
	services_catalog_node_service: {
		get_catalog_nodes_error: '获取节点失败！',
		new_stack_default_name: '新分组',
		new_doc_default_name: '无标题文档',
		create_stack_error: '创建分组失败！',
		create_doc_error: '创建文档失败！',
		delete_with_children_error: '删除失败！',
		prepend_child_error: '添加子节点失败！',
		move_after_error: '移动失败！',
		update_title_error: '更新标题失败！'
	},
	services_doc_service: {
		get_recent_edits_error: '获取最近编辑失败！',
		get_doc_meta_error: '获取文档元数据失败！',
		update_doc_title_error: '更新文档标题失败！',
		get_doc_error: '获取文档失败！',
		update_doc_content_error: '更新文档内容失败！'
	},
	services_image: {
		upload_error: '图片上传失败！'
	},
	services_site_settings: {
		get_site_settings_error: '获取站点设置失败！',
		update_site_settings_error: '更新站点设置失败！'
	}
};
