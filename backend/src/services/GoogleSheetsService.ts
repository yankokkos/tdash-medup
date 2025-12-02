import axios from 'axios';
import { parse } from 'csv-parse/sync';

interface GoogleSheetsUrlParts {
  spreadsheetId: string;
  gid: string;
}

class GoogleSheetsService {
  /**
   * Extrai o ID da planilha e o GID da URL do Google Sheets
   */
  parseGoogleSheetsUrl(url: string): GoogleSheetsUrlParts | null {
    try {
      // Formato: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit?gid={GID}#gid={GID}
      const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      if (!match) {
        throw new Error('URL do Google Sheets inválida');
      }

      const spreadsheetId = match[1];

      // Extrair GID da query string ou hash
      const gidMatch = url.match(/[?&#]gid=([0-9]+)/);
      const gid = gidMatch ? gidMatch[1] : '0'; // Default para primeira aba

      return { spreadsheetId, gid };
    } catch (error) {
      return null;
    }
  }

  /**
   * Gera URL de export CSV do Google Sheets
   */
  getCsvExportUrl(spreadsheetId: string, gid: string): string {
    // Tentar primeiro com o formato padrão
    // Se gid for 0, não incluir o parâmetro gid (primeira aba)
    if (gid === '0') {
      return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;
    }
    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
  }

  /**
   * Baixa a planilha do Google Sheets como CSV
   */
  async downloadCsv(url: string): Promise<string> {
    const urlParts = this.parseGoogleSheetsUrl(url);
    if (!urlParts) {
      throw new Error('URL do Google Sheets inválida. Certifique-se de que a URL está no formato correto.');
    }

    const csvUrl = this.getCsvExportUrl(urlParts.spreadsheetId, urlParts.gid);

    try {
      const response = await axios.get(csvUrl, {
        responseType: 'text',
        timeout: 30000, // 30 segundos
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/csv',
        },
        maxRedirects: 5,
        validateStatus: (status) => status < 500, // Aceitar status < 500 para verificar o conteúdo
      });

      // Verificar se a resposta é realmente CSV ou se é uma página de erro HTML
      const contentType = response.headers['content-type'] || '';
      const data = response.data || '';
      
      if (data.trim().startsWith('<!DOCTYPE') || data.trim().startsWith('<html') || contentType.includes('text/html')) {
        throw new Error('A planilha não está pública. Para importar, você precisa:\n1. Abrir a planilha no Google Sheets\n2. Clicar em "Compartilhar"\n3. Alterar para "Qualquer pessoa com o link"\n4. Definir permissão como "Visualizador"\n5. Copiar o link novamente e tentar importar.');
      }

      // Verificar se recebeu um erro HTTP mas com status < 500
      if (response.status >= 400 && response.status < 500) {
        if (response.status === 403 || response.status === 401) {
          throw new Error('A planilha não está pública. Para importar, você precisa:\n1. Abrir a planilha no Google Sheets\n2. Clicar em "Compartilhar"\n3. Alterar para "Qualquer pessoa com o link"\n4. Definir permissão como "Visualizador"\n5. Copiar o link novamente e tentar importar.');
        }
        
        if (response.status === 400) {
          throw new Error(`Erro 400: A planilha pode não estar pública ou a URL está incorreta. Certifique-se de que a planilha está compartilhada publicamente.`);
        }
        
        if (response.status === 404) {
          throw new Error('Planilha não encontrada. Verifique se a URL está correta.');
        }
        
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText || 'Erro desconhecido'}`);
      }

      return data;
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const statusText = error.response.statusText;
        
        if (status === 403 || status === 401) {
          throw new Error('A planilha não está pública. Para importar, você precisa:\n1. Abrir a planilha no Google Sheets\n2. Clicar em "Compartilhar"\n3. Alterar para "Qualquer pessoa com o link"\n4. Definir permissão como "Visualizador"\n5. Copiar o link novamente e tentar importar.');
        }
        
        if (status === 400) {
          throw new Error(`Erro 400: A planilha pode não estar pública ou a URL está incorreta. Certifique-se de que a planilha está compartilhada publicamente.`);
        }
        
        if (status === 404) {
          throw new Error('Planilha não encontrada. Verifique se a URL está correta e se você tem acesso à planilha.');
        }
        
        const errorData = error.response.data?.toString().substring(0, 200) || '';
        throw new Error(`Erro ao baixar planilha (${status} ${statusText}): ${errorData || error.message}`);
      }
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Timeout ao baixar planilha. A planilha pode estar muito grande ou o servidor está lento.');
      }
      
      // Se a mensagem de erro já foi formatada, usar ela; caso contrário, usar a mensagem padrão
      if (error.message && !error.message.includes('Request failed')) {
        throw error;
      }
      
      throw new Error(`Erro ao baixar planilha: ${error.message || 'Erro desconhecido'}`);
    }
  }

  /**
   * Converte CSV para array de objetos JSON
   */
  csvToJson(csvContent: string): any[] {
    try {
      // Parse CSV
      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        bom: true, // Suporta BOM (Byte Order Mark)
      });

      return records;
    } catch (error: any) {
      throw new Error(`Erro ao converter CSV: ${error.message}`);
    }
  }

  /**
   * Baixa e converte planilha do Google Sheets para JSON
   */
  async downloadAndConvert(url: string): Promise<any[]> {
    const csvContent = await this.downloadCsv(url);
    const jsonData = this.csvToJson(csvContent);
    return jsonData;
  }
}

export default GoogleSheetsService;

