import { useState } from 'react';
import { useCollections } from '../../context/CollectionContext';
import { FiX, FiFolderPlus } from 'react-icons/fi';

const CreateCollectionModal = ({ isOpen, onClose }) => {
  const { createCollection } = useCollections();
  const [collectionName, setCollectionName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const created = createCollection(collectionName);
    if (created) {
      setCollectionName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <FiX className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-orange-50 text-[#ff6a00] rounded-xl">
            <FiFolderPlus className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Create New Collection</h3>
            <p className="text-xs text-gray-500">Group your products in custom categories</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Collection Name
            </label>
            <input
              type="text"
              autoFocus
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="e.g. Gaming Setup, Office Essentials"
              maxLength={50}
              className="block w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] focus:border-[#ff6a00] outline-none transition-all"
            />
            <span className="block mt-1.5 text-[10px] font-semibold text-gray-400 text-right">
              {collectionName.length}/50 characters
            </span>
          </div>

          <div className="flex justify-end gap-3.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4.5 py-2.5 border border-gray-200 text-sm font-bold text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#ff6a00] text-white text-sm font-bold rounded-xl hover:bg-[#e05e00] transition-colors shadow-md"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCollectionModal;
