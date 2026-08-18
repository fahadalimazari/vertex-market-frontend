export const dashboardService = {
  getDashboardStats: () => {
    return Promise.resolve({
      monthlySales: 154000,
      activeUsers: 3400
    });
  }
};

export default dashboardService;
