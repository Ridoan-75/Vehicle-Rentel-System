import { pool } from "../../config/db";
import bcrypt from "bcryptjs";


const GetAllUsers = async () => {
  const result = await pool.query('SELECT id, name, email, phone, role FROM users ORDER BY id');
  return result.rows;
}

const GetUserById = async (userId: number) => {
  const result = await pool.query('SELECT id, name, email, phone, role FROM users WHERE id = $1', [userId]);
  if (result.rows.length === 0) {
    throw new Error('User not found');
  }
  return result.rows[0];
}


const UpdateUserById = async (userId: number, updateData: any) => {

  if (updateData.role && !['admin', 'customer'].includes(updateData.role)) {
    throw new Error('Invalid role. Must be admin or customer');
  }


  if (updateData.email) {
    const emailCheck = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [updateData.email.toLowerCase(), userId]
    );

    if (emailCheck.rows.length > 0) {
      throw new Error('Email already in use');
    }
  }

  const fields = [];
  const values = [];
  let paramCount = 1;

  for (const [key, value] of Object.entries(updateData)) {
    if (value !== undefined && value !== null && key !== 'id') {
      

      if (key === 'password') {
        if ((value as string).length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }
        const hashedPassword = await bcrypt.hash(value as string, 10);
        fields.push(`password = $${paramCount}`);
        values.push(hashedPassword);
        paramCount++;
      } 

      else if (key === 'email') {
        fields.push(`${key} = $${paramCount}`);
        values.push((value as string).toLowerCase());
        paramCount++;
      }
      else {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }
  }

  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  values.push(userId);


  const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING id, name, email, phone, role`;
  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  return result.rows[0];
}


const DeleteUserById = async (userId: number) => {

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