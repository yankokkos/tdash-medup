import { Router } from 'express';
import ClienteController from '../controllers/ClienteController';

const router = Router();
const controller = new ClienteController();

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.get('/:id/meses', controller.getMeses);

export default router;

