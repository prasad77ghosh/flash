import { Request } from "express";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}


export interface AuthRequest extends Request {
  payload?: {
    userId: string;
    role: "user" | "admin";
    name: string;
  };
  location?: any;
}
