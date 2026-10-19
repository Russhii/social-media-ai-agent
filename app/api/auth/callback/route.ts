import { createAuthActions } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("insforge_code");
  const oauthError = request.nextUrl.searchParams.get("error");
  if (oauthError || !code) return NextResponse.redirect(new URL("/sign-in?error=google_auth_failed", request.url));

  const verifier = (await cookies()).get("insforge_code_verifier")?.value;
  if (!verifier) return NextResponse.redirect(new URL("/sign-in?error=google_session_expired", request.url));

  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  const auth = createAuthActions({ requestCookies: request.cookies, responseCookies: response.cookies });
  const { data, error } = await auth.exchangeOAuthCode(code, verifier);
  if (error || !data?.user) return NextResponse.redirect(new URL("/sign-in?error=google_auth_failed", request.url));
  response.cookies.delete("insforge_code_verifier");
  return response;
}
