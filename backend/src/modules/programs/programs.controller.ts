import { Request, Response } from 'express';
import { programsService } from './programs.service';

export class ProgramsController {
  async createFitnessProgram(req: Request, res: Response) {
    try {
      const program = await programsService.createFitnessProgram(req.body);

      res.status(201).json({
        success: true,
        data: program,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create fitness program',
      });
    }
  }

  async getFitnessPrograms(req: Request, res: Response) {
    try {
      const clientId = req.query.clientId as string;
      const coachId = req.query.coachId as string;

      const programs = await programsService.getFitnessPrograms(clientId, coachId);

      res.json({
        success: true,
        data: programs,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch programs',
      });
    }
  }

  async getFitnessProgramById(req: Request, res: Response) {
    try {
      const program = await programsService.getFitnessProgramById(req.params.id);

      res.json({
        success: true,
        data: program,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Program not found',
      });
    }
  }

  async updateFitnessProgram(req: Request, res: Response) {
    try {
      const program = await programsService.updateFitnessProgram(req.params.id, req.body);

      res.json({
        success: true,
        data: program,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update program',
      });
    }
  }

  async deleteFitnessProgram(req: Request, res: Response) {
    try {
      await programsService.deleteFitnessProgram(req.params.id);

      res.json({
        success: true,
        message: 'Program deleted successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete program',
      });
    }
  }

  async activateFitnessProgram(req: Request, res: Response) {
    try {
      const program = await programsService.activateFitnessProgram(req.params.id);

      res.json({
        success: true,
        data: program,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to activate program',
      });
    }
  }
}

export const programsController = new ProgramsController();
