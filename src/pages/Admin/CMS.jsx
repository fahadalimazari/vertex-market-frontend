import { useCMS } from '../../context/Admin/CMSContext';
import { useLogs } from '../../context/Admin/LogsContext';
import { FiSave, FiToggleLeft, FiToggleRight, FiLayout } from 'react-icons/fi';

const CMS = () => {
  const { sections, toggleSection } = useCMS();
  const { addLog } = useLogs();

  const handleToggle = (key) => {
    toggleSection(key);
    addLog('CMS Section Updated', `Toggled homepage section visibility: "${key}"`);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FiLayout className="text-[#ff6a00]" /> Content Management System (CMS)
        </h2>
        <p className="text-xs text-gray-500 mt-1">Enable or disable frontpage widgets layout configurations.</p>
      </div>

      {/* Grid of home layout switches */}
      <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-2">
          Homepage Layout Toggles
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: 'hero', label: 'Main Hero Slider', desc: 'Prominent slides and promotional banners at the top.' },
            { key: 'categories', label: 'Featured Categories Carousel', desc: 'Category bubbles grid mapping catalog links.' },
            { key: 'flashSale', label: 'Time-Limited Flash Sale', desc: 'Discounted products list with active countdown.' },
            { key: 'featuredProducts', label: 'Hot Recommended Products', desc: 'Display recommended catalogs customized by AI.' },
            { key: 'newsletter', label: 'Newsletter Subscription Bar', desc: 'Footer subscriber email submission input.' },
            { key: 'footer', label: 'Site Links Footer', desc: 'Sitemap list details at the very bottom.' }
          ].map((item) => (
            <div 
              key={item.key} 
              className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100"
            >
              <div>
                <span className="text-xs font-bold text-gray-800 block">{item.label}</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">{item.desc}</span>
              </div>

              {/* Toggler switch */}
              <button
                type="button"
                onClick={() => handleToggle(item.key)}
                className="text-2xl text-gray-600 focus:outline-none"
              >
                {sections[item.key] ? (
                  <FiToggleRight className="text-[#ff6a00] text-3xl" />
                ) : (
                  <FiToggleLeft className="text-gray-300 text-3xl" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CMS;
