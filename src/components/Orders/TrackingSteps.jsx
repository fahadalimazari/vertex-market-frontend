import { memo } from 'react';
import { FiCheckCircle, FiCircle, FiPackage, FiTruck, FiMapPin, FiCheck } from 'react-icons/fi';

const TrackingSteps = memo(({ timeline }) => {
  if (!timeline || timeline.length === 0) return null;

  const currentStepIndex = timeline.length - 1;

  const getIconForStatus = (status) => {
    switch(status) {
      case 'Order Placed': return <FiCheckCircle />;
      case 'Packed': return <FiPackage />;
      case 'Shipped': return <FiTruck />;
      case 'Out For Delivery': return <FiMapPin />;
      case 'Delivered': return <FiCheck />;
      default: return <FiCircle />;
    }
  };

  return (
    <div className="relative">
      <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gray-100"></div>
      
      <div className="space-y-8 relative">
        {timeline.map((event, idx) => {
          const isLast = idx === timeline.length - 1;
          const isCompleted = idx <= currentStepIndex;

          return (
            <div key={idx} className="flex gap-4">
              <div className="w-16 text-right pt-1 flex-shrink-0">
                <p className="text-[10px] font-bold text-gray-500">
                  {new Date(event.timestamp).toLocaleDateString()}
                </p>
                <p className="text-[10px] text-gray-400">
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 
                ${isLast ? 'bg-[#ff6a00] text-white shadow-md shadow-orange-500/20' : 
                  isCompleted ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'}`}
              >
                {getIconForStatus(event.status)}
              </div>

              <div className="pt-1 flex-1">
                <h4 className={`text-sm font-bold ${isLast ? 'text-[#ff6a00]' : 'text-gray-900'}`}>
                  {event.status}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{event.details}</p>
                {event.location && (
                  <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                    <FiMapPin /> {event.location}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

TrackingSteps.displayName = 'TrackingSteps';
export default TrackingSteps;
