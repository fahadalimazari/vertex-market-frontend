import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiDollarSign, FiClock, FiPhone } from 'react-icons/fi';

const PRIORITY_COLORS = {
  Low: 'bg-gray-100 text-gray-600',
  Medium: 'bg-blue-100 text-blue-600',
  High: 'bg-orange-100 text-orange-600',
  Urgent: 'bg-red-100 text-red-600'
};

const LeadCard = ({ lead, isDragging, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-4 rounded-xl border ${isDragging ? 'border-orange-500 shadow-lg' : 'border-gray-200 shadow-sm'} hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing relative group`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-gray-900 text-sm truncate pr-2">{lead.name}</h4>
        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full whitespace-nowrap ${PRIORITY_COLORS[lead.priority]}`}>
          {lead.priority}
        </span>
      </div>
      
      {lead.company && (
        <p className="text-xs text-gray-500 mb-3 truncate font-medium">{lead.company}</p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-400 mt-4 border-t border-gray-50 pt-3">
        <div className="flex items-center gap-1 font-medium text-gray-600">
          <FiDollarSign size={12} className="text-green-500" />
          ${lead.estimatedValue?.toLocaleString() || 0}
        </div>
        
        {lead.nextFollowUp && (
          <div className="flex items-center gap-1 font-medium">
            <FiClock size={12} className="text-orange-500" />
            {new Date(lead.nextFollowUp).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

export const SortableLeadCard = ({ lead, stage, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: lead._id,
    data: { stage }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <LeadCard lead={lead} isDragging={isDragging} onClick={() => onClick && onClick(lead)} />
    </div>
  );
};

export default LeadCard;
