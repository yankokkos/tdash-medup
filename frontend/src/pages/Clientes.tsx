import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container, Typography, Box } from '@mui/material';
import ClientesTable from '../components/ClientesTable/ClientesTable';
import Filters from '../components/Filters/Filters';
import { clientesApi, mesesApi } from '../services/api';

function Clientes() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 50,
    search: '',
    municipio: '',
    segmento: '',
    status: '',
    pendente: '',
    etapa: '',
    mesId: undefined as number | undefined,
  });

  const { data: meses } = useQuery({
    queryKey: ['meses'],
    queryFn: () => mesesApi.list().then(res => res.data),
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['clientes', filters],
    queryFn: () =>
      clientesApi
        .list({
          page: filters.page,
          limit: filters.limit,
          search: filters.search || undefined,
          municipio: filters.municipio || undefined,
          segmento: filters.segmento || undefined,
          status: filters.status || undefined,
          pendente: filters.pendente || undefined,
          etapa: filters.etapa || undefined,
          mesId: filters.mesId,
        })
        .then(res => res.data),
  });

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Clientes
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Filters
          meses={meses || []}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </Box>

      <ClientesTable
        clientes={data?.data || []}
        pagination={data?.pagination}
        loading={isLoading}
        mesId={filters.mesId}
        onPageChange={(page) => handleFilterChange({ page })}
        onRefresh={refetch}
      />
    </Container>
  );
}

export default Clientes;

