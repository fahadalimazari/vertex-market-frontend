export const defaultTenantConfig = {
  id: 'vertex_main',
  name: 'Vertex Market',
  domain: 'vertexmarket.com',
  branding: {
    logo: '/logo.png',
    primaryColor: '#ff6a00',
    secondaryColor: '#1f2937',
    fontFamily: 'Inter, sans-serif'
  },
  subscription: {
    plan: 'Enterprise',
    status: 'active',
    features: ['api_access', 'custom_domain', 'white_label', 'ai_builder']
  },
  settings: {
    currency: 'USD',
    language: 'en',
    timezone: 'UTC'
  }
};
