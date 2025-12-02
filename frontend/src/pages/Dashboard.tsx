import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Box,
  Chip,
  Button,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { useState } from 'react';
import { dashboardApi } from '../services/api';
import { Link } from 'react-router-dom';
import ImportDialog from '../components/ImportDialog/ImportDialog';

function Dashboard() {
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const { data: estatisticas, isLoading } = useQuery({
    queryKey: ['dashboard', 'estatisticas'],
    queryFn: () => dashboardApi.getEstatisticas().then(res => res.data),
  });

  const { data: pendencias, isLoading: loadingPendencias } = useQuery({
    queryKey: ['dashboard', 'pendencias'],
    queryFn: () => dashboardApi.getPendencias().then(res => res.data),
  });

  if (isLoading || loadingPendencias) {
    return <Container>Carregando...</Container>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Dashboard - TDash MedUp
        </Typography>
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          onClick={() => setImportDialogOpen(true)}
        >
          Importar Planilha
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total de Clientes</Typography>
            <Typography variant="h4">{estatisticas?.totalClientes || 0}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Clientes Ativos</Typography>
            <Typography variant="h4">{estatisticas?.clientesAtivos || 0}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Transmitidos</Typography>
            <Typography variant="h4">{estatisticas?.totalTransmitido || 0}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Pendentes</Typography>
            <Typography variant="h4">{estatisticas?.totalPendente || 0}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Lista de Pendências
            </Typography>
            {pendencias && pendencias.length > 0 ? (
              <List>
                {pendencias.map((pendencia: any) => (
                  <ListItem
                    key={pendencia.id}
                    component={Link}
                    to={`/clientes?search=${encodeURIComponent(pendencia.nomeCliente)}`}
                    sx={{
                      textDecoration: 'none',
                      color: 'inherit',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemText
                      primary={pendencia.nomeCliente}
                      secondaryTypographyProps={{ component: 'div' }}
                      secondary={
                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                          <Chip
                            label={pendencia.tipoPendencia}
                            size="small"
                            color="warning"
                          />
                          {pendencia.descricao && (
                            <Typography variant="body2" color="text.secondary" component="span">
                              {pendencia.descricao}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nenhuma pendência encontrada
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <ImportDialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} />
    </Container>
  );
}

export default Dashboard;

