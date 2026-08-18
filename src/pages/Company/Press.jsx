import { FiFileText, FiDownloadCloud } from 'react-icons/fi';

const Press = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-white py-24 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-6">Press & Media</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          News, announcements and media resources from Vertex Market.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Latest News */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-2">
            <FiFileText className="text-[#ff6a00]" /> Latest News
          </h2>
          
          <div className="bg-white rounded-3xl border border-gray-100 border-dashed p-12 text-center shadow-sm">
            <h3 className="text-lg font-bold text-gray-600 mb-2">No press releases published yet.</h3>
            <p className="text-sm text-gray-500">Check back later for official announcements and news coverage.</p>
          </div>
        </div>

        {/* Media Kit & Contact */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 mb-4">Media Kit</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Download our official brand assets, logos, and company fact sheet for press coverage.
            </p>
            <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors border border-gray-200">
              <FiDownloadCloud /> Download Assets (.zip)
            </button>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl p-8 text-white shadow-lg border border-gray-800">
            <h3 className="text-lg font-black mb-4">Press Contact</h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              For press inquiries, interviews, or additional media resources, please reach out to our communications team.
            </p>
            <a href="mailto:press@vertexmarket.com" className="w-full bg-[#ff6a00] hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-colors">
              press@vertexmarket.com
            </a>
          </div>
        </div>

      </section>
      
    </div>
  );
};

export default Press;
