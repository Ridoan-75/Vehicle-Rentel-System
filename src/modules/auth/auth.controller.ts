import { Request, Response } from "express";
import { authService } from "./auth.service";

const signupUser = async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;

  try {
    const user = await authService.signupUser({ name, email, password, phone, role });
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error registering user',
      errors: error.message
    });
  }
};

const signinUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authService.loginUser(email, password);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token: result.token,
        user: result.user
      }
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Invalid email or password',
      errors: error.message
    });
  }
};

export const authController = {
  signupUser,
  signinUser
};