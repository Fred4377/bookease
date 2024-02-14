import React, { useState, useEffect, useRef } from 'react';
import BookingForm from '../components/BookingForm';
import api from '../utils/api';

const LandingPage = () => {
  const [availableServices, setAvailableServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chosenService, setChosenService] = useState(null);
  const pageRef = useRef(null);

  useEffect(() => {
    // mixing .then here just for a change of pace
    api.get('/services')
      .then(response => {
        const { data: allServices } = response;
        // only show services that the owner has marked as active
        setAvailableServices(allServices.filter(s => s.isActive));
        setIsLoading(false);
      })
      .catch(err => {
        console.error('failed to load services:', err.message);
        setIsLoading(false);
      });
  }, []);

  // Set up vanilla intersection observer for scroll animations
  useEffect(() => {
    // TODO: might refactor this out if I add more pages
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            scrollObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 } 
    );

    const sectionsToAnimate = document.querySelectorAll('.animate-on-scroll');
    sectionsToAnimate.forEach((sec) => scrollObserver.observe(sec));

    return () => {
      sectionsToAnimate.forEach((sec) => scrollObserver.unobserve(sec));
    };
  }, []);

  const handleBookService = (serviceItem) => {
    setChosenService(serviceItem);
    const bookingSection = document.getElementById('book');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToBooking = () => {
    const bookingSection = document.getElementById('book');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#0f172a] min-h-screen text-[#f8fafc] font-sans" ref={pageRef}>
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-b from-[#0f172a] via-[#0f172a] to-[#1e293b] py-20 lg:py-32 animate-on-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center space-x-2 bg-purple-900/30 text-purple-400 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-purple-500/30">
              <i className="fas fa-magic"></i>
              <span>Effortless Scheduling</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Book Your Appointment <br />
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                in seconds
              </span> — no calls, no waiting
            </h1>
            <p className="text-lg sm:text-xl text-[#94a3b8] max-w-2xl mx-auto lg:mx-0">
              Simple online booking for salons, clinics, gyms, coaches, photographers, and more. Set your schedule, share your link, and get booked.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={handleScrollToBooking}
                className="bg-purple-600 text-white hover:bg-purple-700 px-8 py-3.5 rounded-xl font-bold tracking-wide text-base shadow-lg shadow-purple-600/25 active:scale-95 transition-all flex items-center justify-center"
              >
                Book Now <i className="fas fa-calendar-alt ml-2"></i>
              </button>
              <a
                href="#services"
                className="bg-transparent text-[#f8fafc] hover:text-white border border-gray-700 hover:border-gray-500 px-8 py-3.5 rounded-xl font-semibold text-base transition-all flex items-center justify-center active:scale-95"
              >
                View Services
              </a>
            </div>
          </div>

          {/* Hero Right: Animated floating calendar */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="absolute w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>
            <div className="absolute w-72 h-72 bg-pink-500/10 rounded-full blur-3xl translate-x-12 translate-y-12"></div>
            
            <div className="relative animate-bounce-slow bg-[#1e293b] border border-gray-700 rounded-3xl p-6 shadow-2xl w-80">
              <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-4">
                <span className="text-sm font-bold text-white uppercase tracking-wider">Appointment Details</span>
                <i className="fas fa-ellipsis-h text-gray-500"></i>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 bg-[#0f172a] p-3 rounded-xl border border-gray-800">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <i className="fas fa-cut"></i>
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-400">Service</h4>
                    <p className="text-sm font-semibold text-[#f8fafc]">Premium Haircut</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-[#0f172a] p-3 rounded-xl border border-gray-800">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500">
                    <i className="far fa-calendar-check"></i>
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-400">Date & Time</h4>
                    <p className="text-sm font-semibold text-[#f8fafc]">Tomorrow at 10:30 AM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-[#0f172a] p-3 rounded-xl border border-gray-800">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-400">Status</h4>
                    <p className="text-sm font-semibold text-green-500">Confirmed Instantly</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#1e293b] border-y border-gray-800 animate-on-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">How It Works</h2>
            <p className="text-[#94a3b8] max-w-xl mx-auto">Book your appointment in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4 group">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-[#0f172a] border border-gray-700 group-hover:border-purple-500 transition-all flex items-center justify-center text-2xl text-purple-500 shadow-lg">
                  <i className="fas fa-concierge-bell"></i>
                </div>
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow">
                  1
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#f8fafc]">Choose a Service</h3>
              <p className="text-sm text-[#94a3b8] px-4">
                Select from our catalog of premium services custom tailored to your exact needs.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4 group">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-[#0f172a] border border-gray-700 group-hover:border-purple-500 transition-all flex items-center justify-center text-2xl text-purple-500 shadow-lg">
                  <i className="far fa-clock"></i>
                </div>
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow">
                  2
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#f8fafc]">Pick Date & Time</h3>
              <p className="text-sm text-[#94a3b8] px-4">
                Select your preferred day on our active calendar and choose an available time slot.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4 group">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-[#0f172a] border border-gray-700 group-hover:border-purple-500 transition-all flex items-center justify-center text-2xl text-purple-500 shadow-lg">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow">
                  3
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#f8fafc]">Confirm Your Booking</h3>
              <p className="text-sm text-[#94a3b8] px-4">
                Enter your details, review the summary, and secure your appointment instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 animate-on-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Our Services</h2>
            <p className="text-[#94a3b8] max-w-xl mx-auto">Explore services offered and book yours directly</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
            </div>
          ) : availableServices.length === 0 ? (
            <p className="text-center text-gray-500">No services found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableServices.map((svc) => (
                <div
                  key={svc._id}
                  className="bg-[#1e293b] border border-gray-800 hover:border-purple-500/40 rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-white pr-2">{svc.name}</h3>
                      <span className="text-purple-400 font-extrabold text-xl">${svc.price}</span>
                    </div>
                    <p className="text-sm text-[#94a3b8] mb-6 line-clamp-3">
                      {svc.description || "No description provided."}
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                    <span className="text-xs text-[#94a3b8] flex items-center">
                      <i className="far fa-hourglass mr-1.5 text-pink-500"></i> {svc.duration} Mins
                    </span>
                    <button
                      onClick={() => handleBookService(svc)}
                      className="bg-purple-900/30 text-purple-400 border border-purple-500/30 hover:bg-purple-600 hover:text-white hover:border-purple-600 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center"
                    >
                      Book This <i className="fas fa-arrow-right ml-1.5"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Book With Us Section */}
      <section className="py-20 bg-[#1e293b] border-t border-gray-800 animate-on-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Why Book With Us?</h2>
            <p className="text-[#94a3b8] max-w-xl mx-auto">We provide the smoothest client scheduling experience</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center text-xl mx-auto">
                <i className="fas fa-bolt"></i>
              </div>
              <h3 className="font-bold text-white">Instant Confirmation</h3>
              <p className="text-xs text-[#94a3b8]">Your appointment is secured immediately, no phone call follow-up required.</p>
            </div>
            
            <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 bg-pink-500/10 text-pink-500 rounded-xl flex items-center justify-center text-xl mx-auto">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3 className="font-bold text-white">Mobile Friendly</h3>
              <p className="text-xs text-[#94a3b8]">Book easily on your smartphone, tablet, or laptop. responsive layout adapts to your device.</p>
            </div>

            <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 bg-yellow-500/10 text-yellow-500 rounded-xl flex items-center justify-center text-xl mx-auto">
                <i className="far fa-bell"></i>
              </div>
              <h3 className="font-bold text-white">Reminder Notifications</h3>
              <p className="text-xs text-[#94a3b8]">Automatic scheduling logs help you track appointments and prevent missed slots.</p>
            </div>

            <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center text-xl mx-auto">
                <i className="fas fa-lock"></i>
              </div>
              <h3 className="font-bold text-white">Secure & Private</h3>
              <p className="text-xs text-[#94a3b8]">Your contact data is encrypted and kept private, protecting your scheduling records.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="book" className="py-20 border-t border-gray-800 animate-on-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Book Your Appointment</h2>
            <p className="text-[#94a3b8] max-w-xl mx-auto">Complete the scheduler form below to request a slot</p>
          </div>
          <BookingForm initialService={chosenService} />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
