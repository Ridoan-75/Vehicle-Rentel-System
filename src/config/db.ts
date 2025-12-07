import { Pool } from "pg";
import config from ".";

// DB
export const pool = new Pool({
  connectionString: `${config.connection_str}`,
});

const initDB = async () => {
  // USER TABLE
  await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(250) NOT NULL,
            email VARCHAR(100) NOT NULL,
            password VARCHAR(250) NOT NULL,
            phone VHARCHAR(20) NOT NULL,
            role VHARCHAR(20) NOT NULL CHECK (role IN ('admin', 'customer'))
            )
        `);

  // VEHICLE TABLE
  await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(250) NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN('car', 'bike', 'van', 'SUV')),
        registration_number VARCHAR(20) NOT NULL UNIQUE,
        daily_rent_price INT NOT NULL CHECK (daily_rent_price > 0),
        availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('available', 'booked'))
        )
        `);

  // BOOKING TABLE
  await pool.query(
    `
        CREATE TABLE IF NOT EXISTS booking(
        id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL REFERENCES users(id),
        vehicle_id INTEGER NOT NULL REFERENCES vehicles (id),
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL CHECK (daily_rent_price > 0),
        total_price INT NOT NULL CHECK (total_price > 0),
        status VHARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'returned'))
        )
        `
  );
};

export default initDB;
