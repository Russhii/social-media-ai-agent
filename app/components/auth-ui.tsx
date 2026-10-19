"use client";

import { useFormStatus } from "react-dom";
import type { InputHTMLAttributes, ReactNode } from "react";

export function AuthCard({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle: string; children: ReactNode }) {
  return <main className="auth-shell"><div className="auth-layout">
    <aside className="auth-showcase">
      <a className="auth-brand auth-brand-showcase" href="/sign-in" aria-label="Socially home"><span className="auth-brand-mark">s</span><span>socially</span></a>
      <div className="auth-showcase-content"><span className="auth-showcase-kicker"><i /> YOUR CREATIVE HQ</span><h2>Make room for<br />your <em>next big idea.</em></h2><p>One calm workspace for better content, sharper campaigns, and more consistent growth.</p>
        <div className="auth-showcase-art" aria-hidden="true"><div className="showcase-orbit orbit-one" /><div className="showcase-orbit orbit-two" /><div className="showcase-spark">✦</div><div className="showcase-card showcase-card-back"><span className="showcase-dot" /><span /><span /></div><div className="showcase-card showcase-card-front"><span className="showcase-mini-mark">s</span><span className="showcase-lines"><i /><i /><i /></span><span className="showcase-art-arrow">↗</span></div><div className="showcase-floating floating-one">✧</div><div className="showcase-floating floating-two">●</div></div>
      </div>
      <div className="auth-showcase-foot"><span>DESIGNED TO KEEP YOU IN FLOW</span><span>01 <i /> 03</span></div>
    </aside>
    <section className="auth-card">
      <div className="auth-mobile-brand"><a className="auth-brand" href="/sign-in"><span className="auth-brand-mark">s</span><span>socially</span></a><span className="auth-mobile-kicker">YOUR CREATIVE HQ</span></div>
      <p className="auth-eyebrow">{eyebrow}</p><h1>{title}</h1><p className="auth-subtitle">{subtitle}</p>{children}
      <p className="auth-legal">By continuing, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</p>
    </section>
  </div><p className="auth-caption">Less busywork. More meaningful growth.</p></main>;
}

export function AuthField({ id, label, ...props }: InputHTMLAttributes<HTMLInputElement> & { id: string; label: string }) {
  return <label className="auth-label" htmlFor={id}>{label}<input className="auth-input" id={id} name={id} required {...props} /></label>;
}

export function SubmitButton({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();
  return <button className="auth-submit" type="submit" disabled={pending}>{pending ? "Please wait…" : children}</button>;
}

export function GoogleButton({ label = "Continue with Google" }: { label?: string }) {
  const { pending } = useFormStatus();
  return <button className="google-button" type="submit" disabled={pending}><GoogleMark />{pending ? "Connecting…" : label}</button>;
}

export function AuthError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="auth-error" role="alert">{message.replaceAll("_", " ")}</p>;
}

function GoogleMark() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="google-mark"><path fill="#4285F4" d="M21.6 12.23c0-.72-.06-1.42-.18-2.09H12v3.96h5.38a4.6 4.6 0 0 1-2 3.01v2.51h3.23c1.89-1.74 2.99-4.3 2.99-7.39Z"/><path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.63-2.44l-3.23-2.51c-.9.6-2.05.96-3.4.96-2.61 0-4.83-1.76-5.63-4.13H3.04v2.59A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.37 13.88a6 6 0 0 1 0-3.76V7.53H3.04a10 10 0 0 0 0 8.94l3.33-2.59Z"/><path fill="#EA4335" d="M12 5.99c1.47 0 2.79.51 3.83 1.52l2.87-2.87A9.58 9.58 0 0 0 12 2a10 10 0 0 0-8.96 5.53l3.33 2.59C7.17 7.75 9.39 5.99 12 5.99Z"/></svg>;
}
