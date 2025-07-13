import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUserRole() {
  try {
    console.log('检查用户角色...');
    
    // 获取所有用户
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    console.log('\n=== 用户列表 ===');
    users.forEach((user, index) => {
      console.log(`${index + 1}. 用户名: ${user.username}`);
      console.log(`   邮箱: ${user.email}`);
      console.log(`   角色: ${user.role}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   创建时间: ${user.createdAt}`);
      console.log('---');
    });
    
    // 检查是否有管理员用户
    const adminUsers = users.filter(user => user.role === 'ADMIN');

    console.log(`\n管理员用户数量: ${adminUsers.length}`);
    
    if (adminUsers.length === 0) {
      console.log('⚠️  没有找到管理员用户！');
      console.log('需要将某个用户的角色设置为 ADMIN 才能访问统计接口。');
    } else {
      console.log('✅ 找到管理员用户:');
      adminUsers.forEach(admin => {
        console.log(`   - ${admin.username} (${admin.email})`);
      });
    }
    
  } catch (error) {
    console.error('检查用户角色失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserRole();