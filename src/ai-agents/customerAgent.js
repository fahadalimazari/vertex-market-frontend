import { CoreAgent } from './coreAgent';

class CustomerAgent extends CoreAgent {
  constructor() {
    super('CustomerAgent_V1', 'Customer Assistant', [
      'product_recommendation',
      'cart_abandonment',
      'support_routing',
      'review_analysis'
    ]);
  }

  async generateRecommendations(userId, browsingHistory) {
    this.logAction(`Analyzing history for user ${userId}`);
    return await this.processTask({ type: 'recommendation', data: browsingHistory });
  }

  async handleSupportQuery(queryText) {
    this.logAction(`Processing support query: ${queryText.substring(0, 20)}...`);
    const isUrgent = queryText.toLowerCase().includes('refund') || queryText.toLowerCase().includes('broken');
    
    return await this.processTask({ 
      type: 'support_routing', 
      isUrgent,
      action: isUrgent ? 'Route to Human' : 'Auto-Reply'
    });
  }
}

export const customerAgent = new CustomerAgent();
