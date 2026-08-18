export const checkSystemHealth = () => {
  const health = {
    status: 'Healthy',
    score: 100,
    services: {
      localStorage: false,
      serviceWorker: 'serviceWorker' in navigator,
      apis: true,
      auth: !!localStorage.getItem('vertex_auth_v1'),
      cache: !!window.caches
    }
  };

  try {
    localStorage.setItem('test', '1');
    localStorage.removeItem('test');
    health.services.localStorage = true;
  } catch(e) {
    health.score -= 20;
    health.status = 'Degraded';
  }

  if (!health.services.serviceWorker) {
    health.score -= 10;
  }

  return health;
};
