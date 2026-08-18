import { memo } from 'react';
import { FiMessageSquare, FiClock } from 'react-icons/fi';

const SupportTicketCard = memo(({ ticket, onClick }) => {
  return (
    <div 
      onClick={() => onClick(ticket)}
      className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-[#ff6a00] hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold
            ${ticket.status === 'Open' ? 'bg-blue-100 text-blue-800' :
              ticket.status === 'Closed' ? 'bg-gray-100 text-gray-600' :
              'bg-orange-100 text-orange-800'}`}
          >
            {ticket.status}
          </span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{ticket.category}</span>
        </div>
        <span className="text-xs text-gray-400 flex items-center gap-1 font-medium">
          <FiClock /> {new Date(ticket.updatedAt).toLocaleDateString()}
        </span>
      </div>

      <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#ff6a00] transition-colors line-clamp-1 mb-2">
        {ticket.subject}
      </h3>

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <FiMessageSquare />
        <span>{ticket.messages.length} messages</span>
      </div>
    </div>
  );
});

SupportTicketCard.displayName = 'SupportTicketCard';
export default SupportTicketCard;
