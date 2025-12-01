import dotenv from 'dotenv';
import prisma from '../database/connection';

dotenv.config();

async function main() {
  console.log('📅 Populando meses iniciais...');

  const meses = [
    { ano: 2025, mes: 11, nome: 'novembro_2025', nomeExibicao: 'Novembro 2025' },
    { ano: 2025, mes: 12, nome: 'dezembro_2025', nomeExibicao: 'Dezembro 2025' },
  ];

  for (const mesData of meses) {
    const mes = await prisma.mes.upsert({
      where: { nome: mesData.nome },
      update: { nomeExibicao: mesData.nomeExibicao, ativo: true },
      create: {
        ...mesData,
        ativo: true,
      },
    });
    console.log(`✅ Mês criado/atualizado: ${mes.nomeExibicao}`);
  }

  console.log('✅ Meses populados com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

