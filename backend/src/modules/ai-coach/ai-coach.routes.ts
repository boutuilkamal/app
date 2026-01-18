import { Router } from 'express';
import { protect } from '../auth/auth.middleware';
import { aiCoachController } from './ai-coach.controller';

const router = Router();

router.use(protect);

router.post('/conversations', aiCoachController.createConversation.bind(aiCoachController));
router.get('/conversations', aiCoachController.getConversations.bind(aiCoachController));
router.get('/conversations/:id', aiCoachController.getConversationById.bind(aiCoachController));
router.post('/conversations/:id/messages', aiCoachController.sendMessage.bind(aiCoachController));
router.delete('/conversations/:id', aiCoachController.deleteConversation.bind(aiCoachController));

export default router;
