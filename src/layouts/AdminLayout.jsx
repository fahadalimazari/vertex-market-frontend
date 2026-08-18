import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAdmin } from '../context/Admin/AdminContext';
import AdminSidebar from '../components/Admin/AdminSidebar';
import AdminHeader from '../components/Admin/AdminHeader';

const AdminLayout = () => {
  const { isAuthenticated } = useAdmin();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden font-sans transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar Navigation */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <AdminSidebar onCloseMobile={() => setIsMobileSidebarOpen(false)} />
      </div>

      {/* Main Panel Content Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto hide-scrollbar">
        <AdminHeader onMenuClick={() => setIsMobileSidebarOpen(true)} />
        
        {/* Pages Content View */}
        <main className="p-4 md:p-6 flex-1 max-w-[1280px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
