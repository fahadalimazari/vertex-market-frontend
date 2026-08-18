import { useState, useMemo, useEffect } from 'react';
import { useProductManagement } from '../../context/Admin/ProductManagementContext';
import { useLogs } from '../../context/Admin/LogsContext';
import { FiSearch, FiSliders, FiCheck, FiX, FiStar, FiEyeOff, FiTrash2, FiCopy, FiEdit, FiPlus, FiDownload, FiUpload, FiFilter, FiFileText } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Products = () => {
  const { 
    products, loading, approveProduct, rejectProduct, 
    toggleFeatureProduct, toggleHideProduct, deleteProduct, duplicateProduct, refreshProducts, fetchProducts
  } = useProductManagement();
  
  const { addLog } = useLogs();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts('ADMIN');
  }, [fetchProducts]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  
  // Review Modal State
  const [reviewingProduct, setReviewingProduct] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  const itemsPerPage = 10;

  const getDisplayName = (field) => {
    if (!field) return '';
    if (typeof field === 'object') return field.name || '';
    return String(field);
  };

  const handleApprove = async (id, name) => {
    await approveProduct(id);
    addLog('Product Approved', `Approved listing catalog: "${name}" (${id})`);
    toast.success(`${name} has been approved.`);
    setReviewingProduct(null);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason.');
      return;
    }
    await rejectProduct(reviewingProduct._id, rejectReason);
    addLog('Product Rejected', `Rejected listing: "${reviewingProduct.name}". Reason: ${rejectReason}`);
    toast.error(`${reviewingProduct.name} has been rejected.`);
    setReviewingProduct(null);
    setIsRejecting(false);
    setRejectReason('');
  };

  const handleFeature = async (id, name) => {
    await toggleFeatureProduct(id);
    addLog('Product Featured', `Updated featured tag for: "${name}" (${id})`);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Permanently delete product listing for ${name}?`)) {
      await deleteProduct(id);
      addLog('Product Deleted', `Permanently deleted catalog item: "${name}" (${id})`);
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const handleDuplicate = async (id, name) => {
    await duplicateProduct(id);
    addLog('Product Duplicated', `Duplicated product listing for: "${name}" (${id})`);
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === paginatedProducts.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedProducts.map(p => p._id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Permanently delete ${selectedItems.length} products?`)) {
      for (const id of selectedItems) {
        await deleteProduct(id);
      }
      setSelectedItems([]);
      addLog('Bulk Delete', `Deleted ${selectedItems.length} products.`);
    }
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = 
        getDisplayName(p.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sku || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        getDisplayName(p.brand).toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && getDisplayName(p.category) !== categoryFilter) return false;

      return true;
    });
  }, [products, searchQuery, statusFilter, categoryFilter]);

  // Categories for filter
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => getDisplayName(p.category)).filter(Boolean));
    return Array.from(cats);
  }, [products]);

  // Paginated products
  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Products</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your enterprise product catalog.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={refreshProducts}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            Refresh
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
            <FiDownload /> Export
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
            <FiUpload /> Import
          </button>
          <Link to="/admin/products/create" className="px-4 py-2 bg-orange-600 text-white font-bold text-sm rounded-xl hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/30 flex items-center gap-2">
            <FiPlus /> Add Product
          </Link>
        </div>
      </div>

      {/* Advanced search & filters block */}
      <div className="bg-white p-4 border border-gray-100 rounded-2xl shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-sm w-full bg-gray-50/20"
              placeholder="Search by Product Name, SKU, or Brand..."
            />
          </div>

          <div>
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-sm bg-white text-gray-700 font-semibold appearance-none"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
             <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-sm bg-white text-gray-700 font-semibold"
            >
              <option value="all">Status: All</option>
              <option value="Approved">Approved</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedItems.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-100 rounded-xl animate-fade-in">
            <span className="text-sm font-bold text-orange-800">
              {selectedItems.length} items selected
            </span>
            <div className="flex gap-2">
              <button 
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-white text-red-600 text-xs font-bold rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table list */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-4 pl-6 w-10">
                  <input 
                    type="checkbox" 
                    checked={selectedItems.length === paginatedProducts.length && paginatedProducts.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </th>
                <th className="p-4">Product Details</th>
                <th className="p-4">SKU / Brand</th>
                <th className="p-4">Price / Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No products found matching your criteria.
                  </td>
                </tr>
              ) : paginatedProducts.map((prod) => (
                <tr key={prod._id} className={`hover:bg-gray-50/50 transition-colors ${selectedItems.includes(prod._id) ? 'bg-orange-50/30' : ''}`}>
                  <td className="p-4 pl-6">
                    <input 
                      type="checkbox" 
                      checked={selectedItems.includes(prod._id)}
                      onChange={() => toggleSelect(prod._id)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                  </td>
                  {/* Details */}
                  <td className="p-4 flex items-center gap-3">
                    <div className="h-12 w-12 bg-gray-50 border border-gray-100 rounded-lg p-1 flex items-center justify-center shrink-0">
                      <img src={prod.image} alt={prod.name} className="max-h-full max-w-full object-contain" loading="lazy" />
                    </div>
                    <div className="min-w-0">
                      <Link to={`/product/${prod.slug || prod._id}`} className="font-bold text-gray-900 hover:text-orange-600 transition-colors line-clamp-1">
                        {getDisplayName(prod.name)}
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">{getDisplayName(prod.category)} {prod.subCategory && `> ${getDisplayName(prod.subCategory)}`}</p>
                    </div>
                  </td>

                  {/* SKU/Brand */}
                  <td className="p-4">
                    <p className="font-mono text-xs font-bold text-gray-800">{prod.sku || 'N/A'}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{getDisplayName(prod.brand) || 'No Brand'}</p>
                  </td>

                  {/* Price / Stock */}
                  <td className="p-4">
                    <div className="font-bold text-gray-900">
                      Rs. {prod.price?.toLocaleString()}
                      {prod.oldPrice && <span className="text-xs text-gray-400 line-through ml-2">Rs. {prod.oldPrice.toLocaleString()}</span>}
                    </div>
                    <div className="text-xs mt-1">
                      {prod.stock > 10 ? (
                        <span className="text-green-600 font-semibold">{prod.stock} in stock</span>
                      ) : prod.stock > 0 ? (
                        <span className="text-orange-600 font-semibold">Low Stock ({prod.stock})</span>
                      ) : (
                        <span className="text-red-600 font-semibold">Out of Stock</span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      prod.status === 'Approved' 
                        ? 'bg-green-100 text-green-800' 
                        : prod.status?.includes('Pending') 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {prod.status || 'Active'}
                    </span>
                    <div className="flex gap-1 mt-2">
                      {prod.isFeatured && <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded">Featured</span>}
                      {prod.isFlashSale && <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded">Flash</span>}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right pr-6">
                    <div className="inline-flex items-center justify-end gap-1">
                      {prod.status?.includes('Pending') && (
                        <button 
                          onClick={() => setReviewingProduct(prod)} 
                          className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold text-xs rounded-lg transition-colors border border-orange-100"
                        >
                          Review
                        </button>
                      )}

                      {!prod.status?.includes('Pending') && (
                        <Link to={`/admin/products/edit/${prod._id}`} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-600 transition-colors" title="Edit Product">
                          <FiEdit className="h-4 w-4" />
                        </Link>
                      )}
                      
                      <button onClick={() => handleFeature(prod._id, prod.name)} className={`p-1.5 rounded-lg transition-colors ${prod.isFeatured ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-900'}`} title="Toggle Featured">
                        <FiStar className="h-4 w-4" />
                      </button>

                      <button onClick={() => handleDuplicate(prod._id, prod.name)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors" title="Duplicate">
                        <FiCopy className="h-4 w-4" />
                      </button>

                      <button onClick={() => handleDelete(prod._id, prod.name)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500 font-medium">
              Showing <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> of <span className="font-bold text-gray-900">{filteredProducts.length}</span> results
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 disabled:opacity-50 hover:bg-white transition-colors shadow-sm"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 disabled:opacity-50 hover:bg-white transition-colors shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Approval Modal */}
      {reviewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto hide-scrollbar">
            <button
              onClick={() => { setReviewingProduct(null); setIsRejecting(false); }}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <FiX className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-black text-gray-900 mb-4">Product Approval Workflow</h3>
            
            <div className="space-y-6">
              {/* Product Info Summary */}
              <div className="flex gap-4 p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                <div className="w-24 h-24 bg-white border border-gray-200 rounded-xl p-2 shrink-0">
                  <img src={reviewingProduct.image} alt="Product" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{getDisplayName(reviewingProduct.name)}</h4>
                  <p className="text-xs text-gray-500 mb-2">Category: {getDisplayName(reviewingProduct.category)}</p>
                  <p className="text-sm font-black text-[#ff6a00]">Rs. {reviewingProduct.price?.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Stock: {reviewingProduct.stock} units</p>
                </div>
              </div>

              {/* Actions & Feedback */}
              {isRejecting ? (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="font-bold text-red-600">Rejection Reason</h4>
                  <textarea
                    rows={4}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Explain to the seller why this product is being rejected (e.g. Low quality images, incorrect category, missing specifications)..."
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm resize-none"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleRejectSubmit}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md"
                    >
                      Confirm Rejection
                    </button>
                    <button
                      onClick={() => setIsRejecting(false)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      onClick={() => handleApprove(reviewingProduct._id, reviewingProduct.name)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      <FiCheck /> Approve Listing
                    </button>
                    <button
                      onClick={() => setIsRejecting(true)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-xl transition-colors border border-red-200 flex items-center justify-center gap-2"
                    >
                      <FiX /> Reject with Reason
                    </button>
                    <button
                      onClick={() => navigate(`/admin/products/edit/${reviewingProduct._id}`)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold py-3 rounded-xl transition-colors border border-blue-200 flex items-center justify-center gap-2"
                    >
                      <FiEdit /> Edit & Approve
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Products;
