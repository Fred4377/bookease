import React from 'react';
import BookingForm from '../components/BookingForm';

const BookingPage = () => {
  return (
    <div className="bg-[#0D1117] min-h-screen text-[#E6EDF3] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Schedule an Appointment
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-sm text-[#E6EDF3]/60 sm:mt-4">
            Select a service, pick your date and time, and confirm your details.
          </p>
        </div>
        <BookingForm />
      </div>
    </div>
  );
};

export default BookingPage;
