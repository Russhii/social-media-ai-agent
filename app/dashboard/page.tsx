import { redirect } from "next/navigation";
import { signOutAction } from "@/app/actions/auth";
import { createInsForgeServerClient } from "@/app/lib/insforge/server";

export default async function DashboardPage() {
  const insforge = await createInsForgeServerClient();
  const { data, error } = await insforge.auth.getCurrentUser();
  if (error || !data.user) redirect("/sign-in");
  const profile = data.user as typeof data.user & { profile?: { name?: string; avatar_url?: string } };
  const name = profile.profile?.name || profile.email?.split("@")[0] || "there";

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <a className="dashboard-brand" href="/dashboard"><span className="auth-brand-mark">s</span> socially</a>
        <form action={signOutAction}><button className="sign-out-button" type="submit">Sign out</button></form>
      </header>
      <section className="dashboard-content">
        <p className="dashboard-kicker">YOUR WORKSPACE</p>
        <h1>Good to see you, {name}.</h1>
        <p className="dashboard-lede">Your account is ready. This is your home for planning and growing your social media presence.</p>
        <div className="dashboard-welcome-card">
          <span className="welcome-icon">✦</span>
          <div><h2>You’re all set</h2><p>Signed in as <strong>{data.user.email}</strong>. Your profile is saved securely with your account.</p></div>
        </div>
      </section>
    </main>
  );
}
