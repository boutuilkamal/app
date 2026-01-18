import { Request, Response } from 'express';
import { supplementsService } from './supplements.service';

export class SupplementsController {
  async createSupplementProtocol(req: Request, res: Response) {
    try {
      const protocol = await supplementsService.createSupplementProtocol(req.body);

      res.status(201).json({
        success: true,
        data: protocol,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create protocol',
      });
    }
  }

  async getSupplementProtocols(req: Request, res: Response) {
    try {
      const clientId = req.query.clientId as string;
      const coachId = req.query.coachId as string;

      const protocols = await supplementsService.getSupplementProtocols(clientId, coachId);

      res.json({
        success: true,
        data: protocols,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch protocols',
      });
    }
  }

  async getSupplementProtocolById(req: Request, res: Response) {
    try {
      const protocol = await supplementsService.getSupplementProtocolById(req.params.id);

      res.json({
        success: true,
        data: protocol,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Protocol not found',
      });
    }
  }

  async updateSupplementProtocol(req: Request, res: Response) {
    try {
      const protocol = await supplementsService.updateSupplementProtocol(req.params.id, req.body);

      res.json({
        success: true,
        data: protocol,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update protocol',
      });
    }
  }

  async deleteSupplementProtocol(req: Request, res: Response) {
    try {
      await supplementsService.deleteSupplementProtocol(req.params.id);

      res.json({
        success: true,
        message: 'Protocol deleted successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete protocol',
      });
    }
  }

  async activateSupplementProtocol(req: Request, res: Response) {
    try {
      const protocol = await supplementsService.activateSupplementProtocol(req.params.id);

      res.json({
        success: true,
        data: protocol,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to activate protocol',
      });
    }
  }
}

export const supplementsController = new SupplementsController();
