import { useState, useRef, useEffect } from 'react';
import { FiSend, FiPaperclip, FiSmile, FiArrowLeft, FiMoreVertical, FiCheck, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const TicketChat = ({ ticket, onBack, onReply, onCloseTicket }) => {
  const [replyText, setReplyText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ticket.messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim() || ticket.status === 'Closed') return;
    
    onReply(ticket.id, replyText);
    setReplyText('');
    
    // Simulate support agent typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleAttachment = () => {
    toast('Attachments are disabled in this simulation.', { icon: '📎' });
  };

  return (
    <div className="flex flex-col h-[600px] bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors lg:hidden">
            <FiArrowLeft className="text-xl" />
          </button>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{ticket.subject}</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
              Ticket {ticket.id} • {ticket.status}
            </p>
          </div>
        </div>
        {ticket.status !== 'Closed' && (
          <button
            onClick={() => onCloseTicket(ticket.id)}
            className="text-xs font-bold text-gray-500 hover:text-red-600 transition-colors px-3 py-1.5 border border-gray-200 rounded-lg hover:border-red-200"
          >
            Close Ticket
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
        {ticket.messages.map((msg, idx) => {
          const isCustomer = msg.senderRole === 'Customer';
          return (
            <div key={idx} className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                isCustomer ? 'bg-gray-900 text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'
              }`}>
                {!isCustomer && (
                  <p className="text-[10px] font-bold text-[#ff6a00] mb-1">{msg.senderRole}</p>
                )}
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <div className={`flex items-center gap-1 mt-2 text-[10px] ${isCustomer ? 'text-gray-400 justify-end' : 'text-gray-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {isCustomer && (
                    <span className="ml-1 text-sm">
                      {msg.status === 'Seen' ? <FiCheckCircle className="text-[#ff6a00]" /> : <FiCheck />}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm p-4 shadow-sm flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        {ticket.status === 'Closed' ? (
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500 font-medium">This ticket has been closed.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <button
              type="button"
              onClick={handleAttachment}
              className="p-3 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <FiPaperclip className="text-xl" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-sm transition-all"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500"
              >
                <FiSmile className="text-xl" />
              </button>
            </div>
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="p-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl transition-colors flex items-center justify-center"
            >
              <FiSend className="text-xl" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default TicketChat;
