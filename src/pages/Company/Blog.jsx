import { FiRss } from 'react-icons/fi';

const Blog = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-white py-24 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-6">Vertex Tech Blog</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Engineering, AI, commerce and technology insights from Vertex Market.
        </p>
      </section>

      {/* Blog Listing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="bg-white rounded-3xl border border-gray-100 border-dashed p-16 text-center shadow-sm max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiRss className="text-2xl text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No articles published yet.</h3>
          <p className="text-gray-500">
            Our engineering and product teams are busy building. Check back soon for deep dives into our AI architecture, scaling infrastructure, and eCommerce insights.
          </p>
        </div>

      </section>
      
    </div>
  );
};

export default Blog;
