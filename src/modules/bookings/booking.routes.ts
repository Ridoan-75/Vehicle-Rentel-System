import { Router } from 'express';
import { bookingController } from './booking.controller';
import auth from '../../middleware/auth';

const router = Router();

// Protected routes - requires authentication
router.post('/', auth(), bookingController.createBooking);
router.get('/', auth(), bookingController.getBookings);
router.put('/:bookingId', auth(), bookingController.updateBooking);

export const bookingRoutes = router;