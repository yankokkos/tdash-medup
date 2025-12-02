import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  LinearProgress,
  Alert,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { importApi } from '../../services/api';

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
}

function ImportDialog({ open, onClose }: ImportDialogProps) {
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState('');
  const [mesNome, setMesNome] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: ({ url, mes }: { url: string; mes?: string }) =>
      importApi.importGoogleSheets(url, mes).then((res) => res.data),
    onSuccess: (data) => {
      setJobId(data.jobId);
      toast.success('Importação iniciada!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao iniciar importação');
    },
  });

  const statusQuery = useQuery({
    queryKey: ['importStatus', jobId],
    queryFn: () => importApi.getStatus(jobId!).then((res) => res.data),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const data = query.state.data as any;
      if (data?.status === 'processing') {
        return 1000; // Poll a cada 1 segundo enquanto processando
      }
      return false; // Parar polling quando concluído ou falhou
    },
  });

  // Resetar estado quando o dialog abrir
  useEffect(() => {
    if (open) {
      setGoogleSheetsUrl('');
      setMesNome('');
      setJobId(null);
      importMutation.reset();
    }
  }, [open]);

  // Quando a importação concluir, invalidar queries e fechar
  useEffect(() => {
    const status = statusQuery.data as any;
    if (status?.status === 'completed') {
      toast.success('Importação concluída com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      queryClient.invalidateQueries({ queryKey: ['meses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setTimeout(() => {
        onClose();
      }, 2000);
    } else if (status?.status === 'failed') {
      toast.error(`Erro na importação: ${status.error || 'Erro desconhecido'}`);
    }
  }, [statusQuery.data, onClose, queryClient]);

  const handleImport = () => {
    if (!googleSheetsUrl.trim()) {
      toast.error('Por favor, informe a URL do Google Sheets');
      return;
    }

    importMutation.mutate({
      url: googleSheetsUrl.trim(),
      mes: mesNome.trim() || undefined,
    });
  };

  const handleClose = () => {
    if (importMutation.isPending || (statusQuery.data as any)?.status === 'processing') {
      toast.error('Aguarde a importação concluir');
      return;
    }
    onClose();
  };

  const status = statusQuery.data as any;
  const isProcessing = importMutation.isPending || status?.status === 'processing';

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Importar Planilha do Google Sheets</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            fullWidth
            label="URL do Google Sheets"
            placeholder="https://docs.google.com/spreadsheets/d/..."
            value={googleSheetsUrl}
            onChange={(e) => setGoogleSheetsUrl(e.target.value)}
            disabled={isProcessing}
            helperText="Cole o link completo da planilha do Google Sheets"
          />

          <TextField
            fullWidth
            label="Nome do Mês (opcional)"
            placeholder="novembro_2025"
            value={mesNome}
            onChange={(e) => setMesNome(e.target.value)}
            disabled={isProcessing}
            helperText="Deixe em branco para detectar automaticamente do nome da planilha"
          />

          {isProcessing && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {status?.message || 'Processando...'}
              </Typography>
              <LinearProgress
                variant={status?.progress !== undefined ? 'determinate' : 'indeterminate'}
                value={status?.progress || 0}
                sx={{ mt: 1 }}
              />
              {status?.progress !== undefined && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                  {Math.round(status.progress)}%
                </Typography>
              )}
            </Box>
          )}

          {status?.status === 'failed' && (
            <Alert severity="error">
              {status.error || 'Erro ao importar planilha'}
            </Alert>
          )}

          {status?.status === 'completed' && (
            <Alert severity="success">
              Importação concluída com sucesso!
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isProcessing}>
          {status?.status === 'completed' ? 'Fechar' : 'Cancelar'}
        </Button>
        <Button
          onClick={handleImport}
          variant="contained"
          disabled={isProcessing || !googleSheetsUrl.trim()}
        >
          {isProcessing ? 'Importando...' : 'Importar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ImportDialog;

