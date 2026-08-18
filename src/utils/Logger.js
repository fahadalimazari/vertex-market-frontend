export const Logger = {
  log: (message, data) => {
    if (import.meta.env.DEV) {
      console.log(`[Vertex Log]: ${message}`, data || '');
    }
  },
  error: (message, error) => {
    console.error(`[Vertex Error]: ${message}`, error);
    // Here we would push to Sentry or Datadog in production
  },
  warn: (message, data) => {
    if (import.meta.env.DEV) {
      console.warn(`[Vertex Warn]: ${message}`, data || '');
    }
  }
};

export const measurePerformance = (metricName) => {
  if (window.performance && import.meta.env.DEV) {
    const time = performance.now();
    Logger.log(`Performance [${metricName}]: ${time.toFixed(2)}ms`);
  }
};
