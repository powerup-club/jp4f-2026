"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Registration {
  timestamp: string; lang: string; type: string;
  fullName: string; email: string; phone: string;
  university: string; branch: string; yearOfStudy: string;
  teamName: string; projTitle: string; projDomain: string;
  demoFormat: string; heardFrom: string; fileLink: string;
}
interface QuizResult {
  timestamp: string; firstName: string; lastName: string;
  lang: string; branch: string; profile: string; rating: string; comment: string;
}

const BRANCH_COLORS: Record<string, string> = {
  GESI: "#00f5a0", MECA: "#f5a000", MECATRONIQUE: "#cc44ff", GI: "#0088ff",
};
const DOMAIN_COLORS = ["#f5a000","#00f5a0","#cc44ff","#0088ff","#ff4466","#00ccff","#ffcc00","#888"];

// ── Helpers ───────────────────────────────────────────────────────────────────
function countBy<T>(arr: T[], key: keyof T) {
  return arr.reduce((acc, item) => {
    const k = String(item[key] || "Inconnu");
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}
function toChartData(obj: Record<string, number>) {
  return Object.entries(obj).map(([name, value]) => ({ name, value }));
}
function exportCSV(data: any[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const rows    = data.map(r => headers.map(h => `"${String(r[h]||"").replace(/"/g,'""')}"`).join(","));
  const csv     = [headers.join(","), ...rows].join("\n");
  const blob    = new Blob([csv], { type:"text/csv;charset=utf-8;" });
  const url     = URL.createObjectURL(blob);
  const a       = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ── StatCard ──────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color="#00f5a0", sub="" }: any) {
  return (
    <div style={{ background:"rgba(255,255,255,.03)", border:`1px solid ${color}22`, borderRadius:16, padding:"20px 22px" }}>
      <div style={{ fontSize:28, marginBottom:8 }}>{icon}</div>
      <div style={{ color:"rgba(255,255,255,.4)", fontSize:11, fontWeight:700, letterSpacing:2, marginBottom:4 }}>{label}</div>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:800, color }}>{value}</div>
      {sub && <div style={{ color:"rgba(255,255,255,.3)", fontSize:12, marginTop:4 }}>{sub}</div>}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tab,          setTab]       = useState<"overview"|"registrations"|"quiz">("overview");
  const [regData,      setRegData]   = useState<Registration[]>([]);
  const [quizData,     setQuizData]  = useState<QuizResult[]>([]);
  const [loading,      setLoading]   = useState(true);
  const [lastRefresh,  setLastRefresh] = useState<Date | null>(null);
  const [search,       setSearch]    = useState("");
  const [autoRefresh,  setAutoRefresh] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [rRes, qRes] = await Promise.all([
        fetch("/api/admin/data?type=register"),
        fetch("/api/admin/data?type=quiz"),
      ]);
      const [rJson, qJson] = await Promise.all([rRes.json(), qRes.json()]);
      if (rJson.rows) setRegData(rJson.rows);
      if (qJson.rows) setQuizData(qJson.rows);
      setLastRefresh(new Date());
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { if (status === "authenticated") fetchData(); }, [status, fetchData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(fetchData, 30000);
    return () => clearInterval(id);
  }, [autoRefresh, fetchData]);

  if (status === "loading" || status === "unauthenticated") return <Loader/>;

  // ── Computed stats ──────────────────────────────────────────────────────────
  const totalReg    = regData.length;
  const teamReg     = regData.filter(r => r.type === "Équipe").length;
  const indivReg    = totalReg - teamReg;
  const totalQuiz   = quizData.length;
  const avgRating   = quizData.length
    ? (quizData.reduce((s,q) => s + (parseFloat(q.rating)||0), 0) / quizData.length).toFixed(1)
    : "—";

  const branchDist  = toChartData(countBy(quizData, "branch"));
  const domainDist  = toChartData(countBy(regData,  "projDomain"));
  const univDist    = toChartData(countBy(regData,  "university")).sort((a,b)=>b.value-a.value).slice(0,8);
  const heardDist   = toChartData(countBy(regData,  "heardFrom"));
  const typeDist    = [
    { name:"Individuel", value:indivReg },
    { name:"Équipe",     value:teamReg  },
  ];

  const filteredReg = regData.filter(r =>
    [r.fullName, r.email, r.university, r.projTitle, r.teamName]
      .join(" ").toLowerCase().includes(search.toLowerCase())
  );
  const filteredQuiz = quizData.filter(q =>
    [q.firstName, q.lastName, q.branch, q.profile]
      .join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight:"100vh", background:"#04080f", fontFamily:"'DM Sans',sans-serif", color:"#e8f4f0" }}>
      {/* BG */}
      <div style={{ position:"fixed", inset:0, backgroundImage:"linear-gradient(rgba(245,160,0,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(245,160,0,.02) 1px,transparent 1px)", backgroundSize:"46px 46px", pointerEvents:"none" }}/>

      {/* Header */}
      <div style={{ position:"sticky", top:0, background:"rgba(4,8,15,.9)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,.07)", zIndex:100, padding:"14px 28px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, background:"linear-gradient(135deg,#fff,#f5a000)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            JESI 2026 · Admin
          </div>
          <div style={{ background:"rgba(0,245,160,.1)", border:"1px solid rgba(0,245,160,.2)", color:"#00f5a0", fontSize:10, fontWeight:700, letterSpacing:2, padding:"3px 10px", borderRadius:10 }}>
            DASHBOARD
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {lastRefresh && (
            <span style={{ color:"rgba(255,255,255,.25)", fontSize:11 }}>
              Mis à jour {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <button onClick={()=>setAutoRefresh(a=>!a)} style={{ background:autoRefresh?"rgba(0,245,160,.1)":"rgba(255,255,255,.05)", border:`1px solid ${autoRefresh?"rgba(0,245,160,.3)":"rgba(255,255,255,.1)"}`, color:autoRefresh?"#00f5a0":"rgba(255,255,255,.4)", borderRadius:8, padding:"6px 12px", cursor:"pointer", fontSize:12, fontWeight:600 }}>
            {autoRefresh ? "⟳ Auto ON" : "⟳ Auto OFF"}
          </button>
          <button onClick={fetchData} style={{ background:"rgba(245,160,0,.1)", border:"1px solid rgba(245,160,0,.25)", color:"#f5a000", borderRadius:8, padding:"6px 14px", cursor:"pointer", fontSize:12, fontWeight:600 }}>
            Actualiser
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            {session?.user?.image && <img src={session.user.image} style={{ width:28, height:28, borderRadius:"50%" }} alt=""/>}
            <span style={{ color:"rgba(255,255,255,.5)", fontSize:12 }}>{session?.user?.email}</span>
          </div>
          <button onClick={()=>signOut({callbackUrl:"/admin/login"})} style={{ background:"rgba(255,80,80,.08)", border:"1px solid rgba(255,80,80,.15)", color:"rgba(255,100,100,.7)", borderRadius:8, padding:"6px 12px", cursor:"pointer", fontSize:12 }}>
            Déconnexion
          </button>
        </div>
      </div>

      <div style={{ maxWidth:1400, margin:"0 auto", padding:"28px 24px" }}>

        {/* Tabs */}
        <div style={{ display:"flex", gap:8, marginBottom:28 }}>
          {(["overview","registrations","quiz"] as const).map(t => (
            <button key={t} onClick={()=>setTab(t)} style={{ background:tab===t?"rgba(245,160,0,.12)":"rgba(255,255,255,.04)", border:`1px solid ${tab===t?"rgba(245,160,0,.35)":"rgba(255,255,255,.08)"}`, color:tab===t?"#f5a000":"rgba(255,255,255,.4)", borderRadius:10, padding:"8px 20px", cursor:"pointer", fontSize:13, fontWeight:700, letterSpacing:.5, textTransform:"capitalize" }}>
              {t === "overview" ? "Vue d'ensemble" : t === "registrations" ? "Inscriptions" : "Quiz"}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:300, flexDirection:"column", gap:16 }}>
            <div style={{ width:40, height:40, border:"3px solid rgba(245,160,0,.2)", borderTop:"3px solid #f5a000", borderRadius:"50%", animation:"spin .8s linear infinite" }}/>
            <p style={{ color:"rgba(255,255,255,.3)" }}>Chargement des données...</p>
          </div>
        ) : (
          <>
            {/* ── OVERVIEW ── */}
            {tab === "overview" && (
              <>
                {/* Stat cards */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:14, marginBottom:28 }}>
                  <StatCard icon="📋" label="INSCRIPTIONS TOTALES" value={totalReg} color="#f5a000"/>
                  <StatCard icon="👤" label="INDIVIDUELS" value={indivReg} color="#00f5a0" sub={`${totalReg ? Math.round(indivReg/totalReg*100) : 0}%`}/>
                  <StatCard icon="👥" label="ÉQUIPES" value={teamReg} color="#cc44ff" sub={`${totalReg ? Math.round(teamReg/totalReg*100) : 0}%`}/>
                  <StatCard icon="🧠" label="QUIZ COMPLÉTÉS" value={totalQuiz} color="#0088ff"/>
                  <StatCard icon="⭐" label="NOTE MOYENNE QUIZ" value={avgRating} color="#f5c400" sub="/ 5 étoiles"/>
                </div>

                {/* Charts row 1 */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
                  <ChartCard title="Résultats Quiz — Filières" subtitle={`${totalQuiz} participants`}>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={branchDist} margin={{top:8,right:8,left:-20,bottom:0}}>
                        <XAxis dataKey="name" tick={{fill:"rgba(255,255,255,.5)",fontSize:12}}/>
                        <YAxis tick={{fill:"rgba(255,255,255,.3)",fontSize:11}}/>
                        <Tooltip contentStyle={{background:"#0d1520",border:"1px solid rgba(255,255,255,.1)",borderRadius:8,color:"#fff"}}/>
                        <Bar dataKey="value" radius={[6,6,0,0]}>
                          {branchDist.map((entry, i) => (
                            <Cell key={i} fill={BRANCH_COLORS[entry.name] || "#888"}/>
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="Type de participation" subtitle="Individuel vs Équipe">
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={typeDist} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" label={({name,value})=>`${name}: ${value}`} labelLine={false}>
                          <Cell fill="#f5a000"/><Cell fill="#cc44ff"/>
                        </Pie>
                        <Tooltip contentStyle={{background:"#0d1520",border:"1px solid rgba(255,255,255,.1)",borderRadius:8,color:"#fff"}}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </div>

                {/* Charts row 2 */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  <ChartCard title="Domaines de projet" subtitle="Distribution">
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={domainDist} layout="vertical" margin={{top:4,right:8,left:8,bottom:0}}>
                        <XAxis type="number" tick={{fill:"rgba(255,255,255,.3)",fontSize:11}}/>
                        <YAxis type="category" dataKey="name" width={140} tick={{fill:"rgba(255,255,255,.5)",fontSize:11}}/>
                        <Tooltip contentStyle={{background:"#0d1520",border:"1px solid rgba(255,255,255,.1)",borderRadius:8,color:"#fff"}}/>
                        <Bar dataKey="value" radius={[0,6,6,0]}>
                          {domainDist.map((_,i)=><Cell key={i} fill={DOMAIN_COLORS[i%DOMAIN_COLORS.length]}/>)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="Comment ils ont entendu parler" subtitle="Canaux">
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={heardDist} cx="50%" cy="50%" outerRadius={85} paddingAngle={3} dataKey="value">
                          {heardDist.map((_,i)=><Cell key={i} fill={DOMAIN_COLORS[i%DOMAIN_COLORS.length]}/>)}
                        </Pie>
                        <Tooltip contentStyle={{background:"#0d1520",border:"1px solid rgba(255,255,255,.1)",borderRadius:8,color:"#fff"}}/>
                        <Legend wrapperStyle={{color:"rgba(255,255,255,.5)",fontSize:11}}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </div>
              </>
            )}

            {/* ── REGISTRATIONS ── */}
            {tab === "registrations" && (
              <>
                <TableToolbar
                  search={search} onSearch={setSearch}
                  onExport={()=>exportCSV(filteredReg, "inscriptions-jesi-2026.csv")}
                  count={filteredReg.length} total={totalReg}
                />
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                    <thead>
                      <tr style={{ background:"rgba(245,160,0,.06)", borderBottom:"1px solid rgba(255,255,255,.08)" }}>
                        {["#","Nom","Email","Type","Université","Filière","Titre projet","Domaine","Fichier","Date"].map(h=>(
                          <th key={h} style={{ padding:"10px 14px", textAlign:"left", color:"rgba(255,255,255,.4)", fontWeight:700, fontSize:11, letterSpacing:1, whiteSpace:"nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReg.map((r, i) => (
                        <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,.04)", transition:"background .15s" }}
                          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.03)"}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          <td style={td}>{i+1}</td>
                          <td style={{...td, fontWeight:600, color:"#fff"}}>{r.fullName}</td>
                          <td style={{...td, color:"rgba(255,255,255,.5)"}}>{r.email}</td>
                          <td style={td}>
                            <span style={{ background:r.type==="Équipe"?"rgba(204,68,255,.15)":"rgba(0,245,160,.1)", color:r.type==="Équipe"?"#cc44ff":"#00f5a0", borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:700 }}>
                              {r.type}
                            </span>
                          </td>
                          <td style={{...td, color:"rgba(255,255,255,.6)"}}>{r.university}</td>
                          <td style={{...td, color:"rgba(255,255,255,.5)"}}>{r.branch}</td>
                          <td style={{...td, maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:"rgba(255,255,255,.7)"}}>{r.projTitle}</td>
                          <td style={{...td, color:"rgba(255,255,255,.45)", fontSize:11}}>{r.projDomain}</td>
                          <td style={td}>
                            {r.fileLink ? (
                              <a href={r.fileLink} target="_blank" rel="noreferrer" style={{ color:"#f5a000", fontSize:11, fontWeight:600 }}>📄 Voir</a>
                            ) : <span style={{ color:"rgba(255,255,255,.2)" }}>—</span>}
                          </td>
                          <td style={{...td, color:"rgba(255,255,255,.3)", fontSize:11}}>{r.timestamp ? new Date(r.timestamp).toLocaleDateString("fr-FR") : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredReg.length === 0 && <Empty text="Aucune inscription trouvée"/>}
                </div>
              </>
            )}

            {/* ── QUIZ ── */}
            {tab === "quiz" && (
              <>
                <TableToolbar
                  search={search} onSearch={setSearch}
                  onExport={()=>exportCSV(filteredQuiz, "quiz-jesi-2026.csv")}
                  count={filteredQuiz.length} total={totalQuiz}
                />
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                    <thead>
                      <tr style={{ background:"rgba(0,136,255,.05)", borderBottom:"1px solid rgba(255,255,255,.08)" }}>
                        {["#","Prénom","Nom","Filière","Profil","Note","Commentaire","Langue","Date"].map(h=>(
                          <th key={h} style={{ padding:"10px 14px", textAlign:"left", color:"rgba(255,255,255,.4)", fontWeight:700, fontSize:11, letterSpacing:1, whiteSpace:"nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuiz.map((q, i) => (
                        <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,.04)" }}
                          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.03)"}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          <td style={td}>{i+1}</td>
                          <td style={{...td, fontWeight:600, color:"#fff"}}>{q.firstName}</td>
                          <td style={{...td, color:"rgba(255,255,255,.7)"}}>{q.lastName}</td>
                          <td style={td}>
                            <span style={{ background:`${BRANCH_COLORS[q.branch] || "#888"}18`, color:BRANCH_COLORS[q.branch]||"#888", borderRadius:6, padding:"2px 10px", fontSize:11, fontWeight:700 }}>
                              {q.branch}
                            </span>
                          </td>
                          <td style={{...td, color:"rgba(255,255,255,.6)"}}>{q.profile}</td>
                          <td style={td}>
                            <span style={{ color:"#f5c400" }}>{"★".repeat(parseInt(q.rating)||0)}</span>
                            <span style={{ color:"rgba(255,255,255,.15)" }}>{"★".repeat(5-(parseInt(q.rating)||0))}</span>
                          </td>
                          <td style={{...td, maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:"rgba(255,255,255,.4)", fontSize:12}}>{q.comment || "—"}</td>
                          <td style={{...td, color:"rgba(255,255,255,.35)", fontSize:11}}>{q.lang?.toUpperCase()}</td>
                          <td style={{...td, color:"rgba(255,255,255,.3)", fontSize:11}}>{q.timestamp ? new Date(q.timestamp).toLocaleDateString("fr-FR") : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredQuiz.length === 0 && <Empty text="Aucun résultat quiz trouvé"/>}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ── Small sub-components ──────────────────────────────────────────────────────
function ChartCard({ title, subtitle, children }: any) {
  return (
    <div style={{ background:"rgba(255,255,255,.025)", border:"1px solid rgba(255,255,255,.07)", borderRadius:16, padding:"20px 18px" }}>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:"#fff", marginBottom:2 }}>{title}</div>
      <div style={{ color:"rgba(255,255,255,.3)", fontSize:12, marginBottom:16 }}>{subtitle}</div>
      {children}
    </div>
  );
}
function TableToolbar({ search, onSearch, onExport, count, total }: any) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16, flexWrap:"wrap" }}>
      <input value={search} onChange={e=>onSearch(e.target.value)} placeholder="Rechercher..."
        style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:10, padding:"9px 14px", color:"#fff", fontSize:14, fontFamily:"'DM Sans',sans-serif", flex:1, minWidth:200 }}/>
      <span style={{ color:"rgba(255,255,255,.3)", fontSize:12 }}>{count} / {total} résultats</span>
      <button onClick={onExport} style={{ background:"rgba(0,245,160,.08)", border:"1px solid rgba(0,245,160,.2)", color:"#00f5a0", borderRadius:10, padding:"9px 18px", cursor:"pointer", fontSize:13, fontWeight:700 }}>
        ⬇ Export CSV
      </button>
    </div>
  );
}
function Empty({ text }: { text: string }) {
  return <div style={{ textAlign:"center", padding:"48px", color:"rgba(255,255,255,.25)", fontSize:14 }}>{text}</div>;
}
function Loader() {
  return (
    <div style={{ minHeight:"100vh", background:"#04080f", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:40, height:40, border:"3px solid rgba(245,160,0,.2)", borderTop:"3px solid #f5a000", borderRadius:"50%", animation:"spin .8s linear infinite" }}/>
    </div>
  );
}
const td: React.CSSProperties = { padding:"11px 14px", color:"rgba(255,255,255,.65)", whiteSpace:"nowrap" };
