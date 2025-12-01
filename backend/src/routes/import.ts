import { Router } from 'express';
import ImportController from '../controllers/ImportController';

const router = Router();
const controller = new ImportController();

router.post('/json', controller.importJson);
router.post('/csv', controller.importCsv);
router.get('/status/:jobId', controller.getStatus);

export default router;

