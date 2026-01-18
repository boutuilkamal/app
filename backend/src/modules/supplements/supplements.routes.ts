import { Router } from 'express';
import { protect } from '../auth/auth.middleware';
import { supplementsController } from './supplements.controller';

const router = Router();

router.use(protect);

router.post('/protocols', supplementsController.createSupplementProtocol.bind(supplementsController));
router.get('/protocols', supplementsController.getSupplementProtocols.bind(supplementsController));
router.get('/protocols/:id', supplementsController.getSupplementProtocolById.bind(supplementsController));
router.put('/protocols/:id', supplementsController.updateSupplementProtocol.bind(supplementsController));
router.delete('/protocols/:id', supplementsController.deleteSupplementProtocol.bind(supplementsController));
router.post('/protocols/:id/activate', supplementsController.activateSupplementProtocol.bind(supplementsController));

export default router;
