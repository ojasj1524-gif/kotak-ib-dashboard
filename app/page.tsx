"use client";
import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

// ── DATA ──────────────────────────────────────────────────────────────────────
const revenueData = [
  { year: "FY22", revenue: 1100, pat: 95 },
  { year: "FY23", revenue: 1680, pat: 198 },
  { year: "FY24", revenue: 2230, pat: 287 },
  { year: "FY25", revenue: 3210, pat: 419 },
];
const aumData = [
  { label: "FY23", aum: 7499 },
  { label: "FY24", aum: 13000 },
  { label: "FY25", aum: 15700 },
  { label: "2026", aum: 22000 },
];
const shareholdingData = [
  { name: "Institutional", value: 44.53, color: "#1A3A5C" },
  { name: "Promoter",      value: 33.35, color: "#CC0000" },
  { name: "Parent",        value: 21.72, color: "#2E6DA4" },
  { name: "ESOP",          value: 0.40,  color: "#C9973A" },
];
const risks = [
  { category: "Market",      level: "High",   desc: "66% of 2026 IPOs trade below issue price" },
  { category: "Sector",      level: "High",   desc: "MFI portfolio contracted 18.3% YoY in Q3 FY26" },
  { category: "Regulatory",  level: "Medium", desc: "RBI tightening NBFC-MFI norms since June 2025" },
  { category: "Valuation",   level: "Medium", desc: "Peer P/E: 17x–43x (CreditAccess) vs negative (Fusion)" },
  { category: "Supply",      level: "Medium", desc: "₹1,680 Cr unlock April 2026; $68B pipeline" },
  { category: "Integration", level: "Low",    desc: "Merger completed March 2026 — limited combined history" },
];
const milestones = [
  { year: "2012",     title: "Founded",            desc: "Incorporated by Ananya Birla" },
  { year: "2013",     title: "Operations",         desc: "First 100% cashless MFI in India" },
  { year: "2021",     title: "AA− Rating",         desc: "Highest credit rating in MFI sector" },
  { year: "Nov 2023", title: "Chaitanya Acquired", desc: "₹1,479 Cr deal from Navi Group" },
  { year: "Mar 2024", title: "$230M PE Round",     desc: "Advent International & Multiples PE" },
  { year: "Mar 2026", title: "Merger Complete",    desc: "NCLT, RBI & CCI approvals received" },
  { year: "Apr 2026", title: "Kotak Appointed",    desc: "Lead BRLM for upcoming IPO" },
];
const TABS = ["Overview", "Financials", "Deal", "Risks", "Timeline"];
const RISK_CFG: Record<string, { color: string; bg: string; width: string }> = {
  High:   { color: "#CC0000", bg: "#FFF1F1", width: "100%" },
  Medium: { color: "#C9973A", bg: "#FDF3E3", width: "65%"  },
  Low:    { color: "#16a34a", bg: "#F0FDF4", width: "30%"  },
};

// ── HOVER WRAPPER ─────────────────────────────────────────────────────────────
function H({
  children, scale = 1.04, lift = 8, style = {},
}: {
  children: React.ReactNode;
  scale?: number;
  lift?: number;
  style?: React.CSSProperties;
}) {
  const [on, setOn] = useState(false);
  return (
    <div
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      style={{
        ...style,
        transform: on ? `translateY(-${lift}px) scale(${scale})` : "translateY(0) scale(1)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "default",
        zIndex: on ? 10 : 1,
        position: "relative",
        boxShadow: on
          ? "0 24px 48px rgba(26,58,92,0.18)"
          : (style.boxShadow as string) || "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {children}
    </div>
  );
}

// ── TOOLTIP ───────────────────────────────────────────────────────────────────
function Tip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12,
      padding: "10px 14px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#1A3A5C", marginBottom: 6 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
          <span style={{ fontSize: 11, color: "#6B7280" }}>{p.name}:</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#1A3A5C" }}>₹{p.value} Cr</span>
        </div>
      ))}
    </div>
  );
}

// ── LABEL ─────────────────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
      <div style={{ width: 4, height: 22, background: "#CC0000", borderRadius: 2 }} />
      <span style={{ fontSize: 18, fontWeight: 800, color: "#1A3A5C", letterSpacing: "-0.3px" }}>
        {children}
      </span>
    </div>
  );
}

// ── KPI CARD ──────────────────────────────────────────────────────────────────
function Kpi({ label, value, sub, badge, up, highlight }: {
  label: string; value: string; sub?: string;
  badge?: string; up?: boolean; highlight?: boolean;
}) {
  return (
    <H
      scale={1.05}
      lift={8}
      style={{
        background: highlight ? "linear-gradient(135deg,#1A3A5C,#2E6DA4)" : "#fff",
        borderRadius: 20,
        padding: "24px 24px 20px",
        border: highlight ? "none" : "1px solid #F3F4F6",
        boxShadow: highlight ? "0 8px 24px rgba(26,58,92,0.25)" : "0 1px 4px rgba(0,0,0,0.04)",
        overflow: "hidden",
      }}
    >
      {highlight && (
        <div style={{
          position: "absolute", width: 100, height: 100, borderRadius: "50%",
          background: "rgba(255,255,255,0.05)", top: -20, right: -20, pointerEvents: "none",
        }} />
      )}
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
        color: highlight ? "rgba(255,255,255,0.6)" : "#9CA3AF", marginBottom: 10,
      }}>{label}</div>
      <div style={{
        fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px",
        color: highlight ? "#fff" : "#1A3A5C", marginBottom: 4,
      }}>{value}</div>
      {sub && (
        <div style={{ fontSize: 11, color: highlight ? "rgba(255,255,255,0.5)" : "#9CA3AF" }}>{sub}</div>
      )}
      {badge && (
        <div style={{
          display: "inline-block", marginTop: 10, fontSize: 10, fontWeight: 700,
          padding: "3px 10px", borderRadius: 20,
          background: up ? "rgba(22,163,74,0.12)" : "rgba(204,0,0,0.1)",
          color: up ? "#16a34a" : "#CC0000",
        }}>{badge}</div>
      )}
    </H>
  );
}

// ── LEGEND DOT ────────────────────────────────────────────────────────────────
function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 24, height: 3, borderRadius: 2, background: color }} />
      <span style={{ fontSize: 11, color: "#9CA3AF" }}>{label}</span>
    </div>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [active, setActive] = useState("Overview");

  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FC", fontFamily: "Arial, sans-serif" }}>

      {/* NAV */}
      <nav style={{
        background: "#1A3A5C", position: "sticky", top: 0, zIndex: 50,
        boxShadow: "0 2px 20px rgba(0,0,0,0.2)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 32px",
          height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, background: "#fff", borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "#CC0000", fontWeight: 900, fontSize: 16 }}>K</span>
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>kotak</div>
              <div style={{ color: "#7BAFD4", fontSize: 9, letterSpacing: "0.15em" }}>INVESTMENT BANKING</div>
            </div>
          </div>

          <div style={{
            display: "flex", background: "rgba(255,255,255,0.08)",
            borderRadius: 12, padding: 4, gap: 2,
          }}>
            {TABS.map(t => (
              <TabBtn key={t} label={t} active={active === t} onClick={() => setActive(t)} />
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%", background: "#4ade80",
            }} />
            <span style={{ color: "#7BAFD4", fontSize: 11 }}>Live</span>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{
        background: "linear-gradient(135deg,#0D2137 0%,#1A3A5C 50%,#1E4D7B 100%)",
        padding: "64px 32px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-end", flexWrap: "wrap", gap: 32,
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 32, height: 2, background: "#CC0000", borderRadius: 2 }} />
                <span style={{ color: "#7BAFD4", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em" }}>
                  DEAL ANALYSIS · APRIL 2026
                </span>
              </div>
              <h1 style={{ color: "#fff", fontSize: 48, fontWeight: 800, lineHeight: 1.1, margin: "0 0 6px", letterSpacing: "-1px" }}>
                Svatantra Microfin
              </h1>
              <h1 style={{ color: "#C9973A", fontSize: 48, fontWeight: 800, lineHeight: 1.1, margin: "0 0 20px", letterSpacing: "-1px" }}>
                IPO
              </h1>
              <p style={{ color: "#7BAFD4", fontSize: 14, margin: 0 }}>
                Lead BRLM: <span style={{ color: "#fff", fontWeight: 600 }}>Kotak Mahindra Capital</span>
                &nbsp;·&nbsp; Co-Lead: <span style={{ color: "#fff", fontWeight: 600 }}>Axis Capital</span>
              </p>
            </div>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[
                { label: "TARGET RAISE",    value: "₹2,500 Cr",  note: "~$250 Million", accent: "#C9973A" },
                { label: "POST-MERGER AUM", value: "₹22,000 Cr", note: "March 2026",     accent: "#fff"    },
                { label: "STATUS",          value: "Pre-DRHP",   note: "Q2/Q3 2026",     accent: "#4ade80" },
              ].map(s => (
                <H key={s.label} scale={1.06} lift={6} style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 16, padding: "20px 24px", minWidth: 140,
                  boxShadow: "none",
                }}>
                  <div style={{ color: "#7BAFD4", fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", marginBottom: 8 }}>
                    {s.label}
                  </div>
                  <div style={{ color: s.accent, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>
                    {s.value}
                  </div>
                  <div style={{ color: "#7BAFD4", fontSize: 10, marginTop: 4 }}>{s.note}</div>
                </H>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px" }}>

        {/* KPIs */}
        {(active === "Overview" || active === "Financials") && (
          <section style={{ marginBottom: 56 }}>
            <Label>Key Metrics</Label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 20 }}>
              <Kpi label="AUM"          value="₹22,000 Cr" sub="Post-Merger · Mar 2026"    badge="+40%"  up highlight />
              <Kpi label="Revenue FY25" value="₹3,210 Cr"  sub="44% CAGR"                  badge="+44%"  up />
              <Kpi label="PAT FY25"     value="₹419 Cr"    sub="Q3 FY26: ₹72.65 Cr"        badge="+300%" up />
              <Kpi label="Borrowers"    value="5 Million"  sub="2,200 branches · 20 states" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
              <Kpi label="Credit Rating"    value="AA−"         sub="Highest in MFI sector" />
              <Kpi label="Employees"        value="25,000+"     sub="Post-merger" />
              <Kpi label="PE Backing"       value="$230M"       sub="Advent + Multiples 2024" />
              <Kpi label="Total Disbursals" value="₹70,000 Cr" sub="Since inception 2013" />
            </div>
          </section>
        )}

        {/* Charts */}
        {(active === "Overview" || active === "Financials") && (
          <section style={{ marginBottom: 56 }}>
            <Label>Financial Performance</Label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <H scale={1.02} lift={6} style={{
                background: "#fff", borderRadius: 20,
                border: "1px solid #F3F4F6", padding: 28,
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1A3A5C", marginBottom: 4 }}>Revenue vs PAT</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 16 }}>₹ Crore · FY22–FY25</div>
                <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
                  <LegendDot color="#2E6DA4" label="Revenue" />
                  <LegendDot color="#CC0000" label="PAT" />
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2E6DA4" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#2E6DA4" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#CC0000" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#CC0000" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<Tip />} />
                    <Area type="monotone" dataKey="revenue" stroke="#2E6DA4" fill="url(#gR)" strokeWidth={2.5} name="Revenue" dot={false} />
                    <Area type="monotone" dataKey="pat"     stroke="#CC0000" fill="url(#gP)" strokeWidth={2.5} name="PAT"     dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </H>

              <H scale={1.02} lift={6} style={{
                background: "#fff", borderRadius: 20,
                border: "1px solid #F3F4F6", padding: 28,
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1A3A5C", marginBottom: 4 }}>AUM Growth</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 16 }}>₹ Crore · FY23 → Post-Merger</div>
                <ResponsiveContainer width="100%" height={228}>
                  <BarChart data={aumData} barSize={40} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<Tip />} />
                    <Bar dataKey="aum" name="AUM" radius={[8, 8, 0, 0]}>
                      {aumData.map((_, i) => (
                        <Cell key={i} fill={i === aumData.length - 1 ? "#CC0000" : "#2E6DA4"}
                          opacity={i === aumData.length - 1 ? 1 : 0.65} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </H>
            </div>
          </section>
        )}

        {/* Deal */}
        {(active === "Overview" || active === "Deal") && (
          <section style={{ marginBottom: 56 }}>
            <Label>Deal Structure</Label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

              <H scale={1.02} lift={5} style={{
                background: "#fff", borderRadius: 20,
                border: "1px solid #F3F4F6", padding: 28,
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1A3A5C", marginBottom: 4 }}>Pre-IPO Shareholding</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 8 }}>Ownership breakdown</div>
                <ResponsiveContainer width="100%" height={210}>
                  <PieChart>
                    <Pie data={shareholdingData} cx="50%" cy="50%"
                      innerRadius={60} outerRadius={88} dataKey="value" paddingAngle={4} stroke="none">
                      {shareholdingData.map((s, i) => <Cell key={i} fill={s.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
                  {shareholdingData.map(s => (
                    <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
                      <span style={{ fontSize: 11, color: "#6B7280" }}>{s.name}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#1A3A5C" }}>{s.value}%</span>
                    </div>
                  ))}
                </div>
              </H>

              <H scale={1.02} lift={5} style={{
                background: "#fff", borderRadius: 20,
                border: "1px solid #F3F4F6", padding: 28,
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1A3A5C", marginBottom: 4 }}>Transaction Parameters</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 20 }}>Key deal terms</div>
                {[
                  ["Deal Size",    "₹2,000–2,500 Cr"],
                  ["Equivalent",  "~$250 Million"],
                  ["Structure",   "Fresh Issue + OFS"],
                  ["Lead BRLM",   "Kotak Mahindra Capital"],
                  ["Co-Lead",     "Axis Capital Ltd."],
                  ["OFS Sellers", "Advent Int'l · Multiples PE"],
                  ["Peer P/E",    "17x–43x (CreditAccess)"],
                  ["DRHP Target", "Q2/Q3 2026"],
                ].map(([k, v], i, arr) => (
                  <DealRow key={k} k={k} v={v} last={i === arr.length - 1} />
                ))}
              </H>

            </div>
          </section>
        )}

        {/* Risks */}
        {(active === "Overview" || active === "Risks") && (
          <section style={{ marginBottom: 56 }}>
            <Label>Risk Assessment</Label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
              {risks.map(r => <RiskCard key={r.category} r={r} />)}
            </div>
          </section>
        )}

        {/* Timeline */}
        {active === "Timeline" && (
          <section>
            <Label>Company Timeline</Label>
            <div style={{ maxWidth: 640 }}>
              {milestones.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 20, marginBottom: 8 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: i === milestones.length - 1
                        ? "linear-gradient(135deg,#CC0000,#A30000)"
                        : "linear-gradient(135deg,#1A3A5C,#2E6DA4)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    }}>
                      <span style={{ color: "#fff", fontSize: 11, fontWeight: 800 }}>{i + 1}</span>
                    </div>
                    {i < milestones.length - 1 && (
                      <div style={{ width: 1, flex: 1, minHeight: 20, background: "#E5E7EB", margin: "4px 0" }} />
                    )}
                  </div>
                  <H scale={1.02} lift={4} style={{
                    background: "#fff", borderRadius: 16, padding: "16px 20px", flex: 1,
                    border: "1px solid #F3F4F6", marginBottom: 8,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#1A3A5C" }}>{m.title}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, color: "#CC0000",
                        background: "#FFF1F1", padding: "3px 10px", borderRadius: 20,
                      }}>{m.year}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>{m.desc}</p>
                  </H>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* FOOTER */}
      <footer style={{ background: "#0D2137", padding: "28px 32px", marginTop: 32 }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 28, height: 28, background: "rgba(255,255,255,0.08)",
              borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "#CC0000", fontWeight: 900, fontSize: 12 }}>K</span>
            </div>
            <span style={{ color: "#f3f5f7", fontSize: 12 }}>Kotak Investment Banking</span>
          </div>
          <span style={{ color: "#4A6A8A", fontSize: 11 }}>
            Deal Analysis Dashboard · Built by <span style={{ color: "#7BAFD4", fontWeight: 700 }}>Ojas Joshi</span> · Kotak Analyst Program Application · April 2026
          </span>
        </div>
      </footer>

    </div>
  );
}

// ── SMALL COMPONENTS ──────────────────────────────────────────────────────────
function TabBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const [on, setOn] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      style={{
        padding: "8px 18px", borderRadius: 9, border: "none", cursor: "pointer",
        fontSize: 12, fontWeight: 600,
        background: active ? "#CC0000" : on ? "rgba(255,255,255,0.15)" : "transparent",
        color: active ? "#fff" : "#7BAFD4",
        transform: on && !active ? "scale(1.05)" : "scale(1)",
        transition: "all 0.2s ease",
      }}
    >
      {label}
    </button>
  );
}

function DealRow({ k, v, last }: { k: string; v: string; last: boolean }) {
  const [on, setOn] = useState(false);
  return (
    <div
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: on ? "11px 12px" : "11px 8px",
        borderBottom: last ? "none" : "1px solid #F3F4F6",
        background: on ? "#F7F8FC" : "transparent",
        borderRadius: on ? 8 : 0,
        transition: "all 0.15s ease",
      }}
    >
      <span style={{ fontSize: 12, color: "#9CA3AF" }}>{k}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: "#1A3A5C" }}>{v}</span>
    </div>
  );
}

function RiskCard({ r }: { r: typeof risks[0] }) {
  const [on, setOn] = useState(false);
  const cfg = RISK_CFG[r.level];
  return (
    <div
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      style={{
        background: "#fff", borderRadius: 16, border: `1px solid ${on ? "#2E6DA4" : "#F3F4F6"}`,
        padding: 24,
        boxShadow: on ? "0 16px 32px rgba(26,58,92,0.12)" : "0 1px 4px rgba(0,0,0,0.04)",
        transform: on ? "translateY(-6px) scale(1.03)" : "translateY(0) scale(1)",
        transition: "all 0.2s ease",
        zIndex: on ? 10 : 1,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1A3A5C" }}>{r.category}</span>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: "3px 10px",
          borderRadius: 20, background: cfg.bg, color: cfg.color,
        }}>{r.level}</span>
      </div>
      <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6, margin: "0 0 16px" }}>{r.desc}</p>
      <div style={{ height: 4, background: "#F3F4F6", borderRadius: 4 }}>
        <div style={{ height: "100%", width: cfg.width, background: cfg.color, borderRadius: 4, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}