import { useState } from 'react';
import { useCollections } from '../../context/CollectionContext';
import CollectionCard from './CollectionCard';
import CollectionDetails from './CollectionDetails';
import CreateCollectionModal from './CreateCollectionModal';
import { FiPlus, FiFolder } from 'react-icons/fi';

const CollectionGrid = () => {
  const { collections } = useCollections();
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const selectedCollection = collections.find(c => c.id === selectedCollectionId);

  if (selectedCollection) {
    return (
      <CollectionDetails 
        collection={selectedCollection} 
        onBack={() => setSelectedCollectionId(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FiFolder className="text-[#ff6a00]" /> My Collections
          </h2>
          <p className="text-xs text-gray-500 mt-1">Organize your shopping items in custom lists</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-[#ff6a00] hover:bg-[#e05e00] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
        >
          <FiPlus className="h-4 w-4" />
          <span>New Collection</span>
        </button>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <div className="h-16 w-16 mx-auto mb-4 bg-orange-50 text-[#ff6a00] rounded-full flex items-center justify-center">
            <FiFolder className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No Collections Yet</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            You don't have any custom lists. Create one to organize products you like.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 bg-[#ff6a00] hover:bg-[#e05e00] text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md"
          >
            Create Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Main Collection Cards */}
          {collections.map((col) => (
            <CollectionCard
              key={col.id}
              collection={col}
              onOpen={setSelectedCollectionId}
            />
          ))}

          {/* Quick Create Card placeholder */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 hover:border-[#ff6a00] rounded-2xl hover:bg-orange-50/10 transition-all text-gray-400 hover:text-[#ff6a00] min-h-[220px]"
          >
            <FiPlus className="h-8 w-8 mb-2" />
            <span className="text-sm font-bold">Add Collection</span>
          </button>
        </div>
      )}

      <CreateCollectionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default CollectionGrid;
