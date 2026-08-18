import { useState } from 'react';
import { FiFileText, FiList, FiBox, FiShield } from 'react-icons/fi';

const ProductSpecs = ({ details }) => {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
      
      {/* Tabs headers */}
      <div className="flex border-b border-gray-100 overflow-x-auto hide-scrollbar whitespace-nowrap bg-gray-50/50">
        {[
          { id: 'description', label: 'Overview Description', icon: FiFileText },
          { id: 'specs', label: 'Specifications', icon: FiList },
          { id: 'box', label: 'What\'s in the Box', icon: FiBox }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-6 py-4 text-xs font-bold transition-all relative border-r border-gray-100 ${
                activeTab === tab.id
                  ? 'bg-white text-[#ff6a00]'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tabs Content */}
      <div className="p-6 text-xs text-gray-700 leading-relaxed">
        
        {/* Description tab */}
        {activeTab === 'description' && (
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 text-sm">Product Features & Capabilities</h4>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              {details.features.map((feat, idx) => (
                <li key={idx}>{feat}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === 'specs' && (
          <div className="border border-gray-150 rounded-2xl overflow-hidden bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="p-3 pl-4">Attribute</th>
                  <th className="p-3">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
                {details.specs.map((spec, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/20">
                    <td className="p-3 pl-4 font-bold text-gray-500">{spec.attribute}</td>
                    <td className="p-3 text-gray-800">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* What's in the Box Tab */}
        {activeTab === 'box' && (
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 text-sm">Package Details</h4>
            <p className="text-gray-650 bg-gray-50 p-4 rounded-xl border border-gray-150 font-mono">
              {details.boxContents}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductSpecs;
