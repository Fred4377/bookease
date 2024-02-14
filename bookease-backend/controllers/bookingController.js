const Booking = require('../models/Booking');
const Service = require('../models/Service');

const ALL_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "02:00 PM",
  "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM",
  "04:30 PM", "05:00 PM"
];

// Helper to get start and end of day based on date string "YYYY-MM-DD"
// TODO: refactor this weird date parsing logic later, it's brittle
const getStartAndEndOfDay = (dateStr) => {
  let year, month, day;
  if (dateStr.includes('T')) {
    const d = new Date(dateStr);
    year = d.getFullYear();
    month = d.getMonth();
    day = d.getDate();
  } else {
    const parts = dateStr.split('-');
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    day = parseInt(parts[2], 10);
  }
  const start = new Date(year, month, day, 0, 0, 0, 0);
  const end = new Date(year, month, day, 23, 59, 59, 999);
  return { start, end };
};

const getAvailableSlots = (req, res) => {
  const { date: targetDate, serviceId } = req.query;

  if (!targetDate) {
    return res.status(400).json({ message: 'Date is required man' });
  }

  // testing out mixing .then here instead of full async/await
  try {
    const { start, end } = getStartAndEndOfDay(targetDate);

    // Fetch non-cancelled bookings for this day
    Booking.find({
      bookingDate: { $gte: start, $lte: end },
      status: { $ne: 'cancelled' }
    }).then(bookedAppointments => {
      const takenTimeSlots = bookedAppointments.map(app => app.timeSlot);
      const freeSlots = ALL_SLOTS.filter(slot => !takenTimeSlots.includes(slot));
      
      res.json(freeSlots);
    }).catch(err => {
      console.error('failed to fetch taken slots:', err);
      res.status(500).json({ message: 'Server issue while checking slots' });
    });
    
  } catch (error) {
    console.error('Available slots error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const createBooking = async (req, res) => {
  const { customerName: clientName, customerEmail: clientEmail, customerPhone: clientPhone, serviceId: chosenService, bookingDate: chosenDate, timeSlot: chosenSlot, notes } = req.body;

  if (!clientName || !clientEmail || !clientPhone || !chosenService || !chosenDate || !chosenSlot) {
    return res.status(400).json({ message: 'Missing some form fields' });
  }

  try {
    const serviceDoc = await Service.findById(chosenService);
    if (!serviceDoc) {
      return res.status(404).json({ message: 'Service not found in DB' });
    }

    const { start, end } = getStartAndEndOfDay(chosenDate);

    // double check if someone snagged the slot while they were filling the form
    const clashingBooking = await Booking.findOne({
      bookingDate: { $gte: start, $lte: end },
      timeSlot: chosenSlot,
      status: { $ne: 'cancelled' }
    });

    if (clashingBooking) {
      return res.status(400).json({ message: 'Ah, this slot just got booked. Please pick another time.' });
    }

    // go ahead and make the reservation
    const newReservation = await Booking.create({
      customerName: clientName,
      customerEmail: clientEmail,
      customerPhone: clientPhone,
      service: chosenService,
      serviceName: serviceDoc.name,
      servicePrice: serviceDoc.price,
      bookingDate: new Date(chosenDate),
      timeSlot: chosenSlot,
      notes,
      status: 'pending' // need to hook up payment conf later
    });

    res.status(201).json(newReservation);
  } catch (error) {
    console.error('crash in create booking flow:', error.message);
    res.status(500).json({ message: 'Server crashed' });
  }
};

const getBookings = async (req, res) => {
  const { status, date: filterDate } = req.query;
  let filters = {};

  if (status) {
    filters.status = status;
  }

  if (filterDate) {
    try {
      const { start, end } = getStartAndEndOfDay(filterDate);
      filters.bookingDate = { $gte: start, $lte: end };
    } catch (e) {
      return res.status(400).json({ message: 'Date filter is malformed' });
    }
  }

  try {
    const allMatchingBookings = await Booking.find(filters).sort({ bookingDate: 1, timeSlot: 1 });
    res.json(allMatchingBookings);
  } catch (error) {
    console.error('Get bookings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBookingById = (req, res) => {
  // simple lookup, using older syntax just for fun
  Booking.findById(req.params.id)
    .then(foundBooking => {
      if (foundBooking) {
        res.json(foundBooking);
      } else {
        res.status(404).json({ message: 'Could not find that booking' });
      }
    })
    .catch(err => {
      console.error('Get booking by ID error:', err.message);
      res.status(500).json({ message: 'DB error' });
    });
};

const updateBookingStatus = async (req, res) => {
  const { status: newStatus } = req.body;

  // valid states
  const allowedStates = ['pending', 'confirmed', 'cancelled', 'completed'];
  if (!allowedStates.includes(newStatus)) {
    return res.status(400).json({ message: 'Invalid status update attempt' });
  }

  try {
    const existingAppt = await Booking.findById(req.params.id);

    if (existingAppt) {
      existingAppt.status = newStatus;
      const savedAppt = await existingAppt.save();
      res.json(savedAppt);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    console.error('failed to update status:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const bookingToDelete = await Booking.findById(req.params.id);

    if (bookingToDelete) {
      await Booking.deleteOne({ _id: req.params.id });
      res.json({ message: 'Booking removed' });
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    console.error('Delete booking error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAvailableSlots,
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking
};
