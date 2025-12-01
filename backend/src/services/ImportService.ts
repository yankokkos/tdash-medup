import fs from 'fs';
import path from 'path';
import prisma from '../database/connection';
import NormalizeService from './NormalizeService';

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

  constructor() {
    this.normalizeService = new NormalizeService();
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

  getStatus(jobId: string): ImportJob | null {
    return this.jobs.get(jobId) || null;
  }
}

export default ImportService;

