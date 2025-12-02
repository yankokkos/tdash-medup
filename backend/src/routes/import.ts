import { Router } from 'express';
import ImportController from '../controllers/ImportController';

const router = Router();
const controller = new ImportController();

router.post('/json', (req, res) => controller.importJson(req, res));
router.post('/csv', (req, res) => controller.importCsv(req, res));
router.post('/google-sheets', (req, res) => controller.importGoogleSheets(req, res));
router.get('/status/:jobId', (req, res) => controller.getStatus(req, res));

export default router;

