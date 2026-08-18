import { useState, useEffect } from 'react';
import { sellerService } from '../../services/seller/sellerService';
import { FiBox, FiSearch, FiEdit2, FiAlertCircle, FiLoader, FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SellerInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ stock: 0, lowStockAlert: 0 });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await sellerService.getInventory();
      if (res.success) {
        setInventory(res.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setEditValues({ stock: item.stock || 0, lowStockAlert: item.lowStockAlert || 5 });
  };

  const handleSave = async (id) => {
    try {
      const res = await sellerService.updateInventory(id, {
        stock: Number(editValues.stock),
        lowStockAlert: Number(editValues.lowStockAlert)
      });
      if (res.success) {
        toast.success('Inventory updated successfully');
        setEditingId(null);
        fetchInventory();
      }
    } catch (error) {
      toast.error('Failed to update inventory');
    }
  };

  const lowStockCount = inventory.filter(item => item.stock <= (item.lowStockAlert || 5)).length;

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <FiLoader className="h-8 w-8 animate-spin text-[#ff6a00]" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 w-full min-w-0 max-w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 min-w-0 w-full">
        <div className="min-w-0 w-full md:w-auto">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2 truncate">
            <FiBox className="text-[#ff6a00] shrink-0" /> Warehouse & Inventory
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">Manage stock levels across multiple warehouses.</p>
        </div>
        <button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-md w-full md:w-auto shrink-0">
          Add Warehouse
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 w-full min-w-0">
        <div className="bg-orange-50 border border-orange-100 p-5 rounded-2xl min-w-0">
          <div className="flex items-center gap-3 text-orange-600 mb-2 min-w-0">
            <FiAlertCircle size={20} className="shrink-0" />
            <h3 className="font-bold truncate">Low Stock Alerts</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-gray-900 truncate">{lowStockCount} Items</p>
          <p className="text-xs text-gray-500 mt-1 truncate">Requires immediate restocking.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-w-0 w-full">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 min-w-0">
          <div className="relative flex-1 w-full min-w-0">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search SKU or Product Name..." className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm outline-none" />
          </div>
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-[10px] sm:text-sm min-w-full">
            <thead className="bg-gray-50 text-gray-600 font-bold">
              <tr>
                <th className="hidden md:table-cell px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">SKU</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Product Name</th>
                <th className="hidden lg:table-cell px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Warehouse</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Stock Level</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Alert Threshold</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inventory.map(item => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="hidden sm:table-cell px-1 sm:px-4 py-2 sm:py-4 font-mono text-[9px] sm:text-xs text-gray-500 whitespace-normal sm:whitespace-nowrap">{item.sku}</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 font-bold text-gray-900">{item.name}</td>
                  <td className="hidden lg:table-cell px-1 sm:px-4 py-2 sm:py-4 text-gray-600 whitespace-normal sm:whitespace-nowrap">{item.warehouse || 'Central WH'}</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">
                    {editingId === item._id ? (
                      <input 
                        type="number"
                        className="w-20 px-2 py-1 border rounded"
                        value={editValues.stock}
                        onChange={e => setEditValues({...editValues, stock: e.target.value})}
                      />
                    ) : (
                      <span className={`font-black ${item.stock <= (item.lowStockAlert || 5) ? 'text-red-600' : 'text-gray-900'}`}>
                        {item.stock}
                      </span>
                    )}
                  </td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 text-gray-500 whitespace-normal sm:whitespace-nowrap">
                    {editingId === item._id ? (
                      <input 
                        type="number"
                        className="w-20 px-2 py-1 border rounded"
                        value={editValues.lowStockAlert}
                        onChange={e => setEditValues({...editValues, lowStockAlert: e.target.value})}
                      />
                    ) : (
                      item.lowStockAlert || 5
                    )}
                  </td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 text-center">
                    {editingId === item._id ? (
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => handleSave(item._id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg shrink-0" title="Save">
                          <FiSave />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg shrink-0" title="Cancel">
                          <FiX />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => handleEditClick(item)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg shrink-0" title="Edit">
                        <FiEdit2 />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {inventory.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">
                    No products found in inventory.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerInventory;
