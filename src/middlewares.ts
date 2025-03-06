import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/sign-in"];
const AUTH_PATHS = ["/sign-in"];
const API_PATHS = ["/api/admin/login"];

const isPublicPath = (path: string) =>
  PUBLIC_PATHS.some(
    (publicPath) => path === publicPath || path.startsWith(`${publicPath}/`),
  );
const isAuthPath = (path: string) =>
  AUTH_PATHS.some(
    (authPath) => path === authPath || path.startsWith(`${authPath}/`),
  );
const isApiPath = (path: string) =>
  API_PATHS.some(
    (apiPath) => path === apiPath || path.startsWith(`${apiPath}/`),
  );
const isStaticAsset = (path: string) =>
  path.startsWith("/_next/") ||
  path.startsWith("/images/") ||
  path.startsWith("/favicon.ico");

export async function middlewares(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isStaticAsset(pathname) || isApiPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  const isAuthenticated = !!token;

  if (isAuthenticated && isAuthPath(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isAuthenticated && !isPublicPath(pathname)) {
    const redirectUrl = new URL("/sign-in", request.url);
    redirectUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|images|favicon.ico).*)"],
};
