'use client'

import { useState, useEffect } from "react";

const C = {
  red: "#E24B4A", amber: "#BA7517", green: "#639922",
  blue: "#378ADD", teal: "#1D9E75", gray: "#888780",
  lightGray: "#D3D1C7",
};

const fmt  = (n) => "$" + Math.round(n).toLocaleString();
const fmtM = (n) => "$" + (Math.round(n * 10) / 10).toFixed(1) + "M";

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{
      background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)",
      padding: "1.1rem 1.25rem", display: "flex", flexDirection: "column", gap: 5,
      borderTop: `3px solid ${color || "transparent"}`,
    }}>
      <span style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</span>
      <span style={{ fontSize: 30, fontWeight: 500, color: color || "var(--color-text-primary)", lineHeight: 1.05 }}>{value}</span>
      {sub && <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{sub}</span>}
    </div>
  );
}

function Section({ id, eyebrow, title, description, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section id={id} style={{ borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: "2rem", marginBottom: "1rem" }}>
      <button
        onClick={() => setOpen(o => !o)} aria-expanded={open}
        style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 6 }}>{eyebrow}</div>
          <h2 style={{ fontSize: 24, fontWeight: 500, margin: "0 0 0.5rem", color: "var(--color-text-primary)", lineHeight: 1.2 }}>{title}</h2>
          {!open && description && <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6, maxWidth: 560, opacity: 0.8 }}>{description}</p>}
        </div>
        <span style={{
          flexShrink: 0, marginTop: 4, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
          border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)",
          color: "var(--color-text-secondary)", fontSize: 14,
          transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s",
        }}>↓</span>
      </button>
      {open && (
        <div style={{ marginTop: "1.5rem", paddingBottom: "2rem" }}>
          {description && <p style={{ fontSize: 16, color: "var(--color-text-secondary)", margin: "0 0 1.75rem", lineHeight: 1.7, maxWidth: 580 }}>{description}</p>}
          {children}
        </div>
      )}
    </section>
  );
}

function TBar({ label, value, barPct, offsetPct = 0, color, tip, height = 26 }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
      <div style={{ width: 175, fontSize: 13, color: "var(--color-text-secondary)", textAlign: "right", flexShrink: 0, lineHeight: 1.3 }}>{label}</div>
      <div style={{ flex: 1, position: "relative", height }}>
        <div style={{ position: "absolute", inset: 0, background: "var(--color-border-tertiary)", borderRadius: 4 }} />
        <div
          onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
          aria-label={tip || `${label}: ${value}`}
          style={{
            position: "absolute", left: `${offsetPct}%`, width: `${Math.max(barPct, 0.5)}%`, height: "100%",
            background: color, borderRadius: 4, display: "flex", alignItems: "center",
            opacity: hov ? 1 : 0.85, transition: "opacity 0.15s", cursor: "pointer",
          }}
        >
          {barPct > 12 && <span style={{ fontSize: 12, fontWeight: 500, color: "#fff", padding: "0 8px", whiteSpace: "nowrap" }}>{value}</span>}
        </div>
        {hov && (
          <div style={{
            position: "absolute", bottom: "calc(100% + 6px)", left: `${Math.min(offsetPct + barPct / 2, 70)}%`,
            transform: "translateX(-50%)",
            background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-secondary)",
            borderRadius: "var(--border-radius-md)", padding: "5px 10px",
            fontSize: 12, color: "var(--color-text-primary)", whiteSpace: "nowrap",
            zIndex: 10, pointerEvents: "none", lineHeight: 1.4,
          }}>
            {tip || `${label}: ${value}`}
          </div>
        )}
        {barPct <= 12 && (
          <span style={{ position: "absolute", left: `${offsetPct + barPct + 1}%`, top: "50%", transform: "translateY(-50%)", fontSize: 12, fontWeight: 500, color: "var(--color-text-primary)", whiteSpace: "nowrap" }}>{value}</span>
        )}
      </div>
    </div>
  );
}

function Note({ children, accent }) {
  return (
    <div style={{ marginTop: "1.25rem", padding: "1rem 1.25rem", borderLeft: `3px solid ${accent || "var(--color-border-secondary)"}`, background: "var(--color-background-secondary)", borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0" }}>
      <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>{children}</p>
    </div>
  );
}

function Card({ children, style }) {
  return <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.5rem", ...style }}>{children}</div>;
}

function CLabel({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--color-text-secondary)", marginBottom: "1rem" }}>{children}</div>;
}

function Legend({ items }) {
  return (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: "1rem", fontSize: 12, color: "var(--color-text-secondary)" }}>
      {items.map(l => (
        <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: l.color, display: "inline-block", opacity: l.dim ? 0.4 : 1 }} />{l.label}
        </span>
      ))}
    </div>
  );
}

function StatGrid({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: "1.75rem" }}>{children}</div>;
}

/* ─── SECTION COMPONENTS ─── */

function ShortfallSection() {
  const steps = [
    { label: "Projected revenue",    value: 264.3,  color: C.teal,  isTotal: true,  tip: "Projected general fund revenue for FY2027" },
    { label: "Spending requests",    value: -41.3,  color: C.red,   off: 223.0/310, tip: "Gap: departments requested $305.6M total" },
    { label: "New tax revenue",      value: 16.2,   color: C.blue,  off: 223.0/310, tip: "Rate increases: RE, personal property, meals, vehicle" },
    { label: "Reserve draws",        value: 13.3,   color: C.amber, off: 239.2/310, tip: "Draws from proffer, animal shelter, and capital reserves" },
    { label: "Spending reductions",  value: 11.7,   color: C.green, off: 252.5/310, tip: "Cuts to operations, capital, and school operating funds" },
    { label: "Final proposed budget",value: 293.9,  color: C.teal,  isTotal: true,  tip: "Final balanced proposed budget for FY2027" },
  ];
  const max = 310;
  return (
    <>
      <StatGrid>
        <StatCard label="Projected revenue"  value="$264.3M" />
        <StatCard label="Requested spending" value="$305.6M" />
        <StatCard label="Shortfall"          value="$41.3M"  color={C.red} />
        <StatCard label="Final proposed"     value="$293.9M" color={C.teal} />
      </StatGrid>
      <Card>
        <CLabel>How the gap was closed. Hover over each bar for detail</CLabel>
        {steps.map((s, i) => (
          <TBar key={i} label={s.label} value={fmtM(Math.abs(s.value))}
            barPct={Math.abs(s.value) / max * 100} offsetPct={s.isTotal ? 0 : (s.off || 0) * 100}
            color={s.color} tip={s.tip} />
        ))}
        <Legend items={[
          { color: C.teal, label: "Baseline / final" }, { color: C.red, label: "Shortfall" },
          { color: C.blue, label: "New tax revenue" }, { color: C.amber, label: "Reserve draws" },
          { color: C.green, label: "Spending cuts" },
        ]} />
      </Card>
      <Note>The county drew $13.3M from reserves, including $7.5M from the Capital Fund, to avoid larger tax increases. The Capital Fund shows a $31M balance but carries $16.1M in prior commitments, leaving $7.4M actually available for future needs.</Note>
    </>
  );
}

function TaxCalculator() {
  const [home, setHome] = useState(350000);
  const [car,  setCar]  = useState(25000);
  const [meals,setMeals]= useState(400);

  const reDiff    = home  * (0.0053 - 0.0048);
  const ppDiff    = car   * (0.0435 - 0.0423);
  const mealsDiff = meals * 12 * 0.02;
  const total     = reDiff + ppDiff + mealsDiff + 5;

  const rows = [
    { label: "Real estate tax",       cur: "$0.48/$100", prop: "$0.53/$100", ann: reDiff,    note: `On ${fmt(home)} home` },
    { label: "Personal property tax", cur: "$4.23/$100", prop: "$4.35/$100", ann: ppDiff,    note: `On ${fmt(car)} vehicle` },
    { label: "Meals tax",             cur: "4%",          prop: "6%",         ann: mealsDiff, note: `$${meals}/mo dining` },
    { label: "Vehicle license fee",   cur: "$25",         prop: "$30",        ann: 5,         note: "Per vehicle" },
  ];

  const Sl = ({ label, min, max, step, val, set, disp }) => (
    <div style={{ marginBottom: "1.1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <label style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{label}</label>
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>{disp}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={val} onChange={e => set(+e.target.value)} style={{ width: "100%" }} aria-label={label} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>
        <span>{fmt(min)}</span><span>{fmt(max)}</span>
      </div>
    </div>
  );

  return (
    <>
      <Card style={{ marginBottom: "1.25rem" }}>
        <CLabel>Adjust your household values</CLabel>
        <Sl label="Home assessed value"          min={100000} max={900000} step={5000} val={home}  set={setHome}  disp={fmt(home)} />
        <Sl label="Vehicle assessed value"        min={5000}  max={80000}  step={1000} val={car}   set={setCar}   disp={fmt(car)} />
        <Sl label="Monthly restaurant spending"   min={50}    max={1500}   step={25}   val={meals} set={setMeals} disp={`$${meals}`} />
      </Card>
      <StatGrid>
        <StatCard label="Annual increase"  value={fmt(total)}        color={C.red} />
        <StatCard label="Monthly impact"   value={fmt(total / 12)}   sub="per month added" />
        <StatCard label="Real estate only" value={fmt(reDiff)}       color={C.amber} sub="annual" />
        <StatCard label="Meals tax only"   value={fmt(mealsDiff)}    sub="annual" />
      </StatGrid>
      <Card>
        <CLabel>Breakdown by tax type</CLabel>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "0.5px solid var(--color-border-secondary)" }}>
                {["Tax", "Current", "Proposed", "Your annual +", ""].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px 10px", color: "var(--color-text-secondary)", fontWeight: 400, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                  <td style={{ padding: "11px 10px", fontWeight: 500, color: "var(--color-text-primary)" }}>{r.label}</td>
                  <td style={{ padding: "11px 10px", color: "var(--color-text-secondary)", fontSize: 13 }}>{r.cur}</td>
                  <td style={{ padding: "11px 10px", color: C.amber, fontWeight: 500, fontSize: 13 }}>{r.prop}</td>
                  <td style={{ padding: "11px 10px", fontWeight: 500, color: C.red, fontSize: 15 }}>{fmt(r.ann)}</td>
                  <td style={{ padding: "11px 10px", fontSize: 12, color: "var(--color-text-secondary)" }}>{r.note}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} style={{ padding: "11px 10px", fontWeight: 500, color: "var(--color-text-primary)" }}>Total annual increase</td>
                <td style={{ padding: "11px 10px", fontWeight: 500, color: C.red, fontSize: 17 }}>{fmt(total)}</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
      <Note>Even after proposed increases, Frederick&apos;s real estate tax rate ($0.53) remains among the lowest in Virginia, below Warren, Shenandoah, Winchester, and every similar-population locality. The question for residents is whether the structural causes of the shortfall are being addressed, or whether reserves are being drawn down to delay harder choices.</Note>
    </>
  );
}

function SpendingCutsSection() {
  const cuts = [
    { label: "Schools: operating",   pct: 9.1/11.7*100, val: "$9.1M", tip: "School board requested $18.2M additional; county approved $9.1M" },
    { label: "County capital",        pct: 5.5/11.7*100, val: "$5.5M", tip: "County capital reduced from $12.1M to $6.6M requested" },
    { label: "11 new positions (FTE)",pct: 1.4/11.7*100, val: "$1.4M", tip: "11 new full-time positions requested but not funded" },
    { label: "Dept. budget cuts",     pct: 1.2/11.7*100, val: "$1.2M", tip: "Cuts distributed across county departments" },
    { label: "VRS rate adjustment",   pct: 0.7/11.7*100, val: "$0.7M", tip: "Virginia Retirement System rate reduction" },
    { label: "Health insurance adj.", pct: 0.7/11.7*100, val: "$0.7M", tip: "Adjustment to county health insurance line" },
    { label: "Outside agencies",      pct: 0.1/11.7*100, val: "$0.1M", tip: "Outside agency funding reduced from $4.1M to $4.0M" },
  ];
  return (
    <>
      <StatGrid>
        <StatCard label="Total reductions" value="$11.7M"  color={C.red} />
        <StatCard label="Schools took"     value="$9.1M"   color={C.amber} sub="78% of all cuts" />
        <StatCard label="Capital cut"      value="$5.5M"   sub="from county capital" />
        <StatCard label="Positions denied" value="11 FTE"  sub="new positions" />
      </StatGrid>
      <Card>
        <CLabel>Where the $11.7M in reductions landed. Hover bars</CLabel>
        {cuts.map((c, i) => (
          <TBar key={i} label={c.label} value={c.val} barPct={c.pct} color={i === 0 ? C.red : C.amber} tip={c.tip} height={24} />
        ))}
      </Card>
      <Note accent={C.red}>Schools absorbed $9.1M, which is 78% of all reductions, despite FCPS needing the funds for health insurance increases, compliance staffing, and teacher salary improvements. The school board warned that if funding fell to $6M, it would need to eliminate between 11 and 40 existing positions.</Note>
    </>
  );
}

function SchoolFundingSection() {
  const hist = [
    { y: "FY17", req: 10.0, app: 3.0 }, { y: "FY18", req: 5.7, app: 2.3 },
    { y: "FY19", req: 5.8, app: 5.1 },  { y: "FY20", req: 9.4, app: 4.0 },
    { y: "FY21", req: 10.9, app: 1.9 }, { y: "FY22", req: 6.7, app: 4.6 },
    { y: "FY23", req: 4.7, app: 2.6 },  { y: "FY24", req: 9.6, app: 9.2 },
    { y: "FY25", req: 8.0, app: 5.0 },  { y: "FY26", req: 8.7, app: 4.2 },
    { y: "FY27", req: 18.2, app: 9.1 },
  ];
  const sals = [
    { n: "Loudoun", s: 60553 }, { n: "Clarke", s: 54312 },
    { n: "Frederick", s: 54000, fc: true }, { n: "Shenandoah", s: 53312 },
    { n: "Winchester", s: 53000 }, { n: "Warren", s: 52919 },
    { n: "Page", s: 50710 }, { n: "Fauquier", s: 50000 },
  ].sort((a, b) => b.s - a.s);
  const maxB = 20, maxS = 65000;

  return (
    <>
      <StatGrid>
        <StatCard label="FY27 FCPS request" value="$18.2M" color={C.red}   sub="additional operating" />
        <StatCard label="County approved"   value="$9.1M"  color={C.amber} sub="additional operating" />
        <StatCard label="Funding rate"      value="95.3%"                   sub="of total FCPS ask" />
        <StatCard label="YOY increase"      value="+9.1%"  color={C.teal}  sub="vs FY26 budgeted" />
      </StatGrid>
      <Card style={{ marginBottom: "1.25rem" }}>
        <CLabel>Additional county operating funds: requested vs. approved (FY17–FY27, $M). Hover over bars</CLabel>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 180 }}>
          {hist.map((d, i) => {
            const cur = d.y === "FY27";
            const rH = d.req / maxB * 160, aH = d.app / maxB * 160;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "100%", display: "flex", gap: 1, alignItems: "flex-end", height: 160 }}>
                  <div title={`${d.y} requested: ${fmtM(d.req)}`} style={{ flex: 1, height: rH, background: cur ? C.red : C.lightGray, borderRadius: "2px 2px 0 0", opacity: 0.9, cursor: "pointer" }} />
                  <div title={`${d.y} approved: ${fmtM(d.app)}`}  style={{ flex: 1, height: aH, background: cur ? C.amber : C.teal,    borderRadius: "2px 2px 0 0", opacity: 0.9, cursor: "pointer" }} />
                </div>
                <div style={{ fontSize: 9, color: "var(--color-text-secondary)", marginTop: 3, textAlign: "center" }}>{d.y.replace("FY", "")}</div>
              </div>
            );
          })}
        </div>
        <Legend items={[
          { color: C.lightGray, label: "Requested (historical)" }, { color: C.teal, label: "Approved (historical)" },
          { color: C.red, label: "FY27 requested" }, { color: C.amber, label: "FY27 approved" },
        ]} />
      </Card>
      <Card>
        <CLabel>FY26 starting teacher salary, 30-mile VA peer group, bachelor&apos;s degree</CLabel>
        {sals.map((d, i) => (
          <TBar key={i} label={d.n} value={`$${(d.s/1000).toFixed(0)}K`}
            barPct={d.s / maxS * 100} color={d.fc ? C.amber : C.gray}
            tip={`${d.n}: $${d.s.toLocaleString()} starting salary`} height={22} />
        ))}
        <Note>Frederick ranks 3rd of 8 in starting salary. FCPS data shows experienced teacher pay falls further below the regional average as years of service increase. The gap widens over a career, it doesn&apos;t stay flat.</Note>
      </Card>
    </>
  );
}

function LCISection() {
  const data = [
    { p: "2016–18", lci: 38.89 }, { p: "2018–20", lci: 38.98 },
    { p: "2020–22", lci: 41.20 }, { p: "2022–24", lci: 41.41 },
    { p: "2024–26", lci: 41.51 }, { p: "2026–28", lci: 42.04 },
  ];
  return (
    <>
      <StatGrid>
        <StatCard label="LCI 2016"        value="38.89%" sub="county's share" />
        <StatCard label="LCI 2026"        value="42.04%" color={C.amber} sub="county's share" />
        <StatCard label="New cost shift"  value="$0.9M"  color={C.red}   sub="state → county, FY27" />
        <StatCard label="State pays now"  value="57.96%" sub="down from 61.11% in 2016" />
      </StatGrid>
      <Card>
        <CLabel>County vs. state share of education costs. Hover for detail</CLabel>
        {data.map((d, i) => {
          const cur = i === data.length - 1;
          return (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
                <span style={{ color: "var(--color-text-secondary)" }}>{d.p}</span>
                <span style={{ color: cur ? C.amber : "var(--color-text-primary)", fontWeight: cur ? 500 : 400 }}>
                  County {d.lci.toFixed(2)}% · State {(100 - d.lci).toFixed(2)}%
                </span>
              </div>
              <div title={`${d.p}: county pays ${d.lci.toFixed(2)}%, state pays ${(100-d.lci).toFixed(2)}%`} style={{ height: 14, borderRadius: 3, display: "flex", overflow: "hidden", cursor: "pointer" }}>
                  <div style={{ width: `${d.lci}%`, background: cur ? C.amber : C.blue, opacity: 0.85 }} />
                  <div style={{ flex: 1, background: "var(--color-border-tertiary)" }} />
                </div>
            </div>
          );
        })}
        <Legend items={[{ color: C.blue, label: "County share (historical)" }, { color: C.amber, label: "County share (2026–28)" }]} />
      </Card>
      <Note>The LCI is automatic and outside the county&apos;s control. Every time Frederick&apos;s property values or incomes rise, the state cuts its education contribution. This structural dynamic means the education funding gap will keep growing unless the county raises its own revenue accordingly.</Note>
    </>
  );
}

function ShortfallScenariosSection() {
  const [act, setAct] = useState("A");
  const sc = {
    A: {
      sub: "County funds $6M · No salary increase",
      funded: ["Health insurance (employer + employee)", "Compliance positions (speech pathologists, ELL teachers)"],
      cut: [
        { i: "No salary increase for any staff", x: "~2,586 employees" },
        { i: "No new positions", x: "13 FTE dropped" },
        { i: "No virtual school or summer expansion", x: "$220K in programs" },
        { i: "No additional school bus", x: "$155K" },
        { i: "Dept/school budgets cut 10%", x: "Est. ~$2.5M reduction" },
        { i: "11 existing positions eliminated", x: "To fund compliance" },
      ],
    },
    B: {
      sub: "County funds $6M · 2% salary increase",
      funded: ["Health insurance", "2% salary increase (with state matching)", "Compliance positions (speech, ELL)"],
      cut: [
        { i: "No new positions", x: "13 FTE dropped" },
        { i: "No virtual school or summer expansion", x: "$220K in programs" },
        { i: "No additional school bus", x: "$155K" },
        { i: "Dept/school budgets cut 15%", x: "Est. ~$3.75M reduction" },
        { i: "29 existing positions eliminated", x: "Net job losses" },
      ],
    },
    C: {
      sub: "County funds $6M · 3% salary increase",
      funded: ["Health insurance", "3% salary increase", "Compliance positions (speech, ELL)"],
      cut: [
        { i: "No new positions", x: "13 FTE dropped" },
        { i: "No virtual school or summer expansion", x: "$220K in programs" },
        { i: "No additional bus + reduce replacements by 4", x: "Fleet aging accelerates" },
        { i: "Dept/school budgets cut 15%", x: "Est. ~$3.75M reduction" },
        { i: "~40 existing positions eliminated", x: "Largest net job loss" },
      ],
    },
  };
  const s = sc[act];
  return (
    <>
      <p style={{ fontSize: 15, color: "var(--color-text-secondary)", lineHeight: 1.7, margin: "0 0 1.5rem", maxWidth: 560 }}>
        Before the final budget, FCPS presented three scenarios showing required cuts if the county provided only $6M of the $18.2M request. The county ultimately approved $9.1M, so these didn&apos;t fully materialize, but they show the stakes of the ongoing funding gap.
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
        {["A", "B", "C"].map(k => (
          <button key={k} onClick={() => setAct(k)} aria-pressed={act === k} style={{
            padding: "9px 22px", cursor: "pointer", fontSize: 14, fontWeight: act === k ? 500 : 400,
            color: "var(--color-text-primary)", borderRadius: "var(--border-radius-md)",
            border: `0.5px solid ${act === k ? "var(--color-border-primary)" : "var(--color-border-tertiary)"}`,
            background: act === k ? "var(--color-background-secondary)" : "none", transition: "all 0.15s",
          }}>Scenario {k}</button>
        ))}
      </div>
      <Card>
        <div style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 4 }}>Scenario {act}</div>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: "1.25rem" }}>{s.sub}</div>
        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.teal, fontWeight: 500, marginBottom: 10 }}>What would still be funded</div>
          {s.funded.map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7, alignItems: "flex-start" }}>
              <span style={{ color: C.teal, fontSize: 15, flexShrink: 0 }}>✓</span>
              <span style={{ fontSize: 14, color: "var(--color-text-primary)", lineHeight: 1.5 }}>{f}</span>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: "1.25rem" }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.red, fontWeight: 500, marginBottom: 10 }}>What would be cut or eliminated</div>
          {s.cut.map((c, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "9px 0", fontSize: 14, borderBottom: i < s.cut.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
              <span style={{ color: "var(--color-text-primary)", lineHeight: 1.4 }}>{c.i}</span>
              <span style={{ color: C.red, fontSize: 13, whiteSpace: "nowrap", flexShrink: 0 }}>{c.x}</span>
            </div>
          ))}
        </div>
      </Card>
      <Note>The county approved $9.1M, which ismore than the $6M floor. The actual cuts were less severe, but the structural funding gap remains and will return in FY2028.</Note>
    </>
  );
}

function PerPupilSection() {
  const data = [
    { n: "Warren County",    t: 15042, l: 39, s: 38, st: 11, f: 13 },
    { n: "Clarke County",    t: 15165, l: 55, s: 28, st: 10, f: 7  },
    { n: "Frederick County", t: 15734, l: 47, s: 38, st: 9,  f: 6, fc: true },
    { n: "Shenandoah County",t: 16081, l: 36, s: 42, st: 10, f: 12 },
    { n: "Fauquier County",  t: 16351, l: 56, s: 28, st: 9,  f: 7  },
    { n: "Winchester City",  t: 20101, l: 42, s: 36, st: 6,  f: 16 },
    { n: "Loudoun County",   t: 21183, l: 69, s: 22, st: 6,  f: 2  },
    { n: "Regional avg.",    t: 17094, l: 50, s: 33, st: 9,  f: 9  },
    { n: "State avg.",       t: 17636, l: 48, s: 35, st: 8,  f: 10 },
  ];
  const maxT = 22000;
  const segs = [{ k: "l", c: C.blue }, { k: "s", c: C.teal }, { k: "st", c: C.gray }, { k: "f", c: C.amber }];
  return (
    <>
      <StatGrid>
        <StatCard label="Frederick per pupil" value="$15,734" color={C.amber} />
        <StatCard label="Regional average"    value="$17,094" />
        <StatCard label="State average"       value="$17,636" />
        <StatCard label="Gap vs. state avg."  value="-$1,902" color={C.red} sub="per student" />
      </StatGrid>
      <Card>
        <CLabel>Per pupil expenditure by funding source, FY2024. Hover for breakdown</CLabel>
        {data.map((d, i) => {
          const tw = d.t / maxT * 100;
          return (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 13, fontWeight: d.fc ? 500 : 400, color: d.fc ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}>{d.n}</span>
                <span style={{ fontSize: 13, fontWeight: d.fc ? 500 : 400, color: d.fc ? C.amber : "var(--color-text-secondary)" }}>${d.t.toLocaleString()}</span>
              </div>
              <div title={`${d.n} - Local: ${d.l}% · State: ${d.s}% · Sales tax: ${d.st}% · Federal: ${d.f}%`} style={{ height: 16, display: "flex", borderRadius: 3, overflow: "hidden", cursor: "pointer" }}>
                  {segs.map(sg => <div key={sg.k} style={{ width: `${d[sg.k] / 100 * tw}%`, background: sg.c, opacity: d.fc ? 0.9 : 0.4 }} />)}
                  <div style={{ flex: 1, background: "var(--color-border-tertiary)" }} />
                </div>
            </div>
          );
        })}
        <Legend items={[{ color: C.blue, label: "Local" }, { color: C.teal, label: "State" }, { color: C.gray, label: "Sales tax" }, { color: C.amber, label: "Federal" }]} />
      </Card>
    </>
  );
}

function CapitalFundSection() {
  const items = [
    { l: "Fund balance (Mar 2026)",          v: 31.0,  t: "balance" },
    { l: "FCPS capital + buses (proposed)",  v: -6.4,  t: "draw" },
    { l: "County capital (proposed)",        v: -1.1,  t: "draw" },
    { l: "Remaining after proposed draws",   v: 23.5,  t: "sub" },
    { l: "Fire station 22 (committed)",      v: -8.3,  t: "committed" },
    { l: "Charlestown Park grant match",     v: -2.8,  t: "committed" },
    { l: "Public safety radio project",      v: -5.0,  t: "committed" },
    { l: "Actually available",               v: 7.4,   t: "final" },
  ];
  const tc = { balance: C.teal, draw: C.amber, committed: C.red, sub: C.blue, final: C.green };
  const tl = { balance: "Starting balance", draw: "Proposed FY27 draw", committed: "Prior commitment (locked)", sub: "Subtotal", final: "Actually available" };
  const maxV = 31;
  return (
    <>
      <StatGrid>
        <StatCard label="Fund balance"        value="$31.0M" sub="as of Mar 2026" />
        <StatCard label="Prior commitments"   value="$16.1M" color={C.red}   sub="already locked" />
        <StatCard label="FY27 shortfall draw" value="$7.5M"  color={C.amber} sub="used to balance budget" />
        <StatCard label="Actually available"  value="$7.4M"  color={C.green} sub="after all draws" />
      </StatGrid>
      <Card>
        <CLabel>Capital fund waterfall ($M) - hover bars</CLabel>
        {items.map((item, i) => {
          const isSub = item.t === "sub" || item.t === "final";
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, paddingTop: isSub ? 10 : 0, borderTop: isSub ? "0.5px solid var(--color-border-secondary)" : "none" }}>
              <div style={{ width: 200, fontSize: 13, color: "var(--color-text-secondary)", textAlign: "right", flexShrink: 0, lineHeight: 1.3 }}>{item.l}</div>
              <div style={{ flex: 1, height: 26, position: "relative", background: "var(--color-border-tertiary)", borderRadius: 4 }}>
                <div title={`${item.l}: ${item.v > 0 ? "" : "-"}${fmtM(Math.abs(item.v))}`} style={{ position: "absolute", left: 0, height: "100%", width: `${Math.abs(item.v) / maxV * 100}%`, background: tc[item.t], borderRadius: 4, opacity: 0.85, cursor: "pointer" }} />
                <span style={{ position: "absolute", left: `${Math.abs(item.v) / maxV * 100 + 1}%`, top: "50%", transform: "translateY(-50%)", fontSize: 12, fontWeight: isSub ? 500 : 400, color: "var(--color-text-primary)", whiteSpace: "nowrap" }}>
                  {item.v > 0 ? "" : "-"}{fmtM(Math.abs(item.v))}
                </span>
              </div>
            </div>
          );
        })}
        <Legend items={Object.entries(tl).map(([k, v]) => ({ color: tc[k], label: v }))} />
      </Card>
      <Note>Using $7.5M in capital reserves to balance an operating shortfall is a one-time fix. Those funds cannot be used again next year. If the structural gap persists, and the LCI trend suggests it will, the county faces the same choices in FY2028 with a smaller cushion.</Note>
    </>
  );
}

function ComparisonSection() {
  const rates = [
    { n: "Roanoke City", r: 1.22 }, { n: "Hampton City", r: 1.14 },
    { n: "Suffolk City", r: 1.07 }, { n: "Albemarle", r: 0.89 },
    { n: "Loudoun", r: 0.81 },      { n: "Hanover", r: 0.81 },
    { n: "Winchester", r: 0.80 },   { n: "Montgomery", r: 0.76 },
    { n: "Shenandoah", r: 0.64 },
    { n: "Frederick (proposed)", r: 0.53, fc: true },
    { n: "Frederick (current)",  r: 0.48, fc: true, dim: true },
    { n: "Warren", r: 0.47 }, { n: "Clarke", r: 0.451 },
  ].sort((a, b) => b.r - a.r);
  const maxR = 1.3;
  return (
    <>
      <StatGrid>
        <StatCard label="Frederick current"  value="$0.48" sub="per $100 assessed" />
        <StatCard label="Frederick proposed" value="$0.53" color={C.amber} sub="per $100 assessed" />
        <StatCard label="Regional median"    value="~$0.80" sub="similar localities" />
        <StatCard label="Still below"        value="9 of 12" color={C.teal} sub="peer localities" />
      </StatGrid>
      <Card>
        <CLabel>Real estate tax rate per $100 assessed value. Hover for detail</CLabel>
        {rates.map((d, i) => (
          <TBar key={i} label={d.n} value={`$${d.r.toFixed(3)}`}
            barPct={d.r / maxR * 100} color={d.fc ? C.amber : C.gray}
            tip={`${d.n}: $${d.r.toFixed(3)} per $100 assessed value`} height={22} />
        ))}
        <Legend items={[
          { color: C.amber, label: "Frederick proposed ($0.53)" },
          { color: C.amber, label: "Frederick current ($0.48)", dim: true },
          { color: C.gray, label: "Peer localities", dim: true },
        ]} />
      </Card>
      <Note>Even after proposed increases, Frederick&apos;s real estate rate remains below Warren, Shenandoah, Winchester, and every similar-population Virginia locality. The shortfall reflects a low revenue base relative to service demands, not excessive spending.</Note>
    </>
  );
}

function DataCenterSection() {
  const pressures = [
    { l: "LCI cost shift (automatic, biennial)", cur: "$0.9M added in FY2027", traj: "Increases every two years as property values rise, outside the county's control", c: C.red },
    { l: "Capital reserves drawn down", cur: "$7.5M used to balance FY2027", traj: "Only $7.4M remains available; the same approach in FY2028 exhausts the fund", c: C.amber },
    { l: "School underfunding gap at record high", cur: "$9.1M below request in FY2027", traj: "Structural, not a one-time event. It has widened every year since FY24", c: C.amber },
    { l: "Low tax rate relative to regional peers", cur: "$0.48, 3rd lowest in the region", traj: "Board has shown reluctance to raise rates to the regional median (~$0.80)", c: C.gray },
  ];
  const qs = [
    { q: "What revenue will data centers actually generate?", a: "The county has not published a projected general fund contribution from approved or pending data center rezonings. Without that number, the fiscal argument cannot be evaluated by residents." },
    { q: "How does it compare to a rate increase?", a: "A $0.05 increase in the real estate rate, raising Frederick from $0.48 to $0.53, still below most peer localities, generates approximately $9M annually. That is a known, permanent, auditable number. Data center revenue projections are based on assessed value assumptions that can be contested or revised." },
    { q: "What is the timeline for data center revenue?", a: "Data center construction, permitting, and tax assessment takes years. Capital reserves and school funding gaps are pressing now. If the county is drawing reserves while waiting for future data center revenue, that gap needs to be named explicitly." },
    { q: "What costs offset the revenue?", a: "Large industrial developments require infrastructure: roads, utility capacity, emergency services, stormwater management. The county recently received a new MS4 stormwater permit requiring expanded staffing and compliance costs. These are rarely included in fiscal impact projections presented to the public." },
    { q: "Who bears the risk if projections miss?", a: "If data center development stalls, rezonings are challenged, or assessed values come in below projections, the structural pressure on residential rates and school funding remains, without the capital reserves spent in the interim." },
  ];
  return (
    <>
      <p style={{ fontSize: 16, color: "var(--color-text-secondary)", lineHeight: 1.7, margin: "0 0 1.75rem", maxWidth: 580 }}>
        The Board of Supervisors does not argue that data centers will fix the FY2027 shortfall, that gap was already closed through tax increases, cuts, and reserve draws. Instead, some membersargue that data center tax revenue will fix the <em>structural</em> fiscal problem that keeps producing shortfalls year after year. That is a more ambitious claim, and a harder one to evaluate.
      </p>
      <Card style={{ marginBottom: "1.25rem" }}>
        <CLabel>Structural pressures that persist after FY2027</CLabel>
        {pressures.map((p, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "4px 1fr", gap: "0 14px", marginBottom: i < pressures.length - 1 ? 18 : 0, paddingBottom: i < pressures.length - 1 ? 18 : 0, borderBottom: i < pressures.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ background: p.c, borderRadius: 2, gridRow: "1 / 3" }} />
            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 4 }}>{p.l}</div>
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.55 }}><span style={{ color: "var(--color-text-primary)" }}>{p.cur}</span> - {p.traj}</div>
          </div>
        ))}
      </Card>
      <p style={{ fontSize: 15, color: "var(--color-text-secondary)", lineHeight: 1.7, margin: "0 0 1.25rem", maxWidth: 580 }}>
        The argument for data centers goes like this: commercial real estate tax revenue from large industrial users reduces the burden on residential taxpayers, funds services without raising residential rates, and diversifies the tax base. That argument is worth taking seriously, which is exactly why residents deserve the data to evaluate it.
      </p>
      <Card style={{ marginBottom: "1.25rem" }}>
        <CLabel>Questions the fiscal record raises</CLabel>
        {qs.map((item, i) => (
          <div key={i} style={{ padding: i === 0 ? "0 0 18px" : "18px 0", borderBottom: i < qs.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 7, lineHeight: 1.35 }}>{item.q}</div>
            <div style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>{item.a}</div>
          </div>
        ))}
      </Card>
      <div style={{ padding: "1.25rem 1.5rem", borderLeft: `4px solid ${C.red}`, background: "var(--color-background-secondary)", borderRadius: "0 var(--border-radius-lg) var(--border-radius-lg) 0" }}>
        <p style={{ margin: "0 0 0.6rem", fontSize: 16, fontWeight: 500, color: "var(--color-text-primary)" }}>The structural argument deserves a structural answer.</p>
        <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
          If the fiscal problem is structural, driven by a revenue base that can&apos;t keep pace with the cost of residential growth, then the question is whether data centers fix that structure or just slow its deterioration. The TischlerBise study shows data centers generate the highest fiscal surplus of any land use. It does not show how many would be needed, over what timeline, to offset the residential deficit the county already carries. That calculation has not been made public. Until it is, the structural argument rests on a direction, not a plan.
        </p>
      </div>
    </>
  );
}

function ELI5Section() {
  const [active, setActive] = useState(0);
  const concepts = [
    { term: "The general fund", emoji: "🏛",
      simple: "It's the county's main checking account. Every dollar spent on schools, police, roads, and parks comes out of it. Property taxes, meals taxes, and fees go in. If the fund runs short, the county either raises taxes, cuts services, or borrows from savings.",
      detail: "Frederick County's general fund for FY2027 is $293.9 million. About 44% goes to schools, 25% to public safety, and the rest to roads, parks, administration, and debt payments. When the county says the budget is 'balanced,' it means money in equals money out - but it doesn't mean the county funded everything it needed to.",
      dc: "Data center proponents argue that commercial real estate taxes from data centers would add tens of millions to the general fund annually, reducing the need to raise residential rates. That claim depends entirely on assessed values and tax rates that have not been publicly specified for any approved rezoning." },
    { term: "A fiscal shortfall", emoji: "📉",
      simple: "Imagine your household earns $264 but your bills total $305. That gap, $41, is your shortfall. You have three choices: earn more, spend less, or dip into savings. Frederick County did all three to close a $41.3M gap.",
      detail: "The shortfall wasn't caused by overspending as department budgets were cut $11.7M just to reduce the number. It was caused by a revenue base that hasn't kept pace with the cost of services. The county's real estate tax rate is the third lowest in the region. Costs rise automatically each year regardless of revenue.",
      dc: "The shortfall is the foundational argument for data centers. A large commercial taxpayer would add revenue without raising residential rates. The question is whether that revenue arrives fast enough, reliably enough, and in large enough amounts to actually close a structural gap, not just a one-year hole." },
    { term: "The LCI", emoji: "📊",
      simple: "Virginia decides how much of your child's school costs the state pays vs. how much the county pays. As your neighborhood gets more expensive, the state assumes you can afford more and pays less. Frederick County has gotten more expensive, so the state keeps cutting its share.",
      detail: "The LCI is recalculated every two years. Frederick's has risen from 38.89% in 2016 to 42.04% in 2026, meaning the county now pays 42 cents of every required education dollar, up from 39 cents. The new LCI shifted $0.9M of costs from the state to the county for FY2027 alone. This happens automatically, outside anyone's control.",
      dc: "If data center development raises property values and local income, which proponents argue it will, it also raises the LCI. That means the state cuts its education contribution further. Some of the commercial tax revenue data centers generate would be offset by increased local education obligations." },
    { term: "Drawing from reserves", emoji: "🏦",
      simple: "Reserves are the county's savings account. When you spend from savings to pay your regular monthly bills, not for an emergency, you're using a one-time fix for a recurring problem. Next year the bills are still there, but the savings are smaller.",
      detail: "Frederick County drew $13.3M from reserves in FY2027 to balance the budget, including $7.5M from the Capital Fund. The Capital Fund showed $31M on paper, but $16.1M was already committed to specific projects. That leaves $7.4M genuinely available. One more year at this rate and the cushion is gone.",
      dc: "The county is drawing reserves now while data center rezoning decisions are being made. If development is approved and takes 3–5 years to generate tax revenue, the county will face the same structural gap each year with progressively less savings to draw from. That timing mismatch is rarely discussed publicly." },
    { term: "What a data center is", emoji: "🏭",
      simple: "A data center is a giant warehouse full of computers that store and process information for companies, apps, and governments. It looks like a windowless industrial building. It needs enormous amounts of electricity and water every day to keep those computers cool.",
      detail: "A single large data center can consume 20–100+ megawatts of power, enough to power tens of thousands of homes, and 1–5 million gallons of water per day for cooling. Frederick County sits on a karst aquifer: fractured limestone that filters poorly, recharges slowly, and is highly vulnerable to contamination. The county has not published a water capacity assessment for any proposed data center sites.",
      dc: "The fiscal argument for data centers focuses entirely on tax revenue. It rarely includes the infrastructure costs the county must bear: road upgrades, expanded emergency services, stormwater compliance, and potential water system expansion. These costs reduce the net fiscal benefit and in some cases eliminate it." },
    { term: "A fiscal impact study", emoji: "📋",
      simple: "A fiscal impact study is a report that estimates how much money a new development will bring in vs. how much it will cost the county in services. They sound official. But they're usually paid for by the developer, and they almost always show the project as a net positive.",
      detail: "The TischlerBise fiscal impact study used to justify Frederick County data center rezonings was commissioned by the applicants. These studies typically assume full build-out at maximum assessed values, model revenue over 20-year periods, and exclude or minimize infrastructure offset costs. They are not independent analyses.",
      dc: "When a Board member cites a fiscal impact study to justify a rezoning, the right questions are: who paid for it, what assessed value was assumed, what infrastructure costs were excluded, and what happens to the projection if the facility is only 60% built out? None of those questions have been publicly answered for Frederick County's pending rezonings." },
  ];
  const c = concepts[active];
  return (
    <>
      <p style={{ fontSize: 16, color: "var(--color-text-secondary)", lineHeight: 1.7, margin: "0 0 1.75rem", maxWidth: 580 }}>
        Budget debates involve a lot of terms officials use without explaining. Here is what they actually mean and how each connects to the data center argument.
      </p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {concepts.map((cn, i) => (
          <button key={i} onClick={() => setActive(i)} aria-pressed={active === i} style={{
            padding: "8px 14px", cursor: "pointer", fontSize: 13,
            fontWeight: active === i ? 500 : 400, color: "var(--color-text-primary)",
            borderRadius: "var(--border-radius-md)",
            border: `0.5px solid ${active === i ? "var(--color-border-primary)" : "var(--color-border-tertiary)"}`,
            background: active === i ? "var(--color-background-secondary)" : "none", transition: "all 0.15s",
          }}>{cn.emoji} {cn.term}</button>
        ))}
      </div>
      <Card>
        <div style={{ fontSize: 20, marginBottom: 8 }}>{c.emoji}</div>
        <div style={{ fontSize: 18, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: "1.25rem" }}>{c.term}</div>
        <div style={{ marginBottom: "1.25rem", padding: "1rem 1.25rem", background: "var(--color-background-primary)", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-tertiary)" }}>
          <div style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--color-text-secondary)", marginBottom: 8 }}>The simple version</div>
          <p style={{ margin: 0, fontSize: 16, color: "var(--color-text-primary)", lineHeight: 1.7 }}>{c.simple}</p>
        </div>
        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--color-text-secondary)", marginBottom: 8 }}>More detail</div>
          <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>{c.detail}</p>
        </div>
        <div style={{ padding: "1rem 1.25rem", borderLeft: `3px solid ${C.amber}`, background: "var(--color-background-secondary)", borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0" }}>
          <div style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", color: C.amber, marginBottom: 8 }}>How this connects to data centers</div>
          <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>{c.dc}</p>
        </div>
      </Card>
    </>
  );
}

function FullFundingSection() {
  const CURRENT_RATE = 0.48;
  const ONE_CENT_REVENUE = 1.8;
  const schoolGap  = 9.1;
  const capitalGap = 7.5;
  const lciShift   = 0.9;
  const totalNeeded = schoolGap + capitalGap + lciShift;
  const centsNeeded = totalNeeded / ONE_CENT_REVENUE;
  const rateNeeded  = +(CURRENT_RATE + centsNeeded / 100).toFixed(3);

  const [homeValue, setHomeValue] = useState(350000);
  const currentBill  = Math.round(homeValue * CURRENT_RATE / 100);
  const proposedBill = Math.round(homeValue * 0.0053);
  const fullBill     = Math.round(homeValue * rateNeeded / 100);
  const winBill      = Math.round(homeValue * 0.00795);

  const markers = [
    { label: "Current ($0.48)", rate: 0.48, color: C.teal },
    { label: "FY27 proposed ($0.53)", rate: 0.53, color: C.amber },
    { label: `Full funding (~$${rateNeeded.toFixed(2)})`, rate: rateNeeded, color: C.red },
    { label: "Winchester ($0.795)", rate: 0.795, color: C.gray },
    { label: "Regional median (~$0.80)", rate: 0.80, color: C.gray },
  ];

  return (
    <>
      <p style={{ fontSize: 16, color: "var(--color-text-secondary)", lineHeight: 1.7, margin: "0 0 1.75rem", maxWidth: 580 }}>
        The proposed rate increase from $0.48 to $0.53 generates about $9M in new real estate tax revenue, roughly half of what&apos;s needed to close the school gap, stop drawing capital reserves, and cover the LCI shift permanently. What rate would actually do all three?
      </p>
      <Card style={{ marginBottom: "1.25rem" }}>
        <CLabel>What full structural funding of the three recurring gaps requires</CLabel>
        {[
          { l: "Close school funding gap", v: fmtM(schoolGap), note: "vs. FCPS request" },
          { l: "Stop drawing capital reserves", v: fmtM(capitalGap), note: "FY27 draw amount" },
          { l: "Cover LCI cost shift", v: fmtM(lciShift), note: "new biennium shift" },
          { l: "Total additional revenue needed", v: fmtM(totalNeeded), note: "annually", bold: true },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 0", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
            <span style={{ fontSize: 14, color: r.bold ? "var(--color-text-primary)" : "var(--color-text-secondary)", fontWeight: r.bold ? 500 : 400 }}>{r.l}</span>
            <span style={{ fontSize: r.bold ? 18 : 15, fontWeight: r.bold ? 500 : 400, color: r.bold ? C.red : "var(--color-text-primary)" }}>{r.v} <span style={{ fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 400 }}>{r.note}</span></span>
          </div>
        ))}
        <div style={{ marginTop: "1.25rem", padding: "1rem 1.25rem", background: "var(--color-background-primary)", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-tertiary)" }}>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 4 }}>Estimated rate to cover the three recurring gaps without reserve draws</div>
          <div style={{ fontSize: 28, fontWeight: 500, color: C.red }}>${rateNeeded.toFixed(3)} <span style={{ fontSize: 14, color: "var(--color-text-secondary)", fontWeight: 400 }}>per $100 assessed value</span></div>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 4 }}>Still below Winchester ($0.795) and the regional median (~$0.80)</div>
        </div>
        <div style={{ marginTop: "1.25rem" }}>
          <CLabel>Rate comparison</CLabel>
          {markers.map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 180, fontSize: 13, color: i < 3 ? "var(--color-text-primary)" : "var(--color-text-secondary)", textAlign: "right", flexShrink: 0, fontWeight: i === 2 ? 500 : 400 }}>{m.label}</div>
              <div style={{ flex: 1, position: "relative", height: 20, background: "var(--color-border-tertiary)", borderRadius: 4 }}>
                <div style={{ position: "absolute", left: 0, height: "100%", width: `${m.rate / 0.90 * 100}%`, background: m.color, borderRadius: 4, opacity: 0.85 }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "1.5rem", padding: "1.1rem 1.25rem", background: "var(--color-background-primary)", borderRadius: "var(--border-radius-md)", border: `0.5px solid ${C.amber}` }}>
          <div style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", color: C.amber, marginBottom: 10 }}>The 10-cent question</div>
          <p style={{ margin: "0 0 0.75rem", fontSize: 15, color: "var(--color-text-primary)", lineHeight: 1.6 }}>
            A 10-cent rate increase, from $0.48 to $0.58, would have raised approximately <strong style={{ color: C.teal }}>$18M</strong> in additional real estate tax revenue.
          </p>
          {[
            { label: "FCPS operating request", value: "$18.2M", covered: true },
            { label: "LCI cost shift",          value: "$0.9M",  covered: true },
            { label: "Meals tax increase",       value: "not needed", covered: true },
            { label: "Vehicle license increase", value: "not needed", covered: true },
            { label: "Capital reserve draw",     value: "greatly reduced", covered: true },
            { label: "Spending cuts ($11.7M)",   value: "reduced or avoided", covered: true },
          ].map((r, i, arr) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "8px 0", borderBottom: i < arr.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none", fontSize: 14 }}>
              <span style={{ color: "var(--color-text-secondary)" }}>{r.label}</span>
              <span style={{ color: C.teal, fontWeight: 500 }}>{r.value}</span>
            </div>
          ))}
          <p style={{ margin: "0.85rem 0 0", fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.65 }}>
            The board chose a 5-cent increase instead, paired with cuts to schools, increases to meals and vehicle taxes, and a $13.3M draw from reserves. A $0.58 rate would be above Warren ($0.47) but below Shenandoah ($0.64), Winchester ($0.795), and every similar-population Virginia locality in the regional comparison. The choice of 5 cents over 10 is a political judgment, not a fiscal necessity.
          </p>
        </div>
      </Card>
      <Card>
        <CLabel>Your household. Adjust home value</CLabel>
        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <label style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Home assessed value</label>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>{fmt(homeValue)}</span>
          </div>
          <input type="range" min={100000} max={900000} step={5000} value={homeValue} onChange={e => setHomeValue(+e.target.value)} style={{ width: "100%" }} aria-label="Home value" />
        </div>
        <StatGrid>
          <StatCard label="Current bill" value={fmt(currentBill)} sub="at $0.48" />
          <StatCard label="FY27 proposed" value={fmt(proposedBill)} color={C.amber} sub="at $0.53" />
          <StatCard label="Full funding bill" value={fmt(fullBill)} color={C.red} sub={`at $${rateNeeded.toFixed(2)}`} />
          <StatCard label="Winchester rate" value={fmt(winBill)} sub="at $0.795 (neighbor)" />
        </StatGrid>
      </Card>
      <Note>Based on the budget&apos;s own figure of $9M additional revenue from a 5-cent rate increase ($1.8M per cent). The result, approximately $0.58, is about 10 cents above the proposed rate, still below Winchester at $0.795, and well below the regional median of ~$0.80. The county has room to raise rates. The choice not to is a political one, not a fiscal ceiling.</Note>
    </>
  );
}

function WaterPowerSection() {
  const [facilities, setFacilities] = useState(1);
  const dailyWater  = facilities * 3;
  const powerMW     = facilities * 50;
  const homesEquiv  = Math.round(powerMW * 1000 / 1.2);

  return (
    <>
      <p style={{ fontSize: 16, color: "var(--color-text-secondary)", lineHeight: 1.7, margin: "0 0 1.75rem", maxWidth: 580 }}>
        The fiscal argument for data centers focuses on tax revenue. It rarely addresses what large-scale data center development actually requires from the county&apos;s physical infrastructure, particularly water, which Frederick County draws from a karst aquifer.
      </p>
      <Card style={{ marginBottom: "1.25rem" }}>
        <CLabel>Estimated resource demand. Adjust number of large facilities</CLabel>
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <label style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Large data center facilities</label>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>{facilities}</span>
          </div>
          <input type="range" min={1} max={10} step={1} value={facilities} onChange={e => setFacilities(+e.target.value)} style={{ width: "100%" }} aria-label="Number of facilities" />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>
            <span>1</span><span>10</span>
          </div>
        </div>
        <StatGrid>
          <StatCard label="Daily water use" value={`${dailyWater}M gal`} color={C.blue} sub="per day est." />
          <StatCard label="Power demand" value={`${powerMW} MW`} color={C.amber} sub="megawatts est." />
          <StatCard label="Home equivalent" value={homesEquiv.toLocaleString()} sub="homes same power draw" />
          <StatCard label="Aquifer type" value="Karst" color={C.red} sub="high contamination risk" />
        </StatGrid>
      </Card>
      <Card>
        <CLabel>What the county has not publicly disclosed</CLabel>
        {[
          { q: "Water capacity assessment", a: "No public study has been released showing whether Frederick County's karst aquifer can sustain the groundwater draw from proposed data center sites at scale. Karst limestone filters poorly and recharges slowly." },
          { q: "Infrastructure cost obligations", a: "Road upgrades, water system expansion, stormwater compliance (MS4 permit), and emergency service capacity all scale with development. These costs are borne by the county, not the developer." },
          { q: "Power grid capacity", a: "Data centers require dedicated high-voltage transmission infrastructure. The cost of grid upgrades is typically passed to ratepayers and local utilities, not to the data center operator." },
          { q: "Net fiscal impact after offsets", a: "No public document has shown a data center rezoning's projected tax revenue minus projected infrastructure and service costs on the same page, for the same facility, over the same time period." },
        ].map((item, i, arr) => (
          <div key={i} style={{ padding: i === 0 ? "0 0 16px" : "16px 0", borderBottom: i < arr.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 5 }}>{item.q}</div>
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.65 }}>{item.a}</div>
          </div>
        ))}
      </Card>
      <Note accent={C.red}>Estimates use industry midpoint figures (3M gal/day water, 50MW power per large facility). Actual figures vary. The county has not released site-specific demand figures for any approved or pending rezoning.</Note>
    </>
  );
}

function TimelineSection() {
  const events = [
    { year: "FY2023", label: "Gap begins widening", detail: "School board requests $4.7M in additional county funds. County approves only $2.6M, which isa $2.1M gap. Capital reserves intact.", type: "budget" },
    { year: "FY2024", label: "Record school funding year", detail: "County approves $9.2M of a $9.6M school request, the closest to full funding in the decade. Budget appears stable.", type: "budget" },
    { year: "FY2025", label: "Structural gap returns", detail: "County approves $5.0M of an $8.0M school request. $3M gap. Capital reserves begin to be discussed as a buffer.", type: "budget" },
    { year: "2024–25", label: "Data center rezonings accelerate", detail: "Multiple large-scale industrial rezoning applications filed in Frederick County. Board of Supervisors begins approving or advancing applications. Board members begin citing future DC revenue as a reason not to raise residential rates.", type: "dc" },
    { year: "FY2026", label: "School gap widens again", detail: "County approves $4.2M of an $8.7M request, a $4.5M gap. The fiscal framing of data centers becomes more prominent in public Board discussions.", type: "budget" },
    { year: "FY2027", label: "Record $41.3M shortfall", detail: "Projected revenue $264.3M vs. $305.6M in requests. County raises taxes, cuts schools $9.1M below request, and draws $13.3M from reserves. Capital Fund reduced to $7.4M available.", type: "budget" },
    { year: "April 2026", label: "Budget adoption deadline", detail: "Board of Supervisors votes to adopt the FY2027 budget. The $0.53 real estate rate passes. Data center rezonings continue advancing on a parallel track.", type: "decision" },
    { year: "FY2028+", label: "The structural gap persists", detail: "The LCI will shift again. Capital reserves are nearly exhausted. The school funding gap is structural, not one-time. Data center revenue, if it arrives, is 3–5 years away. The same choices return with less cushion.", type: "future" },
  ];
  const tc = { budget: C.amber, dc: C.blue, decision: C.red, future: C.gray };
  const tl = { budget: "Budget", dc: "Data centers", decision: "Board vote", future: "Looking ahead" };
  return (
    <>
      <p style={{ fontSize: 16, color: "var(--color-text-secondary)", lineHeight: 1.7, margin: "0 0 1.75rem", maxWidth: 580 }}>
        The data center push and the budget crisis didn&apos;t happen at the same time by coincidence. Here is the sequence that connects them.
      </p>
      <Card>
        <Legend items={Object.entries(tl).map(([k, v]) => ({ color: tc[k], label: v }))} />
        <div style={{ marginTop: "1.5rem", position: "relative", paddingLeft: 0 }}>
          <div style={{ position: "absolute", left: 87, top: 8, bottom: 8, width: 1, background: "var(--color-border-tertiary)" }} />
          {events.map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 20, marginBottom: i < events.length - 1 ? 24 : 0 }}>
              <div style={{ width: 80, flexShrink: 0, textAlign: "right", paddingTop: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: tc[e.type] }}>{e.year}</span>
              </div>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: tc[e.type], flexShrink: 0, marginTop: 3, zIndex: 1, border: "3px solid var(--color-background-secondary)" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 4, lineHeight: 1.3 }}>{e.label}</div>
                <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.65 }}>{e.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Note>The timeline shows data center rezonings accelerated during the same period the school funding gap widened and capital reserves came under pressure. Whether that timing is coincidence or cause-and-effect is a question residents should press the Board to answer directly.</Note>
    </>
  );
}

function FiscalImpactSection() {
  const [tab, setTab] = useState("findings");

  const findings = [
    {
      label: "7 of 8 residential land uses run deficits",
      detail: "The study found that assuming full capital impacts, seven of the eight non-age-restricted residential land uses do not generate sufficient revenue to cover service and facility costs. Only a Rural 2-Acre Single Family unit is essentially fiscal neutral, and only barely, at less than 0.1% deficit relative to revenues.",
      type: "residential", sev: "high",
    },
    {
      label: "Schools drive 45–50% of residential costs",
      detail: "For every non-age-restricted residential unit, school operations account for 45 to 50 percent of total expenditures. Add school capital costs and the combined school burden exceeds 80 percent of all costs. This is the structural driver of the county's fiscal gap, and it grows with every new residential subdivision approved.",
      type: "residential", sev: "high",
    },
    {
      label: "Assessed value is the single largest fiscal predictor",
      detail: "The study explicitly states that real estate assessed value is the key predictor of fiscal results, with lower-valued homes generating deeper deficits. The county's revenue structure is almost entirely dependent on property values. This means the fiscal gap is not fixed by volume of development; instead, it's fixed by the value of what gets built.",
      type: "residential", sev: "medium",
    },
    {
      label: "Data centers score highest of all land uses",
      detail: "The study found the proxy data center land use generates the highest fiscal surplus of all nonresidential types modeled. The reason: high personal property tax revenue from equipment, combined with very low service costs (few employees, no regular visitors, no school-age children}. Data centers are essentially a land use that generates tax revenue and demands almost nothing in return.",
      type: "datacenter", sev: "positive",
    },
    {
      label: "Data center values are proxied from other Virginia localities",
      detail: "The study explicitly notes that assessed values for the data center land use are proxy values, borrowed from other Virginia localities and scaled to Frederick County. These are not based on actual assessed values of real facilities in Frederick County. The revenue projections depend entirely on whether those scaled assumptions hold.",
      type: "datacenter", sev: "medium",
    },
    {
      label: "The study does not justify any specific rezoning",
      detail: "The study itself states clearly: 'It does not seek to justify the approval or denial of specific land uses.' It is a baseline planning tool, a cost-of-land-use analysis, not a site-specific revenue projection. Using it to justify individual rezoning decisions applies it beyond its stated purpose.",
      type: "limit", sev: "high",
    },
    {
      label: "The LCI effect is not modeled",
      detail: "The study does not account for the Local Composite Index mechanism. If data centers raise assessed values and incomes across the county, which is part of the fiscal argument for approving them, the LCI rises and the state cuts its education contribution automatically. That offset is absent from the analysis.",
      type: "limit", sev: "medium",
    },
    {
      label: "Infrastructure costs are not netted out",
      detail: "The study models service costs at average rates but does not project site-specific infrastructure obligations: road upgrades, water system capacity, stormwater compliance, or emergency service expansion. These costs are borne by the county after approval and reduce the net fiscal benefit of any specific facility.",
      type: "limit", sev: "high",
    },
  ];

  const typeC = { residential: C.amber, datacenter: C.teal, limit: C.red };
  const typeL = { residential: "Residential finding", datacenter: "Data center finding", limit: "Study limitation" };
  const sevC  = { high: C.red, medium: C.amber, positive: C.teal };
  const sevL  = { high: "Major concern", medium: "Concern", positive: "Key finding" };

  const tabs = [
    { id: "findings", label: "What the study found" },
    { id: "questions", label: "Questions to ask" },
    { id: "thepoint", label: "The real argument" },
  ];

  return (
    <>
      <p style={{ fontSize: 16, color: "var(--color-text-secondary)", lineHeight: 1.7, margin: "0 0 1.5rem", maxWidth: 580 }}>
        The TischlerBise Cost of Land Use study is the primary fiscal document cited in Frederick County data center rezoning discussions. Here is what it actually says, including findings the board cites, findings it doesn&apos;t, and what the study explicitly says it cannot do.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} aria-pressed={tab === t.id} style={{
            padding: "9px 18px", cursor: "pointer", fontSize: 13,
            fontWeight: tab === t.id ? 500 : 400, color: "var(--color-text-primary)",
            borderRadius: "var(--border-radius-md)",
            border: `0.5px solid ${tab === t.id ? "var(--color-border-primary)" : "var(--color-border-tertiary)"}`,
            background: tab === t.id ? "var(--color-background-secondary)" : "none", transition: "all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>

      {tab === "findings" && (
        <Card>
          <CLabel>TischlerBise Cost of Land Use Study and its key findings</CLabel>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: "1.25rem" }}>
            {Object.entries(typeL).map(([k, v]) => (
              <span key={k} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--color-text-secondary)" }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: typeC[k], display: "inline-block" }} />{v}
              </span>
            ))}
          </div>
          {findings.map((f, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "4px 1fr", gap: "0 14px", marginBottom: i < findings.length - 1 ? 20 : 0, paddingBottom: i < findings.length - 1 ? 20 : 0, borderBottom: i < findings.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
              <div style={{ background: typeC[f.type], borderRadius: 2, gridRow: "1 / 3" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5, gap: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", lineHeight: 1.3 }}>{f.label}</div>
                <span style={{ fontSize: 11, color: sevC[f.sev], fontWeight: 500, flexShrink: 0 }}>{sevL[f.sev]}</span>
              </div>
              <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>{f.detail}</div>
            </div>
          ))}
        </Card>
      )}

      {tab === "questions" && (
        <Card>
          <CLabel>Questions to ask before accepting this study as justification for a rezoning</CLabel>
          {[
            { q: "What specific assessed value per square foot was used for the Frederick County data center proxy and what is the source?", why: "The study uses proxy values from other Virginia localities scaled to Frederick County. If those comparables don't match actual facilities being proposed, the revenue projections are off from the start." },
            { q: "What infrastructure costs were excluded from the cost side of the data center analysis?", why: "The study models average service costs but does not project road upgrades, water system capacity, stormwater compliance (MS4), or emergency service expansion for any specific site." },
            { q: "Has the county modeled how data center development affects the LCI?", why: "Rising assessed values raise the LCI, which triggers automatic cuts to state education funding. That offset is not in the study." },
            { q: "What is the county's independent review of these projections?", why: "The study was used in rezoning applications. The county has not published an independent assessment of its assumptions for any specific facility." },
            { q: "What happens to the fiscal result if the facility is 60% built out rather than fully built?", why: "The study models land uses at assumed square footages. Partial build-outs produce proportionally lower revenue but the same infrastructure obligations." },
            { q: "If the revenue projections miss by 30%, who bears the risk?", why: "There is no clawback, performance bond, or revenue guarantee attached to data center rezonings in Frederick County. The risk is entirely public." },
          ].map((item, i, arr) => (
            <div key={i} style={{ padding: i === 0 ? "0 0 18px" : "18px 0", borderBottom: i < arr.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 6, lineHeight: 1.35 }}>{i + 1}. {item.q}</div>
              <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.65 }}>{item.why}</div>
            </div>
          ))}
        </Card>
      )}

      {tab === "thepoint" && (
        <>
          <Card style={{ marginBottom: "1.25rem" }}>
            <CLabel>What the study&apos;s own logic actually shows</CLabel>
            <p style={{ margin: "0 0 1rem", fontSize: 15, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
              The study&apos;s core finding is that residential development, particularly families with school-age children, costs more than it generates in tax revenue. Data centers score highest precisely because they are the opposite: high assessed value, high equipment taxes, and almost no service demand. 
            </p>
            <p style={{ margin: "0 0 1rem", fontSize: 15, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
              The board&apos;s argument is that data center tax revenue can subsidize the cost of residential growth the county has already approved and continues to approve. That may be true to a degree, but the study does not say how much data center development would be required to offset the residential deficit or whether that amount of industrial development is compatible with the county Frederick County residents say they want.
            </p>
            <p style={{ margin: 0, fontSize: 15, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
              The study also explicitly states it cannot justify any specific rezoning. It is a planning tool. The leap from &quot;data centers are the most fiscally positive land use in the model&quot; to &quot;this specific facility on this specific parcel should be approved&quot; is a policy judgment.
            </p>
          </Card>
          <div style={{ padding: "1.25rem 1.5rem", borderLeft: `4px solid ${C.amber}`, background: "var(--color-background-secondary)", borderRadius: "0 var(--border-radius-lg) var(--border-radius-lg) 0" }}>
            <p style={{ margin: "0 0 0.5rem", fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}>The question the study raises but doesn&apos;t answer</p>
            <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
              If residential growth is the structural driver of the county&apos;s fiscal gap, and the board&apos;s response is to approve more residential growth alongside data centers to offset it, the fiscal treadmill accelerates, not slows. The study shows the cost structure of that tradeoff.
            </p>
          </div>
        </>
      )}
    </>
  );
}

/* ─── SECTIONS REGISTRY ─── */

const SECTIONS = [
  { id: "shortfall",   label: "Shortfall",       eyebrow: "The fiscal gap",                    title: "A $41.3M shortfall, closed three ways",                          open: true,  desc: "Frederick County projected $264.3M in revenue for FY2027. Departments requested $305.6M, a $41.3M gap closed through tax increases, reserve draws, and spending cuts.", C: ShortfallSection },
  { id: "calculator",  label: "Your bill",        eyebrow: "Your bill",                         title: "What the proposed tax increases cost a typical household",         open: true,  desc: "The county is proposing increases to four revenue sources. Adjust the sliders below to estimate your annual cost increase.", C: TaxCalculator },
  { id: "cuts",        label: "What got cut",     eyebrow: "Spending reductions",               title: "$11.7M in cuts to reach a balanced budget",                       open: false, desc: "After exhausting tax increases and reserve draws, the county needed $11.7M more in reductions. Schools took the largest single hit at $9.1M.", C: SpendingCutsSection },
  { id: "schools",     label: "Schools",          eyebrow: "Frederick County Public Schools",   title: "Schools received 95.3% of their request, but the gap is growing", open: false, desc: "FCPS requested $18.2M in additional county operating funds. The county approved $9.1M. FY2027 set a record gap between the school board's request and what was funded.", C: SchoolFundingSection },
  { id: "lci",         label: "State cost shift", eyebrow: "State cost shifting",               title: "As the county gets 'wealthier,' the state pays less for schools",   open: false, desc: "Virginia's LCI mechanism automatically shifts education costs from the state to the county as property values rise. Frederick's county share has climbed from 38.89% to 42.04% since 2016.", C: LCISection },
  { id: "scenarios",   label: "School scenarios", eyebrow: "FCPS budget scenarios",             title: "What happens if the county only funds $6M of the school request",  open: false, desc: "Three scenarios the school board presented before the final budget was set.", C: ShortfallScenariosSection },
  { id: "perpupil",    label: "Per pupil",        eyebrow: "Per pupil spending",                title: "Frederick spends $1,902 less per student than the state average",   open: false, desc: "FY2024 per pupil data compared across 9 localities, broken down by funding source.", C: PerPupilSection },
  { id: "capital",     label: "Capital fund",     eyebrow: "Capital fund reserves",             title: "The Capital Fund shows $31M but only $7.4M is actually available",    open: false, desc: "The county used $7.5M in capital reserves to help balance FY2027. The headline balance overstates how much flexibility actually exists.", C: CapitalFundSection },
  { id: "comparison",  label: "Regional context", eyebrow: "Regional context",                  title: "Frederick has one of the lowest tax rates in Virginia",              open: false, desc: "Even after the proposed increases, Frederick's real estate rate remains well below peer localities.", C: ComparisonSection },
  { id: "eli5",         label: "Key concepts",    eyebrow: "Explained simply",                  title: "What the budget jargon actually means",                            open: false, desc: "Six key concepts explained in plain language and how each one connects to the data center argument.", C: ELI5Section },
  { id: "fullfunding",  label: "Full funding",    eyebrow: "What would full funding cost?",     title: "What rate would actually close the gap permanently?",               open: false, desc: "The proposed $0.53 rate closes part of the gap and relies on one-time reserve draws. Here is what permanent structural funding would require and how it compares to neighboring localities.", C: FullFundingSection },
  { id: "waterpower",   label: "Water and power", eyebrow: "Infrastructure demand",             title: "What data centers actually require from the county",                 open: false, desc: "The fiscal argument for data centers focuses on tax revenue. It rarely addresses what large-scale facilities require from Frederick County's water supply and power grid.", C: WaterPowerSection },
  { id: "timeline",     label: "Timeline",        eyebrow: "The sequence of events",            title: "How the budget crisis and data center push are connected",           open: false, desc: "The budget shortfall and data center rezonings didn't happen at the same time by coincidence. Here is the sequence that connects them.", C: TimelineSection },
  { id: "fiscalimpact", label: "Fiscal studies",  eyebrow: "TischlerBise study",               title: "What the county's own fiscal study actually says",                 open: false, desc: "The TischlerBise Cost of Land Use study is the primary document cited in data center rezoning discussions. Here is what it found, including what the board cites, what it doesn't, and what the study says it cannot do.", C: FiscalImpactSection },
  { id: "datacenters", label: "Data centers",     eyebrow: "The board's argument",              title: "Some supervisors think data centers fix the structural problem, not just the shortfall", open: false, desc: "That is a more ambitious claim than 'fix this year's budget.' Here is what the data shows about whether it holds up.", C: DataCenterSection },
];

function SectionNav({ active }) {
  return (
    <nav aria-label="Page sections" style={{
      position: "sticky", top: "56px", zIndex: 20,
      background: "var(--color-background-primary)",
      borderBottom: "0.5px solid var(--color-border-tertiary)",
      display: "flex", overflowX: "auto", scrollbarWidth: "none",
      marginBottom: "0.5rem",
    }}>
      {SECTIONS.map(s => (
        <button key={s.id} onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })} aria-current={active === s.id ? "true" : undefined} style={{
          border: "none", background: "none", padding: "11px 14px", fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
          color: active === s.id ? "var(--color-text-primary)" : "var(--color-text-secondary)",
          fontWeight: active === s.id ? 500 : 400,
          borderBottom: active === s.id ? "2px solid var(--color-text-primary)" : "2px solid transparent",
          transition: "color 0.15s",
        }}>{s.label}</button>
      ))}
    </nav>
  );
}

export default function BudgetDashboard() {
  const [active, setActive] = useState("shortfall");

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-35% 0px -55% 0px" }
    );
    SECTIONS.forEach(({ id }) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 1rem 4rem", fontFamily: "var(--font-sans)" }}>
      <header style={{ padding: "2.5rem 0 2rem", borderBottom: "0.5px solid var(--color-border-tertiary)", marginBottom: "0.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 10 }}>Protect Frederick · Budget Transparency</div>
        <h1 style={{ fontSize: 32, fontWeight: 500, margin: "0 0 0.75rem", color: "var(--color-text-primary)", lineHeight: 1.15 }}>Frederick County FY2027 Budget</h1>
        <p style={{ fontSize: 17, color: "var(--color-text-secondary)", margin: "0 0 1rem", lineHeight: 1.7, maxWidth: 600 }}>
          The county faces a $41.3 million structural shortfall. To close it, the Board proposed raising taxes, drawing down reserves, and cutting school funding. This is the data behind those decisions.
        </p>
        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", opacity: 0.7 }}>Sources: FY2027 Public Hearing Presentation · Budget Working Documents · FCPS Feb. 11 Work Session - Frederick County, VA · March 2026</div>
      </header>

      <SectionNav active={active} />

      {SECTIONS.map(({ id, eyebrow, title, desc, open, C: Comp }) => (
        <Section key={id} id={id} eyebrow={eyebrow} title={title} description={desc} defaultOpen={open}>
          <Comp />
        </Section>
      ))}

      
    </div>
  );
}
