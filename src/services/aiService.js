import axiosClient from './api/axiosClient';

export const aiService = {
  getAIChatResponse: async (message, context = {}) => {
    try {
      const response = await axiosClient.post('/ai/chat', { 
        message, 
        page_context: context.productContext ? { type: 'product', id: context.productContext._id } : null
      });
      return response; // axiosClient already returns response.data
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        text: 'Sorry, I am having trouble connecting to the Vertex AI core right now. Please try again later.',
        action: null
      };
    }
  }
};

export default aiService;
