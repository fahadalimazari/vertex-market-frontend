import { memo } from 'react';

const AdminCard = memo(({ title, subtitle, action, children, className = '' }) => {
  return (
    <div className={`bg-white border border-gray-100 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col ${className}`}>
      {/* Header */}
      {(title || action) && (
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-50/80">
          <div>
            {title && <h3 className="text-[15px] font-bold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-[11px] text-gray-500 font-medium mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      
      {/* Body */}
      <div className="p-6 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
});

AdminCard.displayName = 'AdminCard';
export default AdminCard;
