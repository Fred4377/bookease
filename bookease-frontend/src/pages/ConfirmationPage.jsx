import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import Loader from '../components/Loader';
import confetti from 'canvas-confetti';

const ConfirmationPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data } = await api.get(`/bookings/${id}`);
        setBooking(data);
        // Trigger Confetti!
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.error('Error fetching booking details:', err);
        setError('Booking details could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBooking();
    }
  }, [id]);

  if (loading) {
    return <Loader fullPage={true} />;
  }

  if (error || !booking) {
    return (
      <div className="bg-[#0D1117] min-h-screen flex items-center justify-center py-12 px-4 text-[#E6EDF3]">
        <div className="bg-[#161B22] border border-gray-850 p-8 rounded-2xl max-w-md text-center space-y-4">
          <i className="fas fa-exclamation-circle text-4xl text-[#EF4444]"></i>
          <h2 className="text-xl font-bold">Booking Not Found</h2>
          <p className="text-sm text-[#E6EDF3]/60">
            {error || "We couldn't retrieve the details for this booking ID."}
          </p>
          <Link to="/" className="inline-block bg-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  // Format booking date
  const bookingDateFormatted = new Date(booking.bookingDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Construct WhatsApp URL
  const waMsg = `Hello! Confirming my BookEase Appointment:\n\n` +
    `• Booking ID: ${booking._id}\n` +
    `• Service: ${booking.serviceName}\n` +
    `• Date: ${bookingDateFormatted}\n` +
    `• Time: ${booking.timeSlot}\n` +
    `• Customer: ${booking.customerName}\n` +
    `• Price: $${booking.servicePrice}`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(waMsg)}`;

  return (
    <div className="bg-[#0D1117] min-h-screen text-[#E6EDF3] flex flex-col justify-center items-center py-16 px-4">
      <div className="max-w-xl w-full bg-[#161B22] border border-gray-800/60 rounded-3xl p-8 shadow-2xl space-y-8 text-center relative overflow-hidden">
        {/* Animated Checkmark CSS Indicator */}
        <div className="success-checkmark-wrapper py-4 flex justify-center">
          <div className="checkmark-circle">
            <div className="checkmark-stem"></div>
            <div className="checkmark-kick"></div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-white">Booking Confirmed!</h1>
          <p className="text-sm text-[#E6EDF3]/65 max-w-sm mx-auto">
            Your appointment has been successfully scheduled. Below are your booking details.
          </p>
        </div>

        {/* Details Card */}
        <div className="bg-[#0D1117] border border-gray-850 rounded-2xl p-6 text-left space-y-4">
          <div className="flex justify-between items-center border-b border-gray-800 pb-3">
            <span className="text-xs text-[#E6EDF3]/40 uppercase tracking-wider font-semibold">Booking Reference</span>
            <span className="text-sm font-bold text-primary">{booking._id.substring(0, 12)}...</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-[#E6EDF3]/40 block">Service</span>
              <span className="text-sm font-bold text-white">{booking.serviceName}</span>
            </div>
            <div>
              <span className="text-xs text-[#E6EDF3]/40 block">Price</span>
              <span className="text-sm font-bold text-success">${booking.servicePrice}</span>
            </div>
            <div>
              <span className="text-xs text-[#E6EDF3]/40 block">Date</span>
              <span className="text-sm font-semibold text-white">{bookingDateFormatted}</span>
            </div>
            <div>
              <span className="text-xs text-[#E6EDF3]/40 block">Time Slot</span>
              <span className="text-sm font-semibold text-primary">{booking.timeSlot}</span>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-3 mt-1">
            <span className="text-xs text-[#E6EDF3]/40 block">Customer Name</span>
            <span className="text-sm font-medium text-white">{booking.customerName}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/book"
            className="flex-1 bg-[#0D1117] text-[#E6EDF3] border border-gray-850 hover:border-gray-700 px-6 py-3 rounded-xl text-sm font-bold active:scale-95 transition-all flex items-center justify-center"
          >
            <i className="fas fa-calendar-plus mr-2 text-success"></i> Book Another
          </Link>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-success hover:bg-[#0f9f6e] text-white px-6 py-3 rounded-xl text-sm font-bold active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-success/15"
          >
            <i className="fab fa-whatsapp mr-2 text-lg"></i> Add to WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
