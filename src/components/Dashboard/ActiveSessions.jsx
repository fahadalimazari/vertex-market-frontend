import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiMonitor, FiSmartphone, FiLogOut } from 'react-icons/fi';
import { authService } from '../../services/auth/authService';

const ActiveSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevoking, setIsRevoking] = useState(false);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const data = await authService.getSessions();
      setSessions(data);
    } catch (error) {
      toast.error('Failed to load active sessions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevoke = async (id) => {
    try {
      setIsRevoking(true);
      await authService.revokeSession(id);
      toast.success('Session logged out successfully');
      setSessions(sessions.filter(s => s._id !== id));
    } catch (error) {
      toast.error(error.message || 'Failed to logout session');
    } finally {
      setIsRevoking(false);
    }
  };

  const handleRevokeAllOther = async () => {
    try {
      setIsRevoking(true);
      await authService.revokeAllOtherSessions();
      toast.success('All other devices logged out');
      setSessions(sessions.filter(s => s.isCurrent));
    } catch (error) {
      toast.error(error.message || 'Failed to logout other devices');
    } finally {
      setIsRevoking(false);
    }
  };

  const getDeviceIcon = (device) => {
    const d = (device || '').toLowerCase();
    if (d.includes('mobile') || d.includes('iphone') || d.includes('android')) {
      return <FiSmartphone className="w-5 h-5 text-gray-500" />;
    }
    return <FiMonitor className="w-5 h-5 text-gray-500" />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    if (days === 1) return 'Yesterday at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-sm mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Active Sessions</h3>
          <p className="text-[13px] text-gray-500 mt-1">Manage devices currently logged into your account.</p>
        </div>
        {sessions.length > 1 && (
          <button
            onClick={handleRevokeAllOther}
            disabled={isRevoking}
            className="text-[13px] font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            Log Out All Other Devices
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#ff6a00] rounded-full animate-spin"></div>
        </div>
      ) : sessions.length === 0 ? (
        <p className="text-gray-500 text-[14px]">No active sessions found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {sessions.map((session) => (
            <div key={session._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-white p-2.5 rounded-xl border border-gray-200 shadow-sm">
                  {getDeviceIcon(session.device)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-900 text-[14px]">
                      {session.browser} on {session.os}
                    </p>
                    {session.isCurrent && (
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        Current Session
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-gray-500 mt-1 flex items-center gap-2">
                    <span>{session.ipAddress}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>Last active: {formatDate(session.lastActive)}</span>
                  </p>
                </div>
              </div>
              
              {!session.isCurrent && (
                <button
                  onClick={() => handleRevoke(session._id)}
                  disabled={isRevoking}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Log out device"
                >
                  <FiLogOut className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveSessions;
