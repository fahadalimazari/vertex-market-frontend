import { useState } from 'react';
import { FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

const ImageDropzone = ({ label, value, onChange, onRemove, isUploading, setIsUploading, accept = "image/*", recommended }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload JPG, PNG, WEBP, or SVG.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    try {
      setIsUploading(true);
      const res = await axios.post('http://localhost:5000/api/v1/upload/cloudinary', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        onChange(res.data.url);
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">{label}</label>
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 group bg-gray-50 flex items-center justify-center min-h-[140px] max-h-[160px]">
          {value.startsWith('Fi') ? (
            <div className="p-4 flex items-center justify-center">
               <span className="text-2xl text-gray-400 font-mono truncate max-w-[200px]" title={value}>{value}</span>
            </div>
          ) : (
            <img src={value} alt="Preview" className="w-full h-full object-contain" />
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
            <label className="cursor-pointer px-4 py-1.5 bg-white text-gray-900 text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors">
              Replace Image
              <input type="file" accept={accept} onChange={handleChange} className="hidden" />
            </label>
            <button type="button" onClick={onRemove} className="px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors">
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div 
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors min-h-[140px] ${dragActive ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
        >
          <input type="file" accept={accept} onChange={handleChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={isUploading} />
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-2"></div>
              <span className="text-xs font-bold text-orange-600">Uploading...</span>
            </div>
          ) : (
            <>
              <FiImage className="text-3xl text-gray-400 mb-2" />
              <span className="text-sm font-bold text-gray-700">Drag & Drop or Click</span>
              <span className="text-[10px] text-gray-500 mt-1">{recommended}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;
