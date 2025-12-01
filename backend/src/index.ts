import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import clientesRoutes from './routes/clientes';
import mesesRoutes from './routes/meses';
import dadosMensaisRoutes from './routes/dadosMensais';
import importRoutes from './routes/import';
import historicoRoutes from './routes/historico';
import dashboardRoutes from './routes/dashboard';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// Inicializar servidor imediatamente, sem esperar banco
// A conexão com o banco será feita sob demanda nas rotas

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/clientes', clientesRoutes);
app.use('/api/meses', mesesRoutes);
app.use('/api/dados-mensais', dadosMensaisRoutes);
app.use('/api/import', importRoutes);
app.use('/api/historico', historicoRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rota raiz para health check do Docker
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'TDash MedUp API', timestamp: new Date().toISOString() });
});

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`✅ Health check available at http://0.0.0.0:${PORT}/`);
});

// Tratamento de erros
server.on('error', (error: any) => {
  console.error('❌ Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
  });
});

