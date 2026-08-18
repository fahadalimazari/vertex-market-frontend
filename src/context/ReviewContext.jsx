import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { reviewService } from '../services/reviewService';
import { useNotifications } from './NotificationContext';
import { DashboardContext } from './Dashboard/DashboardContext';
import toast from 'react-hot-toast';

export const ReviewContext = createContext(null);

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};

export const ReviewProvider = ({ children }) => {
  const { generateNotification } = useNotifications();
  const dashboardContext = useContext(DashboardContext);
  const orders = dashboardContext?.orders || []; 

  const [reviews, setReviews] = useState([]);
  const [reportedReviews, setReportedReviews] = useState([]);
  const [productStats, setProductStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState('all'); 
  const [sort, setSort] = useState('latest'); 

  // Load all reviews (For Admin)
  const loadAllReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await reviewService.getAllReviews();
      setReviews(data);
    } catch (err) {
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load reported reviews (For Admin)
  const loadReportedReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await reviewService.getReportedReviews();
      setReportedReviews(data);
    } catch (err) {
      toast.error('Failed to load reported reviews');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load reviews for a specific product
  const loadProductReviews = useCallback(async (productSlug) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reviewService.getReviewsByProduct(productSlug);
      setReviews(data);
      setProductStats(reviewService.calculateProductStats(data));
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load reviews by User
  const loadUserReviews = useCallback(async (userId) => {
    setIsLoading(true);
    try {
      const data = await reviewService.getReviewsByUser(userId);
      setReviews(data);
    } catch (err) {
      toast.error('Failed to load user reviews');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Submit a new review
  const submitReview = async (reviewData) => {
    setIsLoading(true);
    try {
      const newReview = await reviewService.submitReview(reviewData);
      setReviews(prev => [newReview, ...prev]);
      setProductStats(reviewService.calculateProductStats([newReview, ...reviews]));
      
      toast.success('Review submitted successfully!');
      generateNotification('Review Submitted', `Your review for ${newReview.title} is now live.`, 'system', 'medium');
      return newReview;
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Edit Review
  const editReview = async (reviewId, updates, userId) => {
    setIsLoading(true);
    try {
      const updatedReview = await reviewService.editReview(reviewId, updates, userId);
      setReviews(prev => prev.map(r => r.id === reviewId ? updatedReview : r));
      setProductStats(reviewService.calculateProductStats(reviews.map(r => r.id === reviewId ? updatedReview : r)));
      toast.success('Review updated successfully!');
      generateNotification('Review Updated', `Your review was updated successfully.`, 'system', 'low');
      return updatedReview;
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Review
  const deleteReview = async (reviewId, userId) => {
    setIsLoading(true);
    try {
      await reviewService.deleteReview(reviewId, userId);
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: 'deleted' } : r));
      setProductStats(reviewService.calculateProductStats(reviews.filter(r => r.id !== reviewId)));
      toast.success('Review deleted.');
      generateNotification('Review Deleted', `Your review was deleted.`, 'system', 'low');
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Admin Change Status
  const changeReviewStatus = async (reviewId, newStatus) => {
    try {
      const updatedReview = await reviewService.changeReviewStatus(reviewId, newStatus);
      setReviews(prev => prev.map(r => r.id === reviewId ? updatedReview : r));
      toast.success(`Review ${newStatus} successfully.`);
      
      if (newStatus === 'approved') {
        generateNotification('Review Approved', `A review has been approved.`, 'system', 'low');
      } else if (newStatus === 'hidden') {
        generateNotification('Review Hidden', `A review has been hidden.`, 'system', 'medium');
      } else if (newStatus === 'deleted') {
        generateNotification('Review Deleted', `A review was permanently deleted.`, 'system', 'high');
      }
      return updatedReview;
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Admin Resolve Report
  const resolveReport = async (reportId, action) => {
    try {
      const updated = await reviewService.resolveReport(reportId, action);
      setReportedReviews(prev => prev.map(r => r.id === reportId ? updated : r));
      toast.success('Report resolved');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Seller Reply
  const replyToReview = async (reviewId, sellerId, sellerName, text) => {
    setIsLoading(true);
    try {
      const updatedReview = await reviewService.replyToReview(reviewId, sellerId, sellerName, text);
      setReviews(prev => prev.map(r => r.id === reviewId ? updatedReview : r));
      toast.success('Reply submitted successfully!');
      generateNotification('Seller Replied', `${sellerName} replied to your review.`, 'system', 'medium');
      return updatedReview;
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Vote Review
  const voteReview = async (reviewId, userId, voteType) => {
    try {
      const result = await reviewService.voteReview(reviewId, userId, voteType);
      setReviews(prev => prev.map(r => r.id === reviewId ? result.review : r));
      if (voteType === 'helpful') {
        generateNotification('Helpful Vote Received', `Someone found your review helpful!`, 'system', 'low');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Report Review
  const reportReview = async (reportData) => {
    try {
      const report = await reviewService.reportReview(reportData);
      toast.success('Review reported successfully. Our team will review it.');
      generateNotification('Review Reported', 'We have received your report.', 'system', 'low');
      setReportedReviews(prev => [report, ...prev]);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Check if user is eligible to review a product
  const canUserReviewProduct = useCallback((productSlug) => {
    return orders.some(o => 
      o.status.toLowerCase() === 'delivered' && 
      o.items.some(i => i.productSlug === productSlug)
    );
  }, [orders]);

  // Derived state: filtered and sorted reviews
  const displayReviews = useMemo(() => {
    // Only show approved reviews for normal display unless it's the admin panel
    let result = reviews.filter(r => r.status === 'approved');

    // Apply Filters
    if (filter === '5star') result = result.filter(r => r.rating === 5);
    if (filter === '4star') result = result.filter(r => r.rating === 4);
    if (filter === '3star') result = result.filter(r => r.rating === 3);
    if (filter === '2star') result = result.filter(r => r.rating === 2);
    if (filter === '1star') result = result.filter(r => r.rating === 1);
    if (filter === 'withImages') result = result.filter(r => r.images && r.images.length > 0);
    if (filter === 'verified') result = result.filter(r => r.isVerified);

    // Apply Sorting
    switch (sort) {
      case 'latest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'highest':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        result.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        result.sort((a, b) => b.helpfulVotes - a.helpfulVotes);
        break;
      default:
        break;
    }

    return result;
  }, [reviews, filter, sort]);

  const value = {
    reviews: displayReviews,
    allReviews: reviews,
    reportedReviews,
    productStats,
    isLoading,
    error,
    filter,
    setFilter,
    sort,
    setSort,
    loadAllReviews,
    loadProductReviews,
    loadUserReviews,
    loadReportedReviews,
    submitReview,
    editReview,
    deleteReview,
    changeReviewStatus,
    resolveReport,
    replyToReview,
    voteReview,
    reportReview,
    canUserReviewProduct
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
};
