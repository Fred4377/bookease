import React from 'react';

const ALL_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "02:00 PM",
  "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM",
  "04:30 PM", "05:00 PM"
];

const TimeSlotPicker = ({ availableSlots = [], selectedSlot, onSelectSlot, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 my-4">
        {ALL_SLOTS.map((slot, index) => (
          <div key={index} className="h-12 rounded bg-[#161B22] animate-pulse border border-[#161B22]/30"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 my-4">
      {ALL_SLOTS.map((slot) => {
        const isAvailable = availableSlots.includes(slot);
        const isSelected = selectedSlot === slot;

        let btnStyle = "";
        if (!isAvailable) {
          btnStyle = "bg-[#161B22] text-[#E6EDF3]/30 border border-gray-800/40 cursor-not-allowed opacity-40 line-through";
        } else if (isSelected) {
          btnStyle = "bg-primary/15 text-primary border-2 border-primary font-semibold scale-105 shadow-md shadow-primary/10";
        } else {
          // Available slot
          btnStyle = "bg-success/10 text-success border border-success/30 hover:bg-success/20 hover:border-success active:scale-95";
        }

        return (
          <button
            key={slot}
            type="button"
            disabled={!isAvailable}
            onClick={() => onSelectSlot(slot)}
            className={`py-3 px-2 rounded-lg text-sm font-medium tracking-wide flex items-center justify-center transition-all duration-200 ${btnStyle}`}
          >
            <i className={`far ${isSelected ? 'fa-check-circle' : (isAvailable ? 'fa-clock' : 'fa-calendar-times')} mr-2`}></i>
            {slot}
          </button>
        );
      })}
    </div>
  );
};

export default TimeSlotPicker;
