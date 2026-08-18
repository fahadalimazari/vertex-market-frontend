import { useState } from 'react';
import { useSupport } from '../../hooks/useSupport';
import SupportTicketCard from '../../components/Orders/SupportTicketCard';
import TicketChat from '../../components/Orders/TicketChat';
import { FiMessageCircle, FiPlus } from 'react-icons/fi';

const Support = () => {
  const { tickets, createTicket, replyToTicket, closeTicket, isLoading } = useSupport();
  const [activeTicket, setActiveTicket] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('Orders');
  const [newMessage, setNewMessage] = useState('');

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const ticket = await createTicket(newSubject, newCategory, newMessage);
    if (ticket) {
      setIsCreating(false);
      setNewSubject('');
      setNewMessage('');
      setActiveTicket(ticket);
    }
  };

  const handleReply = (ticketId, text) => {
    replyToTicket(ticketId, text);
    // Optimistic update of active ticket for immediate UI response
    setActiveTicket(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: [
          ...prev.messages,
          {
            id: `msg-${Date.now()}`,
            senderRole: 'Customer',
            senderName: 'Me',
            text,
            timestamp: new Date().toISOString(),
            status: 'Sent'
          }
        ]
      };
    });
  };

  const handleCloseTicket = (ticketId) => {
    closeTicket(ticketId);
    setActiveTicket(prev => prev ? { ...prev, status: 'Closed' } : null);
  };

  // Find the fully updated ticket from context if it's active
  const currentTicket = activeTicket ? tickets.find(t => t.id === activeTicket.id) || activeTicket : null;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <FiMessageCircle className="text-[#ff6a00]" /> Support Center
            </h1>
            <p className="text-gray-500 mt-1">Manage your support tickets and communications.</p>
          </div>
          {!activeTicket && !isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
            >
              <FiPlus /> New Ticket
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets List Sidebar (Hidden on mobile if viewing a ticket) */}
          <div className={`lg:col-span-1 space-y-4 ${activeTicket || isCreating ? 'hidden lg:block' : 'block'}`}>
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Your Tickets</h3>
            {isLoading && tickets.length === 0 ? (
              <div className="animate-pulse space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-2xl"></div>)}
              </div>
            ) : tickets.length > 0 ? (
              tickets.map(ticket => (
                <div key={ticket.id} className={activeTicket?.id === ticket.id ? 'ring-2 ring-[#ff6a00] rounded-2xl' : ''}>
                  <SupportTicketCard 
                    ticket={ticket} 
                    onClick={(t) => { setActiveTicket(t); setIsCreating(false); }} 
                  />
                </div>
              ))
            ) : (
              <div className="text-center p-8 bg-white border border-gray-100 rounded-2xl">
                <p className="text-gray-500 text-sm">No support tickets found.</p>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {isCreating ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Create New Ticket</h2>
                  <button onClick={() => setIsCreating(false)} className="text-sm font-bold text-gray-500 hover:text-gray-900">Cancel</button>
                </div>
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Subject</label>
                    <input
                      type="text"
                      required
                      value={newSubject}
                      onChange={e => setNewSubject(e.target.value)}
                      placeholder="Briefly describe your issue"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Category</label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-sm"
                    >
                      <option>Orders</option>
                      <option>Payments</option>
                      <option>Refund</option>
                      <option>Delivery</option>
                      <option>Account</option>
                      <option>Technical</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Message</label>
                    <textarea
                      required
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      placeholder="Please provide details..."
                      rows={5}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-sm resize-none"
                    />
                  </div>
                  <button type="submit" className="w-full py-3 bg-[#ff6a00] hover:bg-[#e65c00] text-white rounded-xl font-bold text-sm transition-colors">
                    Submit Ticket
                  </button>
                </form>
              </div>
            ) : currentTicket ? (
              <TicketChat 
                ticket={currentTicket} 
                onBack={() => setActiveTicket(null)}
                onReply={handleReply}
                onCloseTicket={handleCloseTicket}
              />
            ) : (
              <div className="hidden lg:flex flex-col items-center justify-center h-full min-h-[400px] bg-white border border-gray-100 rounded-2xl text-center p-8">
                <FiMessageCircle className="text-4xl text-gray-200 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Select a ticket</h3>
                <p className="text-gray-500 text-sm mt-1">Choose a ticket from the sidebar to view the conversation or create a new one.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Support;
