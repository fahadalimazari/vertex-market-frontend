import { Logger } from '../utils/Logger';

export const trackEvent = (eventName, data = {}) => {
  if (import.meta.env.PROD) {
    // Send to Google Analytics, Mixpanel, etc.
    Logger.log(`[Analytics] ${eventName}`, data);
  }
};

export const trackPageView = (url) => {
  trackEvent('page_view', { url });
};

export const trackError = (error, context = {}) => {
  Logger.error(`[Error Tracking] ${error.message}`, { error, ...context });
};
