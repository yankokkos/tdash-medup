import { Router } from 'express';
import HistoricoController from '../controllers/HistoricoController';

const router = Router();
const controller = new HistoricoController();

router.get('/', controller.list);
router.get('/cliente/:id', controller.getByCliente);
router.get('/mes/:mesId', controller.getByMes);

export default router;

