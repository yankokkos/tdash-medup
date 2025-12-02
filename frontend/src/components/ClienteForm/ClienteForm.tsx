import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Tabs,
  Tab,
  Grid,
  Typography,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { Cliente } from '../../types/cliente';
import { clientesApi, dadosMensaisApi } from '../../services/api';
import CheckboxField from '../CheckboxField';
import MoneyField from '../MoneyField';
import CopyButton from '../CopyButton';
import LinkButton from '../LinkButton';

interface ClienteFormProps {
  open: boolean;
  cliente: Cliente;
  mesId?: number;
  onClose: () => void;
}

function ClienteForm({ open, cliente, mesId, onClose }: ClienteFormProps) {
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState(cliente);
  const [showPassword, setShowPassword] = useState(false);
  const [dadosMensaisData, setDadosMensaisData] = useState<{
    faturamentoPrefeitura: number | null;
    valorSittax: number | null;
  }>({
    faturamentoPrefeitura: null,
    valorSittax: null,
  });
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Cliente>) => clientesApi.update(cliente.id, data),
    onSuccess: () => {
      toast.success('Cliente atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao atualizar cliente');
    },
  });

  // Buscar dados mensais do mês selecionado ou o primeiro disponível
  const dadosMensais = mesId
    ? cliente.dadosMensais?.find((dm: any) => dm.mesId === mesId)
    : cliente.dadosMensais?.[0];

  const updateDadosMensaisMutation = useMutation({
    mutationFn: (data: { faturamentoPrefeitura?: number | null; valorSittax?: number | null }) => {
      if (!dadosMensais?.id) {
        throw new Error('Dados mensais não encontrados');
      }
      return dadosMensaisApi.update(dadosMensais.id, data);
    },
    onSuccess: () => {
      toast.success('Dados mensais atualizados com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao atualizar dados mensais');
    },
  });

  // Atualizar formData quando cliente mudar
  useEffect(() => {
    setFormData(cliente);
  }, [cliente]);

  // Inicializar dados mensais quando o componente carregar ou dadosMensais mudar
  useEffect(() => {
    if (dadosMensais) {
      setDadosMensaisData({
        faturamentoPrefeitura: dadosMensais.faturamentoPrefeitura ?? null,
        valorSittax: dadosMensais.valorSittax ?? null,
      });
    }
  }, [dadosMensais]);

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const handleChange = (field: keyof Cliente, value: any) => {
    setFormData((prev: Cliente) => ({ ...prev, [field]: value }));
  };

  const handleDadosMensaisChange = (field: 'faturamentoPrefeitura' | 'valorSittax', value: number | null) => {
    setDadosMensaisData((prev) => ({ ...prev, [field]: value }));
    // Salvar automaticamente ao alterar
    if (dadosMensais?.id) {
      updateDadosMensaisMutation.mutate({ [field]: value });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {cliente.nomeCliente}
        <Box display="flex" gap={1} mt={1}>
          <CopyButton text={cliente.cnpjFormatado || cliente.cnpj || ''} label="CNPJ" />
          {cliente.linkGoogleDrive && (
            <LinkButton url={cliente.linkGoogleDrive} type="drive" />
          )}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Tabs value={tab} onChange={(_: React.SyntheticEvent, v: number) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Dados Gerais" />
          <Tab label="Transmissões" />
          <Tab label="Baixar XML" />
          <Tab label="DAS/Recibos" />
          <Tab label="Honorários" />
          <Tab label="Sócios" />
        </Tabs>

        {tab === 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome Cliente"
                value={formData.nomeCliente}
                onChange={(e) => handleChange('nomeCliente', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CNPJ"
                value={formData.cnpjFormatado || formData.cnpj}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Razão Social"
                value={formData.razaoSocial || ''}
                onChange={(e) => handleChange('razaoSocial', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Município"
                value={formData.municipio || ''}
                onChange={(e) => handleChange('municipio', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Segmento de Mercado"
                value={formData.segmentoMercado || ''}
                onChange={(e) => handleChange('segmentoMercado', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tributação"
                value={formData.tributacao || ''}
                onChange={(e) => handleChange('tributacao', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Link Google Drive"
                value={formData.linkGoogleDrive || ''}
                onChange={(e) => handleChange('linkGoogleDrive', e.target.value)}
              />
            </Grid>
          </Grid>
        )}

        {tab === 1 && dadosMensais?.transmissoesXml && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <CheckboxField
                label="XML Transmitido"
                value={dadosMensais.transmissoesXml.xmlTransmitido}
                onChange={(_: boolean) => {}}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CheckboxField
                label="Transmitido Novembro"
                value={dadosMensais.transmissoesXml.transmitidoNovembro}
                onChange={(_: boolean) => {}}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Status de Transmissão"
                value={dadosMensais.statusTransmissao || ''}
                disabled
              />
            </Grid>
          </Grid>
        )}

        {tab === 2 && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Login EBIS"
                value={formData.loginWebsiss || ''}
                disabled
                InputProps={{
                  endAdornment: formData.loginWebsiss && (
                    <InputAdornment position="end">
                      <CopyButton text={formData.loginWebsiss} label="Login" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Senha EBIS"
                type={showPassword ? 'text' : 'password'}
                value={formData.senhaWebiss || ''}
                disabled
                InputProps={{
                  endAdornment: formData.senhaWebiss && (
                    <InputAdornment position="end">
                      <Box display="flex" gap={0.5}>
                        <CopyButton text={formData.senhaWebiss} label="Senha" />
                        <Button
                          size="small"
                          onClick={() => setShowPassword(!showPassword)}
                          sx={{ minWidth: 'auto', p: 0.5 }}
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </Button>
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Link da Prefeitura"
                value={formData.sistemaMunicipalNfsE || ''}
                disabled
                InputProps={{
                  endAdornment: formData.sistemaMunicipalNfsE && (
                    <InputAdornment position="end">
                      <LinkButton url={formData.sistemaMunicipalNfsE} type="default" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <MoneyField
                label="Valor Faturamento na Prefeitura"
                value={dadosMensaisData.faturamentoPrefeitura ?? dadosMensais?.faturamentoPrefeitura ?? null}
                onChange={(value) => handleDadosMensaisChange('faturamentoPrefeitura', value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <MoneyField
                label="Valor Faturamento SITTAX"
                value={dadosMensaisData.valorSittax ?? dadosMensais?.valorSittax ?? null}
                onChange={(value) => handleDadosMensaisChange('valorSittax', value)}
                fullWidth
              />
            </Grid>
          </Grid>
        )}

        {tab === 3 && dadosMensais?.dasRecibos && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <MoneyField
                label="Valor DAS"
                value={dadosMensais.dasRecibos.valorDas}
                onChange={(_: number | null) => {}}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="% do Imposto"
                value={dadosMensais.dasRecibos.percentualImposto || ''}
                disabled
              />
            </Grid>
          </Grid>
        )}

        {tab === 4 && dadosMensais?.honorarios && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <MoneyField
                label="Valor Honorários"
                value={dadosMensais.honorarios.valorHonorarios}
                onChange={(_: number | null) => {}}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Banco de Cobrança"
                value={dadosMensais.honorarios.bancoCobranca || ''}
                disabled
              />
            </Grid>
          </Grid>
        )}

        {tab === 5 && dadosMensais?.sociosDadosMensais && (
          <Grid container spacing={2}>
            {dadosMensais.sociosDadosMensais.map((socio: any) => (
              <Grid item xs={12} key={socio.id}>
                <Box border={1} borderColor="divider" p={2} borderRadius={1}>
                  <Typography variant="h6">Sócio {socio.numeroSocio}</Typography>
                  <TextField
                    fullWidth
                    label="Nome"
                    value={socio.nomeSocio || ''}
                    disabled
                    sx={{ mt: 1 }}
                  />
                  <MoneyField
                    label="Valor DAS"
                    value={socio.valorDasSocio}
                    onChange={(_: number | null) => {}}
                    fullWidth
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ClienteForm;

