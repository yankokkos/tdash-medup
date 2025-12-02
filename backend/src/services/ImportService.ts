import fs from 'fs';
import path from 'path';
import prisma from '../database/connection';
import NormalizeService from './NormalizeService';
import GoogleSheetsService from './GoogleSheetsService';

interface ImportJob {
  jobId: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  message?: string;
  error?: string;
}

class ImportService {
  private jobs: Map<string, ImportJob> = new Map();
  private normalizeService: NormalizeService;
  private googleSheetsService: GoogleSheetsService;

  constructor() {
    this.normalizeService = new NormalizeService();
    this.googleSheetsService = new GoogleSheetsService();
  }

  async importJson(filePath: string, mesNome?: string): Promise<{ jobId: string }> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.jobs.set(jobId, {
      jobId,
      status: 'processing',
      progress: 0,
      message: 'Iniciando importação...',
    });

    // Processar em background
    this.processJsonImport(filePath, mesNome, jobId).catch((error) => {
      const job = this.jobs.get(jobId);
      if (job) {
        job.status = 'failed';
        job.error = error.message;
      }
    });

    return { jobId };
  }

  private async processJsonImport(filePath: string, mesNome: string | undefined, jobId: string) {
    try {
      const job = this.jobs.get(jobId);
      if (!job) return;

      job.progress = 10;
      job.message = 'Lendo arquivo JSON...';

      // Ler arquivo JSON
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(fileContent);

      job.progress = 30;
      job.message = 'Normalizando dados...';

      // Normalizar e importar dados
      await this.normalizeService.normalizeAndImport(jsonData, mesNome, (progress, message) => {
        const job = this.jobs.get(jobId);
        if (job) {
          job.progress = 30 + (progress * 0.7); // 30% a 100%
          job.message = message;
        }
      });

      job.progress = 100;
      job.status = 'completed';
      job.message = 'Importação concluída com sucesso!';
    } catch (error: any) {
      const job = this.jobs.get(jobId);
      if (job) {
        job.status = 'failed';
        job.error = error.message;
      }
      throw error;
    }
  }

  async importCsv(filePath: string): Promise<{ jobId: string }> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.jobs.set(jobId, {
      jobId,
      status: 'processing',
      progress: 0,
      message: 'Importação CSV ainda não implementada',
    });

    // TODO: Implementar importação CSV
    setTimeout(() => {
      const job = this.jobs.get(jobId);
      if (job) {
        job.status = 'completed';
        job.progress = 100;
        job.message = 'Importação CSV concluída';
      }
    }, 1000);

    return { jobId };
  }

  async importGoogleSheets(googleSheetsUrl: string, mesNome?: string): Promise<{ jobId: string }> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.jobs.set(jobId, {
      jobId,
      status: 'processing',
      progress: 0,
      message: 'Iniciando importação do Google Sheets...',
    });

    // Processar em background
    this.processGoogleSheetsImport(googleSheetsUrl, mesNome, jobId).catch((error) => {
      const job = this.jobs.get(jobId);
      if (job) {
        job.status = 'failed';
        job.error = error.message;
      }
    });

    return { jobId };
  }

  private async processGoogleSheetsImport(
    googleSheetsUrl: string,
    mesNome: string | undefined,
    jobId: string
  ) {
    try {
      const job = this.jobs.get(jobId);
      if (!job) return;

      job.progress = 10;
      job.message = 'Validando URL do Google Sheets...';

      // Validar URL
      const urlParts = this.googleSheetsService.parseGoogleSheetsUrl(googleSheetsUrl);
      if (!urlParts) {
        throw new Error('URL do Google Sheets inválida');
      }

      job.progress = 20;
      job.message = 'Baixando planilha do Google Sheets...';

      // Baixar e converter planilha
      const jsonData = await this.googleSheetsService.downloadAndConvert(googleSheetsUrl);

      if (!jsonData || jsonData.length === 0) {
        throw new Error('Planilha vazia ou sem dados');
      }

      job.progress = 30;
      job.message = 'Normalizando dados...';

      // Normalizar e importar dados
      await this.normalizeService.normalizeAndImport(jsonData, mesNome, (progress, message) => {
        const job = this.jobs.get(jobId);
        if (job) {
          job.progress = 30 + (progress * 0.7); // 30% a 100%
          job.message = message;
        }
      });

      job.progress = 100;
      job.status = 'completed';
      job.message = 'Importação concluída com sucesso!';
    } catch (error: any) {
      const job = this.jobs.get(jobId);
      if (job) {
        job.status = 'failed';
        job.error = error.message;
      }
      throw error;
    }
  }

  getStatus(jobId: string): ImportJob | null {
    return this.jobs.get(jobId) || null;
  }
}

export default ImportService;

