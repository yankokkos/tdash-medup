import prisma from '../database/connection';

type ProgressCallback = (progress: number, message: string) => void;

class NormalizeService {
  async normalizeAndImport(
    jsonData: any,
    mesNome: string | undefined,
    onProgress?: ProgressCallback
  ) {
    onProgress?.(0, 'Iniciando normalização...');

    // Se mesNome não foi fornecido, tentar detectar do JSON ou usar padrão
    if (!mesNome) {
      mesNome = this.detectMesFromData(jsonData) || 'novembro_2025';
    }

    onProgress?.(10, 'Criando/obtendo mês...');

    // Criar ou obter mês
    const mes = await this.getOrCreateMes(mesNome);

    onProgress?.(20, 'Processando clientes...');

    // Processar cada registro do JSON
    const records = Array.isArray(jsonData) ? jsonData : jsonData.data || [jsonData];
    const total = records.length;

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      await this.processRecord(record, mes.id);

      if (onProgress && i % 10 === 0) {
        const progress = 20 + ((i / total) * 70);
        onProgress(progress, `Processando cliente ${i + 1} de ${total}...`);
      }
    }

    onProgress?.(100, 'Normalização concluída!');
  }

  private detectMesFromData(data: any): string | null {
    // Tentar detectar mês do nome do arquivo ou dados
    // Implementação básica - pode ser melhorada
    if (typeof data === 'string' && data.includes('novembro')) return 'novembro_2025';
    if (typeof data === 'string' && data.includes('dezembro')) return 'dezembro_2025';
    return null;
  }

  private async getOrCreateMes(mesNome: string) {
    // Parse do nome: "novembro_2025" -> ano: 2025, mes: 11
    const [mesStr, anoStr] = mesNome.split('_');
    const mesesMap: { [key: string]: number } = {
      janeiro: 1, fevereiro: 2, marco: 3, abril: 4, maio: 5, junho: 6,
      julho: 7, agosto: 8, setembro: 9, outubro: 10, novembro: 11, dezembro: 12,
    };

    const mes = mesesMap[mesStr.toLowerCase()] || 1;
    const ano = parseInt(anoStr) || 2025;

    const nomeExibicao = `${mesStr.charAt(0).toUpperCase() + mesStr.slice(1)} ${ano}`;

    return await prisma.mes.upsert({
      where: { nome: mesNome },
      update: {},
      create: {
        ano,
        mes,
        nome: mesNome,
        nomeExibicao,
        ativo: true,
      },
    });
  }

  private async processRecord(record: any, mesId: number) {
    try {
      // Extrair dados fixos do cliente
      const clienteData = this.extractClienteData(record);
      
      // Validar CNPJ - pular registros sem CNPJ válido
      if (!clienteData.cnpj || clienteData.cnpj.trim() === '') {
        console.warn('Registro ignorado: CNPJ vazio ou inválido');
        return;
      }

      // Validar se CNPJ tem pelo menos 11 dígitos (CPF) ou 14 dígitos (CNPJ)
      const cnpjLimpo = clienteData.cnpj.replace(/\D/g, '');
      if (cnpjLimpo.length < 11) {
        console.warn(`Registro ignorado: CNPJ muito curto (${cnpjLimpo.length} dígitos): ${clienteData.cnpj}`);
        return;
      }

      // Garantir que campos obrigatórios não sejam null
      const clienteDataClean = {
        ...clienteData,
        nomeCliente: clienteData.nomeCliente || 'Sem Nome',
      };
      
      // Criar ou atualizar cliente
      const cliente = await prisma.cliente.upsert({
        where: { cnpj: clienteDataClean.cnpj },
        update: clienteDataClean,
        create: clienteDataClean,
      });

      // Extrair e criar status do cliente
      await this.processStatusCliente(cliente.id, record);

      // Criar ou obter dados mensais
      const dadosMensais = await this.getOrCreateDadosMensais(cliente.id, mesId, record);

      // Processar dados relacionados
      await this.processTransmissoesXml(dadosMensais.id, record);
      await this.processDasRecibos(dadosMensais.id, record);
      await this.processHonorarios(dadosMensais.id, record);
      await this.processSocios(dadosMensais.id, record);
      await this.processTarefasAutomacao(dadosMensais.id, record);
    } catch (error: any) {
      console.error('Erro ao processar registro:', error?.message || error);
      // Continuar com próximo registro sem interromper a importação
    }
  }

  private extractClienteData(record: any) {
    return {
      numero: this.getField(record, 'N'),
      nomeCliente: this.getField(record, 'Clientes MedUp'),
      cnpj: this.cleanCnpj(this.getField(record, 'CNPJ')),
      cnpjFormatado: this.getField(record, 'CNPJ .../-'),
      razaoSocial: this.getField(record, 'Razao_Social'),
      sedeFilial: this.getField(record, 'SEDE/FILIAL'),
      nomeTratamento: this.getField(record, 'Nome de Tratamento'),
      municipio: this.getField(record, 'MUNICIPIO'),
      qtdSocios: this.getField(record, 'Qtd de Sócios'),
      segmentoMercado: this.getField(record, 'Segmento de Mercado'),
      tributacao: this.getField(record, 'Tributação'),
      linkGoogleDrive: this.getField(record, 'Link do Google Drive'),
      linkDrivePj: this.getField(record, 'Link do drive por PJ'),
      sistemaMunicipalNfsE: this.getField(record, 'Sistema Municipal NFS-e'),
      loginWebsiss: this.getField(record, 'Login WebSiss'),
      senhaWebiss: this.getField(record, 'senha Webiss'),
      idClienteExterno: this.getField(record, 'ID.Cliente'),
      taskClickup1: this.getField(record, 'Task Id Clickup 1.0'),
      taskClickup2: this.getField(record, 'Task Id Clickup 2.0'),
      socioCriado: this.parseBoolean(this.getField(record, 'Sócio criado?')),
    };
  }

  private async processStatusCliente(clienteId: number, record: any) {
    const statusData = {
      clienteId,
      statusCliente: this.getField(record, 'Status do Cliente'),
      statusEmpresaPj: this.getField(record, 'Status da Empresa (PJ)'),
      etapaAbertura: this.getField(record, 'Etapa da Abertura'),
      statusTdash: this.getField(record, 'Status do TDasH'),
      statusCertificadoDigital: this.getField(record, 'Status Certificado Digital'),
      validadeCertificadoDigital: this.parseDate(this.getField(record, 'Validade do Certificado Digital')),
      cadastrarSittax: this.getField(record, 'Cadastrar no Sittax'),
      situacaoProcuracaoEcac: this.getField(record, 'Situação Procuração de Tiago para o eCAC Ativa'),
      cpfSocioAdm: this.getField(record, 'CPF do Sócio Adm'),
      codigoSimplesNacional: this.getField(record, 'Código Simples Nacional'),
      numeroReciboIrpf: this.getField(record, 'Número do recibo de entrega da declaração de IRPF do responsável:'),
    };

    await prisma.statusCliente.upsert({
      where: { clienteId },
      update: statusData,
      create: statusData,
    });
  }

  private async getOrCreateDadosMensais(clienteId: number, mesId: number, record: any) {
    const dadosData = {
      clienteId,
      mesId,
      faturamentoPrefeitura: this.parseMoney(this.getField(record, 'Faturamento (Prefeitura)')),
      valorSittax: this.parseMoney(this.getField(record, 'Valor do Sittax')),
      faturamentoIgualSittax: this.getField(record, 'Faturamento Igual ao Sittax?'),
      tipoTransmissao: this.getField(record, 'Tipo de Transmissão'),
      transmitidoPor: this.getField(record, 'Transmitido por'),
      statusTransmissao: this.getField(record, 'Status de Transmissão'),
      obs: this.getField(record, 'OBS'),
      demandas: this.getField(record, 'Demandas'),
    };

    return await prisma.dadosMensais.upsert({
      where: {
        clienteId_mesId: {
          clienteId,
          mesId,
        },
      },
      update: dadosData,
      create: dadosData,
    });
  }

  private async processTransmissoesXml(dadosMensaisId: number, record: any) {
    const xmlData = {
      dadosMensaisId,
      nomeArquivoXml: this.getField(record, '[XML]'),
      xmlTransmitido: this.parseBoolean(this.getField(record, 'XML')),
      issRetido: this.getField(record, 'ISS Retido'),
      naoTeveNota: this.parseBoolean(this.getField(record, 'Não teve Nota')),
      transmitidoOutubro: this.parseBoolean(this.getField(record, 'Transmitido de Outubro')),
      transmitidoNovembro: this.parseBoolean(this.getField(record, 'Transmitido - Novembro')),
      deveFazerEcac: this.parseBoolean(this.getField(record, 'Deve Fazer via eCAC')),
      feitoEcac: this.parseBoolean(this.getField(record, 'Feito via eCAC')),
      declaracaoEnviadaSittax: this.parseBoolean(this.getField(record, 'Declaração Enviada para o Sittax')),
      viaSittax: this.parseBoolean(this.getField(record, 'via Sittax')),
      downloadDasRecibo: this.parseBoolean(this.getField(record, 'Download DAS/Recibo')),
      transmitidoPeloSittax: this.parseBoolean(this.getField(record, 'Transmitido pelo Sittax?')),
    };

    await prisma.transmissoesXml.upsert({
      where: { dadosMensaisId },
      update: xmlData,
      create: xmlData,
    });
  }

  private async processDasRecibos(dadosMensaisId: number, record: any) {
    const dasData = {
      dadosMensaisId,
      nomeArquivoDas: this.getField(record, '[DAS] '),
      faturamentoPrefeitura: this.parseMoney(this.getField(record, 'Faturamento (Prefeitura)')),
      valorDas: this.parseMoney(this.getField(record, 'R$_Valor_DAS')),
      percentualImposto: this.parsePercent(this.getField(record, '% do Imposto')),
      dasBaixado: this.getField(record, 'DAS BAIXADO'),
      tipoArquivo: this.getField(record, 'Tipo de Arquivo (DAS/Recibo)'),
      planejamentoTributario: this.getField(record, 'Planejamento Tributário'),
      planejMensalTrib: this.parseBoolean(this.getField(record, 'Planej Mensal Trib')),
      downloadDas: this.parseBoolean(this.getField(record, 'Download DAS')),
    };

    await prisma.dasRecibos.upsert({
      where: { dadosMensaisId },
      update: dasData,
      create: dasData,
    });
  }

  private async processHonorarios(dadosMensaisId: number, record: any) {
    const honorariosData = {
      dadosMensaisId,
      nomeHonorarios: this.getField(record, 'HONORÁRIOS'),
      valorHonorarios: this.parseMoney(this.getField(record, 'R$_Honorarios ')),
      bancoCobranca: this.getField(record, 'Banco de Cobrança'),
      boletoEmitidoSalvo: this.parseBoolean(this.getField(record, 'Boleto Emitido e Salvo com Nome Certo')),
      statusCobranca: this.getField(record, 'Status de Cobrança de Honorários'),
      logicaHonorarios: this.getField(record, 'Lógica dos Honorários'),
      statusBanco: this.getField(record, 'Status do Banco'),
      honorariosEmitido: this.getField(record, 'Honorários Emitido'),
    };

    await prisma.honorarios.upsert({
      where: { dadosMensaisId },
      update: honorariosData,
      create: honorariosData,
    });
  }

  private async processSocios(dadosMensaisId: number, record: any) {
    // Processar até 3 sócios
    for (let i = 1; i <= 3; i++) {
      const nomeSocio = this.getField(record, `${i}. Socio${i === 1 ? '1' : i === 2 ? '2' : '03'}`);
      
      if (nomeSocio) {
        const socioData = {
          dadosMensaisId,
          numeroSocio: i,
          nomeSocio,
          valorDasSocio: this.parseMoney(this.getField(record, `${i}.R$_DAS_Socio${i === 1 ? '1' : i === 2 ? '2' : '3'}`)),
          liquidoSocio: this.parseMoney(this.getField(record, `${i}. Liquido_Socio${i === 1 ? '1' : i === 2 ? '02' : '03'}`)),
        };

        await prisma.sociosDadosMensais.upsert({
          where: {
            dadosMensaisId_numeroSocio: {
              dadosMensaisId,
              numeroSocio: i,
            },
          },
          update: socioData,
          create: socioData,
        });
      }
    }
  }

  private async processTarefasAutomacao(dadosMensaisId: number, record: any) {
    const automacaoData = {
      dadosMensaisId,
      executarAutomacao: this.parseBoolean(this.getField(record, 'Executar Automação')),
      liberadoCriarTexto: this.parseBoolean(this.getField(record, 'Liberado para criar o Texto?')),
      textoFeito: this.parseBoolean(this.getField(record, 'Texto feito')),
      dasNaPasta: this.parseBoolean(this.getField(record, 'das na pasta')),
      tdashsEnviados: this.parseBoolean(this.getField(record, 'TDasHs Enviados')),
      emitirRecibo: this.parseBoolean(this.getField(record, 'emitir recibo')),
    };

    await prisma.tarefasAutomacao.upsert({
      where: { dadosMensaisId },
      update: automacaoData,
      create: automacaoData,
    });
  }

  // Helper methods
  private getField(record: any, fieldName: string): string | null {
    if (!record) return null;
    const value = record[fieldName];
    if (value === null || value === undefined || value === '' || value === '#N/D' || value === '#REF!') {
      return null;
    }
    return String(value).trim() || null;
  }

  private cleanCnpj(cnpj: string | null): string {
    if (!cnpj) return '';
    const cleaned = String(cnpj).replace(/\D/g, '');
    // Retornar string vazia se não tiver pelo menos 11 dígitos
    return cleaned.length >= 11 ? cleaned : '';
  }

  private parseBoolean(value: string | null): boolean | null {
    if (!value) return null;
    const str = String(value).toUpperCase().trim();
    if (str === 'TRUE' || str === 'VERDADEIRO' || str === 'SIM' || str === '1') return true;
    if (str === 'FALSE' || str === 'FALSO' || str === 'NÃO' || str === '0') return false;
    return null;
  }

  private parseMoney(value: string | null): number | null {
    if (!value) return null;
    const cleaned = String(value)
      .replace(/R\$/g, '')
      .replace(/\./g, '')
      .replace(',', '.')
      .trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  }

  private parsePercent(value: string | null): number | null {
    if (!value) return null;
    const cleaned = String(value).replace('%', '').replace(',', '.').trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  }

  private parseDate(value: string | null): Date | null {
    if (!value) return null;
    try {
      return new Date(value);
    } catch {
      return null;
    }
  }
}

export default NormalizeService;

