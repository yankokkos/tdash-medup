import prisma from '../database/connection';

interface HistoricoEntry {
  tabelaOrigem: string;
  registroId: number;
  campoAlterado: string;
  valorAnterior: any;
  valorNovo: any;
  usuario?: string;
  mesId?: number;
}

class HistoricoService {
  async registrarAlteracao(entry: HistoricoEntry) {
    try {
      await prisma.historicoAlteracao.create({
        data: {
          tabelaOrigem: entry.tabelaOrigem,
          registroId: entry.registroId,
          campoAlterado: entry.campoAlterado,
          valorAnterior: entry.valorAnterior ? String(entry.valorAnterior) : null,
          valorNovo: entry.valorNovo ? String(entry.valorNovo) : null,
          usuario: entry.usuario || 'system',
          mesId: entry.mesId,
        },
      });
    } catch (error) {
      console.error('Erro ao registrar histórico:', error);
      // Não falhar a operação principal se o histórico falhar
    }
  }

  async registrarAlteracaoCliente(
    clienteId: number,
    campo: string,
    valorAnterior: any,
    valorNovo: any,
    usuario?: string
  ) {
    await this.registrarAlteracao({
      tabelaOrigem: 'clientes',
      registroId: clienteId,
      campoAlterado: campo,
      valorAnterior,
      valorNovo,
      usuario,
    });
  }

  async registrarAlteracaoDadosMensais(
    dadosMensaisId: number,
    mesId: number,
    campo: string,
    valorAnterior: any,
    valorNovo: any,
    usuario?: string
  ) {
    await this.registrarAlteracao({
      tabelaOrigem: 'dados_mensais',
      registroId: dadosMensaisId,
      campoAlterado: campo,
      valorAnterior,
      valorNovo,
      usuario,
      mesId,
    });
  }
}

export default HistoricoService;

