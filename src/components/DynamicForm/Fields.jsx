import React from 'react';

const renderLabel = (attribute) => (
  <label className="block text-xs font-bold text-gray-700 mb-1">
    {attribute.name} {attribute.required && <span className="text-red-500">*</span>}
  </label>
);

const renderHelpText = (attribute) => (
  attribute.helpText && <p className="text-[10px] text-gray-500 mt-1">{attribute.helpText}</p>
);

export const TextField = ({ attribute, value, onChange }) => (
  <div>
    {renderLabel(attribute)}
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(attribute._id, e.target.value)}
      required={attribute.required}
      placeholder={attribute.placeholder || ''}
      maxLength={attribute.validation?.maxLength}
      minLength={attribute.validation?.minLength}
      pattern={attribute.validation?.regex}
      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#ff6a00] outline-none"
    />
    {renderHelpText(attribute)}
  </div>
);

export const NumberField = ({ attribute, value, onChange }) => (
  <div>
    {renderLabel(attribute)}
    <input
      type="number"
      value={value || ''}
      onChange={(e) => onChange(attribute._id, e.target.value)}
      required={attribute.required}
      placeholder={attribute.placeholder || ''}
      max={attribute.validation?.maxValue}
      min={attribute.validation?.minValue}
      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#ff6a00] outline-none"
    />
    {renderHelpText(attribute)}
  </div>
);

export const DropdownField = ({ attribute, value, onChange }) => (
  <div>
    {renderLabel(attribute)}
    <select
      value={value || ''}
      onChange={(e) => onChange(attribute._id, e.target.value)}
      required={attribute.required}
      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#ff6a00] outline-none bg-white"
    >
      <option value="">{attribute.placeholder || 'Select Option'}</option>
      {attribute.values?.map(val => (
        <option key={val._id} value={val._id}>{val.label}</option>
      ))}
    </select>
    {renderHelpText(attribute)}
  </div>
);

export const CheckboxField = ({ attribute, value, onChange }) => {
  // Value here will be an array of attributeValueIds
  const selectedValues = Array.isArray(value) ? value : [];

  const handleToggle = (valId) => {
    if (selectedValues.includes(valId)) {
      onChange(attribute._id, selectedValues.filter(v => v !== valId));
    } else {
      onChange(attribute._id, [...selectedValues, valId]);
    }
  };

  return (
    <div>
      {renderLabel(attribute)}
      <div className="flex flex-wrap gap-3 mt-2">
        {attribute.values?.map(val => (
          <label key={val._id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input 
              type="checkbox" 
              checked={selectedValues.includes(val._id)}
              onChange={() => handleToggle(val._id)}
              className="rounded text-[#ff6a00] focus:ring-[#ff6a00]"
            />
            {val.label}
          </label>
        ))}
      </div>
      {renderHelpText(attribute)}
    </div>
  );
};

export const RadioField = ({ attribute, value, onChange }) => (
  <div>
    {renderLabel(attribute)}
    <div className="flex flex-wrap gap-3 mt-2">
      {attribute.values?.map(val => (
        <label key={val._id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input 
            type="radio" 
            name={`attr_${attribute._id}`}
            checked={value === val._id}
            onChange={() => onChange(attribute._id, val._id)}
            required={attribute.required}
            className="text-[#ff6a00] focus:ring-[#ff6a00]"
          />
          {val.label}
        </label>
      ))}
    </div>
    {renderHelpText(attribute)}
  </div>
);

export const ToggleField = ({ attribute, value, onChange }) => (
  <div>
    {renderLabel(attribute)}
    <label className="relative inline-flex items-center cursor-pointer mt-1">
      <input 
        type="checkbox" 
        className="sr-only peer"
        checked={value === 'true' || value === true}
        onChange={(e) => onChange(attribute._id, e.target.checked)}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff6a00]"></div>
      <span className="ml-3 text-sm font-medium text-gray-700">{value === 'true' || value === true ? 'Yes' : 'No'}</span>
    </label>
    {renderHelpText(attribute)}
  </div>
);

// Fallback Generic Field
export const GenericField = ({ attribute, value, onChange }) => (
  <TextField attribute={attribute} value={value} onChange={onChange} />
);
