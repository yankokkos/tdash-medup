import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import ImportService from '../services/ImportService';

dotenv.config();

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.error('Uso: npm run import:json <caminho-do-arquivo> [nome-do-mes]');
    console.error('Exemplo: npm run import:json "../📶 Operacional MedUp - TDasH - Novembro 2025.json" novembro_2025');
    process.exit(1);
  }

  const filePath = path.resolve(args[0]);
  const mesNome = args[1] || 'novembro_2025';

  if (!fs.existsSync(filePath)) {
    console.error(`Arquivo não encontrado: ${filePath}`);
    process.exit(1);
  }

  console.log(`📥 Iniciando importação de: ${filePath}`);
  console.log(`📅 Mês: ${mesNome}`);

  const importService = new ImportService();
  const { jobId } = await importService.importJson(filePath, mesNome);

  console.log(`✅ Importação iniciada. Job ID: ${jobId}`);
  console.log(`💡 Use a API /api/import/status/${jobId} para verificar o progresso`);

  // Aguardar conclusão (em produção, usar polling ou webhooks)
  let status = importService.getStatus(jobId);
  while (status && status.status === 'processing') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    status = importService.getStatus(jobId);
    if (status) {
      process.stdout.write(`\r⏳ Progresso: ${status.progress.toFixed(0)}% - ${status.message}`);
    }
  }

  console.log('\n');
  if (status) {
    if (status.status === 'completed') {
      console.log('✅ Importação concluída com sucesso!');
    } else {
      console.error('❌ Importação falhou:', status.error);
      process.exit(1);
    }
  }
}

main().catch(console.error);

