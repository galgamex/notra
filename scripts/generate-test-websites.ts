import { PrismaClient, WebsiteStatus } from '@prisma/client';

const prisma = new PrismaClient();

// 首先创建缺失的分类
const additionalCategories = [
  {
    name: '新闻媒体',
    slug: 'news-media',
    description: '新闻媒体和资讯平台',
    icon: '📰',
    color: '#84CC16',
    sortOrder: 11
  },
  {
    name: '电商购物',
    slug: 'e-commerce',
    description: '电商平台和在线购物',
    icon: '🛒',
    color: '#F97316',
    sortOrder: 12
  },
  {
    name: '生产力工具',
    slug: 'productivity',
    description: '办公和生产力工具',
    icon: '⚡',
    color: '#8B5CF6',
    sortOrder: 13
  },
  {
    name: '金融服务',
    slug: 'finance',
    description: '金融和支付服务',
    icon: '💰',
    color: '#10B981',
    sortOrder: 14
  }
];

// 二级分类数据
const subCategories = [
  // 搜索引擎的二级分类
  { name: '通用搜索', slug: 'general-search', parentSlug: 'search-engines', description: '通用搜索引擎', sortOrder: 1 },
  { name: '专业搜索', slug: 'specialized-search', parentSlug: 'search-engines', description: '专业领域搜索', sortOrder: 2 },
  
  // 社交媒体的二级分类
  { name: '社交网络', slug: 'social-networks', parentSlug: 'social-media', description: '社交网络平台', sortOrder: 1 },
  { name: '即时通讯', slug: 'messaging', parentSlug: 'social-media', description: '即时通讯工具', sortOrder: 2 },
  
  // 开发工具的二级分类
  { name: '代码托管', slug: 'code-hosting', parentSlug: 'development-tools', description: '代码托管平台', sortOrder: 1 },
  { name: '开发环境', slug: 'dev-environment', parentSlug: 'development-tools', description: '开发环境工具', sortOrder: 2 },
  
  // 设计资源的二级分类
  { name: '设计工具', slug: 'design-tools', parentSlug: 'design-resources', description: '设计软件工具', sortOrder: 1 },
  { name: '素材资源', slug: 'design-assets', parentSlug: 'design-resources', description: '设计素材资源', sortOrder: 2 },
  
  // 学习教育的二级分类
  { name: '在线课程', slug: 'online-courses', parentSlug: 'education', description: '在线学习课程', sortOrder: 1 },
  { name: '编程学习', slug: 'programming-learning', parentSlug: 'education', description: '编程技能学习', sortOrder: 2 },
  
  // 娱乐休闲的二级分类
  { name: '视频平台', slug: 'video-platforms', parentSlug: 'entertainment', description: '视频娱乐平台', sortOrder: 1 },
  { name: '音乐平台', slug: 'music-platforms', parentSlug: 'entertainment', description: '音乐娱乐平台', sortOrder: 2 },
  
  // 新闻资讯的二级分类
  { name: '国际新闻', slug: 'international-news', parentSlug: 'news', description: '国际新闻媒体', sortOrder: 1 },
  { name: '科技资讯', slug: 'tech-news', parentSlug: 'news', description: '科技新闻资讯', sortOrder: 2 },
  
  // 购物电商的二级分类
  { name: '综合电商', slug: 'general-ecommerce', parentSlug: 'shopping', description: '综合电商平台', sortOrder: 1 },
  { name: '专业电商', slug: 'specialized-ecommerce', parentSlug: 'shopping', description: '专业电商平台', sortOrder: 2 },
  
  // 工具软件的二级分类
  { name: '在线工具', slug: 'online-tools', parentSlug: 'tools', description: '在线实用工具', sortOrder: 1 },
  { name: '系统工具', slug: 'system-tools', parentSlug: 'tools', description: '系统软件工具', sortOrder: 2 },
];

// 测试网站数据（100个网站）
const testWebsites = [
  // 搜索引擎分类 - 通用搜索
  { name: 'Google', url: 'https://www.google.com', description: '全球最大的搜索引擎', categorySlug: 'general-search' },
  { name: 'Bing', url: 'https://www.bing.com', description: '微软搜索引擎', categorySlug: 'general-search' },
  { name: 'DuckDuckGo', url: 'https://duckduckgo.com', description: '注重隐私的搜索引擎', categorySlug: 'general-search' },
  { name: 'Yandex', url: 'https://yandex.com', description: '俄罗斯搜索引擎', categorySlug: 'general-search' },
  { name: 'Baidu', url: 'https://www.baidu.com', description: '百度搜索引擎', categorySlug: 'general-search' },
  
  // 搜索引擎分类 - 专业搜索
  { name: 'GitHub Search', url: 'https://github.com/search', description: '代码搜索引擎', categorySlug: 'specialized-search' },
  { name: 'Stack Overflow', url: 'https://stackoverflow.com', description: '编程问答搜索', categorySlug: 'specialized-search' },
  { name: 'Wolfram Alpha', url: 'https://www.wolframalpha.com', description: '计算知识引擎', categorySlug: 'specialized-search' },
  { name: 'Shodan', url: 'https://www.shodan.io', description: '物联网设备搜索', categorySlug: 'specialized-search' },
  { name: 'TinEye', url: 'https://tineye.com', description: '反向图片搜索', categorySlug: 'specialized-search' },

  // 社交媒体分类 - 社交网络
  { name: 'Facebook', url: 'https://www.facebook.com', description: '全球最大的社交网络', categorySlug: 'social-networks' },
  { name: 'Twitter', url: 'https://twitter.com', description: '微博社交平台', categorySlug: 'social-networks' },
  { name: 'Instagram', url: 'https://www.instagram.com', description: '图片分享社交平台', categorySlug: 'social-networks' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com', description: '职业社交网络', categorySlug: 'social-networks' },
  { name: 'TikTok', url: 'https://www.tiktok.com', description: '短视频社交平台', categorySlug: 'social-networks' },
  
  // 社交媒体分类 - 即时通讯
  { name: 'WhatsApp', url: 'https://web.whatsapp.com', description: 'WhatsApp网页版', categorySlug: 'messaging' },
  { name: 'Telegram', url: 'https://web.telegram.org', description: 'Telegram网页版', categorySlug: 'messaging' },
  { name: 'Discord', url: 'https://discord.com', description: '游戏社交平台', categorySlug: 'messaging' },
  { name: 'Slack', url: 'https://slack.com', description: '团队沟通平台', categorySlug: 'messaging' },
  { name: 'Microsoft Teams', url: 'https://teams.microsoft.com', description: '微软团队协作', categorySlug: 'messaging' },

  // 开发工具分类 - 代码托管
  { name: 'GitHub', url: 'https://github.com', description: '全球最大代码托管平台', categorySlug: 'code-hosting' },
  { name: 'GitLab', url: 'https://gitlab.com', description: 'DevOps平台', categorySlug: 'code-hosting' },
  { name: 'Bitbucket', url: 'https://bitbucket.org', description: 'Atlassian代码托管', categorySlug: 'code-hosting' },
  { name: 'Gitee', url: 'https://gitee.com', description: '码云代码托管', categorySlug: 'code-hosting' },
  { name: 'SourceForge', url: 'https://sourceforge.net', description: '开源项目托管', categorySlug: 'code-hosting' },
  
  // 开发工具分类 - 开发环境
  { name: 'CodePen', url: 'https://codepen.io', description: '在线代码编辑器', categorySlug: 'dev-environment' },
  { name: 'JSFiddle', url: 'https://jsfiddle.net', description: 'JavaScript在线编辑', categorySlug: 'dev-environment' },
  { name: 'Replit', url: 'https://replit.com', description: '在线IDE平台', categorySlug: 'dev-environment' },
  { name: 'CodeSandbox', url: 'https://codesandbox.io', description: '在线开发环境', categorySlug: 'dev-environment' },
  { name: 'Glitch', url: 'https://glitch.com', description: '协作编程平台', categorySlug: 'dev-environment' },

  // 设计资源分类 - 设计工具
  { name: 'Figma', url: 'https://www.figma.com', description: '协作设计工具', categorySlug: 'design-tools' },
  { name: 'Sketch', url: 'https://www.sketch.com', description: 'UI设计工具', categorySlug: 'design-tools' },
  { name: 'Adobe XD', url: 'https://www.adobe.com/products/xd.html', description: 'Adobe用户体验设计', categorySlug: 'design-tools' },
  { name: 'Canva', url: 'https://www.canva.com', description: '在线设计平台', categorySlug: 'design-tools' },
  { name: 'Framer', url: 'https://www.framer.com', description: '交互设计工具', categorySlug: 'design-tools' },
  
  // 设计资源分类 - 素材资源
  { name: 'Unsplash', url: 'https://unsplash.com', description: '免费高质量图片', categorySlug: 'design-assets' },
  { name: 'Pexels', url: 'https://www.pexels.com', description: '免费图片和视频', categorySlug: 'design-assets' },
  { name: 'Dribbble', url: 'https://dribbble.com', description: '设计师作品展示', categorySlug: 'design-assets' },
  { name: 'Behance', url: 'https://www.behance.net', description: 'Adobe创意社区', categorySlug: 'design-assets' },
  { name: 'Iconfinder', url: 'https://www.iconfinder.com', description: '图标资源库', categorySlug: 'design-assets' },

  // 学习教育分类 - 在线课程
  { name: 'Coursera', url: 'https://www.coursera.org', description: '在线课程平台', categorySlug: 'online-courses' },
  { name: 'edX', url: 'https://www.edx.org', description: '免费在线课程', categorySlug: 'online-courses' },
  { name: 'Udemy', url: 'https://www.udemy.com', description: '技能学习平台', categorySlug: 'online-courses' },
  { name: 'Khan Academy', url: 'https://www.khanacademy.org', description: '免费教育资源', categorySlug: 'online-courses' },
  { name: '网易云课堂', url: 'https://study.163.com', description: '网易在线教育', categorySlug: 'online-courses' },
  
  // 学习教育分类 - 编程学习
  { name: 'LeetCode', url: 'https://leetcode.com', description: '算法练习平台', categorySlug: 'programming-learning' },
  { name: 'HackerRank', url: 'https://www.hackerrank.com', description: '编程挑战平台', categorySlug: 'programming-learning' },
  { name: 'Codecademy', url: 'https://www.codecademy.com', description: '交互式编程学习', categorySlug: 'programming-learning' },
  { name: 'FreeCodeCamp', url: 'https://www.freecodecamp.org', description: '免费编程训练营', categorySlug: 'programming-learning' },
  { name: 'MDN Web Docs', url: 'https://developer.mozilla.org', description: 'Web开发文档', categorySlug: 'programming-learning' },

  // 娱乐休闲分类 - 视频平台
  { name: 'YouTube', url: 'https://www.youtube.com', description: '视频分享平台', categorySlug: 'video-platforms' },
  { name: 'Netflix', url: 'https://www.netflix.com', description: '在线视频流媒体', categorySlug: 'video-platforms' },
  { name: 'Twitch', url: 'https://www.twitch.tv', description: '游戏直播平台', categorySlug: 'video-platforms' },
  { name: 'Bilibili', url: 'https://www.bilibili.com', description: 'B站视频平台', categorySlug: 'video-platforms' },
  { name: '爱奇艺', url: 'https://www.iqiyi.com', description: '在线视频平台', categorySlug: 'video-platforms' },
  
  // 娱乐休闲分类 - 音乐平台
  { name: 'Spotify', url: 'https://www.spotify.com', description: '音乐流媒体服务', categorySlug: 'music-platforms' },
  { name: 'Apple Music', url: 'https://music.apple.com', description: '苹果音乐服务', categorySlug: 'music-platforms' },
  { name: 'SoundCloud', url: 'https://soundcloud.com', description: '音频分享平台', categorySlug: 'music-platforms' },
  { name: '网易云音乐', url: 'https://music.163.com', description: '网易云音乐平台', categorySlug: 'music-platforms' },
  { name: 'QQ音乐', url: 'https://y.qq.com', description: 'QQ音乐平台', categorySlug: 'music-platforms' },

  // 新闻资讯分类 - 国际新闻
  { name: 'BBC', url: 'https://www.bbc.com', description: '英国广播公司', categorySlug: 'international-news' },
  { name: 'CNN', url: 'https://www.cnn.com', description: '美国有线电视新闻网', categorySlug: 'international-news' },
  { name: 'Reuters', url: 'https://www.reuters.com', description: '路透社新闻', categorySlug: 'international-news' },
  { name: 'The Guardian', url: 'https://www.theguardian.com', description: '英国卫报', categorySlug: 'international-news' },
  { name: 'New York Times', url: 'https://www.nytimes.com', description: '纽约时报', categorySlug: 'international-news' },
  
  // 新闻资讯分类 - 科技资讯
  { name: 'TechCrunch', url: 'https://techcrunch.com', description: '科技创业资讯', categorySlug: 'tech-news' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com', description: '技术新闻社区', categorySlug: 'tech-news' },
  { name: 'The Verge', url: 'https://www.theverge.com', description: '科技媒体平台', categorySlug: 'tech-news' },
  { name: '36氪', url: 'https://36kr.com', description: '科技媒体平台', categorySlug: 'tech-news' },
  { name: '虎嗅', url: 'https://www.huxiu.com', description: '商业资讯平台', categorySlug: 'tech-news' },

  // 购物电商分类 - 综合电商
  { name: 'Amazon', url: 'https://www.amazon.com', description: '全球最大电商平台', categorySlug: 'general-ecommerce' },
  { name: 'eBay', url: 'https://www.ebay.com', description: '在线拍卖和购物', categorySlug: 'general-ecommerce' },
  { name: 'Taobao', url: 'https://www.taobao.com', description: '淘宝购物平台', categorySlug: 'general-ecommerce' },
  { name: 'Tmall', url: 'https://www.tmall.com', description: '天猫商城', categorySlug: 'general-ecommerce' },
  { name: 'JD.com', url: 'https://www.jd.com', description: '京东商城', categorySlug: 'general-ecommerce' },
  
  // 购物电商分类 - 专业电商
  { name: 'Etsy', url: 'https://www.etsy.com', description: '手工艺品市场', categorySlug: 'specialized-ecommerce' },
  { name: 'Shopify', url: 'https://www.shopify.com', description: '电商建站平台', categorySlug: 'specialized-ecommerce' },
  { name: 'AliExpress', url: 'https://www.aliexpress.com', description: '全球速卖通', categorySlug: 'specialized-ecommerce' },
  { name: 'Wish', url: 'https://www.wish.com', description: '移动购物平台', categorySlug: 'specialized-ecommerce' },
  { name: 'Newegg', url: 'https://www.newegg.com', description: '电子产品电商', categorySlug: 'specialized-ecommerce' },

  // 工具软件分类 - 在线工具
  { name: 'Google Translate', url: 'https://translate.google.com', description: '谷歌翻译工具', categorySlug: 'online-tools' },
  { name: 'DeepL', url: 'https://www.deepl.com', description: 'AI翻译工具', categorySlug: 'online-tools' },
  { name: 'Grammarly', url: 'https://www.grammarly.com', description: '英语语法检查', categorySlug: 'online-tools' },
  { name: 'TinyPNG', url: 'https://tinypng.com', description: '图片压缩工具', categorySlug: 'online-tools' },
  { name: 'PDF24', url: 'https://tools.pdf24.org', description: 'PDF在线工具', categorySlug: 'online-tools' },
  
  // 工具软件分类 - 系统工具
  { name: 'WinRAR', url: 'https://www.win-rar.com', description: '压缩软件官网', categorySlug: 'system-tools' },
  { name: '7-Zip', url: 'https://www.7-zip.org', description: '免费压缩软件', categorySlug: 'system-tools' },
  { name: 'VLC Media Player', url: 'https://www.videolan.org', description: '多媒体播放器', categorySlug: 'system-tools' },
  { name: 'OBS Studio', url: 'https://obsproject.com', description: '直播录制软件', categorySlug: 'system-tools' },
  { name: 'Audacity', url: 'https://www.audacityteam.org', description: '音频编辑软件', categorySlug: 'system-tools' }
];

async function generateTestWebsites() {
  try {
    console.log('开始生成测试网站数据...');
    
    // 1. 创建缺失的一级分类
    console.log('\n1. 创建缺失的一级分类...');

    for (const category of additionalCategories) {
      await prisma.websiteCategory.upsert({
        where: { slug: category.slug },
        update: {},
        create: {
          ...category,
          level: 0,
          isVisible: true
        }
      });
      console.log(`创建/更新分类: ${category.name}`);
    }

    // 2. 创建二级分类
    console.log('\n2. 创建二级分类...');

    for (const subCategory of subCategories) {
      // 查找父分类
      const parentCategory = await prisma.websiteCategory.findUnique({
        where: { slug: subCategory.parentSlug }
      });

      if (!parentCategory) {
        console.log(`跳过二级分类 ${subCategory.name}，父分类 ${subCategory.parentSlug} 不存在`);
        continue;
      }

      await prisma.websiteCategory.upsert({
        where: { slug: subCategory.slug },
        update: {},
        create: {
          name: subCategory.name,
          slug: subCategory.slug,
          description: subCategory.description,
          parentId: parentCategory.id,
          level: 1,
          sortOrder: subCategory.sortOrder,
          isVisible: true,
          icon: '📁',
          color: parentCategory.color
        }
      });
      console.log(`创建/更新二级分类: ${subCategory.name}`);
    }
    
    // 3. 创建测试网站
    console.log('\n3. 创建测试网站...');
    let createdCount = 0;

    for (const website of testWebsites) {
      // 查找分类
      const category = await prisma.websiteCategory.findUnique({
        where: { slug: website.categorySlug }
      });

      if (!category) {
        console.log(`跳过网站 ${website.name}，分类 ${website.categorySlug} 不存在`);
        continue;
      }

      // 检查网站是否已存在
      const existingWebsite = await prisma.website.findFirst({
        where: {
          OR: [
            { name: website.name },
            { url: website.url }
          ]
        }
      });

      if (existingWebsite) {
        console.log(`网站 ${website.name} 已存在，跳过`);
        continue;
      }

      // 创建网站
      await prisma.website.create({
        data: {
          name: website.name,
          url: website.url,
          description: website.description,
          categoryId: category.id,
          status: WebsiteStatus.APPROVED, // 直接设为已审核
          clickCount: Math.floor(Math.random() * 1000), // 随机点击数
          isRecommend: Math.random() > 0.8, // 20% 概率推荐
          isFeatured: Math.random() > 0.9 // 10% 概率精选
        }
      });

      console.log(`创建网站: ${website.name}`);
      createdCount++;
    }

    console.log(`\n成功创建 ${createdCount} 个测试网站`);
    console.log(`总共包含 ${additionalCategories.length} 个新分类和 ${subCategories.length} 个二级分类`);
    
  } catch (error) {
    console.error('生成测试数据失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 运行脚本
if (require.main === module) {
  generateTestWebsites();
}

export { generateTestWebsites };