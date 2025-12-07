import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { pool } from "../config/db";

const verifyAccess = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as JwtPayload;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const result = await pool.query(
        `SELECT id, role FROM users WHERE id = $1`,
        [user.id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const dbUser = result.rows[0];

      if (dbUser.role === "admin") {
        return next();
      }

      if (user.id !== dbUser.id) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      return next();
    } catch (err: any) {
      return res.status(401).json({
        success: false,
        message: err.message || "Something went wrong",
      });
    }
  };
};

export default verifyAccess;
