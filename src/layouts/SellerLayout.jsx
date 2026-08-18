import { Outlet, Navigate } from 'react-router-dom';
import { useSeller } from '../context/SellerContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import SellerSidebar from '../components/Seller/SellerSidebar';
import SellerHeader from '../components/Seller/SellerHeader';

const SellerLayout = () => {
  const { isRegisteredSeller } = useSeller();
  const { loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ff6a00] border-t-transparent" />
      </div>
    );
  }

  if (!isRegisteredSeller) {
    return <Navigate to="/seller/register" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden font-sans transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      <SellerSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Container - adds left margin on large screens to avoid the fixed sidebar */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out lg:pl-64 h-full">
        <SellerHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Content Pane */}
        <main className="p-4 sm:p-6 flex-1 w-full overflow-x-hidden overflow-y-auto">
          <div className="max-w-[1200px] mx-auto w-full min-w-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
