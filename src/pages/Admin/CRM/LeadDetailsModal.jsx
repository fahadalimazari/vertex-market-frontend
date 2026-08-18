import { useState, useEffect } from 'react';
import { FiX, FiMail, FiPhone, FiCalendar, FiClock, FiCheckCircle, FiFileText } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const LeadDetailsModal = ({ leadId, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');

  const fetchLeadDetails = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('vertex_session_v1'))?.token;
      
      const [leadRes, actRes] = await Promise.all([
        axios.get(`http://127.0.0.1:5000/api/v1/admin/crm/leads/${leadId}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`http://127.0.0.1:5000/api/v1/admin/crm/leads/${leadId}/activities`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setLead(leadRes.data.data);
      setActivities(actRes.data.data);
    } catch (error) {
      toast.error('Failed to load details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadDetails();
  }, [leadId]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    try {
      const token = JSON.parse(localStorage.getItem('vertex_session_v1'))?.token;
      await axios.post(`http://127.0.0.1:5000/api/v1/admin/crm/leads/${leadId}/notes`, { note: newNote }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewNote('');
      fetchLeadDetails();
      toast.success('Note added');
    } catch (error) {
      toast.error('Failed to add note');
    }
  };

  const handleConvert = async () => {
    if (confirm("Are you sure you want to convert this lead to a customer?")) {
      try {
        const token = JSON.parse(localStorage.getItem('vertex_admin_auth_v1') || sessionStorage.getItem('vertex_admin_auth_v1'))?.token;
        await axios.post(`http://127.0.0.1:5000/api/v1/admin/crm/leads/${leadId}/convert`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Lead Converted Successfully!');
        onUpdate();
        onClose();
      } catch (error) {
        toast.error('Conversion failed');
      }
    }
  };

  if (loading) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 backdrop-blur-sm">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-0 sm:p-4 bg-gray-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-white h-full sm:h-auto sm:max-h-[95vh] w-full max-w-xl sm:rounded-3xl shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50 sm:rounded-t-3xl shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-black text-gray-900">{lead?.name}</h2>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                lead?.stage === 'Won' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {lead?.stage}
              </span>
            </div>
            {lead?.company && <p className="text-sm font-medium text-gray-500">{lead?.company}</p>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:bg-white p-2 rounded-full transition-colors shadow-sm">
            <FiX size={20} />
          </button>
        </div>

        {/* Action Bar */}
        <div className="px-6 py-3 border-b border-gray-100 flex gap-2 overflow-x-auto hide-scrollbar shrink-0">
          <button onClick={() => setActiveTab('info')} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeTab === 'info' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Information</button>
          <button onClick={() => setActiveTab('activity')} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeTab === 'activity' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Activity Timeline</button>
          <button onClick={() => setActiveTab('notes')} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeTab === 'notes' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Notes</button>
          
          <div className="flex-1"></div>
          
          {lead?.stage !== 'Won' && (
            <button onClick={handleConvert} className="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap bg-green-50 text-green-600 border border-green-200 hover:bg-green-500 hover:text-white transition-all flex items-center gap-1">
              <FiCheckCircle size={14} /> Convert
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <AnimatePresence mode="wait">
            
            {activeTab === 'info' && (
              <motion.div key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Contact Details</h3>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 shrink-0"><FiMail /></div>
                    <span className="font-medium text-gray-700">{lead?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500 shrink-0"><FiPhone /></div>
                    <span className="font-medium text-gray-700">{lead?.phone || 'N/A'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100/50">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Value</p>
                    <p className="text-xl font-black text-orange-600">${lead?.estimatedValue?.toLocaleString() || 0}</p>
                  </div>
                  <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100/50">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Priority</p>
                    <p className="text-xl font-black text-purple-600">{lead?.priority}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">System Info</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Source</span><span className="font-medium text-gray-800">{lead?.source}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Assigned To</span><span className="font-medium text-gray-800">{lead?.assignedTo?.firstName || 'Unassigned'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Created At</span><span className="font-medium text-gray-800">{new Date(lead?.createdAt).toLocaleDateString()}</span></div>
                  </div>
                </div>

              </motion.div>
            )}

            {activeTab === 'activity' && (
              <motion.div key="activity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {activities.length === 0 ? (
                  <div className="text-center text-gray-400 py-10 text-sm">No activity recorded yet.</div>
                ) : (
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                    {activities.map((act, idx) => (
                      <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-orange-100 text-orange-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                          <FiClock size={14} />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-gray-800 text-sm">{act.action}</span>
                            <span className="text-[10px] text-gray-400 font-bold">{new Date(act.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-gray-500">
                            By {act.userId?.firstName || 'System'}
                          </p>
                          {(act.oldValue || act.newValue) && (
                            <div className="mt-2 p-2 bg-gray-50 rounded-lg text-xs font-mono text-gray-600 flex gap-2">
                              {act.oldValue && <span className="line-through opacity-70">{act.oldValue}</span>}
                              {act.oldValue && act.newValue && <span>→</span>}
                              {act.newValue && <span className="text-orange-600 font-bold">{act.newValue}</span>}
                            </div>
                          )}
                          {act.metadata?.note && (
                            <div className="mt-2 text-xs text-gray-600 italic border-l-2 border-orange-200 pl-2">
                              "{act.metadata.note}"
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'notes' && (
              <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 flex flex-col h-full">
                <div className="flex-1 overflow-y-auto bg-gray-50 p-4 rounded-2xl border border-gray-100 whitespace-pre-wrap text-sm text-gray-700 font-medium">
                  {lead?.notes || <span className="text-gray-400 italic">No notes added yet.</span>}
                </div>
                <form onSubmit={handleAddNote} className="flex gap-2 mt-4 shrink-0">
                  <input 
                    type="text" 
                    value={newNote} 
                    onChange={e => setNewNote(e.target.value)} 
                    placeholder="Type a new note..."
                    className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:border-orange-500 outline-none"
                  />
                  <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
                    Add
                  </button>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default LeadDetailsModal;
