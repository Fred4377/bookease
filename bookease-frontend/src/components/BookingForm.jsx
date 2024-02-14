import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarPicker from './CalendarPicker';
import TimeSlotPicker from './TimeSlotPicker';
import Loader from './Loader';
import api from '../utils/api';

const BookingForm = ({ initialService = null }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  
  // Selection States
  const [selectedService, setSelectedService] = useState(initialService);

  // Sync initialService prop if it changes
  useEffect(() => {
    if (initialService) {
      setSelectedService(initialService);
      setStep(2); // Auto-advance to date picker when service is selected
    }
  }, [initialService]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');
  
  // Customer Details States
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Submit States
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Fetch active services on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/services');
        setServices(data.filter(s => s.isActive));
      } catch (err) {
        console.error('Error fetching services:', err.message);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  // Fetch available slots when date or service changes
  useEffect(() => {
    if (selectedDate && selectedService) {
      const fetchSlots = async () => {
        setLoadingSlots(true);
        setSelectedSlot('');
        try {
          const year = selectedDate.getFullYear();
          const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
          const day = String(selectedDate.getDate()).padStart(2, '0');
          const formattedDate = `${year}-${month}-${day}`;
          
          const { data } = await api.get(`/bookings/available-slots?date=${formattedDate}&serviceId=${selectedService._id}`);
          setAvailableSlots(data);
        } catch (err) {
          console.error('Error fetching slots:', err.message);
        } finally {
          setLoadingSlots(false);
        }
      };
      fetchSlots();
    }
  }, [selectedDate, selectedService]);

  // Handle service card selection
  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  // Format date helper
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Submit final booking
  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone) {
      setSubmitError('Please fill out all required details.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      const bookingPayload = {
        customerName,
        customerEmail,
        customerPhone,
        serviceId: selectedService._id,
        bookingDate: formattedDate,
        timeSlot: selectedSlot,
        notes
      };

      const { data } = await api.post('/bookings', bookingPayload);
      
      // Redirect to confirmation page with ID
      navigate(`/confirmation/${data._id}`);
    } catch (err) {
      console.error('Booking submission error:', err);
      const msg = err.response && err.response.data.message 
        ? err.response.data.message 
        : 'Failed to create booking. Please try again.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && selectedService) {
      setStep(2);
    } else if (step === 2 && selectedDate && selectedSlot) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const progressPercent = ((step - 1) / 2) * 100;

  return (
    <div className="w-full max-w-5xl mx-auto bg-[#161B22] border border-gray-800/60 rounded-2xl shadow-2xl p-6 md:p-8">
      {/* Progress Bar Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-primary">Step {step} of 3</span>
          <span className="text-sm font-medium text-[#E6EDF3]">
            {step === 1 && 'Select a Service'}
            {step === 2 && 'Choose Date & Time'}
            {step === 3 && 'Enter Details & Confirm'}
          </span>
        </div>
        <div className="w-full h-2 bg-[#0D1117] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-success transition-all duration-500 ease-out"
            style={{ width: `${progressPercent === 0 ? '5%' : `${progressPercent}%`}` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-[#E6EDF3]/50">
          <span className={step >= 1 ? 'text-primary font-semibold' : ''}>1. Service</span>
          <span className={step >= 2 ? 'text-primary font-semibold' : ''}>2. Date & Time</span>
          <span className={step >= 3 ? 'text-primary font-semibold' : ''}>3. Confirmation</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Step Content */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div>
              <h3 className="text-xl font-bold text-[#E6EDF3] mb-4">Choose a Service</h3>
              {loadingServices ? (
                <Loader />
              ) : services.length === 0 ? (
                <div className="text-center py-12 text-[#E6EDF3]/60">
                  <i className="fas fa-box-open text-4xl mb-3 text-gray-700"></i>
                  <p>No services available at the moment.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                  {services.map((service) => {
                    const isSelected = selectedService?._id === service._id;
                    return (
                      <div
                        key={service._id}
                        onClick={() => handleServiceSelect(service)}
                        className={`p-4 rounded-xl cursor-pointer border transition-all duration-200 flex justify-between items-center ${
                          isSelected 
                            ? 'bg-primary/10 border-primary shadow-lg shadow-primary/5' 
                            : 'bg-[#0D1117] border-gray-800/60 hover:border-gray-700'
                        }`}
                      >
                        <div className="flex-1 pr-4">
                          <h4 className="font-semibold text-[#E6EDF3] text-base">{service.name}</h4>
                          {service.description && (
                            <p className="text-sm text-[#E6EDF3]/60 mt-1 line-clamp-2">{service.description}</p>
                          )}
                          <div className="flex items-center text-xs text-[#E6EDF3]/40 mt-2">
                            <i className="far fa-clock mr-1"></i>
                            <span>{service.duration} mins</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-primary">${service.price}</span>
                          <div className={`mt-2 flex items-center justify-center w-5 h-5 rounded-full border ${
                            isSelected ? 'bg-primary border-primary text-white' : 'border-gray-700'
                          }`}>
                            {isSelected && <i className="fas fa-check text-[10px]"></i>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-xl font-bold text-[#E6EDF3] mb-4">Choose Date & Time</h3>
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="w-full md:w-auto flex-shrink-0">
                  <CalendarPicker selectedDate={selectedDate} onChange={(date) => setSelectedDate(date)} />
                </div>
                <div className="w-full flex-grow">
                  <h4 className="text-sm font-semibold text-[#E6EDF3]/70 uppercase tracking-wider mb-2">
                    {selectedDate ? `Available Slots for ${formatDate(selectedDate)}` : 'Select a date to view slots'}
                  </h4>
                  {selectedDate ? (
                    <TimeSlotPicker
                      availableSlots={availableSlots}
                      selectedSlot={selectedSlot}
                      onSelectSlot={(slot) => setSelectedSlot(slot)}
                      loading={loadingSlots}
                    />
                  ) : (
                    <div className="bg-[#0D1117] border border-gray-800/40 rounded-xl p-8 text-center text-[#E6EDF3]/40 flex flex-col items-center justify-center">
                      <i className="far fa-calendar-alt text-3xl mb-2 text-gray-700"></i>
                      <p>Please click a date on the calendar to fetch available booking times.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-xl font-bold text-[#E6EDF3] mb-4">Your Contact Details</h3>
              {submitError && (
                <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-3 text-sm mb-4 flex items-center">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  {submitError}
                </div>
              )}
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-[#E6EDF3]/70 mb-1">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-[#0D1117] border border-gray-800 rounded-lg px-4 py-2.5 text-[#E6EDF3] placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="customerEmail" className="block text-sm font-medium text-[#E6EDF3]/70 mb-1">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      id="customerEmail"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full bg-[#0D1117] border border-gray-800 rounded-lg px-4 py-2.5 text-[#E6EDF3] placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="customerPhone" className="block text-sm font-medium text-[#E6EDF3]/70 mb-1">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      id="customerPhone"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="(555) 000-0000"
                      className="w-full bg-[#0D1117] border border-gray-800 rounded-lg px-4 py-2.5 text-[#E6EDF3] placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-[#E6EDF3]/70 mb-1">
                    Special Instructions / Notes <span className="text-[#E6EDF3]/40">(Optional)</span>
                  </label>
                  <textarea
                    id="notes"
                    rows="3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any specific requests for your appointment..."
                    className="w-full bg-[#0D1117] border border-gray-800 rounded-lg px-4 py-2.5 text-[#E6EDF3] placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  ></textarea>
                </div>
              </form>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-800/40">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1 || submitting}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium border border-gray-850 transition-all flex items-center ${
                step === 1 || submitting
                  ? 'text-[#E6EDF3]/20 border-gray-850 cursor-not-allowed opacity-50'
                  : 'text-[#E6EDF3]/80 hover:text-white bg-[#0D1117] border-gray-800 hover:border-gray-700 active:scale-95'
              }`}
            >
              <i className="fas fa-arrow-left mr-2"></i> Back
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={
                  (step === 1 && !selectedService) ||
                  (step === 2 && (!selectedDate || !selectedSlot))
                }
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 flex items-center shadow-lg ${
                  (step === 1 && !selectedService) ||
                  (step === 2 && (!selectedDate || !selectedSlot))
                    ? 'bg-primary/30 text-[#E6EDF3]/40 cursor-not-allowed shadow-none'
                    : 'bg-primary text-white hover:bg-blue-700 hover:shadow-primary/20 active:scale-95'
                }`}
              >
                Next <i className="fas fa-arrow-right ml-2"></i>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={submitting || !customerName || !customerEmail || !customerPhone}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all duration-200 flex items-center shadow-lg ${
                  submitting || !customerName || !customerEmail || !customerPhone
                    ? 'bg-success/30 text-[#E6EDF3]/40 cursor-not-allowed shadow-none'
                    : 'bg-success text-white hover:bg-[#0f9f6e] hover:shadow-success/20 active:scale-95'
                }`}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                    Booking...
                  </>
                ) : (
                  <>
                    Confirm Booking <i className="fas fa-check-double ml-2"></i>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Booking Summary Panel */}
        <div className="lg:col-span-1">
          <div className="bg-[#0D1117] border border-gray-800/60 rounded-xl p-5 sticky top-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#E6EDF3]/45 border-b border-gray-800/40 pb-3 mb-4">
              Booking Summary
            </h4>
            
            {selectedService ? (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-[#E6EDF3]/40 block mb-1">Selected Service</span>
                  <div className="font-semibold text-[#E6EDF3]">{selectedService.name}</div>
                  <div className="text-xs text-[#E6EDF3]/50 flex items-center mt-1">
                    <i className="far fa-clock mr-1"></i> {selectedService.duration} mins
                  </div>
                </div>

                {selectedDate && (
                  <div>
                    <span className="text-xs text-[#E6EDF3]/40 block mb-1">Appointment Date</span>
                    <div className="font-semibold text-[#E6EDF3] text-sm">
                      {formatDate(selectedDate)}
                    </div>
                  </div>
                )}

                {selectedSlot && (
                  <div>
                    <span className="text-xs text-[#E6EDF3]/40 block mb-1">Time Slot</span>
                    <div className="font-semibold text-success flex items-center text-sm">
                      <i className="far fa-calendar-check mr-1.5 text-xs"></i>
                      {selectedSlot}
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-850 pt-4 mt-2 flex justify-between items-end">
                  <span className="text-sm font-medium text-[#E6EDF3]/80">Total Price</span>
                  <span className="text-2xl font-bold text-primary">${selectedService.price}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-[#E6EDF3]/30">
                <i className="fas fa-shopping-cart text-3xl mb-2"></i>
                <p className="text-xs">Summary will appear once you select a service.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
