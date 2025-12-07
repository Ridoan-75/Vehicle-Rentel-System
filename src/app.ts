import express, { Request, Response } from 'express'

import initDb from './config/db';
import logger from './middleware/verifyAccess';
import { userRoutes } from './modules/user/user.routes';
import { authRoutes } from './modules/auth/auth.route';
import { vehicleRoute } from './modules/vehicles/vehicle.routes';
import { bookingRoutes } from './modules/bookings/booking.routes';

const app = express()

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize the database and create tables if they don't exist (non-blocking)
initDb().catch(err => console.error('Database initialization error:', err));

// Health Check Endpoint (fast response)
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Root Endpoint
app.get('/', logger, (req: Request, res: Response) => {
  res.send('Wow😲Vehicle Rental System Server is running!')
})
app.get('/api/v1', logger, (req: Request, res: Response) => {
  res.send('Wow😲Vehicle Rental System Server is running!')
})

// Authentication Routes
app.use('/api/v1/auth', authRoutes);

// User Routes
app.use('/api/v1/users', userRoutes);

// Vehicle Routes
app.use('/api/v1/vehicles', vehicleRoute);

// Booking Routes
app.use('/api/v1/bookings', bookingRoutes);

// Handle Invalid Routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

export default app;