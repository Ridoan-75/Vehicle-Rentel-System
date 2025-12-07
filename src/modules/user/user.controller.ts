import { Request, Response } from "express";
import { userService } from "./user.service";

// Get all users (Admin only)
const GetAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.GetAllUsers();
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users from the database',
      errors: error.message
    });
  }
}

// Update a user by ID (Admin or own profile)
const UpdateUserById = async (req: Request, res: Response) => {
  const { userId } = req.params as { userId: string };
  const { user: { id: currentUserId, role } } = req as any;

  try {
    // Check authorization - admin or own profile
    if (role !== 'admin' && currentUserId !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden',
        errors: 'Cannot update another user\'s profile'
      });
    }

    const result = await userService.UpdateUserById(parseInt(userId), req.body);
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error updating user in the database',
      errors: error.message
    });
  }
}

// Delete a user by ID (Admin only)
const DeleteUserById = async (req: Request, res: Response) => {
  const { userId } = req.params as { userId: string };
  try {
    await userService.DeleteUserById(parseInt(userId));
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error deleting user from the database',
      errors: error.message
    });
  }
}

export const userController = {
  GetAllUsers,
  UpdateUserById,
  DeleteUserById
};