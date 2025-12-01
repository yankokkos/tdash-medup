import { Request, Response } from 'express';
import prisma from '../database/connection';

class DashboardController {
  async getEstatisticas(req: Request, res: Response) {
    try {
      const { mesId } = req.query;

      const where: any = {};
      if (mesId) {
        where.mesId = parseInt(mesId as string);
      }

      // Construir where para dadosMensais se mesId for fornecido
      const dadosMensaisWhere = mesId ? { mesId: parseInt(mesId as string) } : {};

      const [
        totalClientes,
        clientesAtivos,
        totalTransmitido,
        totalPendente,
      ] = await Promise.all([
        prisma.cliente.count(),
        prisma.statusCliente.count({
          where: { statusCliente: 'Ativo' },
        }),
        prisma.transmissoesXml.count({
          where: {
            xmlTransmitido: true,
            dadosMensais: mesId
              ? {
                  mesId: parseInt(mesId as string),
                }
              : undefined,
          },
        }),
        prisma.transmissoesXml.count({
          where: {
            xmlTransmitido: false,
            dadosMensais: mesId
              ? {
                  mesId: parseInt(mesId as string),
                }
              : undefined,
          },
        }),
      ]);

      res.json({
        totalClientes,
        clientesAtivos,
        totalTransmitido,
        totalPendente,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPendencias(req: Request, res: Response) {
    try {
      const { mesId } = req.query;

      // Buscar dados mensais com XML não transmitido
      const dadosMensaisWhere: any = {
        transmissoesXml: {
          xmlTransmitido: false,
        },
      };
      
      if (mesId) {
        dadosMensaisWhere.mesId = parseInt(mesId as string);
      }

      const dadosMensaisNaoTransmitidos = await prisma.dadosMensais.findMany({
        where: dadosMensaisWhere,
        include: {
          cliente: true,
          mes: true,
          transmissoesXml: true,
        },
      });

      // Buscar clientes com XML não transmitido (agrupados por cliente)
      const clientesNaoTransmitidos = dadosMensaisNaoTransmitidos.map((dm) => ({
        ...dm.cliente,
        dadosMensais: [dm],
      }));

      // Buscar dados mensais com honorários pendentes
      const dadosMensaisHonorariosWhere: any = {
        honorarios: {
          OR: [
            { statusCobranca: { not: 'Pago' } },
            { statusCobranca: null },
          ],
        },
      };
      
      if (mesId) {
        dadosMensaisHonorariosWhere.mesId = parseInt(mesId as string);
      }

      const dadosMensaisHonorariosPendentes = await prisma.dadosMensais.findMany({
        where: dadosMensaisHonorariosWhere,
        include: {
          cliente: true,
          mes: true,
          honorarios: true,
        },
      });

      // Agrupar por cliente
      const honorariosPendentes = dadosMensaisHonorariosPendentes.map((dm) => ({
        ...dm.cliente,
        dadosMensais: [dm],
      }));

      // Formatar pendências
      const pendencias: any[] = [];

      clientesNaoTransmitidos.forEach((cliente) => {
        cliente.dadosMensais.forEach((dm) => {
          pendencias.push({
            id: `xml-${cliente.id}-${dm.id}`,
            clienteId: cliente.id,
            nomeCliente: cliente.nomeCliente,
            tipoPendencia: 'XML Não Transmitido',
            descricao: `Mês: ${dm.mes?.nomeExibicao || 'N/A'}`,
            mesId: dm.mesId,
          });
        });
      });

      honorariosPendentes.forEach((cliente) => {
        cliente.dadosMensais.forEach((dm) => {
          if (dm.honorarios) {
            pendencias.push({
              id: `honorario-${cliente.id}-${dm.id}`,
              clienteId: cliente.id,
              nomeCliente: cliente.nomeCliente,
              tipoPendencia: 'Honorários Pendentes',
              descricao: `Mês: ${dm.mes?.nomeExibicao || 'N/A'} - Status: ${dm.honorarios.statusCobranca || 'Não definido'}`,
              mesId: dm.mesId,
            });
          }
        });
      });

      res.json(pendencias.slice(0, 20)); // Limitar a 20 pendências
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getGraficos(req: Request, res: Response) {
    try {
      const { mesId } = req.query;

      const where: any = {};
      if (mesId) {
        where.mesId = parseInt(mesId as string);
      }

      // Faturamento por segmento - usando agregação manual
      const clientesComDados = await prisma.cliente.findMany({
        where: {
          dadosMensais: {
            some: where,
          },
        },
        include: {
          dadosMensais: {
            where,
          },
        },
      });

      const faturamentoPorSegmento = clientesComDados.reduce((acc: any, cliente) => {
        const segmento = cliente.segmentoMercado || 'Outros';
        const total = cliente.dadosMensais.reduce(
          (sum, dm) => sum + (Number(dm.faturamentoPrefeitura) || 0),
          0
        );
        acc[segmento] = (acc[segmento] || 0) + total;
        return acc;
      }, {});

      // Faturamento por mês
      const dadosMensais = await prisma.dadosMensais.findMany({
        where,
        include: {
          mes: true,
        },
      });

      const faturamentoPorMes = dadosMensais.reduce((acc: any, dm) => {
        const mesNome = dm.mes?.nomeExibicao || `Mês ${dm.mesId}`;
        acc[mesNome] = (acc[mesNome] || 0) + (Number(dm.faturamentoPrefeitura) || 0);
        return acc;
      }, {});

      res.json({
        faturamentoPorSegmento,
        faturamentoPorMes,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default DashboardController;

