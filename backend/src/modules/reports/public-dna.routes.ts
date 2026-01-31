import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { config } from '../../config';
import { asyncHandler } from '../../utils/errorHandler';

const router = Router();

// Public endpoint for DNA analysis (no authentication required)
router.post(
  '/analyze',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.files || !req.files.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    const file = Array.isArray(req.files.file) ? req.files.file[0] : req.files.file;

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'text/csv',
      'text/plain',
      'image/png',
      'image/jpeg',
      'image/jpg',
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file type. Allowed: PDF, CSV, TXT, PNG, JPG',
      });
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds 10MB limit',
      });
    }

    try {
      // Forward file to AI service for analysis
      const formData = new FormData();
      const blob = new Blob([file.data], { type: file.mimetype });
      formData.append('file', blob, file.name);

      const aiServiceUrl = config.aiServiceUrl || 'http://localhost:8000';
      
      const response = await axios.post(
        `${aiServiceUrl}/api/v1/analyze/genetic`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 120000, // 2 minutes for analysis
        }
      );

      res.status(200).json({
        success: true,
        data: response.data,
        message: 'DNA report analyzed successfully',
      });
    } catch (error) {
      console.error('AI Service error:', error);
      
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.detail || error.message;
        
        return res.status(statusCode).json({
          success: false,
          error: `Analysis failed: ${errorMessage}`,
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Failed to analyze DNA report. Please try again.',
      });
    }
  })
);

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Public DNA analysis API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
