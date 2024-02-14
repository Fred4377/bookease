import React from 'react';

const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30',
    confirmed: 'bg-success/10 text-success border border-success/30',
    cancelled: 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30',
    completed: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30',
  };

  const labels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    completed: 'Completed',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider ${styles[status] || styles.pending}`}>
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current"></span>
      {labels[status] || status}
    </span>
  );
};

export default StatusBadge;
