import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import config from '../../config';

const prisma = new PrismaClient();

interface SendMessageData {
  conversationId: string;
  message: string;
  userId: string;
}

export class AICoachService {
  async createConversation(userId: string) {
    // Get user context (recent reports, programs, etc.)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        clientProfile: {
          include: {
            geneticReports: {
              take: 1,
              orderBy: { createdAt: 'desc' },
            },
            bloodReports: {
              take: 1,
              orderBy: { createdAt: 'desc' },
            },
            fitnessPrograms: {
              where: { isActive: true },
              take: 1,
            },
            nutritionPlans: {
              where: { isActive: true },
              take: 1,
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Create system context message based on user data
    let contextMessage = `You are an AI health coach assistant. You're helping ${user.firstName} ${user.lastName}.`;

    if (user.clientProfile) {
      if (user.clientProfile.geneticReports.length > 0) {
        contextMessage += ` The user has genetic analysis data available.`;
      }
      if (user.clientProfile.bloodReports.length > 0) {
        contextMessage += ` The user has recent blood work data.`;
      }
      if (user.clientProfile.fitnessPrograms.length > 0) {
        contextMessage += ` The user has an active fitness program.`;
      }
      if (user.clientProfile.nutritionPlans.length > 0) {
        contextMessage += ` The user has an active nutrition plan.`;
      }
    }

    contextMessage += ` Provide personalized, evidence-based health and fitness advice. Be supportive, encouraging, and professional.`;

    // Create conversation
    const conversation = await prisma.aIConversation.create({
      data: {
        userId,
        title: 'New Conversation',
        messages: {
          create: {
            role: 'system',
            content: contextMessage,
          },
        },
      },
      include: {
        messages: true,
      },
    });

    return conversation;
  }

  async getConversations(userId: string) {
    const conversations = await prisma.aIConversation.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 1, // Only get first message for preview
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return conversations;
  }

  async getConversationById(id: string, userId: string) {
    const conversation = await prisma.aIConversation.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    return conversation;
  }

  async sendMessage(data: SendMessageData) {
    const { conversationId, message, userId } = data;

    // Verify conversation belongs to user
    const conversation = await prisma.aIConversation.findFirst({
      where: {
        id: conversationId,
        userId,
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Save user message
    const userMessage = await prisma.aIMessage.create({
      data: {
        conversationId,
        role: 'user',
        content: message,
      },
    });

    // Prepare messages for OpenAI
    const messages = conversation.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    messages.push({
      role: 'user',
      content: message,
    });

    // Call OpenAI API
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages,
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.openai.apiKey}`,
          },
        }
      );

      const aiResponse = response.data.choices[0].message.content;

      // Save AI response
      const aiMessage = await prisma.aIMessage.create({
        data: {
          conversationId,
          role: 'assistant',
          content: aiResponse,
        },
      });

      // Update conversation title if it's the first user message
      if (conversation.messages.filter((m) => m.role === 'user').length === 0) {
        await prisma.aIConversation.update({
          where: { id: conversationId },
          data: {
            title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
          },
        });
      }

      // Update conversation updatedAt
      await prisma.aIConversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });

      return {
        userMessage,
        aiMessage,
      };
    } catch (error: any) {
      console.error('OpenAI API Error:', error.response?.data || error.message);

      // Fallback response if OpenAI fails
      const fallbackMessage = await prisma.aIMessage.create({
        data: {
          conversationId,
          role: 'assistant',
          content:
            "I apologize, but I'm having trouble connecting to my AI service right now. Please try again in a moment, or contact your coach directly for assistance.",
        },
      });

      return {
        userMessage,
        aiMessage: fallbackMessage,
      };
    }
  }

  async deleteConversation(id: string, userId: string) {
    const conversation = await prisma.aIConversation.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    await prisma.aIConversation.delete({
      where: { id },
    });

    return { success: true };
  }
}

export const aiCoachService = new AICoachService();
