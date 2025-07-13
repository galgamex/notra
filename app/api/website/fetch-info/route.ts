import * as cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const { url } = await request.json();

		if (!url || !url.startsWith('http')) {
			return NextResponse.json(
				{ error: '请提供有效的URL' },
				{ status: 400 }
			);
		}

		// 获取网页内容
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000);
		
		const response = await fetch(url, {

			signal: controller.signal,
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
			}
		});
		
		clearTimeout(timeoutId);

		if (!response.ok) {

			return NextResponse.json(
				{ error: '无法访问该网站' },
				{ status: 400 }
			);
		}

		const html = await response.text();
		const $ = cheerio.load(html);

		// 提取网站信息
		const title = $('title').text().trim() || 
					  $('meta[property="og:title"]').attr('content') || 
					  $('meta[name="twitter:title"]').attr('content') || 
					  '';

		const description = $('meta[name="description"]').attr('content') || 
							$('meta[property="og:description"]').attr('content') || 
							$('meta[name="twitter:description"]').attr('content') || 
							'';

		// 获取favicon
		let favicon = '';
		const faviconSelectors = [
			'link[rel="icon"]',
			'link[rel="shortcut icon"]',
			'link[rel="apple-touch-icon"]'
		];

		for (const selector of faviconSelectors) {
			const href = $(selector).attr('href');

			if (href) {
				favicon = href.startsWith('http') ? href : new URL(href, url).href;
				break;
			}
		}

		// 如果没找到favicon，尝试默认路径
		if (!favicon) {
			try {
				const defaultFavicon = new URL('/favicon.ico', url).href;
				const faviconResponse = await fetch(defaultFavicon, { method: 'HEAD' });

				if (faviconResponse.ok) {
					favicon = defaultFavicon;
				}
			} catch {
				// 忽略错误
			}
		}

		// 获取logo
		let logo = '';
		const logoSelectors = [
			'meta[property="og:image"]',
			'meta[name="twitter:image"]',
			'link[rel="apple-touch-icon"]',
			'img[alt*="logo" i]',
			'img[class*="logo" i]',
			'img[id*="logo" i]'
		];

		for (const selector of logoSelectors) {
			const src = $(selector).attr('content') || $(selector).attr('href') || $(selector).attr('src');

			if (src) {
				logo = src.startsWith('http') ? src : new URL(src, url).href;
				break;
			}
		}

		return NextResponse.json({

			title: title.substring(0, 100), // 限制长度
			description: description.substring(0, 500), // 限制长度
			favicon,
			logo
		});

	} catch (error) {

		console.error('Failed to fetch website info:', error);

		return NextResponse.json(
			{ error: '获取网站信息失败' },
			{ status: 500 }
		);
	}
}