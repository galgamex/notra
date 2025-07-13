import 'server-only';
import nodemailer from 'nodemailer';

import { logger } from './logger';

// 创建SMTP传输器
const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: parseInt(process.env.SMTP_PORT || '587'),
	secure: false, // 使用STARTTLS
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASSWORD
	},
	tls: {
		rejectUnauthorized: false // 在开发环境中可能需要
	}
});

// 验证SMTP连接
export const verifyEmailConnection = async () => {
	try {
		await transporter.verify();
		logger('Email', 'SMTP连接验证成功');

		return true;
	} catch (error) {
		logger('Email', `SMTP连接验证失败: ${error}`);

		return false;
	}
};

// 发送邮件的通用函数
export const sendEmail = async (options: {
	to: string;
	subject: string;
	html: string;
	text?: string;
}) => {
	try {
		const mailOptions = {
			from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
			to: options.to,
			subject: options.subject,
			html: options.html,
			text: options.text || options.html.replace(/<[^>]*>/g, '') // 如果没有提供text，从html中提取
		};

		const result = await transporter.sendMail(mailOptions);

		logger('Email', `邮件发送成功: ${result.messageId}`);

		return { success: true, messageId: result.messageId };
	} catch (error) {
		logger('Email', `邮件发送失败: ${error}`);

		return { success: false, error: error };
	}
};

// 发送验证邮件
export const sendVerificationEmail = async (email: string, token: string) => {
	const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/verify-email?token=${token}`;

	const html = `
		<div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
			<h2 style="color: #333; text-align: center;">验证您的邮箱地址</h2>
			<p style="color: #666; line-height: 1.6;">
				感谢您注册 Notra！请点击下面的链接来验证您的邮箱地址：
			</p>
			<div style="text-align: center; margin: 30px 0;">
				<a href="${verificationUrl}" 
				   style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
					验证邮箱
				</a>
			</div>
			<p style="color: #999; font-size: 14px;">
				如果您无法点击按钮，请复制以下链接到浏览器中打开：<br>
				<a href="${verificationUrl}">${verificationUrl}</a>
			</p>
			<p style="color: #999; font-size: 14px;">
				此链接将在24小时后过期。如果您没有注册账户，请忽略此邮件。
			</p>
		</div>
	`;

	return await sendEmail({
		to: email,
		subject: '验证您的邮箱地址 - Notra',
		html
	});
};

// 发送密码重置邮件
export const sendPasswordResetEmail = async (email: string, token: string) => {
	const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`;

	const html = `
		<div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
			<h2 style="color: #333; text-align: center;">重置您的密码</h2>
			<p style="color: #666; line-height: 1.6;">
				我们收到了重置您账户密码的请求。请点击下面的链接来重置密码：
			</p>
			<div style="text-align: center; margin: 30px 0;">
				<a href="${resetUrl}" 
				   style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
					重置密码
				</a>
			</div>
			<p style="color: #999; font-size: 14px;">
				如果您无法点击按钮，请复制以下链接到浏览器中打开：<br>
				<a href="${resetUrl}">${resetUrl}</a>
			</p>
			<p style="color: #999; font-size: 14px;">
				此链接将在1小时后过期。如果您没有请求重置密码，请忽略此邮件。
			</p>
		</div>
	`;

	return await sendEmail({
		to: email,
		subject: '重置您的密码 - Notra',
		html
	});
};
