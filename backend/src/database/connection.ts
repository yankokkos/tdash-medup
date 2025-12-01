import { PrismaClient } from '@prisma/client';

// Criar Prisma Client com tratamento de erro
let prisma: PrismaClient;

try {
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
  
  // Testar conexão apenas se DATABASE_URL estiver definido
  if (process.env.DATABASE_URL) {
    // Não bloquear a inicialização se o banco não estiver disponível
    prisma.$connect().catch((error) => {
      console.warn('⚠️  Database connection warning (non-blocking):', error.message);
    });
  } else {
    console.warn('⚠️  DATABASE_URL not set. Database operations will fail until configured.');
  }
} catch (error: any) {
  console.error('❌ Error initializing Prisma Client:', error.message);
  // Criar uma instância mesmo com erro para não quebrar a aplicação
  prisma = new PrismaClient({
    log: ['error'],
  });
}

export default prisma;

