import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

// Get all users
const GetAllUsers = async () => {
  const result = await pool.query('SELECT id, name, email, phone, role FROM users ORDER BY id');
  return result.rows;
}

// Get a single user by ID
const GetUserById = async (userId: number) => {
  const result = await pool.query('SELECT id, name, email, phone, role FROM users WHERE id = $1', [userId]);
  if (result.rows.length === 0) {
    throw new Error('User not found');
  }
  return result.rows[0];
}

// Update a user by ID
const UpdateUserById = async (userId: number, updateData: any) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  for (const [key, value] of Object.entries(updateData)) {
    if (value !== undefined && value !== null && key !== 'password' && key !== 'id') {
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  }

  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  values.push(userId);

  const query = `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING id, name, email, phone, role`;
  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  return result.rows[0];
}

// Delete a user by ID
const DeleteUserById = async (userId: number) => {
  // Check if user has active bookings
  const bookingCheck = await pool.query(
    'SELECT * FROM bookings WHERE customer_id = $1 AND status = $2',
    [userId, 'active']
  );

  if (bookingCheck.rows.length > 0) {
    throw new Error('Cannot delete user with active bookings');
  }

  const result = await pool.query(
    'DELETE FROM users WHERE id = $1 RETURNING id',
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  return result.rows[0];
}

export const userService = {
  GetAllUsers,
  GetUserById,
  UpdateUserById,
  DeleteUserById
};