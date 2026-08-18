import React from 'react';
import BadgeRenderer from '../Admin/BadgeRenderer';

const SellerBadge = ({ badges }) => {
  if (!badges || !Array.isArray(badges) || badges.length === 0) {
    return null;
  }

  // Get only the first badge (Super Admin assigned)
  const badge = badges[0];

  return (
    <span 
      title={badge.label}
      className={`inline-flex items-center justify-center w-3 h-3 rounded-sm text-[8px] shadow-sm text-white shrink-0 ${
        badge.source === 'admin' 
          ? 'bg-gradient-to-r from-purple-500 to-indigo-500' 
          : 'bg-gradient-to-r from-orange-500 to-amber-500'
      }`}
    >
      <BadgeRenderer icon={badge.icon || badge.label} />
    </span>
  );
};

export default SellerBadge;
