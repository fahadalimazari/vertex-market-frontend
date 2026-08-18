import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiRefreshCw, FiPlus, FiTrash2, FiImage } from 'react-icons/fi';

const VariantGenerator = ({ subCategoryId, basePrice = 0, baseSku = 'SKU' }) => {
  const [productType, setProductType] = useState('Simple');
  const [availableAttributes, setAvailableAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]); // [{ attributeId, values: [valId1, valId2] }]
  const [generatedVariants, setGeneratedVariants] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch attributes that can be used for variants (e.g. Color, Size, etc.)
  useEffect(() => {
    if (subCategoryId) {
      // Typically we fetch all attributes for this subcategory
      axios.get(`/api/v1/attributes/subcategory/${subCategoryId}`)
        .then(res => setAvailableAttributes(res.data.data || []))
        .catch(err => console.error('Failed to load attributes', err));
    }
  }, [subCategoryId]);

  const addAttributeField = () => {
    setSelectedAttributes([...selectedAttributes, { attributeId: '', values: [] }]);
  };

  const removeAttributeField = (index) => {
    const newAttrs = [...selectedAttributes];
    newAttrs.splice(index, 1);
    setSelectedAttributes(newAttrs);
  };

  const handleAttributeChange = (index, attrId) => {
    const newAttrs = [...selectedAttributes];
    newAttrs[index].attributeId = attrId;
    newAttrs[index].values = []; // reset values
    setSelectedAttributes(newAttrs);
  };

  const handleValueChange = (index, valId, checked) => {
    const newAttrs = [...selectedAttributes];
    if (checked) {
      newAttrs[index].values.push(valId);
    } else {
      newAttrs[index].values = newAttrs[index].values.filter(id => id !== valId);
    }
    setSelectedAttributes(newAttrs);
  };

  const handleGenerate = async () => {
    const validAttrs = selectedAttributes.filter(a => a.attributeId && a.values.length > 0);
    if (validAttrs.length === 0) {
      toast.error('Please select at least one attribute and value to generate variants.');
      return;
    }

    setIsGenerating(true);
    try {
      const { data } = await axios.post('/api/v1/variants/generate', {
        attributesList: validAttrs,
        basePrice,
        baseSku
      });
      setGeneratedVariants(data.data || []);
      toast.success('Variants generated successfully!');
    } catch (error) {
      toast.error('Failed to generate variants');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVariantEdit = (index, field, value) => {
    const newVariants = [...generatedVariants];
    newVariants[index][field] = value;
    setGeneratedVariants(newVariants);
  };

  if (productType === 'Simple') {
    return (
      <div className="space-y-4 animate-fadeIn">
        <div className="flex items-center gap-4 mb-6">
          <button 
            className="px-4 py-2 bg-orange-50 text-orange-600 border border-orange-200 rounded-xl font-bold"
            onClick={() => setProductType('Simple')}
          >
            Simple Product
          </button>
          <button 
            className="px-4 py-2 text-gray-500 border border-gray-200 rounded-xl font-bold hover:bg-gray-50"
            onClick={() => setProductType('Variable')}
          >
            Variable Product
          </button>
        </div>
        <p className="text-sm text-gray-500">This is a Simple Product. It has no variants. Inventory and pricing are handled in the Basic Info tab.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-4 mb-6">
        <button 
          className="px-4 py-2 text-gray-500 border border-gray-200 rounded-xl font-bold hover:bg-gray-50"
          onClick={() => setProductType('Simple')}
        >
          Simple Product
        </button>
        <button 
          className="px-4 py-2 bg-orange-50 text-orange-600 border border-orange-200 rounded-xl font-bold"
          onClick={() => setProductType('Variable')}
        >
          Variable Product
        </button>
      </div>

      <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
        <h4 className="text-sm font-bold text-gray-900 mb-4">Variant Options</h4>
        
        {selectedAttributes.map((selected, index) => {
          const attributeOptions = availableAttributes.find(a => a._id === selected.attributeId)?.values || [];

          return (
            <div key={index} className="flex flex-col gap-3 mb-4 p-4 bg-white border border-gray-200 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <select 
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    value={selected.attributeId}
                    onChange={(e) => handleAttributeChange(index, e.target.value)}
                  >
                    <option value="">Select Attribute (e.g. Color)</option>
                    {availableAttributes.map(attr => (
                      <option key={attr._id} value={attr._id} disabled={selectedAttributes.some((s, i) => s.attributeId === attr._id && i !== index)}>
                        {attr.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button onClick={() => removeAttributeField(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <FiTrash2 />
                </button>
              </div>

              {selected.attributeId && (
                <div className="flex flex-wrap gap-3 mt-2">
                  {attributeOptions.map(val => (
                    <label key={val._id} className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-100">
                      <input 
                        type="checkbox" 
                        checked={selected.values.includes(val._id)}
                        onChange={(e) => handleValueChange(index, val._id, e.target.checked)}
                        className="rounded text-orange-500 focus:ring-orange-500"
                      />
                      {val.label || val.value}
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <button 
          onClick={addAttributeField}
          className="text-sm font-bold text-orange-600 flex items-center gap-1.5 hover:text-orange-700"
        >
          <FiPlus /> Add another option
        </button>

        <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
          >
            {isGenerating ? <FiRefreshCw className="animate-spin" /> : null}
            Generate Combinations
          </button>
        </div>
      </div>

      {generatedVariants.length > 0 && (
        <div className="overflow-x-auto border border-gray-200 rounded-xl mt-6">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Variant</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Default</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {generatedVariants.map((variant, index) => (
                <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {/* Simplified Display for the generated attributes */}
                    Combo {index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <input 
                      type="text" 
                      value={variant.sku} 
                      onChange={(e) => handleVariantEdit(index, 'sku', e.target.value)}
                      className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-orange-500 outline-none text-xs"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input 
                      type="number" 
                      value={variant.price} 
                      onChange={(e) => handleVariantEdit(index, 'price', e.target.value)}
                      className="w-24 px-2 py-1 border rounded focus:ring-1 focus:ring-orange-500 outline-none text-xs"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input 
                      type="number" 
                      value={variant.stock} 
                      onChange={(e) => handleVariantEdit(index, 'stock', e.target.value)}
                      className="w-20 px-2 py-1 border rounded focus:ring-1 focus:ring-orange-500 outline-none text-xs"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input type="radio" name="defaultVariant" defaultChecked={index === 0} className="text-orange-500 focus:ring-orange-500" />
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-gray-400 hover:text-blue-500 p-1" title="Upload Image"><FiImage /></button>
                    <button onClick={() => {
                      const newVars = [...generatedVariants];
                      newVars.splice(index, 1);
                      setGeneratedVariants(newVars);
                    }} className="text-gray-400 hover:text-red-500 p-1 ml-2"><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VariantGenerator;
