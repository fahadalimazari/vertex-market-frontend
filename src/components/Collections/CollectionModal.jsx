import { useState } from 'react';
import { useCollections } from '../../context/CollectionContext';
import { FiX, FiFolder, FiPlus, FiCheck } from 'react-icons/fi';
import CreateCollectionModal from './CreateCollectionModal';

const CollectionModal = ({ isOpen, onClose, product }) => {
  const { collections, addToCollection, removeFromCollection } = useCollections();
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (!isOpen || !product) return null;

  const handleToggleProduct = (collection) => {
    const isAlreadyIn = collection.products.some(p => p.id === product.id);
    if (isAlreadyIn) {
      removeFromCollection(collection.id, product.id);
    } else {
      addToCollection(collection.id, product);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <FiX className="h-5 w-5" />
          </button>

          <h3 className="text-lg font-bold text-gray-900 mb-1">Save to Collection</h3>
          <p className="text-xs text-gray-500 mb-4 truncate">Product: {product.name}</p>

          {/* List of Collections */}
          <div className="space-y-2 max-h-60 overflow-y-auto mb-4 pr-1">
            {collections.map((col) => {
              const hasProduct = col.products.some(p => p.id === product.id);
              return (
                <button
                  key={col.id}
                  onClick={() => handleToggleProduct(col)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                    hasProduct
                      ? 'border-[#ff6a00] bg-orange-50/20 text-[#ff6a00]'
                      : 'border-gray-100 hover:border-gray-200 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FiFolder className={`h-5 w-5 flex-shrink-0 ${hasProduct ? 'text-[#ff6a00]' : 'text-gray-400'}`} />
                    <div className="truncate">
                      <p className="text-sm font-bold truncate">{col.name}</p>
                      <p className="text-[11px] text-gray-400">
                        {col.products.length} {col.products.length === 1 ? 'product' : 'products'}
                      </p>
                    </div>
                  </div>
                  {hasProduct && <FiCheck className="h-5 w-5 flex-shrink-0 text-[#ff6a00]" />}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 w-full border border-dashed border-gray-300 hover:border-[#ff6a00] p-3 rounded-xl text-sm font-bold text-gray-600 hover:text-[#ff6a00] transition-colors"
            >
              <FiPlus className="h-4 w-4" />
              <span>Create New Collection</span>
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-900 text-white p-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors mt-2"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      <CreateCollectionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </>
  );
};

export default CollectionModal;
