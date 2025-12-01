import { Router } from 'express';
import DadosMensaisController from '../controllers/DadosMensaisController';

const router = Router();
const controller = new DadosMensaisController();

router.get('/cliente/:id/mes/:mesId', controller.getByClienteAndMes);
router.put('/:id', controller.update);
router.post('/', controller.create);

export default router;

