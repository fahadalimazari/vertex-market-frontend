import { useState, useMemo } from 'react';
import { useUserManagement } from '../../context/Admin/UserManagementContext';
import { useLogs } from '../../context/Admin/LogsContext';
import { FiSearch, FiSliders, FiTrash2, FiUserCheck, FiUserMinus, FiRotateCcw } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Users = () => {
  const { users, suspendUser, activateUser, deleteUser, resetUserPassword } = useUserManagement();
  const { addLog } = useLogs();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSuspend = (id, name) => {
    suspendUser(id);
    addLog('User Suspended', `Suspended access for account: ${name} (${id})`);
  };

  const handleActivate = (id, name) => {
    activateUser(id);
    addLog('User Activated', `Activated access for account: ${name} (${id})`);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Permanently delete account for ${name}?`)) {
      deleteUser(id);
      addLog('User Deleted', `Permanently deleted account: ${name} (${id})`);
    }
  };

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;

      return true;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Paginated users
  const paginatedUsers = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">User Accounts Management</h2>
        <p className="text-xs text-gray-500 mt-1">Suspend, activate, delete, and dispatch password reset links.</p>
      </div>

      {/* Advanced search & filters block */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 border border-gray-100 rounded-2xl shadow-sm">
        <div className="md:col-span-2 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs w-full bg-gray-50/20"
            placeholder="Search users by name or email..."
          />
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs bg-white text-gray-700 font-semibold"
          >
            <option value="all">Role: All Roles</option>
            <option value="Customer">Customer</option>
            <option value="Seller">Seller</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs bg-white text-gray-700 font-semibold"
          >
            <option value="all">Status: All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Table list */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-700 uppercase tracking-wider">
                <th className="p-4 pl-6">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Fulfillment Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-750">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="p-4 pl-6">
                    <p className="font-bold text-gray-900">{user.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Joined: {user.joinDate}</p>
                  </td>
                  <td className="p-4 text-gray-800">{user.email}</td>
                  <td className="p-4 text-gray-600">{user.phone}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${user.role === 'Seller' ? 'bg-orange-50 text-[#ff6a00]' : 'bg-gray-100 text-gray-600'
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${user.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500 animate-pulse'
                      }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      {user.status === 'Active' ? (
                        <button
                          onClick={() => handleSuspend(user.id, user.name)}
                          className="p-1.5 hover:bg-orange-50 rounded-lg text-gray-400 hover:text-[#ff6a00] transition-colors"
                          title="Suspend User Account"
                        >
                          <FiUserMinus className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(user.id, user.name)}
                          className="p-1.5 hover:bg-green-50 rounded-lg text-gray-400 hover:text-green-600 transition-colors"
                          title="Activate User Account"
                        >
                          <FiUserCheck className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        onClick={() => resetUserPassword(user.id)}
                        className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-900 transition-colors"
                        title="Reset Password"
                      >
                        <FiRotateCcw className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete permanently"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    No registered user accounts match search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] text-gray-500 font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-3.5 py-1.5 border border-gray-200 rounded-lg text-[11px] font-bold text-gray-700 disabled:opacity-50 hover:bg-white transition-colors"
              >
                Prev
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-3.5 py-1.5 border border-gray-200 rounded-lg text-[11px] font-bold text-gray-700 disabled:opacity-50 hover:bg-white transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
