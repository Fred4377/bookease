import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CalendarPicker = ({ selectedDate, onChange }) => {
  // Disable Sundays
  const isNotSunday = (date) => {
    const day = date.getDay();
    return day !== 0;
  };

  return (
    <div className="flex justify-center w-full my-4">
      <DatePicker
        selected={selectedDate}
        onChange={onChange}
        filterDate={isNotSunday}
        minDate={new Date()}
        inline
        calendarClassName="bookease-datepicker"
      />
    </div>
  );
};

export default CalendarPicker;
