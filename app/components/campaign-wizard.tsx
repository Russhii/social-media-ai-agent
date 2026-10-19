"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, ImagePlus, Sparkles } from "lucide-react";
import { useFormStatus } from "react-dom";
import { createCampaignAction } from "@/app/actions/campaign";

const icons = ["✦", "◉", "🌱", "🚀", "🎯", "💡"];
const offices = [
  { path: "/offices/modern-office.png", file: "offices/modern-office.png", title: "Modern Office", description: "Bright ideas, clean lines" },
  { path: "/offices/wooden-office.png", file: "offices/wooden-office.png", title: "Wooden Office", description: "Warm, focused energy" },
];

function CreateButton() {
  const { pending } = useFormStatus();
  return <button className="campaign-primary" type="submit" disabled={pending}>{pending ? "Creating workspace…" : <>Create campaign <Check size={17} /></>}</button>;
}

export function CampaignWizard({ error }: { error?: string }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(icons[0]);
  const [office, setOffice] = useState(offices[0].file);
  const [customIcon, setCustomIcon] = useState("");

  function uploadIcon(file?: File) {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 600_000) return;
    const reader = new FileReader();
    reader.onload = () => setCustomIcon(String(reader.result));
    reader.readAsDataURL(file);
  }

  return <main className="campaign-shell">
    <header className="campaign-header">
      <a className="campaign-brand" href="/dashboard"><span className="campaign-brand-mark"><Sparkles size={17} /></span>socially</a>
      <div className="campaign-progress"><span>WORKSPACE SETUP</span><div><i className={step === 1 ? "active" : "done"} /><i className={step === 2 ? "active" : ""} /></div><b>0{step} <small>/ 02</small></b></div>
      <span className="campaign-secure">Your workspace, your rules</span>
    </header>
    <section className="campaign-layout">
      <div className="campaign-intro">
        <div className="campaign-eyebrow"><span /> A BETTER WAY TO GROW</div>
        <h1>Make this space<br />feel like <em>yours.</em></h1>
        <p>Set up your campaign workspace and your AI team will be ready to get to work.</p>
        <div className="campaign-steps">
          <div className={step === 1 ? "current" : "complete"}><span>{step > 1 ? <Check size={15} /> : "01"}</span><div><b>Name your workspace</b><small>Choose a name and an icon</small></div></div>
          <div className="step-connector" />
          <div className={step === 2 ? "current" : ""}><span>02</span><div><b>Pick your AI office</b><small>Choose where your team works</small></div></div>
        </div>
        <div className="campaign-note"><Sparkles size={16} /><span>Thoughtfully designed for teams that move ideas forward.</span></div>
      </div>

      <section className="campaign-panel">
        <div className="campaign-panel-head"><div><span className="campaign-step-label">STEP 0{step} OF 02</span><h2>{step === 1 ? "Name your campaign" : "Choose your AI office"}</h2><p>{step === 1 ? "Give your workspace a name and a little personality." : "Your AI agents are ready. Pick their home base."}</p></div><div className="campaign-panel-number">0{step}</div></div>
        {error && <p className="campaign-error" role="alert">{error}</p>}
        {step === 1 ? <div className="campaign-step-content">
          <label className="campaign-label" htmlFor="campaign-name">Campaign name</label>
          <input id="campaign-name" className="campaign-name-input" placeholder="e.g. Acme social studio" maxLength={60} value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          <div className="campaign-icon-head"><span className="campaign-label">Choose an icon</span><span>A LITTLE PERSONALITY</span></div>
          <div className="campaign-icons">{icons.map((item) => <button type="button" key={item} className={!customIcon && icon === item ? "selected" : ""} onClick={() => { setIcon(item); setCustomIcon(""); }} aria-label={`Select ${item} icon`}>{item}</button>)}
            <label className={`campaign-upload ${customIcon ? "selected" : ""}`} title="Upload a custom icon">{customIcon ? <img src={customIcon} alt="Custom campaign icon" /> : <ImagePlus size={19} />}<input type="file" accept="image/*" onChange={(e) => uploadIcon(e.target.files?.[0])} /></label>
          </div>
          <p className="campaign-upload-hint">PNG or JPG, up to 600 KB</p>
          <div className="campaign-preview"><span className="campaign-preview-icon">{customIcon ? <img src={customIcon} alt="" /> : icon}</span><span><small>YOUR WORKSPACE</small><b>{name || "Your campaign"}</b></span><span className="preview-dot" /></div>
          <button className="campaign-primary" type="button" disabled={!name.trim()} onClick={() => setStep(2)}>Next <ArrowRight size={17} /></button>
        </div> : <form action={createCampaignAction} className="campaign-step-content">
          <input type="hidden" name="name" value={name} /><input type="hidden" name="icon" value={customIcon || icon} /><input type="hidden" name="office_image" value={office} />
          <div className="office-options">{offices.map((item) => <button type="button" key={item.file} className={`office-card ${office === item.file ? "selected" : ""}`} onClick={() => setOffice(item.file)}>
            <Image src={item.path} alt={item.title} fill sizes="(max-width: 900px) 80vw, 340px" />
            <span className="office-shade" /><span className="office-card-check">{office === item.file && <Check size={14} />}</span>
            <span className="office-card-caption"><b>{item.title}</b><small>{item.description}</small></span>
          </button>)}</div>
          <div className="campaign-selected-preview"><span>{customIcon ? <img src={customIcon} alt="" /> : icon}</span><div><small>CAMPAIGN</small><b>{name}</b></div><button type="button" onClick={() => setStep(1)} aria-label="Edit campaign name"><ArrowLeft size={15} /> Edit</button></div>
          <div className="campaign-actions"><button className="campaign-back" type="button" onClick={() => setStep(1)}><ArrowLeft size={16} /> Back</button><CreateButton /></div>
        </form>}
        <div className="campaign-panel-footer"><span><i /> ENCRYPTED &amp; PRIVATE</span><span>MADE FOR MOMENTUM <Sparkles size={12} /></span></div>
      </section>
    </section>
    <footer className="campaign-footer"><span>© 2026 socially</span><span>Built for what’s next <b>✦</b></span></footer>
  </main>;
}
