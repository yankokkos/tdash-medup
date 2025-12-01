import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Edit, Visibility } from '@mui/icons-material';
import { useState } from 'react';
import type { Cliente, PaginatedResponse } from '../../types/cliente';
import CopyButton from '../CopyButton';
import LinkButton from '../LinkButton';
import ClienteForm from '../ClienteForm/ClienteForm';

interface ClientesTableProps {
  clientes: Cliente[];
  pagination?: PaginatedResponse<Cliente>['pagination'];
  loading?: boolean;
  mesId?: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

function ClientesTable({
  clientes,
  pagination,
  loading,
  mesId,
  onPageChange,
  onRefresh,
}: ClientesTableProps) {
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setFormOpen(true);
  };

  const handleView = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedCliente(null);
    onRefresh();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>N</TableCell>
              <TableCell>Nome Cliente</TableCell>
              <TableCell>CNPJ</TableCell>
              <TableCell>Razão Social</TableCell>
              <TableCell>Município</TableCell>
              <TableCell>Segmento</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Links</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.id} hover>
                <TableCell>{cliente.numero || '-'}</TableCell>
                <TableCell>{cliente.nomeCliente}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {cliente.cnpjFormatado || cliente.cnpj}
                    <CopyButton
                      text={cliente.cnpjFormatado || cliente.cnpj || ''}
                      label="CNPJ"
                    />
                  </Box>
                </TableCell>
                <TableCell>{cliente.razaoSocial || '-'}</TableCell>
                <TableCell>{cliente.municipio || '-'}</TableCell>
                <TableCell>{cliente.segmentoMercado || '-'}</TableCell>
                <TableCell>{cliente.statusCliente?.statusCliente || '-'}</TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    {cliente.linkGoogleDrive && (
                      <LinkButton url={cliente.linkGoogleDrive} type="drive" />
                    )}
                    {cliente.taskClickup1 && (
                      <LinkButton
                        url={`https://app.clickup.com/t/${cliente.taskClickup1}`}
                        type="clickup"
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Tooltip title="Visualizar">
                    <IconButton size="small" onClick={() => handleView(cliente)}>
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton size="small" onClick={() => handleEdit(cliente)}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && (
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page - 1}
          onPageChange={(_, page) => onPageChange(page + 1)}
          rowsPerPage={pagination.limit}
          rowsPerPageOptions={[25, 50, 100]}
          labelRowsPerPage="Linhas por página:"
        />
      )}

      {selectedCliente && (
        <ClienteForm
          open={formOpen}
          cliente={selectedCliente}
          mesId={mesId}
          onClose={handleCloseForm}
        />
      )}
    </>
  );
}

export default ClientesTable;

