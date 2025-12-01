import { Router } from 'express';
import MesController from '../controllers/MesController';

const router = Router();
const controller = new MesController();

router.get('/', controller.list);
router.get('/:mesId/clientes', controller.getClientes);

export default router;

