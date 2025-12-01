import { Router } from 'express';
import DashboardController from '../controllers/DashboardController';

const router = Router();
const controller = new DashboardController();

router.get('/estatisticas', controller.getEstatisticas);
router.get('/pendencias', controller.getPendencias);
router.get('/graficos', controller.getGraficos);

export default router;

