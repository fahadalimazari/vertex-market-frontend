import { useState } from 'react';
import { FiX, FiStar, FiImage, FiVideo, FiTrash2 } from 'react-icons/fi';
import { useReviews } from '../../hooks/useReviews';
import { useDashboard } from '../../context/Dashboard/DashboardContext';

const WriteReviewModal = ({ productSlug, productId, sellerId, onClose }) => {
  const { submitReview, isLoading } = useReviews();
  const { user } = useDashboard();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [recommendProduct, setRecommendProduct] = useState(true);

  // Note: For mock implementation, we simulate file selection via dummy URL generation
  const handleImageUpload = (e) => {
    if (images.length >= 5) return;
    const newImages = [...images, `https://picsum.photos/seed/${Math.random()}/400/400`];
    setImages(newImages.slice(0, 5));
  };

  const handleVideoUpload = (e) => {
    setVideo({ thumbnail: `https://picsum.photos/seed/${Math.random()}/400/400`, url: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;
    
    try {
      await submitReview({
        productId,
        productSlug,
        orderId: `ORD-MOCK-${Date.now()}`, // Would come from context of which order they are reviewing
        userId: user?.id || 'mock-user',
        userName: user?.name || 'Test User',
        userAvatar: user?.avatar || null,
        sellerId,
        rating,
        title,
        description,
        images,
        video,
        isAnonymous,
        recommendProduct,
        isVerified: true
      });
      onClose();
    } catch (err) {
      // Handled by context
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto py-10">
      <div className="bg-white rounded-2xl w-full max-w-2xl relative shadow-xl my-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <h3 className="font-bold text-xl text-gray-900">Write a Review</h3>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 mb-2">Overall Rating *</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110"
                >
                  <FiStar 
                    size={32} 
                    className={`${(hoverRating || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 mb-2">Review Title *</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sum up your experience in one line"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/20 focus:border-[#ff6a00]"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 mb-2">Review Details *</label>
            <textarea 
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did you like or dislike? What should other buyers know?"
              rows={5}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/20 focus:border-[#ff6a00] resize-none"
            />
          </div>

          {/* Media Upload */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 mb-2">Add Photo or Video</label>
            <p className="text-xs text-gray-500 mb-3">Shoppers find images and videos more helpful than text alone. (Max 5 images, 1 video)</p>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleImageUpload}
                disabled={images.length >= 5}
                className={`w-20 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors ${images.length >= 5 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-500 hover:border-[#ff6a00] hover:text-[#ff6a00]'}`}
              >
                <FiImage size={24} />
                <span className="text-[10px] font-medium">Add Photo</span>
              </button>
              
              {!video && (
                <button
                  type="button"
                  onClick={handleVideoUpload}
                  className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-[#ff6a00] hover:text-[#ff6a00] flex flex-col items-center justify-center gap-1 transition-colors"
                >
                  <FiVideo size={24} />
                  <span className="text-[10px] font-medium">Add Video</span>
                </button>
              )}

              {/* Previews */}
              {images.map((img, idx) => (
                <div key={idx} className="w-20 h-20 rounded-xl relative group overflow-hidden border border-gray-200">
                  <img src={img} alt="upload preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              ))}
              
              {video && (
                <div className="w-20 h-20 rounded-xl relative group overflow-hidden border border-gray-200 bg-black">
                  <img src={video.thumbnail} alt="video preview" className="w-full h-full object-cover opacity-70" />
                  <button 
                    type="button"
                    onClick={() => setVideo(null)}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-4 border-t border-gray-100 pt-6 mb-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  checked={recommendProduct}
                  onChange={(e) => setRecommendProduct(e.target.checked)}
                  className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded focus:outline-none checked:bg-[#ff6a00] checked:border-[#ff6a00] transition-colors"
                />
                <FiCheckCircle className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" size={14} />
              </div>
              <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">I recommend this product</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded focus:outline-none checked:bg-[#ff6a00] checked:border-[#ff6a00] transition-colors"
                />
                <FiCheckCircle className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" size={14} />
              </div>
              <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">Submit anonymously</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 px-6 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={rating === 0 || isLoading}
              className="flex-1 py-3.5 px-6 rounded-xl bg-[#ff6a00] text-white font-bold hover:bg-[#e65c00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WriteReviewModal;
