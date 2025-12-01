import { Request, Response } from 'express';
import prisma from '../database/connection';

class MesController {
  async list(req: Request, res: Response) {
    try {
      const meses = await prisma.mes.findMany({
        where: { ativo: true },
        orderBy: [{ ano: 'desc' }, { mes: 'desc' }],
      });

      res.json(meses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getClientes(req: Request, res: Response) {
    try {
      const { mesId } = req.params;
      const {
        page = '1',
        limit = '50',
        search,
        municipio,
        segmento,
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const where: any = {
        dadosMensais: {
          some: {
            mesId: parseInt(mesId),
          },
        },
      };

      if (search) {
        where.OR = [
          { nomeCliente: { contains: search as string } },
          { cnpj: { contains: search as string } },
          { razaoSocial: { contains: search as string } },
        ];
      }

      if (municipio) {
        where.municipio = municipio;
      }

      if (segmento) {
        where.segmentoMercado = segmento;
      }

      const [clientes, total] = await Promise.all([
        prisma.cliente.findMany({
          where,
          include: {
            statusCliente: true,
            dadosMensais: {
              where: { mesId: parseInt(mesId) },
              include: {
                transmissoesXml: true,
                dasRecibos: true,
                honorarios: true,
                sociosDadosMensais: true,
                tarefasAutomacao: true,
              },
            },
          },
          skip,
          take: limitNum,
          orderBy: { nomeCliente: 'asc' },
        }),
        prisma.cliente.count({ where }),
      ]);

      res.json({
        data: clientes,
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
}

export default MesController;

