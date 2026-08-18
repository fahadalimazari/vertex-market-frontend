import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/Admin/AdminContext';
import { FiLock, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const { adminLogin, isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await adminLogin(email, password, rememberMe);
    if (success) {
      navigate('/admin/dashboard');
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6">
        
        {/* Banner header */}
        <div className="text-center">
          <h2 className="text-3xl font-black text-gray-900">Vertex Admin</h2>
          <p className="mt-2 text-xs text-gray-500">Sign in with administrator credentials to manage the marketplace.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Admin Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4.5 w-4.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vertex.market"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4.5 w-4.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-gray-600 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-gray-300 text-[#ff6a00] focus:ring-[#ff6a00] accent-[#ff6a00]"
              />
              <span>Remember Me</span>
            </label>
            <button
              type="button"
              onClick={() => toast.success('Password reset link dispatched to admin mailbox (Simulated)')}
              className="text-[#ff6a00] hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#ff6a00] hover:bg-[#e05e00] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md mt-2"
          >
            Sign In to Panel
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100 mt-2">
          <div className="bg-orange-50 text-[#ff6a00] p-3 rounded-xl text-[10px] font-bold text-center border border-orange-100">
            Credential sandbox: admin@vertexmarket.com / password123
          </div>
        </div>


      </div>
    </div>
  );
};

export default AdminLogin;
