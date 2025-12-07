import { Request, Response } from "express";
import { userService } from "./user.service";

const GetAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.GetAllUsers();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      errors: error.message,
    });
  }
};

const UpdateUserById = async (req: Request, res: Response) => {
  const { userId } = req.params as { userId: string };
  const {
    user: { id: currentUserId, role },
  } = req as any;

  try {
    if (role !== "admin" && currentUserId !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
        errors: "Cannot update another user's profile",
      });
    }

    if (role === "customer" && req.body.role) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
        errors: "Cannot change your own role",
      });
    }

    const result = await userService.UpdateUserById(parseInt(userId), req.body);
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (error: any) {
    const statusCode = error.message.includes("not found")
      ? 404
      : error.message.includes("already in use")
      ? 409
      : 400;

    res.status(statusCode).json({
      success: false,
      message: "Error updating user",
      errors: error.message,
    });
  }
};

const DeleteUserById = async (req: Request, res: Response) => {
  const { userId } = req.params as { userId: string };
  try {
    await userService.DeleteUserById(parseInt(userId));
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    const statusCode = error.message.includes("not found") ? 404 : 400;

    res.status(statusCode).json({
      success: false,
      message: "Error deleting user",
      errors: error.message,
    });
  }
};

export const userController = {
  GetAllUsers,
  UpdateUserById,
  DeleteUserById,
};
