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
<<<<<<< HEAD
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
=======
		login_error: '登录失败！'
>>>>>>> f2962736316efd5726c61050eac23356daea6ebd
	},
	app_api_common: {
		unauthorized: '未登录'
	},
	app_dashboard_page: {
		metadata_title: '工作台',
<<<<<<< HEAD
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
=======
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
>>>>>>> f2962736316efd5726c61050eac23356daea6ebd
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
<<<<<<< HEAD
=======
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
>>>>>>> f2962736316efd5726c61050eac23356daea6ebd
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
<<<<<<< HEAD
	components_navbar_auth: {
		login: '登录',
		user: '用户',
		admin_panel: '管理后台',
		settings: '设置',
		log_out: '退出登录'
	},
=======
>>>>>>> f2962736316efd5726c61050eac23356daea6ebd
	components_image_cropper: {
		re_select: '重新选择',
		cancel: '取消',
		crop: '裁剪',
		max_size: '图片尺寸不能超过 {size}MB'
	},
<<<<<<< HEAD
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
=======
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
>>>>>>> f2962736316efd5726c61050eac23356daea6ebd
	},
	services_image: {
		upload_error: '图片上传失败！'
	},
	services_site_settings: {
		get_site_settings_error: '获取站点设置失败！',
		update_site_settings_error: '更新站点设置失败！'
<<<<<<< HEAD
=======
	},
	notra_editor: {
		placeholder_paragraph: '输入 / 以使用命令',
		placeholder_heading_1: '无标题',
		fixed_toolbar_redo: '重做',
		fixed_toolbar_undo: '撤销',
		fixed_toolbar_bold: '加粗',
		fixed_toolbar_italic: '斜体',
		fixed_toolbar_underline: '下划线',
		fixed_toolbar_strikethrough: '删除线',
		fixed_toolbar_code_inline: '行内代码',
		fixed_toolbar_decimal: '数字 (1, 2, 3)',
		fixed_toolbar_lower_alpha: '小写字母 (a, b, c)',
		fixed_toolbar_upper_alpha: '大写字母 (A, B, C)',
		fixed_toolbar_lower_roman: '小写罗马 (i, ii, iii)',
		fixed_toolbar_upper_roman: '大写罗马 (I, II, III)',
		fixed_toolbar_default: '默认',
		fixed_toolbar_circle: '圆圈',
		fixed_toolbar_square: '方块',
		fixed_toolbar_todo: '待办',
		fixed_toolbar_toggle: '折叠',
		fixed_toolbar_align: '对齐',
		fixed_toolbar_outdent: '减少缩进',
		fixed_toolbar_indent: '增加缩进',
		fixed_toolbar_line_height: '行高',
		fixed_toolbar_more_text_styles: '更多文本样式',
		fixed_toolbar_keyboard_input: '键盘输入',
		fixed_toolbar_superscript: '上标',
		fixed_toolbar_subscript: '下标',
		fixed_toolbar_turn_into: '转换为',
		fixed_toolbar_text: '文本',
		fixed_toolbar_heading_1: '一级标题',
		fixed_toolbar_heading_2: '二级标题',
		fixed_toolbar_heading_3: '三级标题',
		fixed_toolbar_heading_4: '四级标题',
		fixed_toolbar_heading_5: '五级标题',
		fixed_toolbar_heading_6: '六级标题',
		fixed_toolbar_bulleted_list: '无序列表',
		fixed_toolbar_numbered_list: '有序列表',
		fixed_toolbar_todo_list: '待办列表',
		fixed_toolbar_toggle_list: '折叠列表',
		fixed_toolbar_code_block: '代码块',
		fixed_toolbar_quote: '引用',
		fixed_toolbar_3_columns: '分栏',
		fixed_toolbar_text_color: '文本颜色',
		fixed_toolbar_background_color: '背景颜色',
		fixed_toolbar_table: '表格',
		fixed_toolbar_cell: '单元格',
		fixed_toolbar_row: '行',
		fixed_toolbar_column: '列',
		fixed_toolbar_delete_table: '删除表格',
		fixed_toolbar_merge_cells: '合并单元格',
		fixed_toolbar_split_cell: '拆分单元格',
		fixed_toolbar_insert_row_before: '插入行前',
		fixed_toolbar_insert_row_after: '插入行后',
		fixed_toolbar_delete_row: '删除行',
		fixed_toolbar_insert_column_before: '插入列前',
		fixed_toolbar_insert_column_after: '插入列后',
		fixed_toolbar_delete_column: '删除列',
		fixed_toolbar_emoji: '表情',
		drag_to_move: '可拖拽',
		color_picker_custom_colors: '自定义颜色',
		color_picker_default_colors: '默认颜色',
		color_picker_clear: '清除',
		table_floating_toolbar_background_color: '背景颜色',
		table_floating_toolbar_merge_cells: '合并单元格',
		table_floating_toolbar_split_cell: '拆分单元格',
		table_floating_toolbar_cell_borders: '单元格边框',
		table_floating_toolbar_delete_table: '删除表格',
		table_floating_toolbar_insert_row_before: '向上插入行',
		table_floating_toolbar_insert_row_after: '向下插入行',
		table_floating_toolbar_delete_row: '删除行',
		table_floating_toolbar_insert_column_before: '向左插入列',
		table_floating_toolbar_insert_column_after: '向右插入列',
		table_floating_toolbar_delete_column: '删除列',
		table_floating_toolbar_top_border: '上边框',
		table_floating_toolbar_right_border: '右边框',
		table_floating_toolbar_bottom_border: '下边框',
		table_floating_toolbar_left_border: '左边框',
		table_floating_toolbar_no_border: '无边框',
		table_floating_toolbar_outside_borders: '外边框',
		slash_input_element_basic_blocks: '基础块',
		slash_input_element_text: '文本',
		slash_input_element_heading_1: '一级标题',
		slash_input_element_heading_2: '二级标题',
		slash_input_element_heading_3: '三级标题',
		slash_input_element_heading_4: '四级标题',
		slash_input_element_heading_5: '五级标题',
		slash_input_element_heading_6: '六级标题',
		slash_input_element_bulleted_list: '无序列表',
		slash_input_element_numbered_list: '有序列表',
		slash_input_element_todo_list: '待办列表',
		slash_input_element_toggle_list: '折叠块',
		slash_input_element_code_block: '代码块',
		slash_input_element_table: '表格',
		slash_input_element_quote: '引用',
		slash_input_element_callout: '提示',
		slash_input_element_advanced_blocks: '高级块',
		slash_input_element_table_of_contents: '目录',
		slash_input_element_3_columns: '分栏',
		slash_input_element_equation: '公式',
		slash_input_element_inline: '行内元素',
		slash_input_element_date: '日期',
		slash_input_element_inline_equation: '行内公式',
		auto_save_tip_saving: '保存中...',
		auto_save_tip_last_saved: '上次保存',
		auto_save_tip_saved: '已保存',
		untitled: '无标题'
>>>>>>> f2962736316efd5726c61050eac23356daea6ebd
	}
};
