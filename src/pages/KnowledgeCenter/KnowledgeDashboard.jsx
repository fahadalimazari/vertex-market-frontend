import { FiBookOpen, FiPlayCircle, FiFileText, FiAward } from 'react-icons/fi';

const mockTutorials = [
  { id: 1, title: 'Getting Started with Vertex', category: 'Basics', duration: '5 min read' },
  { id: 2, title: 'Automating Sales with AI', category: 'Advanced', duration: '12 min video' },
  { id: 3, title: 'Setting up your POS Register', category: 'Operations', duration: '8 min read' },
];

const KnowledgeDashboard = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 bg-gray-900 text-white rounded-3xl p-10 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-4">Vertex Knowledge Center</h1>
          <p className="text-gray-400 max-w-xl mb-6">Access documentation, AI training manuals, and interactive tutorials to master the Enterprise Commerce Operating System.</p>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Search guides, errors, or tutorials..." 
              className="px-6 py-3 rounded-xl bg-gray-800 border border-gray-700 w-96 focus:outline-none focus:border-orange-500 transition-colors text-white"
            />
            <button className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-xl font-bold transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Documentation', desc: 'Core platform APIs', icon: <FiFileText /> },
          { label: 'Video Academy', desc: 'Step-by-step guides', icon: <FiPlayCircle /> },
          { label: 'AI Training', desc: 'Prompt engineering', icon: <FiBookOpen /> },
          { label: 'Certifications', desc: 'Become an expert', icon: <FiAward /> },
        ].map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-orange-200 hover:shadow-md transition-all cursor-pointer">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center text-xl mb-4">
              {card.icon}
            </div>
            <h3 className="font-bold text-gray-900">{card.label}</h3>
            <p className="text-gray-500 text-sm mt-1">{card.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Trending Tutorials</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockTutorials.map(tutorial => (
            <div key={tutorial.id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors">
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded mb-3 inline-block">
                {tutorial.category}
              </span>
              <h3 className="font-bold text-gray-900 mb-2">{tutorial.title}</h3>
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <FiPlayCircle /> {tutorial.duration}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeDashboard;
