 import { PrismaClient } from '@prisma/client';
 import { genSaltSync, hashSync } from 'bcrypt-ts';

const prisma = new PrismaClient();

async function initAdminUser() {
  try {
    console.log('正在初始化管理员用户...');
    
    // 检查是否已有用户
    const userCount = await prisma.user.count();
    
    if (userCount > 0) {
      console.log('✓ 用户已存在，无需初始化');

      return;
    }
    
    // 创建默认管理员用户
    const salt = genSaltSync(10);
    const hashedPassword = hashSync('admin123', salt);
    
    const adminUser = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
        name: '管理员'
      }
    });
    
    console.log('✓ 管理员用户创建成功！');
    console.log('用户名: admin');
    console.log('密码: admin123');
    console.log('用户ID:', adminUser.id);
    console.log('\n请登录后立即修改密码！');
    
  } catch (error) {
    console.error('❌ 创建管理员用户失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initAdminUser();