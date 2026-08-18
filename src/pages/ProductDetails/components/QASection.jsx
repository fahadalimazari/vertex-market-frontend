import React, { useState, useMemo } from 'react';
import { FiMessageCircle, FiX } from 'react-icons/fi';
import { useProduct } from '../../../context/ProductContext';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const QASection = ({ product }) => {
  const { customFaqs, addCustomQuestion } = useProduct();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [error, setError] = useState('');

  const productQuestions = useMemo(() => {
    return customFaqs.filter(q => q.productId === product._id);
  }, [customFaqs, product._id]);

  const handleAskQuestionClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${product.slug}` } });
      return;
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!questionText.trim()) {
      setError('Please enter a question.');
      return;
    }

    addCustomQuestion({
      productId: product._id,
      userId: user?._id || 'guest',
      userName: user?.name || 'Customer',
      question: questionText,
      date: new Date().toISOString().split('T')[0]
    });

    setIsModalOpen(false);
    setQuestionText('');
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-2xl font-black text-gray-900">Questions & Answers</h2>
        <button 
          onClick={handleAskQuestionClick}
          className="px-5 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-colors"
        >
          Ask a Question
        </button>
      </div>

      {productQuestions.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-gray-50/50 rounded-2xl border border-gray-100 border-dashed">
          <FiMessageCircle className="text-4xl mx-auto mb-3 opacity-20" />
          <h3 className="text-base font-bold text-gray-900 mb-1">No Questions Yet</h3>
          <p className="text-xs">Have a question about this product? Ask the seller!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {productQuestions.map(q => (
            <div key={q.id} className="pb-6 border-b border-gray-100 last:border-0">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-black shrink-0">Q</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-gray-900">{q.question}</h4>
                    <span className="text-xs text-gray-400 font-medium whitespace-nowrap ml-4">{q.date || 'Today'}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-4">Asked by {q.userName || 'Customer'}</div>
                  
                  <div className="flex gap-4 mt-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-black shrink-0">A</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm mb-1">{product.seller?.name || 'Seller'}</h4>
                      <p className="text-sm text-gray-600">{q.answer || 'Pending seller reply. Usually answers within 1 hour.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ask Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-fadeIn">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900">Ask a Question</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors shadow-sm"
              >
                <FiX className="text-lg" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-100">{error}</div>}
              
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Your Question <span className="text-red-500">*</span></label>
                <textarea 
                  value={questionText}
                  onChange={e => setQuestionText(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all h-32 resize-none"
                  placeholder="What would you like to know about this product?"
                ></textarea>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-colors shadow-sm"
                >
                  Submit Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QASection;
