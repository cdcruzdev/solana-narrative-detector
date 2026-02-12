"use client";

import { useEffect, useState } from "react";
import { AnalysisReport, Narrative, BuildIdea } from "@/lib/types";

function SignalStrengthBar({ value }: { value: number }) {
  const segments = 10;
  const filled = Math.round((value / 100) * segments);
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-3 transition-all duration-500"
            style={{
              background: i < filled
                ? value >= 80
                  ? "#00E599"
                  : value >= 60
                  ? "#FFB020"
                  : value >= 40
                  ? "#FF8C20"
                  : "#FF4D4D"
                : "rgba(255, 255, 255, 0.04)",
              transitionDelay: `${i * 40}ms`,
            }}
          />
        ))}
      </div>
      <span className="text-xs font-mono text-ink-muted tabular-nums w-8 text-right">{value}</span>
    </div>
  );
}

function TrendMark({ trend }: { trend: string }) {
  const colors: Record<string, string> = {
    emerging: "#00E599",
    accelerating: "#FFB020",
    peaking: "#FF8C20",
    declining: "#FF4D4D",
  };
  return (
    <span className="trend-mark" style={{ color: colors[trend] || colors.emerging, borderLeftColor: colors[trend] || colors.emerging }}>
      {trend}
    </span>
  );
}

function CategoryTag({ category }: { category: string }) {
  const colors: Record<string, string> = {
    ai: "#A78BFA",
    defi: "#00E599",
    depin: "#38BDF8",
    payments: "#34D399",
    consumer: "#FB923C",
    infrastructure: "#7D8694",
    gaming: "#FBBF24",
    social: "#C084FC",
  };
  return (
    <span className="cat-tag" style={{ color: colors[category] || "#7D8694", borderBottomColor: colors[category] || "#7D8694" }}>
      {category}
    </span>
  );
}

function DifficultyMark({ difficulty }: { difficulty: string }) {
  const map: Record<string, { label: string; bars: number; color: string }> = {
    beginner: { label: "Beginner", bars: 1, color: "#00E599" },
    intermediate: { label: "Intermediate", bars: 2, color: "#FFB020" },
    advanced: { label: "Advanced", bars: 3, color: "#FF4D4D" },
  };
  const d = map[difficulty] || map.beginner;
  return (
    <div className="flex items-end gap-0.5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-1"
          style={{
            height: `${6 + i * 3}px`,
            background: i <= d.bars ? d.color : "rgba(255, 255, 255, 0.06)",
          }}
        />
      ))}
      <span className="text-[9px] font-mono uppercase tracking-wider ml-1.5" style={{ color: d.color }}>{d.label}</span>
    </div>
  );
}

function SignalTypeMark({ type }: { type: string }) {
  const styles: Record<string, string> = {
    onchain: "#00E599",
    github: "#7D8694",
    market: "#38BDF8",
    social: "#C084FC",
  };
  return (
    <span
      className="font-mono text-[9px] uppercase tracking-[0.15em] px-1.5 py-0.5"
      style={{
        color: styles[type] || "#7D8694",
        borderBottom: `1px solid ${styles[type] || "#7D8694"}`,
      }}
    >
      {type}
    </span>
  );
}

function BuildIdeaCard({ idea }: { idea: BuildIdea }) {
  return (
    <div className="group cursor-pointer bg-surface-base p-4 border-l-2 border-ink-ghost hover:border-accent-muted active:scale-[0.99] transition-all duration-200">
      <div className="flex items-start justify-between mb-2 gap-2">
        <h4 className="font-sans font-bold text-sm text-ink group-hover:text-accent transition-colors duration-150">{idea.title}</h4>
        <DifficultyMark difficulty={idea.difficulty} />
      </div>
      <p className="text-xs text-ink-muted mb-3 leading-relaxed">{idea.description}</p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {idea.keyFeatures.map((f, i) => (
          <span key={i} className="px-1.5 py-0.5 text-[10px] font-mono text-ink-faint border-b border-ink-ghost">
            {f}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2 pt-3 border-t border-surface-border">
        <span className="text-[9px] text-ink-faint font-mono uppercase tracking-[0.15em]">Potential</span>
        <div className="flex gap-1">
          {["low", "medium", "high"].map((level) => (
            <div
              key={level}
              className="w-6 h-0.5"
              style={{
                background:
                  (idea.potential === "high") || (idea.potential === "medium" && level !== "high") || (level === "low")
                    ? "#00E599"
                    : "rgba(255, 255, 255, 0.06)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function NarrativeCard({ narrative, index }: { narrative: Narrative; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div className="card rounded fade-up" style={{ animationDelay: `${index * 0.06}s`, opacity: 0 }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 md:p-5 text-left flex items-start gap-3 md:gap-4 group cursor-pointer"
      >
        {/* Rank number - mono terminal style */}
        <div className="flex-shrink-0 w-8 md:w-10 text-right">
          <span className="font-mono text-lg md:text-xl text-accent/30 leading-none font-semibold">{String(index + 1).padStart(2, "0")}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 md:gap-3 mb-1.5 flex-wrap">
            <h3 className="font-display text-lg md:text-xl text-ink-strong tracking-tight w-full md:w-auto font-semibold">{narrative.title}</h3>
            <CategoryTag category={narrative.category} />
            <TrendMark trend={narrative.trend} />
          </div>
          <p className="text-xs md:text-sm text-ink-muted line-clamp-2 leading-relaxed">{narrative.summary}</p>
          <div className="mt-3 max-w-xs">
            <SignalStrengthBar value={narrative.signalStrength} />
          </div>
        </div>

        <div
          className="text-ink-faint group-hover:text-accent transition-colors duration-150 text-sm mt-1 flex-shrink-0"
          style={{
            transform: expanded ? "rotate(0deg)" : "rotate(-90deg)",
            transition: "transform 200ms cubic-bezier(0.16, 1, 0.3, 1), color 150ms ease",
          }}
        >
          &#9662;
        </div>
      </button>

      <div className="accordion-content" data-open={expanded}>
        <div className="accordion-inner">
          <div className="px-4 pb-4 pt-0 md:px-5 md:pb-5">
            <div className="divider-accent mb-4" />

            {/* Signals */}
            <div className="mb-5">
              <h4 className="text-[9px] font-mono text-ink-faint uppercase tracking-[0.2em] mb-3">Detected Signals</h4>
              <div className="grid gap-2">
                {narrative.signals.map((signal, i) => (
                  <div key={i} className="flex flex-col sm:flex-row items-start gap-1.5 sm:gap-3 text-sm bg-surface-base/50 px-3 py-2.5 border-l border-surface-border">
                    <SignalTypeMark type={signal.type} />
                    <span className="text-ink-muted flex-1 text-xs leading-relaxed">{signal.description}</span>
                    {signal.change && (
                      <span className={`text-xs font-mono tabular-nums ${parseFloat(signal.change) >= 0 ? "text-signal-up" : "text-signal-down"}`}>
                        {parseFloat(signal.change) >= 0 ? "+" : ""}{signal.change}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Build Ideas */}
            <div>
              <h4 className="text-[9px] font-mono text-ink-faint uppercase tracking-[0.2em] mb-3">Build Ideas</h4>
              <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {narrative.buildIdeas.map((idea, i) => (
                  <BuildIdeaCard key={i} idea={idea} />
                ))}
              </div>
            </div>

            {/* Sources */}
            <div className="mt-4 flex items-center gap-2 text-[9px] text-ink-faint font-mono uppercase tracking-[0.15em]">
              <span>Sources</span>
              <div className="flex-1 h-px bg-surface-border" />
              {narrative.sources.map((s, i) => (
                <span key={i} className="px-2 py-0.5 border-b border-ink-ghost">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, change, delay }: { label: string; value: string; change?: string; delay: number }) {
  return (
    <div className="p-3.5 md:p-5 fade-up border-l-2 border-ink-ghost bg-surface-raised" style={{ animationDelay: `${delay}s`, opacity: 0 }}>
      <span className="text-[9px] font-mono text-ink-faint uppercase tracking-[0.2em] block mb-2 md:mb-3">{label}</span>
      <div className="text-xl md:text-2xl font-display text-ink-strong tracking-tight font-bold">{value}</div>
      {change && (
        <div className={`text-xs mt-2 font-mono flex items-center gap-1 ${parseFloat(change) >= 0 ? "text-signal-up" : "text-signal-down"}`}>
          <span className="text-[10px]">{parseFloat(change) >= 0 ? "+" : ""}{Math.abs(parseFloat(change)).toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMethodology, setShowMethodology] = useState(false);

  useEffect(() => {
    fetch("/api/report")
      .then((r) => r.json())
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-base">
        <div className="text-center">
          <div className="relative w-10 h-10 mx-auto mb-6">
            <div className="absolute inset-0 border border-accent/15" />
            <div className="absolute inset-0 border border-transparent border-t-accent" style={{ animation: "spin-slow 1.2s linear infinite" }} />
          </div>
          <p className="font-mono text-xs text-ink-muted tracking-[0.2em] uppercase">Analyzing signals</p>
          <p className="text-[10px] text-ink-faint mt-3 tracking-wider font-mono">DeFi Llama / GitHub / CoinGecko / On-Chain</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-base">
        <div className="p-8 text-center max-w-md bg-surface-raised border-l-2 border-signal-down">
          <p className="text-ink-muted mb-4 text-sm">Failed to load report: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="cursor-pointer px-6 py-2.5 bg-accent/8 border-b-2 border-accent text-accent text-xs font-mono uppercase tracking-[0.15em] hover:bg-accent/15 active:scale-[0.98] transition-all duration-150"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalBuildIdeas = report.narratives.reduce((sum, n) => sum + n.buildIdeas.length, 0);

  return (
    <div className="min-h-screen bg-surface-base text-ink">
      {/* Header - terminal status bar */}
      <header className="sticky top-0 z-50 border-b border-surface-border bg-surface-base/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="4" fill="rgba(0,229,153,0.08)"/>
              <path d="M8 20 L12 12 L16 16 L20 8 L24 14" stroke="#00E599" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="8" cy="20" r="1.5" fill="#00E599" opacity="0.6"/>
              <circle cx="12" cy="12" r="1.5" fill="#00E599" opacity="0.6"/>
              <circle cx="16" cy="16" r="1.5" fill="#00E599" opacity="0.6"/>
              <circle cx="20" cy="8" r="1.5" fill="#00E599" opacity="0.6"/>
              <circle cx="24" cy="14" r="1.5" fill="#00E599" opacity="0.6"/>
            </svg>
            <div>
              <h1 className="font-display text-base tracking-tight text-ink-strong font-bold">SolSignal</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-signal-up rounded-full" style={{ boxShadow: "0 0 6px rgba(0, 229, 153, 0.4)" }} />
              <span className="text-[9px] font-mono text-ink-faint uppercase tracking-[0.15em]">Live</span>
            </div>
            <div className="h-3 w-px bg-surface-border" />
            <span className="text-[9px] text-ink-faint font-mono tracking-wider">
              {new Date(report.generatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Hero - terminal intelligence brief */}
        <div className="mb-10 md:mb-14 fade-up">
          <p className="text-[9px] font-mono text-accent uppercase tracking-[0.3em] mb-4">Fortnight Analysis</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 md:mb-5 tracking-tight text-ink-strong leading-tight">
            {new Date(report.fortnightStart + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric" })}
            <span className="text-ink-faint mx-2">&ndash;</span>
            {new Date(report.fortnightEnd + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </h2>
          <p className="text-ink-muted max-w-xl leading-relaxed text-sm">
            <span className="text-ink font-bold">{report.narratives.length} emerging narratives</span> detected across{" "}
            <span className="text-ink font-bold">{report.narratives.reduce((s, n) => s + n.signals.length, 0)} signals</span>,
            with <span className="text-ink font-bold">{totalBuildIdeas} actionable build ideas</span> generated.
          </p>
        </div>

        {/* Metrics - data terminal boxes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-surface-border mb-10 md:mb-14">
          <MetricCard
            label="Solana TVL"
            value={`$${(report.metrics.totalTVL / 1e9).toFixed(2)}B`}
            change={report.metrics.tvlChange24h?.toFixed(1)}
            delay={0.1}
          />
          <MetricCard label="Narratives" value={String(report.narratives.length)} delay={0.15} />
          <MetricCard label="Build Ideas" value={String(totalBuildIdeas)} delay={0.2} />
          <MetricCard label="Repos Tracked" value={String(report.metrics.topGithubRepos.length)} delay={0.25} />
        </div>

        {/* Narratives */}
        <section className="mb-14">
          <div className="flex items-baseline gap-3 mb-6">
            <h3 className="font-display text-xl md:text-2xl text-ink-strong font-bold">Detected Narratives</h3>
            <div className="flex-1 h-px bg-surface-border mt-1" />
            <span className="text-[9px] font-mono text-ink-faint uppercase tracking-[0.15em]">By signal strength</span>
          </div>
          <div className="space-y-3">
            {report.narratives.map((narrative, i) => (
              <NarrativeCard key={narrative.id} narrative={narrative} index={i} />
            ))}
          </div>
        </section>

        {/* GitHub Repos */}
        {report.metrics.topGithubRepos.length > 0 && (
          <section className="mb-14">
            <div className="flex items-baseline gap-3 mb-6">
              <h3 className="font-display text-xl md:text-2xl text-ink-strong font-bold">Trending Repositories</h3>
              <div className="flex-1 h-px bg-surface-border mt-1" />
            </div>
            <div className="bg-surface-raised overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm mobile-card-table">
                  <thead>
                    <tr className="border-b border-surface-border">
                      {["Repository", "Description", "Stars", "Forks", "Language"].map((h) => (
                        <th key={h} className={`text-[9px] font-mono text-ink-faint uppercase tracking-[0.15em] p-4 font-normal ${h === "Stars" || h === "Forks" ? "text-right" : "text-left"}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {report.metrics.topGithubRepos.slice(0, 10).map((repo, i) => (
                      <tr key={i} className="border-b border-surface-border table-row-hover">
                        <td className="p-4 mobile-primary">
                          <a href={repo.url} target="_blank" rel="noopener noreferrer" className="cursor-pointer text-accent hover:text-accent-muted transition-colors duration-150 text-xs font-mono underline-offset-2 hover:underline">
                            {repo.fullName}
                          </a>
                        </td>
                        <td className="p-4 text-ink-muted max-w-md truncate text-xs mobile-primary" data-label="Desc">{repo.description}</td>
                        <td className="p-4 text-right text-accent/60 font-mono text-xs mobile-secondary" data-label="Stars">{repo.stars.toLocaleString()}</td>
                        <td className="p-4 text-right text-ink-faint font-mono text-xs mobile-secondary" data-label="Forks">{repo.forks.toLocaleString()}</td>
                        <td className="p-4 text-ink-muted text-xs mobile-secondary" data-label="Lang">{repo.language}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Protocols */}
        {report.metrics.topProtocols.length > 0 && (
          <section className="mb-14">
            <div className="flex items-baseline gap-3 mb-6">
              <h3 className="font-display text-xl md:text-2xl text-ink-strong font-bold">Top DeFi Protocols</h3>
              <div className="flex-1 h-px bg-surface-border mt-1" />
            </div>
            <div className="bg-surface-raised overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm mobile-card-table">
                  <thead>
                    <tr className="border-b border-surface-border">
                      {["#", "Protocol", "Category", "TVL", "7d Change"].map((h) => (
                        <th key={h} className={`text-[9px] font-mono text-ink-faint uppercase tracking-[0.15em] p-4 font-normal ${h === "TVL" || h === "7d Change" || h === "#" ? "text-right" : "text-left"}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {report.metrics.topProtocols.map((protocol, i) => (
                      <tr key={i} className="border-b border-surface-border table-row-hover">
                        <td className="p-4 text-ink-ghost font-mono text-xs hidden md:table-cell text-right">{i + 1}</td>
                        <td className="p-4 font-bold text-ink text-xs mobile-primary">{protocol.name}</td>
                        <td className="p-4 text-ink-muted text-xs mobile-secondary" data-label="Cat">{protocol.category}</td>
                        <td className="p-4 font-mono text-xs text-ink mobile-secondary text-right" data-label="TVL">${(protocol.tvl / 1e6).toFixed(1)}M</td>
                        <td className={`p-4 font-mono text-xs mobile-secondary text-right ${protocol.tvlChange7d >= 0 ? "text-signal-up" : "text-signal-down"}`} data-label="7d">
                          {protocol.tvlChange7d >= 0 ? "+" : ""}{protocol.tvlChange7d.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Methodology */}
        <section className="mb-14">
          <button
            onClick={() => setShowMethodology(!showMethodology)}
            className="cursor-pointer flex items-baseline gap-3 group w-full"
          >
            <h3 className="font-display text-xl md:text-2xl text-ink-strong font-bold group-hover:text-accent transition-colors duration-150">Methodology</h3>
            <div className="flex-1 h-px bg-surface-border mt-1" />
            <span
              className="text-ink-faint group-hover:text-accent transition-colors duration-150 text-sm font-mono"
              style={{
                transform: showMethodology ? "rotate(0deg)" : "rotate(-90deg)",
                transition: "transform 200ms cubic-bezier(0.16, 1, 0.3, 1), color 150ms ease",
                display: "inline-block",
              }}
            >
              &#9662;
            </span>
          </button>
          <div className="accordion-content" data-open={showMethodology}>
            <div className="accordion-inner">
              <div className="mt-4 bg-surface-raised p-6 border-l-2 border-surface-border">
                <div className="max-w-none">
                  {report.methodology.split("\n").map((line, i) => {
                    if (line.startsWith("**") && line.endsWith("**")) {
                      return <h4 key={i} className="text-ink font-mono text-[10px] uppercase tracking-[0.15em] mt-5 mb-2 font-semibold">{line.replace(/\*\*/g, "")}</h4>;
                    }
                    if (line.startsWith("- ")) {
                      return <li key={i} className="text-ink-muted ml-4 text-xs leading-relaxed list-disc">{line.slice(2)}</li>;
                    }
                    if (line.match(/^\d+\./)) {
                      return <li key={i} className="text-ink-muted ml-4 list-decimal text-xs leading-relaxed">{line.replace(/^\d+\.\s*/, "")}</li>;
                    }
                    return line ? <p key={i} className="text-ink-muted text-xs leading-relaxed">{line}</p> : <br key={i} />;
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-surface-border pt-8 pb-16 text-center">
          <p className="font-display text-sm text-ink-muted tracking-tight font-bold">
            SolSignal
          </p>
          <p className="text-[9px] text-ink-faint mt-3 tracking-wider font-mono">
            Built for{" "}
            <a href="https://earn.superteam.fun" target="_blank" className="cursor-pointer text-accent/50 hover:text-accent transition-colors duration-150">
              Superteam Earn
            </a>
            {" / "}DeFi Llama / GitHub / CoinGecko / Solana On-Chain
          </p>
          <p className="text-[9px] text-ink-ghost mt-1 tracking-wider font-mono">Refreshed fortnightly. Open source.</p>
        </footer>
      </main>
    </div>
  );
}
