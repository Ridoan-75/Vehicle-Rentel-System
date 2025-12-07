import bcrypt from "bcryptjs";
import { pool } from "../../config/db"
import jwt from "jsonwebtoken";
import config from "../../config";

const signupUser = async (userData: {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
}) => {
  const { name, email, password, phone, role } = userData;

  // Check if user already exists
  const existingUser = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  if (existingUser.rows.length > 0) {
    throw new Error('Email already in use');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user
  const result = await pool.query(
    'INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role',
    [name, email.toLowerCase(), hashedPassword, phone, role]
  );

  return result.rows[0];
};

const loginUser = async (email: string, password: string) => {
  // Find user by email
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  if (result.rows.length === 0) {
    throw new Error('Invalid email or password');
  }

  const user = result.rows[0];

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT
  const secret = config.jwtSecret as string;
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    secret,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
};

export const authService = {
  signupUser,
  loginUser
};