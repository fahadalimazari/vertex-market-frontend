export const notificationService = {
  getNotifications: () => {
    return Promise.resolve([]);
  },
  sendNotification: (notification) => {
    return Promise.resolve({ id: Date.now(), ...notification, isRead: false });
  }
};

export default notificationService;
