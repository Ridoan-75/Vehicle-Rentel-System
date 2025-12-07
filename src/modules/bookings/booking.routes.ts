import { Router } from 'express';
import { bookingController } from './booking.controller';
import auth from '../../middleware/auth';
import verifyAccess from '../../middleware/verifyAccess';

const router = Router();


router.post('/', auth(), verifyAccess(['admin', 'customer']), bookingController.createBooking);
router.get('/', auth(), verifyAccess(['admin', 'customer']), bookingController.getBookings);
router.put('/:bookingId', auth(), verifyAccess(['admin', 'customer']), bookingController.updateBooking);

export const bookingRoutes = router;