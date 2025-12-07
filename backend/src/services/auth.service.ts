import { Conflict, NotFound, Unauthorized } from "http-errors";
import UserSchema from "../models/user.model";
import { EncryptAndDecryptService } from "../helpers/password-encription.helper";
import { redisServer } from "../helpers/redis-cache.helper";
import { JwtService } from "../helpers/jwt.helper";
import { LoginData, RegisterData } from "../types/auth";



export class AuthService {
  static async register({ name, email, password }: RegisterData) {
    const isUserExist = await UserSchema.findOne({ email });
    if (isUserExist) {
      throw new Conflict("A user already exists with this email");
    }
    const hashPassword = await new EncryptAndDecryptService().hashPassword(
      password
    );
    const user = await UserSchema.create({
      name,
      email,
      password: hashPassword,
      isVerified:true
    });

    // if (user) {
    //   await kafkaProducer.sendMessage(TOPICS.AUTH_EVENTS, [
    //     {
    //       key: user.id,
    //       value: JSON.stringify({
    //         eventType: "USER_REGISTER",
    //         data: { name: user.name, email: user.email },
    //       }),
    //     },
    //   ]);
    // }

    return {
      name: user?.name,
      email: user?.email,
    };
  }

  static async verify({ email, otp }: { email: string; otp: string }) {
    const storedOtp = await redisServer.get(`otp:${email}`);

    //add verify logic
  }

  static async login({ email, password }: LoginData) {
    const user = await UserSchema.findOne({ email }).select("+password");
    if (!user) throw new NotFound("User not found");

    const isPasswordValid =
      await new EncryptAndDecryptService().comparePassword(
        password,
        user?.password as string
      );
    if (!isPasswordValid) throw new Unauthorized("Invalid credentials");

    const payload = { userId: user._id, email: user.email };

    const jwtService = new JwtService();
    const accessToken = jwtService.generateAccessToken(payload);
    const refreshToken = jwtService.generateRefreshToken(payload);

    // here i can put device count logic

    return { user, accessToken, refreshToken };
  }

  static async rotateTokens(refreshToken: string) {
    const jwtService = new JwtService();

    const decoded = jwtService.verifyRefreshToken(refreshToken);

    const payload = { userId: decoded.userId, email: decoded.email };
    const accessToken = jwtService.generateAccessToken(payload);
    return { accessToken };
  }

  static async getProfile(userId: string) {
    const user = await UserSchema.findById(userId).select("-password -__v");
    if (!user) throw new NotFound("User not found");

    return user;
  }
}
