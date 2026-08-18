import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const FAQAccordion = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between focus:outline-none"
      >
        <span className="font-bold text-gray-900 text-left text-sm">{item.question}</span>
        {isOpen ? (
          <FiChevronUp className="text-[#ff6a00] text-xl flex-shrink-0" />
        ) : (
          <FiChevronDown className="text-gray-400 text-xl flex-shrink-0" />
        )}
      </button>
      
      {isOpen && (
        <div className="px-6 pb-5">
          <div className="h-px w-full bg-gray-50 mb-4"></div>
          <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  );
};

export default FAQAccordion;
