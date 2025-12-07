import express, { Request, Response } from "express";
import dotenv from "dotenv";
import initDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.route";
import { userRoutes } from "./modules/user/user.routes";
import { vehicleRoute } from "./modules/vehicles/vehicle.routes";
import { bookingRoutes } from "./modules/bookings/booking.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; 


app.use(express.json());


app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});


app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Vehicle Rental System Server is running!"
  });
});


app.use("/api/v1/auth", authRoutes);      
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vehicles", vehicleRoute);
app.use("/api/v1/bookings", bookingRoutes);


app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});


const startServer = async () => {
  try {

    console.log('Initializing database...');
    await initDB();
    console.log('Database initialized');


    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
      console.log(` API: http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();