import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { AuthRequest } from "../types/auth";
import { fieldValidateError } from "../helpers/field-validation.helper";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      fieldValidateError(req);
      const user = await AuthService.register({ name, email, password });

      res.status(201).json({
        success: true,
        msg: "You have registered successfully!",
        data: user,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      console.log({
        email,
        password,
      });

      fieldValidateError(req);

      const { user, accessToken, refreshToken } = await AuthService.login({
        email,
        password,
      });

      // Set both cookies
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 30 * 60 * 1000, // ⭐ 30 minutes
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // ⭐ 7 days
      });

      res.status(200).json({
        success: true,
        msg: "Login successful",
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refresh_token;

      if (!refreshToken)
        return res
          .status(401)
          .json({ success: false, msg: "No refresh token" });

      const { accessToken } = await AuthService.rotateTokens(refreshToken);

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 30 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        msg: "Token rotated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.payload?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, msg: "Unauthorized" });
      }

      const user = await AuthService.getProfile(userId);

      res.status(200).json({
        success: true,
        msg: "Profile fetched successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none" as const,
        path: "/",
      };

      res.clearCookie("access_token", {
        ...cookieOptions,
        expires: new Date(0),
      });
      res.clearCookie("refresh_token", {
        ...cookieOptions,
        expires: new Date(0),
      });

      return res.status(200).json({
        success: true,
        msg: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
