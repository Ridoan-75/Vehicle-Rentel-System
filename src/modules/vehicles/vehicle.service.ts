import { pool } from "../../config/db";

const createVehicle = async (
  vehicle_name: string,
  type: string,
  registration_number: string,
  daily_rent_price: number,
  availability_status: string
) => {
  if (
    !vehicle_name ||
    !type ||
    !registration_number ||
    !daily_rent_price ||
    !availability_status
  ) {
    throw new Error("All fields are required");
  }

  const validTypes = ["car", "bike", "van", "SUV"];
  if (!validTypes.includes(type)) {
    throw new Error("Invalid vehicle type. Must be car, bike, van, or SUV");
  }

  const validStatuses = ["available", "booked"];
  if (!validStatuses.includes(availability_status)) {
    throw new Error("Invalid availability status. Must be available or booked");
  }

  if (daily_rent_price <= 0) {
    throw new Error("Daily rent price must be greater than 0");
  }

  const existing = await pool.query(
    "SELECT id FROM vehicles WHERE registration_number = $1",
    [registration_number]
  );

  if (existing.rows.length > 0) {
    throw new Error("Registration number already exists");
  }

  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) 
     VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result.rows[0];
};

const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles ORDER BY id`);
  return result.rows;
};

const singleVehicle = async (id: number) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);

  if (result.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  return result.rows[0];
};

const updateVehicle = async (
  id: number,
  updateData: {
    vehicle_name?: string;
    type?: string;
    registration_number?: string;
    daily_rent_price?: number;
    availability_status?: string;
  }
) => {
  const vehicleCheck = await pool.query(
    "SELECT * FROM vehicles WHERE id = $1",
    [id]
  );

  if (vehicleCheck.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  if (updateData.type) {
    const validTypes = ["car", "bike", "van", "SUV"];
    if (!validTypes.includes(updateData.type)) {
      throw new Error("Invalid vehicle type. Must be car, bike, van, or SUV");
    }
  }

  if (updateData.availability_status) {
    const validStatuses = ["available", "booked"];
    if (!validStatuses.includes(updateData.availability_status)) {
      throw new Error(
        "Invalid availability status. Must be available or booked"
      );
    }
  }

  if (
    updateData.daily_rent_price !== undefined &&
    updateData.daily_rent_price <= 0
  ) {
    throw new Error("Daily rent price must be greater than 0");
  }

  if (updateData.registration_number) {
    const existing = await pool.query(
      "SELECT id FROM vehicles WHERE registration_number = $1 AND id != $2",
      [updateData.registration_number, id]
    );

    if (existing.rows.length > 0) {
      throw new Error("Registration number already exists");
    }
  }

  const result = await pool.query(
    `UPDATE vehicles
     SET
       vehicle_name = COALESCE($1, vehicle_name),
       type = COALESCE($2, type),
       registration_number = COALESCE($3, registration_number),
       daily_rent_price = COALESCE($4, daily_rent_price),
       availability_status = COALESCE($5, availability_status)
     WHERE id = $6
     RETURNING *`,
    [
      updateData.vehicle_name ?? null,
      updateData.type ?? null,
      updateData.registration_number ?? null,
      updateData.daily_rent_price ?? null,
      updateData.availability_status ?? null,
      id,
    ]
  );

  return result.rows[0];
};

const deleteVehicle = async (id: number) => {
  const vehicleCheck = await pool.query(
    "SELECT * FROM vehicles WHERE id = $1",
    [id]
  );

  if (vehicleCheck.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  const bookingCheck = await pool.query(
    "SELECT * FROM bookings WHERE vehicle_id = $1 AND status = $2",
    [id, "active"]
  );

  if (bookingCheck.rows.length > 0) {
    throw new Error("Cannot delete vehicle with active bookings");
  }

  const result = await pool.query(
    "DELETE FROM vehicles WHERE id = $1 RETURNING *",
    [id]
  );

  return result.rows[0];
};

export const vehicleServices = {
  createVehicle,
  getAllVehicles,
  singleVehicle,
  updateVehicle,
  deleteVehicle,
};
