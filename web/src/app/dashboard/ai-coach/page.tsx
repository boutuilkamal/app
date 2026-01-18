'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { aiCoachApi } from '@/lib/api';
import { toast } from 'sonner';

export default function AICoachPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.id);
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const response = await aiCoachApi.getConversations();
      setConversations(response.data.data || []);
    } catch (error: any) {
      toast.error('Failed to load conversations');
    }
  };

  const loadMessages = async (conversationId: string) => {
    setLoading(true);
    try {
      const response = await aiCoachApi.getConversation(conversationId);
      const conversation = response.data.data;
      setMessages(conversation.messages.filter((m: any) => m.role !== 'system'));
    } catch (error: any) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const createNewConversation = async () => {
    try {
      const response = await aiCoachApi.createConversation();
      const newConversation = response.data.data;
      setConversations([newConversation, ...conversations]);
      setActiveConversation(newConversation);
      toast.success('New conversation started');
    } catch (error: any) {
      toast.error('Failed to create conversation');
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !activeConversation) return;

    const message = inputMessage.trim();
    setInputMessage('');
    setSending(true);

    // Optimistically add user message
    const tempUserMsg = {
      id: 'temp-user',
      role: 'user',
      content: message,
      createdAt: new Date(),
    };
    setMessages([...messages, tempUserMsg]);

    try {
      const response = await aiCoachApi.sendMessage(activeConversation.id, message);
      const { userMessage, aiMessage } = response.data.data;

      // Replace temp message with actual messages
      setMessages((prev) =>
        prev.filter((m) => m.id !== 'temp-user').concat([userMessage, aiMessage])
      );

      // Update conversation in list
      loadConversations();
    } catch (error: any) {
      toast.error('Failed to send message');
      // Remove temp message on error
      setMessages((prev) => prev.filter((m) => m.id !== 'temp-user'));
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="h-[calc(100vh-200px)]">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white mb-6">
            <h1 className="text-2xl font-bold mb-2">AI Health Coach</h1>
            <p className="text-indigo-100">
              Get personalized health advice 24/7 from your AI coach
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100%-120px)]">
            {/* Conversations Sidebar */}
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 overflow-y-auto">
              <button
                onClick={createNewConversation}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition mb-4 font-medium"
              >
                + New Conversation
              </button>

              <div className="space-y-2">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversation(conv)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                      activeConversation?.id === conv.id
                        ? 'bg-indigo-50 dark:bg-indigo-900 border-2 border-indigo-500'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {conv.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(conv.updatedAt).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>

              {conversations.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
                  No conversations yet. Start a new one!
                </div>
              )}
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col h-full">
              {activeConversation ? (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {loading ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                      </div>
                    ) : (
                      <>
                        {messages.map((message, index) => (
                          <div
                            key={message.id || index}
                            className={`flex ${
                              message.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                message.role === 'user'
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                              }`}
                            >
                              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                              <div
                                className={`text-xs mt-1 ${
                                  message.role === 'user'
                                    ? 'text-indigo-200'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}
                              >
                                {new Date(message.createdAt).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>

                  {/* Input Area */}
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-end space-x-2">
                      <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message... (Press Enter to send)"
                        rows={3}
                        disabled={sending}
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!inputMessage.trim() || sending}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                      >
                        {sending ? (
                          <div className="flex items-center">
                            <svg
                              className="animate-spin h-5 w-5 mr-2"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Sending...
                          </div>
                        ) : (
                          'Send'
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      💡 Tip: The AI coach has access to your health data and can provide
                      personalized advice
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-center p-6">
                  <div>
                    <div className="text-6xl mb-4">🤖</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Welcome to AI Health Coach
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Start a new conversation or select an existing one to continue chatting
                    </p>
                    <button
                      onClick={createNewConversation}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                    >
                      Start New Conversation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
