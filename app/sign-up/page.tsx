import Link from "next/link";
import { signUpAction, googleSignInAction } from "@/app/actions/auth";
import { AuthCard, AuthError, AuthField, GoogleButton, SubmitButton } from "@/app/components/auth-ui";
import { createInsForgeServerClient } from "@/app/lib/insforge/server";
import { redirect } from "next/navigation";

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const insforge = await createInsForgeServerClient();
  const { data: session } = await insforge.auth.getCurrentUser();
  if (session.user) redirect("/dashboard");
  const params = await searchParams;
  return (
    <AuthCard eyebrow="GET STARTED" title="Create your workspace" subtitle="Plan, create, and grow your social presence in one place.">
      <AuthError message={params.error} />
      <form action={googleSignInAction}><GoogleButton label="Sign up with Google" /></form>
      <div className="auth-divider"><span>or sign up with email</span></div>
      <form action={signUpAction} className="auth-form">
        <AuthField id="name" label="Full name" autoComplete="name" placeholder="Your name" />
        <AuthField id="email" label="Email address" type="email" autoComplete="email" placeholder="you@example.com" />
        <AuthField id="password" label="Password" type="password" autoComplete="new-password" placeholder="At least 6 characters" minLength={6} />
        <SubmitButton>Create account</SubmitButton>
      </form>
      <p className="auth-note">We’ll email you a verification code before your first sign in.</p>
      <p className="auth-switch">Already have an account? <Link href="/sign-in">Sign in</Link></p>
    </AuthCard>
  );
}
