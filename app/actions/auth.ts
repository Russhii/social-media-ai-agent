"use server";

import { createAuthActions } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserCampaign } from "@/app/lib/campaigns";

async function auth() {
  return createAuthActions({ cookies: await cookies() });
}

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) fail("/sign-in", "Enter your email and password.");
  const { data, error } = await (await auth()).signInWithPassword({ email, password });
  if (error || !data?.user) fail("/sign-in", error?.message ?? "Unable to sign in.");
  redirect(await destinationFor(data.user.id));
}

export async function signUpAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!name || !email || !password) fail("/sign-up", "Complete each field to create your account.");
  if (password.length < 6) fail("/sign-up", "Use a password with at least 6 characters.");

  const { data, error } = await (await auth()).signUp({
    name,
    email,
    password,
    redirectTo: new URL("/sign-in?verified=1", process.env.NEXT_PUBLIC_APP_URL).toString(),
  });
  if (error) fail("/sign-up", error.message);
  if (data?.requireEmailVerification) redirect(`/verify-email?email=${encodeURIComponent(email)}`);
  if (!data?.user) fail("/sign-up", "Your account could not be created. Please try again.");
  redirect(await destinationFor(data.user.id));
}

export async function verifyEmailAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const otp = String(formData.get("otp") ?? "").trim();
  if (!email || !/^\d{6}$/.test(otp)) fail(`/verify-email?email=${encodeURIComponent(email)}`, "Enter the six digit code from your email.");
  const { data, error } = await (await auth()).verifyEmail({ email, otp });
  if (error || !data?.user) fail(`/verify-email?email=${encodeURIComponent(email)}`, error?.message ?? "That code could not be verified.");
  redirect(await destinationFor(data.user.id));
}

async function destinationFor(userId: string) {
  try {
    return (await getUserCampaign(userId)) ? "/dashboard" : "/create-campaign";
  } catch {
    return "/create-campaign?error=campaign_lookup";
  }
}

export async function googleSignInAction() {
  const cookieStore = await cookies();
  const { data, error } = await createAuthActions({ cookies: cookieStore }).signInWithOAuth("google", {
    redirectTo: new URL("/api/auth/callback", process.env.NEXT_PUBLIC_APP_URL).toString(),
    skipBrowserRedirect: true,
    additionalParams: { prompt: "select_account" },
  });
  if (error || !data.url || !data.codeVerifier) fail("/sign-in", error?.message ?? "Google sign in is not available right now.");
  cookieStore.set("insforge_code_verifier", data.codeVerifier, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 600,
  });
  redirect(data.url);
}

export async function signOutAction() {
  const { error } = await (await auth()).signOut();
  if (error) fail("/dashboard", error.message);
  redirect("/sign-in");
}
