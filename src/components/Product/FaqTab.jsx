import { memo, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

const FaqTab = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  if (!faqs || faqs.length === 0) {
    return <div className="text-gray-500">No FAQs available.</div>
  }

  return (
    <div className="flex flex-col gap-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index
        return (
          <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#ff6a00]"
              aria-expanded={isOpen}
            >
              <span className="text-[14px] font-bold text-gray-900 text-left">
                {faq.question}
              </span>
              <FiChevronDown className={`text-lg text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-4 border-t border-gray-100 text-[14px] text-gray-600 bg-white">
                {faq.answer}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default memo(FaqTab)
