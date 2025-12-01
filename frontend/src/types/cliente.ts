export interface Cliente {
  id: number;
  numero?: string | null;
  nomeCliente: string;
  cnpj: string;
  cnpjFormatado?: string | null;
  razaoSocial?: string | null;
  sedeFilial?: string | null;
  nomeTratamento?: string | null;
  municipio?: string | null;
  qtdSocios?: string | null;
  segmentoMercado?: string | null;
  tributacao?: string | null;
  linkGoogleDrive?: string | null;
  linkDrivePj?: string | null;
  sistemaMunicipalNfsE?: string | null;
  loginWebsiss?: string | null;
  senhaWebiss?: string | null;
  idClienteExterno?: string | null;
  taskClickup1?: string | null;
  taskClickup2?: string | null;
  socioCriado?: boolean | null;
  createdAt: string;
  updatedAt: string;
  statusCliente?: StatusCliente | null;
  dadosMensais?: DadosMensais[];
}

export interface StatusCliente {
  id: number;
  clienteId: number;
  statusCliente?: string | null;
  statusEmpresaPj?: string | null;
  etapaAbertura?: string | null;
  statusTdash?: string | null;
  statusCertificadoDigital?: string | null;
  validadeCertificadoDigital?: string | null;
  cadastrarSittax?: string | null;
  situacaoProcuracaoEcac?: string | null;
  cpfSocioAdm?: string | null;
  codigoSimplesNacional?: string | null;
  numeroReciboIrpf?: string | null;
}

export interface Mes {
  id: number;
  ano: number;
  mes: number;
  nome: string;
  nomeExibicao: string;
  ativo: boolean;
  createdAt: string;
}

export interface DadosMensais {
  id: number;
  clienteId: number;
  mesId: number;
  faturamentoPrefeitura?: number | null;
  valorSittax?: number | null;
  faturamentoIgualSittax?: string | null;
  tipoTransmissao?: string | null;
  transmitidoPor?: string | null;
  statusTransmissao?: string | null;
  obs?: string | null;
  demandas?: string | null;
  createdAt: string;
  updatedAt: string;
  cliente?: Cliente;
  mes?: Mes;
  transmissoesXml?: TransmissoesXml | null;
  dasRecibos?: DasRecibos | null;
  honorarios?: Honorarios | null;
  sociosDadosMensais?: SociosDadosMensais[];
  tarefasAutomacao?: TarefasAutomacao | null;
}

export interface TransmissoesXml {
  id: number;
  dadosMensaisId: number;
  nomeArquivoXml?: string | null;
  xmlTransmitido?: boolean | null;
  issRetido?: string | null;
  naoTeveNota?: boolean | null;
  transmitidoOutubro?: boolean | null;
  transmitidoNovembro?: boolean | null;
  deveFazerEcac?: boolean | null;
  feitoEcac?: boolean | null;
  declaracaoEnviadaSittax?: boolean | null;
  viaSittax?: boolean | null;
  downloadDasRecibo?: boolean | null;
  transmitidoPeloSittax?: boolean | null;
}

export interface DasRecibos {
  id: number;
  dadosMensaisId: number;
  nomeArquivoDas?: string | null;
  faturamentoPrefeitura?: number | null;
  valorDas?: number | null;
  percentualImposto?: number | null;
  dasBaixado?: string | null;
  tipoArquivo?: string | null;
  planejamentoTributario?: string | null;
  planejMensalTrib?: boolean | null;
  downloadDas?: boolean | null;
}

export interface Honorarios {
  id: number;
  dadosMensaisId: number;
  nomeHonorarios?: string | null;
  valorHonorarios?: number | null;
  bancoCobranca?: string | null;
  boletoEmitidoSalvo?: boolean | null;
  statusCobranca?: string | null;
  logicaHonorarios?: string | null;
  statusBanco?: string | null;
  honorariosEmitido?: string | null;
}

export interface SociosDadosMensais {
  id: number;
  dadosMensaisId: number;
  numeroSocio: number;
  nomeSocio?: string | null;
  valorDasSocio?: number | null;
  liquidoSocio?: number | null;
}

export interface TarefasAutomacao {
  id: number;
  dadosMensaisId: number;
  executarAutomacao?: boolean | null;
  liberadoCriarTexto?: boolean | null;
  textoFeito?: boolean | null;
  dasNaPasta?: boolean | null;
  tdashsEnviados?: boolean | null;
  emitirRecibo?: boolean | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

