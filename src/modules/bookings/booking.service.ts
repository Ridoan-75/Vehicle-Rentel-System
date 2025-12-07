import { pool } from "../../config/db";

export const bookingService = {
  async createBooking(bookingData: {
    customer_id: number;
    vehicle_id: number;
    rent_start_date: string;
    rent_end_date: string;
  }) {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
      bookingData;

    const customerResult = await pool.query(
      "SELECT id FROM users WHERE id = $1",
      [customer_id]
    );

    if (customerResult.rows.length === 0) {
      throw new Error("Customer not found");
    }

    const startDate = new Date(rent_start_date);
    const endDate = new Date(rent_end_date);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (endDate <= startDate) {
      throw new Error("End date must be after start date");
    }

    const vehicleResult = await pool.query(
      "SELECT * FROM vehicles WHERE id = $1",
      [vehicle_id]
    );

    if (vehicleResult.rows.length === 0) {
      throw new Error("Vehicle not found");
    }

    const vehicle = vehicleResult.rows[0];

    if (vehicle.availability_status !== "available") {
      throw new Error("Vehicle is not available for booking");
    }

    const numberOfDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = numberOfDays * parseInt(vehicle.daily_rent_price);

    const bookingResult = await pool.query(
      "INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        totalPrice,
        "active",
      ]
    );

    await pool.query(
      "UPDATE vehicles SET availability_status = $1 WHERE id = $2",
      ["booked", vehicle_id]
    );

    const booking = bookingResult.rows[0];

    return {
      ...booking,
      vehicle: {
        vehicle_name: vehicle.vehicle_name,
        daily_rent_price: vehicle.daily_rent_price,
      },
    };
  },

  async getBookings(
    userId: number,
    userRole: string,
    isAdmin: boolean = false
  ) {
    let query;
    let params: any[] = [];

    if (isAdmin) {
      query = `
        SELECT
          b.*,
          c.name as customer_name,
          c.email as customer_email,
          v.vehicle_name,
          v.registration_number
        FROM bookings b
        JOIN users c ON b.customer_id = c.id
        JOIN vehicles v ON b.vehicle_id = v.id
        ORDER BY b.id DESC
      `;
    } else {
      query = `
        SELECT
          b.id,
          b.vehicle_id,
          b.rent_start_date,
          b.rent_end_date,
          b.total_price,
          b.status,
          v.vehicle_name,
          v.registration_number,
          v.type
        FROM bookings b
        JOIN vehicles v ON b.vehicle_id = v.id
        WHERE b.customer_id = $1
        ORDER BY b.id DESC
      `;
      params.push(userId);
    }

    const result = await pool.query(query, params);
    return result.rows;
  },

  async getBookingById(id: number) {
    const result = await pool.query("SELECT * FROM bookings WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      throw new Error("Booking not found");
    }
    return result.rows[0];
  },

  async updateBookingStatus(
    id: number,
    status: string,
    userId: number,
    userRole: string
  ) {
    const booking = await this.getBookingById(id);

    if (userRole === "customer") {
      if (status !== "cancelled") {
        throw new Error("Customers can only cancel bookings");
      }

      if (booking.customer_id !== userId) {
        throw new Error("Cannot cancel another customer's booking");
      }

      const startDate = new Date(booking.rent_start_date);
      startDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (today >= startDate) {
        throw new Error("Cannot cancel booking on or after start date");
      }
    }

    if (status === "returned" && userRole !== "admin") {
      throw new Error("Only admin can mark booking as returned");
    }

    const result = await pool.query(
      "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (status === "cancelled" || status === "returned") {
      await pool.query(
        "UPDATE vehicles SET availability_status = $1 WHERE id = $2",
        ["available", booking.vehicle_id]
      );

      if (status === "returned") {
        const vehicleResult = await pool.query(
          "SELECT availability_status FROM vehicles WHERE id = $1",
          [booking.vehicle_id]
        );
        return {
          ...result.rows[0],
          vehicle: {
            availability_status: vehicleResult.rows[0].availability_status,
          },
        };
      }
    }

    return result.rows[0];
  },
};
