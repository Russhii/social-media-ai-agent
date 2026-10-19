"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { LoaderCircle, Sparkles } from "lucide-react";

type Agent = {
  id: string;
  name: string;
  emoji: string;
  character: string;
  x: number;
  y: number;
  animation: string;
  accent: string;
};

type OfficeLayout = {
  id: string;
  name: string;
  background: string;
  canvas: { width: number; height: number };
  agents: Agent[];
};

export function AiAgentOffice({ office }: { office: "modern" | "wooden" }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<OfficeLayout | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLayout(null);
    setLoadFailed(false);
    fetch(`/office-studio/${office}-office.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Office layout could not be loaded.");
        return response.json() as Promise<OfficeLayout>;
      })
      .then(setLayout)
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setLoadFailed(true);
      });
    return () => controller.abort();
  }, [office]);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const aspect = layout ? layout.canvas.width / layout.canvas.height : 1.5;
  const artboardHeight = Math.max(size.height, size.width / aspect);
  const artboardWidth = artboardHeight * aspect;

  return <section className="overview-office" aria-label={`${layout?.name ?? "AI agent"} office`}>
    <div className="overview-office-head"><div><span className="overview-office-kicker"><Sparkles size={13} /> AI AGENT OFFICE</span><h2>{layout?.name ?? "Your team’s office"}</h2></div><span className="overview-office-live"><i /> {layout ? `${layout.agents.length} agents online` : "Loading office"}</span></div>
    <div className={`office-viewport ${layout ? "is-ready" : "is-loading"}`} ref={viewportRef}>
      {layout && <div className="office-artboard" style={{ width: artboardWidth, height: artboardHeight }}>
        <Image className="office-background" src={layout.background} alt={`${layout.name} background`} fill priority sizes="(max-width: 700px) 100vw, 55vw" />
        <div className="office-wash" />
        {layout.agents.map((agent, index) => <div className={`office-agent agent-${agent.accent}`} key={agent.id} style={{ left: `${agent.x}%`, top: `${agent.y}%`, "--agent-delay": `${index * 160}ms` } as CSSProperties}>
          <div className="office-agent-popover"><span>{agent.emoji}</span><b>{agent.name}</b><i /></div>
          <div className={`office-agent-character motion-${agent.animation}`} aria-label={agent.name} role="img"><span className="office-agent-halo" /><span className="office-agent-emoji">{agent.character}</span><span className="office-agent-shadow" /></div>
          <span className="office-agent-task">{agent.animation === "typing" ? "Working" : agent.animation === "analyzing" ? "Reviewing" : agent.animation === "creating" ? "Creating" : "Researching"}<i>···</i></span>
        </div>)}
        <div className="office-image-credit"><span /> Office studio <b>·</b> {layout.name}</div>
      </div>}
      {!layout && <div className="office-loading-state"><span className="office-loading-icon">{loadFailed ? <Sparkles size={20} /> : <LoaderCircle size={20} />}</span><b>{loadFailed ? "Office is taking a break" : "Preparing the office…"}</b><small>{loadFailed ? "Try refreshing to bring your agents back." : "Your team is getting settled in."}</small></div>}
    </div>
  </section>;
}
