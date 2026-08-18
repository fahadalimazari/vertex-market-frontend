import { memo } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const StatCard = memo(({ title, value, change, isPositive, icon: Icon, colorClass, bgClass, sparklineData }) => {
  return (
    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col relative overflow-hidden group cursor-pointer">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-2xl font-black text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${bgClass} ${colorClass} text-xl transition-transform group-hover:scale-110`}>
          <Icon />
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-4 relative z-10">
        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
          {change}
        </span>
        <span className="text-xs text-gray-400 font-medium">vs last month</span>
      </div>

      {/* Sparkline Chart */}
      {sparklineData && (
        <div className="h-16 w-full -mx-6 -mb-6 relative z-0 opacity-60 group-hover:opacity-100 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={isPositive ? '#10b981' : '#ef4444'} 
                fillOpacity={1} 
                fill={`url(#gradient-${title})`} 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
});

StatCard.displayName = 'StatCard';
export default StatCard;
