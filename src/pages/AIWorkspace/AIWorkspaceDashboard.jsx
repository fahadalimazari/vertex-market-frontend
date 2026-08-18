import { FiCpu, FiEdit3, FiImage, FiTrendingUp } from 'react-icons/fi';

const AIWorkspaceDashboard = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Enterprise AI Workspace</h1>
        <p className="text-gray-500">Generate products, marketing emails, SEO content, and business insights using Autonomous AI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'SEO Content Generator', desc: 'Auto-write blog posts and product descriptions.', icon: <FiEdit3 />, color: 'text-blue-500 bg-blue-50' },
          { title: 'Marketing Studio', desc: 'Create AI-driven email campaigns and SMS.', icon: <FiTrendingUp />, color: 'text-orange-500 bg-orange-50' },
          { title: 'Image Generator', desc: 'Create product mockups and banners.', icon: <FiImage />, color: 'text-purple-500 bg-purple-50' },
          { title: 'AI Automation Builder', desc: 'Design intelligent workflows.', icon: <FiCpu />, color: 'text-green-500 bg-green-50' },
        ].map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-orange-200 hover:shadow-md cursor-pointer transition-all">
            <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center text-xl mb-4`}>
              {card.icon}
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
            <p className="text-sm text-gray-500">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIWorkspaceDashboard;
