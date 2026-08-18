import { useState, useMemo } from 'react';
import { useProduct } from '../../context/ProductContext';
import { FiSearch, FiHelpCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductFAQ = ({ initialFaqs }) => {
  const { customFaqs, addCustomQuestion } = useProduct();
  const [searchQuery, setSearchQuery] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  // Combine static and custom Q&As
  const allFaqs = useMemo(() => {
    return [...customFaqs, ...initialFaqs];
  }, [customFaqs, initialFaqs]);

  // Filter Q&As by search query
  const filteredFaqs = useMemo(() => {
    return allFaqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allFaqs, searchQuery]);

  const handleAsk = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    addCustomQuestion(newQuestion);
    setNewQuestion('');
  };

  const handleHelpful = (id) => {
    toast.success('Feedback recorded!');
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50 pb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
            <FiHelpCircle className="text-[#ff6a00]" /> Questions & Answers
          </h3>
          <p className="text-[10px] text-gray-500 mt-0.5">Find answers from the community or ask the merchant directly.</p>
        </div>

        {/* Search Q&As */}
        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs w-full bg-gray-50/20"
            placeholder="Search questions..."
          />
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {filteredFaqs.map((faq) => {
          const isExpanded = expandedId === faq.id;
          return (
            <div key={faq.id} className="border border-gray-100 rounded-2xl overflow-hidden text-xs">
              <button
                onClick={() => toggleExpand(faq.id)}
                className="w-full px-4 py-3 bg-gray-50/50 hover:bg-gray-50 text-left flex justify-between items-center gap-4 text-gray-800 font-bold"
              >
                <span>Q: {faq.question}</span>
                {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              
              {isExpanded && (
                <div className="p-4 bg-white space-y-3 border-t border-gray-100 text-gray-600 leading-relaxed">
                  <p><strong>A:</strong> {faq.answer}</p>
                  <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold">
                    <span>Helpful? ({faq.helpfulCount} votes)</span>
                    <button onClick={() => handleHelpful(faq.id)} className="text-[#ff6a00] hover:underline">
                      Yes, helpful
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <p className="text-center py-6 text-gray-400 text-xs">No questions matched search.</p>
        )}
      </div>

      {/* Ask a Question Form */}
      <form onSubmit={handleAsk} className="flex gap-2 border-t border-gray-50 pt-4">
        <input
          type="text"
          required
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl outline-none text-xs focus:ring-1 focus:ring-[#ff6a00]"
          placeholder="Ask a question about color, stock, warranty..."
        />
        <button
          type="submit"
          className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm"
        >
          Post Question
        </button>
      </form>
    </div>
  );
};

export default ProductFAQ;
