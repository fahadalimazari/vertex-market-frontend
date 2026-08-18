import React, { useEffect } from 'react';
import { 
  TextField, NumberField, DropdownField, CheckboxField, 
  RadioField, ToggleField, GenericField 
} from './Fields';

const DynamicFormRenderer = ({ attributes, values, onChange }) => {
  
  // Set default values on mount
  useEffect(() => {
    if (!attributes || attributes.length === 0) return;
    
    attributes.forEach(attr => {
      if (values[attr._id] === undefined && attr.defaultValue !== undefined) {
        onChange(attr._id, attr.defaultValue);
      }
    });
  }, [attributes]);

  if (!attributes || attributes.length === 0) {
    return null;
  }

  const renderField = (attr) => {
    const val = values[attr._id];
    
    switch (attr.inputType) {
      case 'Text Field':
      case 'Textarea':
      case 'URL':
      case 'Email':
        return <TextField key={attr._id} attribute={attr} value={val} onChange={onChange} />;
      case 'Number Input':
        return <NumberField key={attr._id} attribute={attr} value={val} onChange={onChange} />;
      case 'Dropdown':
        return <DropdownField key={attr._id} attribute={attr} value={val} onChange={onChange} />;
      case 'Checkbox':
      case 'Multi Select':
        return <CheckboxField key={attr._id} attribute={attr} value={val} onChange={onChange} />;
      case 'Radio':
        return <RadioField key={attr._id} attribute={attr} value={val} onChange={onChange} />;
      case 'Toggle':
      case 'Boolean':
        return <ToggleField key={attr._id} attribute={attr} value={val} onChange={onChange} />;
      default:
        return <GenericField key={attr._id} attribute={attr} value={val} onChange={onChange} />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {(attributes || []).map(attr => renderField(attr))}
    </div>
  );
};

export default DynamicFormRenderer;
