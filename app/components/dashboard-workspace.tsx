"use client";

import { useState } from "react";
import {
  Bell,
  Bot,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  CircleHelp,
  Clock3,
  FileText,
  LayoutDashboard,
  Plus,
  Search,
  Settings2,
  Share2,
  Sparkles,
} from "lucide-react";
import { signOutAction } from "@/app/actions/auth";
import type { Campaign } from "@/app/lib/campaigns";
import { AiAgentOffice } from "@/app/components/ai-agent-office";

const navigation = [
  { label: "Overview", icon: LayoutDashboard, tone: "blue" },
  { label: "AI Agent", icon: Bot, tone: "violet" },
  { label: "Posts", icon: FileText, tone: "coral" },
  { label: "Calendar", icon: CalendarDays, tone: "amber" },
  { label: "Analytics", icon: ChartNoAxesCombined, tone: "green" },
  { label: "Accounts", icon: Share2, tone: "pink" },
  { label: "Settings", icon: Settings2, tone: "slate" },
];

export function DashboardWorkspace({ campaign, name, email }: { campaign: Campaign; name: string; email: string }) {
  const [expanded, setExpanded] = useState(false);
  const [campaignMenuOpen, setCampaignMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const officeName = campaign.office_image.includes("modern") ? "Modern Office" : "Wooden Office";
  const officeType = campaign.office_image.includes("modern") ? "modern" : "wooden";

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  }

  const campaignMark = campaign.icon.startsWith("data:image/")
    ? <img src={campaign.icon} alt="" />
    : campaign.icon;

  return (
    <main className={`workspace-shell ${expanded ? "is-expanded" : "is-collapsed"}`}>
      <aside className="workspace-sidebar">
        <div className="workspace-brand-row">
          <a className="workspace-logo" href="/dashboard" aria-label="Socially overview"><span>s</span>{expanded && <b>socially</b>}</a>
          <button className="workspace-collapse" type="button" onClick={() => setExpanded((value) => !value)} aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"} title={expanded ? "Collapse sidebar" : "Expand sidebar"}>
            {expanded ? <ChevronsLeft size={17} /> : <ChevronsRight size={17} />}
          </button>
        </div>

        <div className="campaign-switcher-wrap">
          <button className="campaign-switcher" type="button" onClick={() => setCampaignMenuOpen((value) => !value)} aria-expanded={campaignMenuOpen}>
            <span className="campaign-switcher-mark">{campaignMark}</span>
            {expanded && <><span className="campaign-switcher-copy"><small>ACTIVE CAMPAIGN</small><b>{campaign.name}</b></span><ChevronDown size={15} className="campaign-switcher-chevron" /></>}
          </button>
          {campaignMenuOpen && <div className="campaign-menu">
            <span className="campaign-menu-label">YOUR WORKSPACE</span>
            <button className="campaign-menu-current" type="button" onClick={() => setCampaignMenuOpen(false)}><span className="campaign-menu-mark">{campaignMark}</span><span><b>{campaign.name}</b><small>Current campaign</small></span><span className="campaign-menu-check">✓</span></button>
            <div className="campaign-menu-rule" />
            <button className="campaign-menu-create" type="button" onClick={() => { setCampaignMenuOpen(false); showNotice("New campaign creation will be available here soon."); }}><span><Plus size={16} /></span><b>Create new campaign</b></button>
            <p className="campaign-menu-hint">Manage multiple brands from one place.</p>
          </div>}
        </div>

        <div className="workspace-nav">
          <span className="workspace-nav-caption">{expanded ? "MENU" : ""}</span>
          {navigation.map(({ label, icon: Icon, tone }, index) => <button type="button" key={label} title={!expanded ? label : undefined} aria-label={label} onClick={() => index === 0 ? showNotice("You’re viewing your overview.") : showNotice(`${label} is coming soon.`)} className={`workspace-nav-item ${index === 0 ? "active" : ""}`}>
            <span className={`workspace-nav-icon tone-${tone}`}><Icon size={17} strokeWidth={1.9} /></span>{expanded && <><span className="workspace-nav-text">{label}</span>{index === 0 && <i className="workspace-nav-active-dot" />}</>}
          </button>)}
        </div>

        <div className="workspace-sidebar-bottom">
          <button type="button" className="workspace-help" title={!expanded ? "Help center" : undefined} onClick={() => showNotice("Help center is coming soon.")}><span><CircleHelp size={16} /></span>{expanded && <span><b>Need a hand?</b><small>Visit the help center</small></span>}</button>
          <form action={signOutAction} className="workspace-account">
            <span className="workspace-avatar">{name.charAt(0).toUpperCase()}</span>
            {expanded && <span className="workspace-account-copy"><b>{name}</b><small>{email}</small></span>}
            {expanded && <button className="workspace-signout" type="submit" aria-label="Sign out" title="Sign out">↗</button>}
          </form>
        </div>
      </aside>

      <section className="workspace-main">
        <header className="workspace-topbar">
          <div className="workspace-breadcrumb"><span>Workspace</span><i>/</i><b>Overview</b></div>
          <div className="workspace-topbar-actions">
            <div className="workspace-search"><Search size={15} /><span>Search anything</span><kbd>/</kbd></div>
            <button type="button" className="workspace-notification" aria-label="Notifications" onClick={() => showNotice("You’re all caught up.")}><Bell size={17} /><i /></button>
            <span className="workspace-top-avatar">{name.charAt(0).toUpperCase()}</span>
          </div>
        </header>

        <div className="overview-page">
          <div className="overview-heading"><div><p className="dashboard-kicker"><span /> YOUR WORKSPACE</p><h1>Good to see you, {name}.</h1><p>Here’s what’s happening across your campaign.</p></div><div className="overview-date"><span className="overview-date-dot" /> Workspace ready</div></div>
          <div className="overview-grid">
            <div className="overview-left">
              <section className="overview-campaign-card">
                <div className="overview-card-head"><span className="overview-section-label">CAMPAIGN STATUS</span><span className="overview-status-pill"><i /> Active</span></div>
                <div className="overview-campaign-main"><span className="overview-campaign-mark">{campaignMark}</span><div><h2>{campaign.name}</h2><p>Social media campaign</p></div><span className="overview-campaign-spark"><Sparkles size={17} /></span></div>
                <div className="overview-campaign-bottom"><span><small>AI OFFICE</small><b>{officeName}</b></span><span><small>CAMPAIGN HEALTH</small><b><i className="overview-health-dot" /> Ready to grow</b></span></div>
              </section>
              <section className="overview-data-card overview-schedule-card">
                <div className="overview-card-heading"><div><span className="overview-section-label">YOUR CONTENT</span><h2>Upcoming scheduled posts</h2></div><span className="overview-card-icon schedule-icon"><CalendarDays size={17} /></span></div>
                <div className="overview-empty-state"><span className="overview-empty-icon"><Clock3 size={19} /></span><b>Your schedule is clear</b><p>When you schedule a post, it’ll appear here so you can see what’s coming up.</p></div>
              </section>
              <section className="overview-data-card overview-activity-card">
                <div className="overview-card-heading"><div><span className="overview-section-label">LATEST UPDATES</span><h2>Recent activity</h2></div><span className="overview-card-icon activity-icon"><Sparkles size={17} /></span></div>
                <div className="overview-activity-empty"><span className="overview-activity-mark"><Sparkles size={15} /></span><span><b>Nothing to report yet</b><small>Your campaign updates and agent activity will show up here.</small></span><span className="overview-activity-line" /></div>
              </section>
            </div>
            <AiAgentOffice office={officeType} />
          </div>
        </div>
      </section>
      {notice && <div className="workspace-toast" role="status"><Sparkles size={15} />{notice}</div>}
    </main>
  );
}
