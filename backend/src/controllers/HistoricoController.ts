import { Request, Response } from 'express';
import prisma from '../database/connection';

class HistoricoController {
  async list(req: Request, res: Response) {
    try {
      const { page = '1', limit = '50', tabelaOrigem, mesId } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const where: any = {};

      if (tabelaOrigem) {
        where.tabelaOrigem = tabelaOrigem;
      }

      if (mesId) {
        where.mesId = parseInt(mesId as string);
      }

      const [historico, total] = await Promise.all([
        prisma.historicoAlteracao.findMany({
          where,
          include: {
            mes: true,
          },
          skip,
          take: limitNum,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.historicoAlteracao.count({ where }),
      ]);

      res.json({
        data: historico,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByCliente(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const historico = await prisma.historicoAlteracao.findMany({
        where: {
          tabelaOrigem: 'clientes',
          registroId: parseInt(id),
        },
        include: {
          mes: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json(historico);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByMes(req: Request, res: Response) {
    try {
      const { mesId } = req.params;

      const historico = await prisma.historicoAlteracao.findMany({
        where: {
          mesId: parseInt(mesId),
        },
        include: {
          mes: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json(historico);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default HistoricoController;

