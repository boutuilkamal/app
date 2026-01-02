import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const aiApi = axios.create({
  baseURL: `${AI_SERVICE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

aiApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Functions
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (data: any) => api.post('/auth/change-password', data),
};

export const reportsApi = {
  uploadGenetic: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/reports/genetic/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadBlood: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/reports/blood/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getGeneticReports: () => api.get('/reports/genetic'),
  getBloodReports: () => api.get('/reports/blood'),
  getGeneticReport: (id: string) => api.get(`/reports/genetic/${id}`),
  getBloodReport: (id: string) => api.get(`/reports/blood/${id}`),
};

export const geneticsApi = {
  getAllGenes: () => api.get('/genetics/genes'),
  getGene: (symbol: string) => api.get(`/genetics/genes/${symbol}`),
  getCategories: () => api.get('/genetics/categories'),
};

export const biomarkersApi = {
  getAllBiomarkers: () => api.get('/biomarkers'),
  getBiomarker: (name: string) => api.get(`/biomarkers/${name}`),
  getCategories: () => api.get('/biomarkers/categories'),
};

export const programsApi = {
  createFitnessProgram: (data: any) => api.post('/programs/fitness', data),
  getFitnessPrograms: () => api.get('/programs/fitness'),
  getFitnessProgram: (id: string) => api.get(`/programs/fitness/${id}`),
  updateFitnessProgram: (id: string, data: any) => api.put(`/programs/fitness/${id}`, data),
  deleteFitnessProgram: (id: string) => api.delete(`/programs/fitness/${id}`),
};

export const nutritionApi = {
  createPlan: (data: any) => api.post('/nutrition/plans', data),
  getPlans: () => api.get('/nutrition/plans'),
  getPlan: (id: string) => api.get(`/nutrition/plans/${id}`),
  updatePlan: (id: string, data: any) => api.put(`/nutrition/plans/${id}`, data),
  deletePlan: (id: string) => api.delete(`/nutrition/plans/${id}`),
};

export const supplementsApi = {
  createProtocol: (data: any) => api.post('/supplements/protocols', data),
  getProtocols: () => api.get('/supplements/protocols'),
  getProtocol: (id: string) => api.get(`/supplements/protocols/${id}`),
  updateProtocol: (id: string, data: any) => api.put(`/supplements/protocols/${id}`, data),
  deleteProtocol: (id: string) => api.delete(`/supplements/protocols/${id}`),
};

export const librariesApi = {
  getExercises: (params?: any) => api.get('/libraries/exercises', { params }),
  getExercise: (id: string) => api.get(`/libraries/exercises/${id}`),
  getRecipes: (params?: any) => api.get('/libraries/recipes', { params }),
  getRecipe: (id: string) => api.get(`/libraries/recipes/${id}`),
  getSupplements: (params?: any) => api.get('/libraries/supplements', { params }),
  getSupplement: (id: string) => api.get(`/libraries/supplements/${id}`),
};

export const aiCoachApi = {
  createConversation: () => api.post('/ai-coach/conversations'),
  getConversations: () => api.get('/ai-coach/conversations'),
  getConversation: (id: string) => api.get(`/ai-coach/conversations/${id}`),
  sendMessage: (conversationId: string, message: string) =>
    api.post(`/ai-coach/conversations/${conversationId}/messages`, { message }),
};
