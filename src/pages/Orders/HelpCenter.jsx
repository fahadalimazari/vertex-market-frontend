import { useState, useMemo } from 'react';
import { useSupport } from '../../hooks/useSupport';
import FAQAccordion from '../../components/Orders/FAQAccordion';
import ContactSupport from '../../components/Orders/ContactSupport';
import { FiSearch, FiBook } from 'react-icons/fi';
import * as Icons from 'react-icons/fi';

const HelpCenter = () => {
  const { faqCategories, faqArticles, isLoading } = useSupport();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredArticles = useMemo(() => {
    let filtered = faqArticles;
    
    if (activeCategory !== 'all') {
      filtered = filtered.filter(a => a.categoryId === activeCategory);
    }
    
    if (searchQuery.trim() !== '') {
      const lowerQ = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.question.toLowerCase().includes(lowerQ) || 
        a.answer.toLowerCase().includes(lowerQ)
      );
    }
    
    return filtered;
  }, [faqArticles, searchQuery, activeCategory]);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white pt-20 pb-28 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff6a00] rounded-full blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="text-4xl lg:text-5xl font-black mb-6">How can we help you?</h1>
          <div className="relative max-w-2xl mx-auto">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers, tracking, returns..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#ff6a00]/30 transition-all font-medium shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20 space-y-12">
        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <button
            onClick={() => setActiveCategory('all')}
            className={`p-6 rounded-2xl border transition-all flex flex-col items-center justify-center text-center gap-3
              ${activeCategory === 'all' ? 'bg-[#ff6a00] text-white border-[#ff6a00] shadow-md shadow-orange-500/20' : 'bg-white border-gray-100 text-gray-600 hover:border-[#ff6a00] hover:text-[#ff6a00] shadow-sm'}`}
          >
            <FiBook className="text-3xl" />
            <span className="font-bold text-sm">All Topics</span>
          </button>
          
          {faqCategories.map(cat => {
            const IconComponent = Icons[cat.icon];
            const isActive = activeCategory === cat.id;
            
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`p-6 rounded-2xl border transition-all flex flex-col items-center justify-center text-center gap-3
                  ${isActive ? 'bg-[#ff6a00] text-white border-[#ff6a00] shadow-md shadow-orange-500/20' : 'bg-white border-gray-100 text-gray-600 hover:border-[#ff6a00] hover:text-[#ff6a00] shadow-sm'}`}
              >
                {IconComponent && <IconComponent className="text-3xl" />}
                <span className="font-bold text-sm">{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 mb-6">
            {searchQuery ? 'Search Results' : activeCategory === 'all' ? 'Popular Questions' : 'Frequently Asked Questions'}
          </h2>
          
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-white border border-gray-100 rounded-2xl w-full"></div>
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="space-y-4">
              {filteredArticles.map(article => (
                <FAQAccordion key={article.id} item={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white border border-gray-100 rounded-3xl">
              <p className="text-gray-500 font-medium">No results found for "{searchQuery}"</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 text-[#ff6a00] font-bold hover:underline"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Contact Block */}
        <div className="max-w-5xl mx-auto">
          <ContactSupport />
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
