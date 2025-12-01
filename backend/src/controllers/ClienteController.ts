import { Request, Response } from 'express';
import prisma from '../database/connection';

class ClienteController {
  async list(req: Request, res: Response) {
    try {
      const {
        page = '1',
        limit = '50',
        search,
        municipio,
        segmento,
        status,
        pendente,
        etapa,
        mesId,
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const where: any = {};

      if (search) {
        where.OR = [
          { nomeCliente: { contains: search as string } },
          { cnpj: { contains: search as string } },
          { cnpjFormatado: { contains: search as string } },
          { razaoSocial: { contains: search as string } },
          { nomeTratamento: { contains: search as string } },
        ];
      }

      if (municipio) {
        where.municipio = municipio;
      }

      if (segmento) {
        where.segmentoMercado = segmento;
      }

      if (status || etapa) {
        where.statusCliente = {};
        if (status) {
          where.statusCliente.statusCliente = status;
        }
        if (etapa) {
          where.statusCliente.etapaAbertura = etapa;
        }
      }

      // Filtro de pendentes
      let pendentesWhere: any = {};
      if (pendente) {
        if (pendente === 'xml') {
          pendentesWhere.transmissoesXml = {
            xmlTransmitido: false,
          };
        } else if (pendente === 'honorarios') {
          pendentesWhere.honorarios = {
            OR: [
              { statusCobranca: { not: 'Pago' } },
              { statusCobranca: null },
            ],
          };
        } else if (pendente === 'das') {
          pendentesWhere.dasRecibos = {
            OR: [
              { downloadDas: false },
              { downloadDas: null },
            ],
          };
        }
      }

      const dadosMensaisWhere: any = mesId
        ? { mesId: parseInt(mesId as string), ...pendentesWhere }
        : pendentesWhere;

      const [clientes, total] = await Promise.all([
        prisma.cliente.findMany({
          where: pendente
            ? {
                ...where,
                dadosMensais: {
                  some: dadosMensaisWhere,
                },
              }
            : where,
          include: {
            statusCliente: true,
            dadosMensais: mesId || pendente
              ? {
                  where: dadosMensaisWhere,
                  include: {
                    mes: true,
                    transmissoesXml: true,
                    dasRecibos: true,
                    honorarios: true,
                    sociosDadosMensais: true,
                    tarefasAutomacao: true,
                  },
                }
              : false,
          },
          skip,
          take: limitNum,
          orderBy: { nomeCliente: 'asc' },
        }),
        prisma.cliente.count({
          where: pendente
            ? {
                ...where,
                dadosMensais: {
                  some: dadosMensaisWhere,
                },
              }
            : where,
        }),
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

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const cliente = await prisma.cliente.findUnique({
        where: { id: parseInt(id) },
        include: {
          statusCliente: true,
          dadosMensais: {
            include: {
              mes: true,
              transmissoesXml: true,
              dasRecibos: true,
              honorarios: true,
              sociosDadosMensais: {
                orderBy: { numeroSocio: 'asc' },
              },
              tarefasAutomacao: true,
            },
            orderBy: { mes: { createdAt: 'desc' } },
          },
        },
      });

      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }

      res.json(cliente);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;

      const cliente = await prisma.cliente.update({
        where: { id: parseInt(id) },
        data,
        include: {
          statusCliente: true,
        },
      });

      res.json(cliente);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getMeses(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const dadosMensais = await prisma.dadosMensais.findMany({
        where: { clienteId: parseInt(id) },
        include: {
          mes: true,
          transmissoesXml: true,
          dasRecibos: true,
          honorarios: true,
        },
        orderBy: { mes: { createdAt: 'desc' } },
      });

      res.json(dadosMensais);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default ClienteController;

