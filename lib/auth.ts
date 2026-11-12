import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET!
);

// Generate JWT
export async function createToken(adminId: number) {
    return new SignJWT({ adminId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h") // can change expiration time, but must change in the app/api/auth/login/route.ts response.cookies as well
        .sign(secret);
}

// Verify JWT
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}