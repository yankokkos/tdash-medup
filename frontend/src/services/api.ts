import axios from 'axios';
import type { Cliente, Mes, DadosMensais, PaginatedResponse } from '../types/cliente';

// Usar URL do backend diretamente se estiver em domínio separado
// Em produção, o backend está em https://tdashapi.medupcontabil.com.br
// Em desenvolvimento, usar /api (proxy via nginx)
const getBaseURL = () => {
  // Se estiver em produção e o backend estiver em domínio separado
  if (import.meta.env.PROD) {
    // Verificar se estamos no domínio do frontend
    const currentHost = window.location.hostname;
    if (currentHost === 'tdash.medupcontabil.com.br') {
      return 'https://tdashapi.medupcontabil.com.br/api';
    }
  }
  // Desenvolvimento ou mesmo domínio - usar proxy
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Clientes
export const clientesApi = {
  list: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    municipio?: string;
    segmento?: string;
    status?: string;
    pendente?: string;
    etapa?: string;
    mesId?: number;
  }) => api.get<PaginatedResponse<Cliente>>('/clientes', { params }),

  getById: (id: number) => api.get<Cliente>(`/clientes/${id}`),

  update: (id: number, data: Partial<Cliente>) =>
    api.put<Cliente>(`/clientes/${id}`, data),

  getMeses: (id: number) => api.get<DadosMensais[]>(`/clientes/${id}/meses`),
};

// Meses
export const mesesApi = {
  list: () => api.get<Mes[]>('/meses'),

  getClientes: (mesId: number, params?: {
    page?: number;
    limit?: number;
    search?: string;
    municipio?: string;
    segmento?: string;
  }) => api.get<PaginatedResponse<Cliente>>(`/meses/${mesId}/clientes`, { params }),
};

// Dados Mensais
export const dadosMensaisApi = {
  getByClienteAndMes: (clienteId: number, mesId: number) =>
    api.get<DadosMensais>(`/dados-mensais/cliente/${clienteId}/mes/${mesId}`),

  update: (id: number, data: Partial<DadosMensais>) =>
    api.put<DadosMensais>(`/dados-mensais/${id}`, data),

  create: (data: Partial<DadosMensais>) =>
    api.post<DadosMensais>('/dados-mensais', data),
};

// Importação
export const importApi = {
  importJson: (filePath: string, mesNome?: string) =>
    api.post('/import/json', { filePath, mesNome }),

  importCsv: (filePath: string) =>
    api.post('/import/csv', { filePath }),

  getStatus: (jobId: string) =>
    api.get(`/import/status/${jobId}`),
};

// Dashboard
export const dashboardApi = {
  getEstatisticas: (mesId?: number) =>
    api.get('/dashboard/estatisticas', { params: { mesId } }),

  getPendencias: (mesId?: number) =>
    api.get('/dashboard/pendencias', { params: { mesId } }),

  getGraficos: (mesId?: number) =>
    api.get('/dashboard/graficos', { params: { mesId } }),
};

export default api;

