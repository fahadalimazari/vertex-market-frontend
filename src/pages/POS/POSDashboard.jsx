import { useState } from 'react';
import { FiMonitor, FiPrinter, FiSearch, FiShoppingCart, FiCreditCard, FiUserPlus, FiTrash2 } from 'react-icons/fi';
import { products } from '../../data/products';

const POSDashboard = () => {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FiMonitor className="text-2xl text-orange-500" />
          <h1 className="text-xl font-bold">Vertex POS</h1>
          <span className="bg-gray-800 text-xs px-2 py-1 rounded ml-2 font-mono">Terminal 01</span>
        </div>
        <div className="flex gap-4">
          <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors">
            <FiUserPlus className="text-xl" />
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors">
            <FiPrinter className="text-xl" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Product Selection */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="relative mb-6">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input 
              type="text" 
              placeholder="Scan barcode or search product..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 focus:outline-none focus:border-orange-500 transition-colors"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pb-6">
            {filteredProducts.slice(0, 16).map(product => (
              <button 
                key={product.id} 
                onClick={() => addToCart(product)}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all text-left flex flex-col h-full"
              >
                <div className="h-32 w-full bg-gray-50 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                  <img src={product.image} alt={product.name} className="object-cover h-full w-full" />
                </div>
                <div className="font-semibold text-gray-900 line-clamp-2 text-sm flex-1">{product.name}</div>
                <div className="text-orange-600 font-bold mt-2">${product.price.toFixed(2)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Cash Register */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-xl z-10">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <FiShoppingCart className="text-gray-400" />
            <h2 className="font-semibold text-gray-900">Current Order</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <FiShoppingCart className="text-4xl mb-2 opacity-50" />
                <p>Cart is empty</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex gap-3 border-b border-gray-50 pb-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0">
                    <img src={item.image} alt="" className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm line-clamp-2">{item.name}</div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-sm font-bold text-gray-500">${item.price} x {item.qty}</div>
                      <div className="text-orange-600 font-bold">${(item.price * item.qty).toFixed(2)}</div>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-2">
                    <FiTrash2 />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 text-sm">
              <span className="text-gray-500">Tax (0%)</span>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="flex justify-between mb-6 text-xl font-bold">
              <span className="text-gray-900">Total</span>
              <span className="text-orange-600">${total.toFixed(2)}</span>
            </div>

            <button 
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={cart.length === 0}
            >
              <FiCreditCard className="text-xl" />
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSDashboard;
