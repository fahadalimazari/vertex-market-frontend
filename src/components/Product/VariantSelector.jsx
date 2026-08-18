import { memo } from 'react'

const VariantSelector = ({ variants, selectedVariants, onChange, allVariants }) => {
  // Check if a combination exists for a given option
  const checkCombinationExists = (type, option) => {
    if (!allVariants || allVariants.length === 0) return true;
    const testSelection = { ...selectedVariants, [type]: option };
    
    return allVariants.some(v => {
      if (!v.options || v.status !== 'Active') return false;
      return Object.keys(testSelection).every(k => v.options[k] === testSelection[k]);
    });
  };

  // If variants exist and is an array, render them (dynamic)
  if (variants && Array.isArray(variants) && variants.length > 0) {
    return (
      <div className="flex flex-col gap-5">
        {variants.map((variant) => (
          <div key={variant.type}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-bold text-gray-900">
                {variant.type}
              </span>
              <span className="text-[13px] text-gray-500">
                {selectedVariants[variant.type] || 'Select one'}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {variant.options.map((option) => {
                const isSelected = selectedVariants[variant.type] === option
                const isAvailable = checkCombinationExists(variant.type, option)
                
                return (
                  <button
                    key={option}
                    onClick={() => onChange(variant.type, option)}
                    disabled={!isAvailable}
                    className={`px-4 py-2 rounded-lg border text-[13px] font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#ff6a00] ${
                      !isAvailable 
                        ? 'border-gray-200 text-gray-400 bg-gray-50 opacity-50 cursor-not-allowed line-through' 
                        : isSelected 
                          ? 'border-[#ff6a00] bg-orange-50 text-[#ff6a00]' 
                          : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    aria-pressed={isSelected}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Placeholder for Task 06 (Enterprise Product Variants) if no variants mapped
  return (
    <div className="flex flex-col gap-5">
      {['Choose Color', 'Choose Size', 'Choose Storage', 'Choose RAM'].map(placeholder => (
        <div key={placeholder} className="opacity-50 pointer-events-none">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-bold text-gray-900">{placeholder}</span>
          </div>
          <div className="flex gap-3">
            <div className="h-9 w-16 bg-gray-100 rounded-lg border border-gray-200 border-dashed"></div>
            <div className="h-9 w-16 bg-gray-100 rounded-lg border border-gray-200 border-dashed"></div>
            <div className="h-9 w-16 bg-gray-100 rounded-lg border border-gray-200 border-dashed"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default memo(VariantSelector)
