import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          TDash MedUp
        </Typography>
        <Box>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{ fontWeight: location.pathname === '/' ? 'bold' : 'normal' }}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/clientes"
            sx={{ fontWeight: location.pathname === '/clientes' ? 'bold' : 'normal' }}
          >
            Clientes
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/comparacao"
            sx={{ fontWeight: location.pathname === '/comparacao' ? 'bold' : 'normal' }}
          >
            Comparação
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;

