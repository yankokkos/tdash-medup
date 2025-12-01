import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import ImportService from '../services/ImportService';

dotenv.config();

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.error('Uso: npm run import:csv <caminho-do-arquivo>');
    console.error('Exemplo: npm run import:csv "../📶 Operacional MedUp - TDasH - Novembro 2025 dados e estrutura .csv"');
    process.exit(1);
  }

  const filePath = path.resolve(args[0]);

  if (!fs.existsSync(filePath)) {
    console.error(`Arquivo não encontrado: ${filePath}`);
    process.exit(1);
  }

  console.log(`📥 Iniciando importação CSV de: ${filePath}`);
  console.log('⚠️  Importação CSV ainda não está totalmente implementada');

  const importService = new ImportService();
  const { jobId } = await importService.importCsv(filePath);

  console.log(`✅ Importação iniciada. Job ID: ${jobId}`);
}

main().catch(console.error);

