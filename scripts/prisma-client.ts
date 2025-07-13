// 用于脚本的 Prisma 客户端，不依赖 server-only
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
