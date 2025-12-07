import { pool } from "../../config/db";

const createVehicle = async (
  vehicle_name: string,
  type: string,
  registration_number: string,
  daily_rent_price: number,
  availability_status: string
) => {
  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type,registration_number,daily_rent_price,availability_status) VALUES($1, $2,$3,$4,$5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  return result;
};

const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result;
};

const singleVehicle = async (id: number) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
  return result;
};

const updateVehicle = async (
  id: number,
  vehicle_name?: string,
  type?: string,
  registration_number?: string,
  daily_rent_price?: number,
  availability_status?: string
) => {
  const result = await pool.query(
    `
    UPDATE vehicles
    SET
      vehicle_name = COALESCE($1, vehicle_name),
      type = COALESCE($2, type),
      registration_number = COALESCE($3, registration_number),
      daily_rent_price = COALESCE($4, daily_rent_price),
      availability_status = COALESCE($5, availability_status)
    WHERE id = $6
    RETURNING *;
  `,
    [
      vehicle_name ?? null,
      type ?? null,
      registration_number ?? null,
      daily_rent_price ?? null,
      availability_status ?? null,
      id,
    ]
  );
  return result;
};

const deleteVehicle = async (id: number) => {
  const result = await pool.query(
    `
        DELETE FROM vehicles WHERE id = $1 RETURNING * 
        `,
    [id]
  );

  return result;
};
export const vehicleServices = {
  createVehicle,
  getAllVehicles,
  singleVehicle,
  updateVehicle,
  deleteVehicle,
};
