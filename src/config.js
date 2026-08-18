export const config = {
  appName: 'Vertex Market',
  version: '1.0.0',
  apiUrl: 'http://localhost:5000/api/v1',
  environment: import.meta.env.MODE || 'development',
  features: {
    enableAnalytics: true,
    enablePWA: true,
    enableRTL: true,
  },
  monitoring: {
    logErrors: import.meta.env.PROD,
    sampleRate: 0.1,
  }
};
