export const FEATURES = {
  AI_ASSISTANT: true,
  SELLER_CENTER: true,
  ADMIN_PANEL: true,
  MULTI_LANGUAGE: true,
  MULTI_CURRENCY: true,
  FLASH_SALE: true,
  PWA_INSTALL: true,
  NEWSLETTER: true,
  WISHLIST: true,
  COMPARE: true,
  REVIEWS: true,
};

export const isFeatureEnabled = (featureKey) => {
  return FEATURES[featureKey] === true;
};
