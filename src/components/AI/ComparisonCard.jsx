import { FiCheckCircle } from 'react-icons/fi'

const ComparisonCard = ({ data }) => {
  if (!data || !data.items || data.items.length < 2) return null

  const specs = [
    { key: 'display', label: 'Display' },
    { key: 'processor', label: 'Processor' },
    { key: 'camera', label: 'Camera' },
    { key: 'battery', label: 'Battery' },
    { key: 'storage', label: 'Storage' }
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      
      {/* Header Info */}
      <div className="flex bg-gray-50/50">
        {data.items.map((item, index) => (
          <div key={item.id} className={`flex-1 p-4 flex flex-col items-center text-center ${index === 0 ? 'border-r border-gray-100' : ''}`}>
            
            {/* Highlight Verdict */}
            <div className="h-6 mb-2">
              {item.verdict && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  item.verdict.includes('Premium') || item.verdict.includes('Best') 
                    ? 'bg-[#ff6a00] text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  <FiCheckCircle /> {item.verdict}
                </span>
              )}
            </div>

            <div className="w-16 h-16 bg-white rounded-xl p-1 shadow-sm mb-3">
              <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
            </div>
            
            <h4 className="text-[13px] font-bold text-gray-900 leading-tight mb-1">{item.name}</h4>
            <div className="text-[13px] font-black text-[#ff6a00]">{item.price}</div>
          </div>
        ))}
      </div>

      {/* Specs Matrix */}
      <div className="flex flex-col text-[12px]">
        {specs.map((spec, specIdx) => (
          <div key={spec.key} className={`flex flex-col ${specIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
            <div className="w-full text-center py-1.5 bg-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-y border-gray-200/60">
              {spec.label}
            </div>
            <div className="flex">
              {data.items.map((item, index) => (
                <div key={item.id} className={`flex-1 p-3 text-center text-gray-700 flex items-center justify-center ${index === 0 ? 'border-r border-gray-100' : ''}`}>
                  {item.specs[spec.key]}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default ComparisonCard
