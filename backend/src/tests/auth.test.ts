import request from "supertest";
import App from "../app";
import { AuthService } from "../services/auth.service";

// Mock the AuthService
jest.mock("../services/auth.service");

// Mock ProtectedMiddleware with correct default export structure
jest.mock("../middlewares/protected.middleware", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        protected: (req: any, res: any, next: any) => {
          req.payload = { userId: "654321654321654321654321", email: "test@example.com" };
          next();
        }
      };
    })
  };
});

describe("Auth Endpoints", () => {
  let app: any;

  beforeAll(() => {
    app = new App().app;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/v1/auth/register", () => {
    it("should register a user successfully", async () => {
      const mockUser = { name: "Test User", email: "test@example.com" };
      (AuthService.register as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Test User",
          email: "test@example.com",
          password: "password123",
          confirmPassword: "password123"
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockUser);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should login successfully", async () => {
      const mockAuthData = {
        user: { _id: "654321654321654321654321", email: "test@example.com", name: "Test User" },
        accessToken: "access-token",
        refreshToken: "refresh-token",
      };
      (AuthService.login as jest.Mock).mockResolvedValue(mockAuthData);

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      const cookies = response.headers["set-cookie"];
      expect(cookies).toBeDefined();
    });
  });

  describe("POST /api/v1/auth/refresh", () => {
    it("should rotate tokens successfully", async () => {
      (AuthService.rotateTokens as jest.Mock).mockResolvedValue({ accessToken: "new-access-token" });

      const response = await request(app)
        .post("/api/v1/auth/refresh")
        .set("Cookie", ["refresh_token=valid-refresh-token"]);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe("POST /api/v1/auth/logout", () => {
    it("should logout successfully", async () => {
      const response = await request(app)
        .post("/api/v1/auth/logout")
        .set("Cookie", ["access_token=valid-token"]);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe("GET /api/v1/auth/profile", () => {
    it("should get profile successfully", async () => {
      const mockProfile = { _id: "654321654321654321654321", name: "Test User", email: "test@example.com" };
      (AuthService.getProfile as jest.Mock).mockResolvedValue(mockProfile);

      const response = await request(app)
        .get("/api/v1/auth/profile")
        .set("Cookie", ["access_token=valid-token"]);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockProfile);
    });
  });
});
