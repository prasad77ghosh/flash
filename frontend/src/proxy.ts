import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/register"];
const AUTH_REDIRECT = "/";
const REFRESH_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`;

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.includes(pathname);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  if (accessToken && isPublicPath(pathname)) {
    return NextResponse.redirect(new URL(AUTH_REDIRECT, request.url));
  }
  /* 2️⃣ No access token but refresh token exists → rotate */
  if (!accessToken && refreshToken && !isPublicPath(pathname)) {
    try {
      const refreshResponse = await fetch(REFRESH_ENDPOINT, {
        method: "POST",
        headers: {
          cookie: `refresh_token=${refreshToken}`,
        },
        credentials: "include",
      });
      if (!refreshResponse.ok) {
        throw new Error("Refresh failed");
      }
      const response = NextResponse.next();
      const setCookie = refreshResponse.headers.get("set-cookie");
      if (setCookie) {
        response.headers.append("set-cookie", setCookie);
      }
      return response;
    } catch (err) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  /* 3️⃣ No tokens & protected route */
  if (!accessToken && !isPublicPath(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
