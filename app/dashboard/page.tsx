import { redirect } from "next/navigation";
import { signOutAction } from "@/app/actions/auth";
import { createInsForgeServerClient } from "@/app/lib/insforge/server";
import { getUserCampaign } from "@/app/lib/campaigns";
import Image from "next/image";
import { ArrowUpRight, Bell, ChevronDown, CircleHelp, LayoutDashboard, Plus, Settings2, Sparkles } from "lucide-react";

export default async function DashboardPage() {
  const insforge = await createInsForgeServerClient();
  const { data, error } = await insforge.auth.getCurrentUser();
  if (error || !data.user) redirect("/sign-in");
  let campaign;
  try {
    campaign = await getUserCampaign(data.user.id);
  } catch {
    redirect("/create-campaign?error=campaign_lookup");
  }
  if (!campaign) redirect("/create-campaign");
  const profile = data.user as typeof data.user & { profile?: { name?: string; avatar_url?: string } };
  const name = profile.profile?.name || profile.email?.split("@")[0] || "there";

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <a className="dashboard-brand" href="/dashboard"><span className="auth-brand-mark">s</span><span>socially</span></a>
        <div className="dashboard-workspace"><span className="dashboard-workspace-icon">{campaign.icon.startsWith("data:image/") ? <img src={campaign.icon} alt="" /> : campaign.icon}</span><span><small>WORKSPACE</small><b>{campaign.name}</b></span><ChevronDown size={14} /></div>
        <span className="dashboard-nav-label">WORKSPACE</span>
        <a className="dashboard-nav-item active" href="/dashboard"><LayoutDashboard size={17} /> Overview</a>
        <a className="dashboard-nav-item" href="#ai-office"><Sparkles size={17} /> AI office <span className="dashboard-nav-new">READY</span></a>
        <a className="dashboard-nav-item" href="#campaign"><Settings2 size={17} /> Campaign settings</a>
        <div className="dashboard-sidebar-bottom"><div className="dashboard-help"><span><CircleHelp size={16} /></span><b>Need a hand?</b><small>Your workspace is ready when you are.</small></div><div className="dashboard-user"><span className="dashboard-avatar">{name.charAt(0).toUpperCase()}</span><span><b>{name}</b><small>{data.user.email}</small></span><form action={signOutAction}><button className="dashboard-user-menu" type="submit" aria-label="Sign out">↗</button></form></div></div>
      </aside>
      <section className="dashboard-main">
        <header className="dashboard-topbar"><div><span>WORKSPACE</span><b>/</b><strong>Overview</strong></div><div className="dashboard-top-actions"><button className="dashboard-icon-button" aria-label="Notifications"><Bell size={17} /></button><span className="dashboard-top-avatar">{name.charAt(0).toUpperCase()}</span></div></header>
        <div className="dashboard-content">
          <div className="dashboard-greeting"><div><p className="dashboard-kicker"><span /> YOUR WORKSPACE IS READY</p><h1>Good to see you, {name}.</h1><p className="dashboard-lede">Your campaign has a home. Let’s make something worth sharing.</p></div><span className="dashboard-date-chip"><span /> All systems ready</span></div>
          <div className="dashboard-hero-grid">
            <article className="dashboard-campaign-card" id="campaign"><div className="dashboard-card-top"><span className="dashboard-section-label">YOUR CAMPAIGN</span><span className="dashboard-status"><i /> ACTIVE</span></div><div className="dashboard-campaign-title"><span className="dashboard-campaign-icon">{campaign.icon.startsWith("data:image/") ? <img src={campaign.icon} alt="" /> : campaign.icon}</span><div><h2>{campaign.name}</h2><p>Campaign workspace</p></div><button className="dashboard-more" aria-label="Campaign options">···</button></div><div className="dashboard-campaign-meta"><span><small>CREATED</small><b>{new Date(campaign.created_at).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}</b></span><span><small>AI OFFICE</small><b>{campaign.office_image.includes("modern") ? "Modern Office" : "Wooden Office"}</b></span></div><a className="dashboard-text-link" href="#ai-office">Explore your workspace <ArrowUpRight size={15} /></a></article>
            <article className="dashboard-office-card" id="ai-office"><div className="dashboard-office-image"><Image src={campaign.office_image} alt={campaign.office_image.includes("modern") ? "Modern AI agent office" : "Wooden AI agent office"} fill sizes="(max-width: 850px) 100vw, 42vw" /></div><div className="dashboard-office-overlay" /><div className="dashboard-office-content"><span className="dashboard-office-tag"><Sparkles size={12} /> YOUR AI OFFICE</span><div><h2>Your team’s<br />ready to roll.</h2><p>{campaign.office_image.includes("modern") ? "Modern Office" : "Wooden Office"} · Your AI agents have a space to call home.</p></div><span className="dashboard-office-button">Office selected <span>✓</span></span></div></article>
          </div>
          <section className="dashboard-start-card"><div className="dashboard-start-icon"><Sparkles size={19} /></div><div className="dashboard-start-copy"><span className="dashboard-section-label">A FRESH START</span><h2>Your next great post starts here.</h2><p>Your Socially workspace is set up and ready for the next step. The tools for planning and creating will live here.</p></div><div className="dashboard-start-stamp"><span>✦</span><small>MADE FOR<br />MOMENTUM</small></div></section>
          <footer className="dashboard-footer"><span>© 2026 Socially</span><span>Small steps. Stronger stories. <b>✦</b></span></footer>
        </div>
      </section>
    </main>
  );
}
