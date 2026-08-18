import { useState } from 'react';
import { FiTrash2, FiEdit2, FiFolder } from 'react-icons/fi';
import { useCollections } from '../../context/CollectionContext';

const CollectionCard = ({ collection, onOpen }) => {
  const { deleteCollection, renameCollection } = useCollections();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(collection.name);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the collection "${collection.name}"?`)) {
      deleteCollection(collection.id);
    }
  };

  const handleRenameSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const success = renameCollection(collection.id, newName);
    if (success) {
      setIsEditing(false);
    }
  };

  return (
    <div 
      onClick={() => !isEditing && onOpen(collection.id)}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col h-full"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[16/10] bg-gray-50 overflow-hidden flex items-center justify-center">
        <img
          src={collection.coverImage}
          alt={collection.name}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
        
        {/* Total Badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-gray-800 flex items-center gap-1.5 shadow-sm">
          <FiFolder className="h-3.5 w-3.5 text-gray-500" />
          <span>
            {collection.products.length} {collection.products.length === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

      {/* Info & Options Panel */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        {isEditing ? (
          <form onSubmit={handleRenameSubmit} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs text-gray-900 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#ff6a00] outline-none"
              autoFocus
              maxLength={50}
            />
            <button 
              type="submit" 
              className="px-2.5 py-1.5 bg-[#ff6a00] text-white text-[11px] font-bold rounded-lg hover:bg-[#e05e00]"
            >
              Save
            </button>
            <button 
              type="button" 
              onClick={() => setIsEditing(false)} 
              className="px-2 py-1.5 border border-gray-200 text-gray-500 text-[11px] font-bold rounded-lg hover:bg-gray-50"
            >
              X
            </button>
          </form>
        ) : (
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-bold text-gray-900 text-sm group-hover:text-[#ff6a00] transition-colors leading-snug">
                {collection.name}
              </h4>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Updated {new Date(collection.updatedAt).toLocaleDateString()}
              </p>
            </div>
            
            {/* Actions (Rename/Delete) */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
                title="Rename Collection"
              >
                <FiEdit2 className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="p-1.5 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-600 transition-colors"
                title="Delete Collection"
              >
                <FiTrash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionCard;
