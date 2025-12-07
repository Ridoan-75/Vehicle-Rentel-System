import { Request, Response } from 'express';
import { bookingService } from './booking.service';

export const bookingController = {

  async createBooking(req: Request, res: Response) {
    try {
      const { vehicle_id, rent_start_date, rent_end_date } = req.body;
      const { user: { id: userId, role } } = req as any;


      let customer_id = req.body.customer_id;
      if (role === 'customer') {
        customer_id = userId; 
      } else if (role === 'admin' && !customer_id) {
        return res.status(400).json({
          success: false,
          message: 'Admin must specify customer_id'
        });
      }

      if (!vehicle_id || !rent_start_date || !rent_end_date) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
          errors: 'vehicle_id, rent_start_date, and rent_end_date are required'
        });
      }

      const booking = await bookingService.createBooking({
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date
      });

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: booking
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: 'Error creating booking',
        errors: error.message
      });
    }
  },


  async getBookings(req: Request, res: Response) {
    try {
      const { user: { id: userId, role } } = req as any;
      const isAdmin = role === 'admin';

      const bookings = await bookingService.getBookings(userId, role, isAdmin);

      const message = isAdmin ? 'Bookings retrieved successfully' : 'Your bookings retrieved successfully';

      res.status(200).json({
        success: true,
        message,
        data: bookings
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving bookings',
        errors: error.message
      });
    }
  },


  async updateBooking(req: Request, res: Response) {
    try {
      const { bookingId } = req.params as { bookingId: string };
      const { status } = req.body;
      const { user: { id: userId, role } } = req as any;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required',
          errors: 'Status field is required'
        });
      }

 
      const validStatuses = ['active', 'cancelled', 'returned'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status',
          errors: 'Status must be active, cancelled, or returned'
        });
      }

      const booking = await bookingService.updateBookingStatus(
        parseInt(bookingId),
        status,
        userId,
        role
      );

      let message = 'Booking updated successfully';
      if (status === 'cancelled') {
        message = 'Booking cancelled successfully';
      } else if (status === 'returned') {
        message = 'Booking marked as returned. Vehicle is now available';
      }

      res.status(200).json({
        success: true,
        message,
        data: booking
      });
    } catch (error: any) {
      const statusCode = error.message.includes('not found') ? 404 : 
                         error.message.includes('Cannot') ? 403 : 400;
      
      res.status(statusCode).json({
        success: false,
        message: 'Error updating booking',
        errors: error.message
      });
    }
  }
};