import { Request, Response } from 'express';
import prisma from '../database/connection';

class DadosMensaisController {
  async getByClienteAndMes(req: Request, res: Response) {
    try {
      const { id, mesId } = req.params;

      const dadosMensais = await prisma.dadosMensais.findFirst({
        where: {
          clienteId: parseInt(id),
          mesId: parseInt(mesId),
        },
        include: {
          cliente: true,
          mes: true,
          transmissoesXml: true,
          dasRecibos: true,
          honorarios: true,
          sociosDadosMensais: {
            orderBy: { numeroSocio: 'asc' },
          },
          tarefasAutomacao: true,
        },
      });

      if (!dadosMensais) {
        return res.status(404).json({ error: 'Dados não encontrados' });
      }

      res.json(dadosMensais);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;

      const dadosMensais = await prisma.dadosMensais.update({
        where: { id: parseInt(id) },
        data: {
          faturamentoPrefeitura: data.faturamentoPrefeitura,
          valorSittax: data.valorSittax,
          faturamentoIgualSittax: data.faturamentoIgualSittax,
          tipoTransmissao: data.tipoTransmissao,
          transmitidoPor: data.transmitidoPor,
          statusTransmissao: data.statusTransmissao,
          obs: data.obs,
          demandas: data.demandas,
        },
        include: {
          cliente: true,
          mes: true,
        },
      });

      res.json(dadosMensais);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = req.body;

      const dadosMensais = await prisma.dadosMensais.create({
        data: {
          clienteId: data.clienteId,
          mesId: data.mesId,
          faturamentoPrefeitura: data.faturamentoPrefeitura,
          valorSittax: data.valorSittax,
          faturamentoIgualSittax: data.faturamentoIgualSittax,
          tipoTransmissao: data.tipoTransmissao,
          transmitidoPor: data.transmitidoPor,
          statusTransmissao: data.statusTransmissao,
          obs: data.obs,
          demandas: data.demandas,
        },
        include: {
          cliente: true,
          mes: true,
        },
      });

      res.status(201).json(dadosMensais);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default DadosMensaisController;

