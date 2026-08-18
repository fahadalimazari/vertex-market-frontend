import { useState } from 'react';
import { useCollections } from '../../context/CollectionContext';
import { useCart } from '../../context/CartContext';
import { FiArrowLeft, FiTrash2, FiShoppingCart, FiShare2, FiEdit3 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const CollectionDetails = ({ collection, onBack }) => {
  const { removeFromCollection, removeAllFromCollection, renameCollection, deleteCollection } = useCollections();
  const { addToCart } = useCart();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(collection.name);

  const handleMoveAllToCart = () => {
    if (collection.products.length === 0) {
      toast.error('This collection is empty');
      return;
    }
    collection.products.forEach(product => {
      addToCart(product, 1, null);
    });
    toast.success(`Moved all ${collection.products.length} items to cart!`);
  };

  const handleRemoveAll = () => {
    if (collection.products.length === 0) return;
    if (window.confirm(`Remove all items from "${collection.name}"?`)) {
      removeAllFromCollection(collection.id);
    }
  };

  const handleRename = (e) => {
    e.preventDefault();
    const success = renameCollection(collection.id, editName);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleDeleteCollection = () => {
    if (window.confirm(`Delete the collection "${collection.name}"?`)) {
      deleteCollection(collection.id);
      onBack(); // Go back to grid
    }
  };

  const handleShare = (productName) => {
    const dummyUrl = `${window.location.origin}/product/${productName.toLowerCase().replace(/ /g, '-')}`;
    navigator.clipboard.writeText(dummyUrl);
    toast.success('Product link copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex flex-col gap-4 border-b border-gray-100 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors self-start"
        >
          <FiArrowLeft className="h-4.5 w-4.5" />
          <span>Back to Collections</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            {isEditing ? (
              <form onSubmit={handleRename} className="flex items-center gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="px-3.5 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-base font-bold text-gray-900"
                  maxLength={50}
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ff6a00] text-white text-xs font-bold rounded-xl hover:bg-[#e05e00]"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-2 border border-gray-200 text-gray-500 text-xs font-bold rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-gray-900">{collection.name}</h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 hover:bg-gray-50 rounded text-gray-400 hover:text-gray-700 transition-colors"
                  title="Rename"
                >
                  <FiEdit3 className="h-4.5 w-4.5" />
                </button>
              </div>
            )}
            <span className="bg-gray-100 px-2 py-0.5 rounded-lg text-xs font-semibold text-gray-600">
              {collection.products.length} {collection.products.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleMoveAllToCart}
              className="flex items-center gap-2 border border-[#ff6a00] text-[#ff6a00] hover:bg-orange-50 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
            >
              <FiShoppingCart className="h-4 w-4" />
              <span>Move All to Cart</span>
            </button>
            <button
              onClick={handleRemoveAll}
              className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
            >
              <FiTrash2 className="h-4 w-4" />
              <span>Remove All</span>
            </button>
            <button
              onClick={handleDeleteCollection}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
            >
              <span>Delete List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Products list */}
      {collection.products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <p className="text-sm text-gray-500 mb-4">This collection contains no products yet.</p>
          <Link
            to="/products"
            className="inline-flex justify-center bg-[#ff6a00] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#e05e00] transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {collection.products.map((prod) => (
            <div key={prod.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group relative p-4">
              
              {/* Delete Trigger */}
              <button
                onClick={() => removeFromCollection(collection.id, prod.id)}
                className="absolute top-3 right-3 p-1.5 bg-white/95 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full shadow-sm border border-gray-50 transition-colors z-10"
                title="Remove item"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>

              <Link to={`/product/${prod.slug}`} className="aspect-square bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-3 mb-4">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-contain group-hover:scale-103 transition-transform"
                />
              </Link>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{prod.brand}</p>
                  <Link to={`/product/${prod.slug}`} className="font-bold text-gray-800 text-sm leading-snug line-clamp-2 hover:text-[#ff6a00] transition-colors mb-2">
                    {prod.name}
                  </Link>
                  <p className="text-base font-black text-[#ff6a00]">Rs. {prod.price.toLocaleString()}</p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => addToCart(prod, 1, null)}
                    className="flex-1 bg-[#ff6a00] hover:bg-[#e05e00] text-white py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FiShoppingCart className="h-3.5 w-3.5" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={() => handleShare(prod.name)}
                    className="p-2 border border-gray-200 hover:border-gray-300 text-gray-500 rounded-xl transition-colors"
                    title="Share Link"
                  >
                    <FiShare2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionDetails;
