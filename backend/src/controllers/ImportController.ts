import { Request, Response } from 'express';
import ImportService from '../services/ImportService';

class ImportController {
  private importService: ImportService;

  constructor() {
    this.importService = new ImportService();
  }

  async importJson(req: Request, res: Response) {
    try {
      const { filePath, mesNome } = req.body;

      if (!filePath) {
        return res.status(400).json({ error: 'Caminho do arquivo é obrigatório' });
      }

      const result = await this.importService.importJson(filePath, mesNome);

      res.json({
        message: 'Importação iniciada',
        jobId: result.jobId,
        status: 'processing',
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async importCsv(req: Request, res: Response) {
    try {
      const { filePath } = req.body;

      if (!filePath) {
        return res.status(400).json({ error: 'Caminho do arquivo é obrigatório' });
      }

      const result = await this.importService.importCsv(filePath);

      res.json({
        message: 'Importação CSV iniciada',
        jobId: result.jobId,
        status: 'processing',
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getStatus(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const status = await this.importService.getStatus(jobId);

      if (!status) {
        return res.status(404).json({ error: 'Job não encontrado' });
      }

      res.json(status);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default ImportController;

