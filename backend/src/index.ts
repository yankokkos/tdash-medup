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
const PORT = process.env.PORT || 5000;

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

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

