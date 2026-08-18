import { useState, useMemo } from 'react';
import { useLogs } from '../../context/Admin/LogsContext';
import { FiSearch, FiSliders, FiFileText } from 'react-icons/fi';

const Logs = () => {
  const { logs } = useLogs();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.adminName.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (actionFilter !== 'all' && log.action !== actionFilter) return false;

      return true;
    });
  }, [logs, searchQuery, actionFilter]);

  // Unique actions list for dropdown filtering
  const uniqueActions = useMemo(() => {
    const actions = logs.map(l => l.action);
    return ['all', ...new Set(actions)];
  }, [logs]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FiFileText className="text-[#ff6a00]" /> Security & Audit logs
        </h2>
        <p className="text-xs text-gray-500 mt-1">Review activity trails of administrator dashboard modifications.</p>
      </div>

      {/* Advanced search & filters block */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 border border-gray-100 rounded-2xl shadow-sm">
        <div className="sm:col-span-2 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs w-full bg-gray-50/20"
            placeholder="Search audit detail targets..."
          />
        </div>

        <div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs bg-white text-gray-700 font-semibold"
          >
            <option value="all">Action Type: All Actions</option>
            {uniqueActions.filter(a => a !== 'all').map(act => (
              <option key={act} value={act}>{act}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table list */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-700 uppercase tracking-wider">
                <th className="p-4 pl-6">Log ID</th>
                <th className="p-4">Action</th>
                <th className="p-4">Modified details</th>
                <th className="p-4">Admin Name</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-750">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="p-4 pl-6 font-mono font-bold text-gray-900">{log.id}</td>
                  <td className="p-4">
                    <span className="bg-orange-50 text-[#ff6a00] px-2 py-0.5 rounded font-bold text-[9px] uppercase">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-gray-700 font-semibold">{log.details}</td>
                  <td className="p-4 text-gray-650">{log.adminName}</td>
                  <td className="p-4 text-gray-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400">
                    No audit records match filters.
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

export default Logs;
