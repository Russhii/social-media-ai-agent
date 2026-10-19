import Link from "next/link";
import { signInAction, googleSignInAction } from "@/app/actions/auth";
import { AuthCard, AuthError, AuthField, GoogleButton, SubmitButton } from "@/app/components/auth-ui";
import { createInsForgeServerClient } from "@/app/lib/insforge/server";
import { redirect } from "next/navigation";
import { getUserCampaign } from "@/app/lib/campaigns";

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ error?: string; verified?: string }> }) {
  const insforge = await createInsForgeServerClient();
  const { data: session } = await insforge.auth.getCurrentUser();
  if (session.user) {
    let hasCampaign = false;
    try { hasCampaign = Boolean(await getUserCampaign(session.user.id)); }
    catch { redirect("/create-campaign?error=campaign_lookup"); }
    redirect(hasCampaign ? "/dashboard" : "/create-campaign");
  }
  const params = await searchParams;
  return (
    <AuthCard eyebrow="WELCOME BACK" title="Sign in to your workspace" subtitle="Your social media work is right where you left it.">
      {params.verified && <p className="auth-success">Email verified. You can now sign in.</p>}
      <AuthError message={params.error} />
      <form action={googleSignInAction}><GoogleButton /></form>
      <div className="auth-divider"><span>or continue with email</span></div>
      <form action={signInAction} className="auth-form">
        <AuthField id="email" label="Email address" type="email" autoComplete="email" placeholder="you@example.com" />
        <AuthField id="password" label="Password" type="password" autoComplete="current-password" placeholder="Your password" />
        <SubmitButton>Sign in</SubmitButton>
      </form>
      <p className="auth-switch">New to Socially? <Link href="/sign-up">Create an account</Link></p>
    </AuthCard>
  );
}
