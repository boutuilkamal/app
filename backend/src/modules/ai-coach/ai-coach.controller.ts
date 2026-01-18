import { Request, Response } from 'express';
import { aiCoachService } from './ai-coach.service';

export class AICoachController {
  async createConversation(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const conversation = await aiCoachService.createConversation(userId);

      res.status(201).json({
        success: true,
        data: conversation,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create conversation',
      });
    }
  }

  async getConversations(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const conversations = await aiCoachService.getConversations(userId);

      res.json({
        success: true,
        data: conversations,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch conversations',
      });
    }
  }

  async getConversationById(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const conversation = await aiCoachService.getConversationById(req.params.id, userId);

      res.json({
        success: true,
        data: conversation,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Conversation not found',
      });
    }
  }

  async sendMessage(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { message } = req.body;
      const conversationId = req.params.id;

      if (!message) {
        return res.status(400).json({
          success: false,
          message: 'Message is required',
        });
      }

      const result = await aiCoachService.sendMessage({
        conversationId,
        message,
        userId,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to send message',
      });
    }
  }

  async deleteConversation(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      await aiCoachService.deleteConversation(req.params.id, userId);

      res.json({
        success: true,
        message: 'Conversation deleted successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete conversation',
      });
    }
  }
}

export const aiCoachController = new AICoachController();
