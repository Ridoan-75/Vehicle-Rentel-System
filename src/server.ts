import express, { Request, Response } from "express"
import dotenv, { config } from "dotenv"
import initDB from "./config/db";
import { userRoutes } from "./modules/user/user.routes";
import { vehicleRoute } from "./modules/vehicles/vehicle.routes";
import { bookingRoutes } from "./modules/bookings/booking.routes";



dotenv.config()
const app = express()
const port = process.env.port;


app.use(express.json())

app.use("/api/v1",userRoutes)
app.use("/api/v1",vehicleRoute)
app.use("/api/v1",bookingRoutes)
app.get("/",(req,res)=>{
  res.send("Server is running")
})

initDB()

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})