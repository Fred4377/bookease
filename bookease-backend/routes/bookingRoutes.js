const express = require('express');
const router = express.Router();
const {
  getAvailableSlots,
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/available-slots', getAvailableSlots);

router.route('/')
  .post(createBooking)
  .get(protect, admin, getBookings);

router.route('/:id')
  .get(getBookingById)
  .delete(protect, admin, deleteBooking);

router.patch('/:id/status', protect, admin, updateBookingStatus);

module.exports = router;
