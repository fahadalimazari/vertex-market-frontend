export const fetchTracking = async (orderId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      import('../data/tracking').then(module => {
        const trackingData = module.mockTracking.find(t => t.orderId === orderId);
        resolve(trackingData ? trackingData.timeline : null);
      });
    }, 800); // Simulate network delay
  });
};
