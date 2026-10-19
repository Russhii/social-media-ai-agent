import { verifyEmailAction } from "@/app/actions/auth";
import { AuthCard, AuthError, AuthField, SubmitButton } from "@/app/components/auth-ui";

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ email?: string; error?: string }> }) {
  const params = await searchParams;
  const email = params.email ?? "";
  return (
    <AuthCard eyebrow="ONE LAST STEP" title="Verify your email" subtitle={`Enter the six digit code we sent to ${email || "your inbox"}.`}>
      <AuthError message={params.error} />
      <form action={verifyEmailAction} className="auth-form">
        <input type="hidden" name="email" value={email} />
        <AuthField id="otp" label="Verification code" inputMode="numeric" autoComplete="one-time-code" placeholder="000000" maxLength={6} pattern="[0-9]{6}" />
        <SubmitButton>Verify and continue</SubmitButton>
      </form>
    </AuthCard>
  );
}
