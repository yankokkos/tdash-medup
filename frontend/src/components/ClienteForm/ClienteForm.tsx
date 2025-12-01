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
} from '@mui/material';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { Cliente } from '../../types/cliente';
import { clientesApi } from '../../services/api';
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

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const handleChange = (field: keyof Cliente, value: any) => {
    setFormData((prev: Cliente) => ({ ...prev, [field]: value }));
  };

  // Buscar dados mensais do mês selecionado ou o primeiro disponível
  const dadosMensais = mesId
    ? cliente.dadosMensais?.find((dm: any) => dm.mesId === mesId)
    : cliente.dadosMensais?.[0];

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

        {tab === 2 && dadosMensais?.dasRecibos && (
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

        {tab === 3 && dadosMensais?.honorarios && (
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

        {tab === 4 && dadosMensais?.sociosDadosMensais && (
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

