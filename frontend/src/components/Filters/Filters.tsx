import { TextField, MenuItem, Select, FormControl, InputLabel, Grid } from '@mui/material';
import type { Mes } from '../../types/cliente';

interface FiltersProps {
  meses: Mes[];
  filters: {
    search: string;
    municipio: string;
    segmento: string;
    status: string;
    pendente?: string;
    etapa?: string;
    mesId?: number;
  };
  onFilterChange: (filters: Partial<FiltersProps['filters']>) => void;
}

function Filters({ meses, filters, onFilterChange }: FiltersProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          label="Buscar"
          placeholder="CNPJ, nome, razão social..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
        />
      </Grid>

      <Grid item xs={12} md={2}>
        <FormControl fullWidth>
          <InputLabel>Mês</InputLabel>
          <Select
            value={filters.mesId || ''}
            label="Mês"
            onChange={(e) =>
              onFilterChange({ mesId: e.target.value ? Number(e.target.value) : undefined })
            }
          >
            <MenuItem value="">Todos</MenuItem>
            {meses.map((mes) => (
              <MenuItem key={mes.id} value={mes.id}>
                {mes.nomeExibicao}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={2}>
        <TextField
          fullWidth
          label="Município"
          value={filters.municipio}
          onChange={(e) => onFilterChange({ municipio: e.target.value })}
        />
      </Grid>

      <Grid item xs={12} md={2}>
        <TextField
          fullWidth
          label="Segmento"
          value={filters.segmento}
          onChange={(e) => onFilterChange({ segmento: e.target.value })}
        />
      </Grid>

      <Grid item xs={12} md={2}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            label="Status"
            onChange={(e) => onFilterChange({ status: e.target.value })}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="Ativo">Ativo</MenuItem>
            <MenuItem value="Pausado">Pausado</MenuItem>
            <MenuItem value="Inativo">Inativo</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={2}>
        <FormControl fullWidth>
          <InputLabel>Pendentes</InputLabel>
          <Select
            value={filters.pendente || ''}
            label="Pendentes"
            onChange={(e) => onFilterChange({ pendente: e.target.value || undefined })}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="xml">XML Não Transmitido</MenuItem>
            <MenuItem value="honorarios">Honorários Pendentes</MenuItem>
            <MenuItem value="das">DAS Pendente</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={2}>
        <FormControl fullWidth>
          <InputLabel>Etapa</InputLabel>
          <Select
            value={filters.etapa || ''}
            label="Etapa"
            onChange={(e) => onFilterChange({ etapa: e.target.value || undefined })}
          >
            <MenuItem value="">Todas</MenuItem>
            <MenuItem value="Abertura">Abertura</MenuItem>
            <MenuItem value="Em Andamento">Em Andamento</MenuItem>
            <MenuItem value="Concluído">Concluído</MenuItem>
            <MenuItem value="Pausado">Pausado</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}

export default Filters;

