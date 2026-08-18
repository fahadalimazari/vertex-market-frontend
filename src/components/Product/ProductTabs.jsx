import { memo, useState } from 'react'
import DescriptionTab from './DescriptionTab'
import SpecificationTable from './SpecificationTable'
import ReviewsTab from './ReviewsTab'
import FaqTab from './FaqTab'

const ProductTabs = ({ product, specifications }) => {
  const [activeTab, setActiveTab] = useState('description')

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'faqs', label: 'FAQs' }
  ]

  return (
    <div className="mt-12 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-100 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[120px] py-4 text-[14px] font-bold transition-colors focus:outline-none focus:bg-gray-50 ${
              activeTab === tab.id
                ? 'text-[#ff6a00] border-b-2 border-[#ff6a00]'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 md:p-8" role="tabpanel">
        {activeTab === 'description' && <DescriptionTab description={product.longDescription || product.shortDescription || product.description} />}
        {activeTab === 'specifications' && <SpecificationTable specifications={specifications || product.specifications} />}
        {activeTab === 'reviews' && <ReviewsTab reviews={product.reviewsList || []} />}
        {activeTab === 'faqs' && <FaqTab faqs={product.faqs || []} />}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  )
}

export default memo(ProductTabs)
