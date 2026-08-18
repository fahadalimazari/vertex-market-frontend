import apiService from './api/apiService';
import { initialReviews, initialReviewReports } from '../data/reviews';

const REVIEWS_KEY = 'vertex_reviews_v1';
const REPORTS_KEY = 'vertex_review_reports_v1';
const VOTES_KEY = 'vertex_review_votes_v1';
const LOGS_KEY = 'vertex_admin_logs_v1';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const getLocalData = (key, initialData) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : initialData;
  } catch {
    return initialData;
  }
};

const setLocalData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const addAdminLog = (action, details) => {
  const logs = getLocalData(LOGS_KEY, []);
  const newLog = {
    id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
    adminName: 'System / Admin',
    action,
    details,
    createdAt: new Date().toISOString()
  };
  setLocalData(LOGS_KEY, [newLog, ...logs]);
};

export const reviewService = {
  // Get all reviews (Admin)
  getAllReviews: async () => {
    await delay(300);
    return getLocalData(REVIEWS_KEY, initialReviews);
  },

  // Get reported reviews (Admin)
  getReportedReviews: async () => {
    await delay(300);
    return getLocalData(REPORTS_KEY, initialReviewReports);
  },

  // Get reviews by Product Slug
  getReviewsByProduct: async (productSlug) => {
    try {
      const response = await apiService.get(`/reviews/product/${productSlug}`);
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch reviews', error);
      return [];
    }
  },

  // Get reviews by User ID
  getReviewsByUser: async (userId) => {
    await delay(300);
    const reviews = getLocalData(REVIEWS_KEY, initialReviews);
    return reviews.filter(r => r.userId === userId && r.status !== 'deleted');
  },

  // Get reviews by Seller ID
  getReviewsBySeller: async (sellerId) => {
    await delay(300);
    const reviews = getLocalData(REVIEWS_KEY, initialReviews);
    return reviews.filter(r => r.sellerId === sellerId && r.status === 'approved');
  },

  // Submit new review
  submitReview: async (reviewData) => {
    try {
      const response = await apiService.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      throw error; // Let the UI handle the error (e.g. duplicate review)
    }
  },

  // Edit existing review
  editReview: async (reviewId, updates, userId) => {
    await delay(500);
    let reviews = getLocalData(REVIEWS_KEY, initialReviews);
    const index = reviews.findIndex(r => r.id === reviewId && r.userId === userId);
    if (index === -1) throw new Error('Review not found or unauthorized.');

    reviews[index] = { ...reviews[index], ...updates };
    setLocalData(REVIEWS_KEY, reviews);
    addAdminLog('Review Edited', `User ${userId} edited review ${reviewId}`);
    return reviews[index];
  },

  // Delete review (Soft delete)
  deleteReview: async (reviewId, userId = null) => {
    await delay(400);
    let reviews = getLocalData(REVIEWS_KEY, initialReviews);
    const index = reviews.findIndex(r => r.id === reviewId);
    if (index === -1) throw new Error('Review not found.');
    
    if (userId && reviews[index].userId !== userId && userId !== 'admin') {
      throw new Error('Unauthorized');
    }

    reviews[index].status = 'deleted';
    setLocalData(REVIEWS_KEY, reviews);
    addAdminLog('Review Deleted', `Review ${reviewId} was deleted.`);
    return true;
  },

  // Admin: Change Status (Approve, Hide, Restore)
  changeReviewStatus: async (reviewId, newStatus) => {
    await delay(300);
    let reviews = getLocalData(REVIEWS_KEY, initialReviews);
    const index = reviews.findIndex(r => r.id === reviewId);
    if (index === -1) throw new Error('Review not found.');
    
    reviews[index].status = newStatus;
    setLocalData(REVIEWS_KEY, reviews);
    addAdminLog(`Review ${newStatus}`, `Review ${reviewId} status changed to ${newStatus}`);
    return reviews[index];
  },

  // Seller reply
  replyToReview: async (reviewId, sellerId, sellerName, text) => {
    await delay(500);
    let reviews = getLocalData(REVIEWS_KEY, initialReviews);
    const index = reviews.findIndex(r => r.id === reviewId && r.sellerId === sellerId);
    if (index === -1) throw new Error('Review not found or unauthorized.');
    if (reviews[index].sellerReply) throw new Error('You have already replied to this review.');

    reviews[index].sellerReply = {
      id: `REP-${Date.now()}`,
      sellerName,
      text,
      createdAt: new Date().toISOString()
    };
    setLocalData(REVIEWS_KEY, reviews);
    addAdminLog('Seller Replied', `Seller ${sellerId} replied to review ${reviewId}`);
    return reviews[index];
  },

  // Vote helpful / unhelpful
  voteReview: async (reviewId, userId, voteType) => {
    await delay(200);
    let reviews = getLocalData(REVIEWS_KEY, initialReviews);
    let votes = getLocalData(VOTES_KEY, {}); 

    const index = reviews.findIndex(r => r.id === reviewId);
    if (index === -1) throw new Error('Review not found.');

    if (!votes[reviewId]) votes[reviewId] = {};
    const previousVote = votes[reviewId][userId];
    
    if (previousVote === voteType) {
      delete votes[reviewId][userId];
      reviews[index][`${voteType}Votes`] = Math.max(0, reviews[index][`${voteType}Votes`] - 1);
    } else {
      if (previousVote) {
        reviews[index][`${previousVote}Votes`] = Math.max(0, reviews[index][`${previousVote}Votes`] - 1);
      }
      votes[reviewId][userId] = voteType;
      reviews[index][`${voteType}Votes`] += 1;
    }

    setLocalData(REVIEWS_KEY, reviews);
    setLocalData(VOTES_KEY, votes);
    return { review: reviews[index], userVote: votes[reviewId][userId] || null };
  },

  // Report review
  reportReview: async (reportData) => {
    await delay(500);
    const reports = getLocalData(REPORTS_KEY, initialReviewReports);
    const newReport = {
      ...reportData,
      id: `REP-R-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setLocalData(REPORTS_KEY, [newReport, ...reports]);
    
    // Also update review status to reported
    let reviews = getLocalData(REVIEWS_KEY, initialReviews);
    const reviewIndex = reviews.findIndex(r => r.id === reportData.reviewId);
    if (reviewIndex > -1) {
      reviews[reviewIndex].status = 'reported';
      setLocalData(REVIEWS_KEY, reviews);
    }
    
    addAdminLog('Review Reported', `Review ${reportData.reviewId} reported for ${reportData.reason}`);
    return newReport;
  },
  
  // Resolve report (Admin)
  resolveReport: async (reportId, action) => {
    await delay(300);
    const reports = getLocalData(REPORTS_KEY, initialReviewReports);
    const index = reports.findIndex(r => r.id === reportId);
    if (index > -1) {
      reports[index].status = 'resolved';
      reports[index].actionTaken = action;
      setLocalData(REPORTS_KEY, reports);
    }
    return reports[index];
  },

  // Calculate stats for a product
  calculateProductStats: (reviews) => {
    // Only count approved reviews for stats
    const validReviews = reviews.filter(r => r.status === 'approved');
    const totalReviews = validReviews.length;
    
    if (totalReviews === 0) return { averageRating: 0, totalReviews: 0, ratingDistribution: { 5:0, 4:0, 3:0, 2:0, 1:0 }, recommendationPercentage: 0 };

    let sum = 0;
    let recommendCount = 0;
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    validReviews.forEach(r => {
      sum += r.rating;
      dist[r.rating] = (dist[r.rating] || 0) + 1;
      if (r.recommendProduct) recommendCount += 1;
    });

    return {
      averageRating: Number((sum / totalReviews).toFixed(1)),
      totalReviews,
      ratingDistribution: dist,
      recommendationPercentage: Math.round((recommendCount / totalReviews) * 100)
    };
  }
};
