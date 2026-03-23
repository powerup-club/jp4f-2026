"use client";
import { useEffect, useState } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

const CRITERIA = [
  { key:"innovation",   label:"Innovation & Originalité", icon:"💡", desc:"À quel point ton idée est-elle unique ?" },
  { key:"feasibility",  label:"Faisabilité Technique",    icon:"⚙️", desc:"Peux-tu réaliser ton projet avec tes compétences ?" },
  { key:"impact",       label:"Impact & Utilité",          icon:"🎯", desc:"Quel est l'impact de ta solution sur les utilisateurs ?" },
  { key:"presentation", label:"Qualité de Présentation",  icon:"🎤", desc:"Es-tu prêt(e) à présenter clairement ton projet ?" },
  { key:"technical",    label:"Profondeur Technique",      icon:"🔬", desc:"Ton projet a-t-il une vraie substance technique ?" },
];

const COLORS = { 1:"#ff4444", 2:"#ff8844", 3:"#f5a000", 4:"#88cc44", 5:"#00f5a0" };
const VERDICTS: Record<string,string> = { "Excellent":"#00f5a0", "Très bien":"#88cc44", "Bien":"#f5a000", "À améliorer":"#ff8844", "À retravailler":"#ff4444" };

export default function EvaluatePage() {
  const [app, setApp] = useState<any>(null);
  const [scores, setScores] = useState({ innovation:3, feasibility:3, impact:3, presentation:3, technical:3 });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingApp, setLoadingApp] = useState(true);

  useEffect(() => {
    fetch("/api/application").then(r=>r.json()).then(d=>{ setApp(d.application); setLoadingApp(false); });
  }, []);

  const set = (k: string, v: number) => setScores(s=>({...s,[k]:v}));

  const evaluate = async () => {
    if (!app?.proj_title) return alert("Remplis d'abord ton formulaire de candidature avec les détails de ton projet.");
    setLoading(true); setResult(null);
    const res = await fetch("/api/evaluate", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ scores, projTitle:app.proj_title, projDesc:app.proj_desc, projDomain:app.proj_domain, innovation:app.innovation }) });
    setResult(await res.json());
    setLoading(false);
  };

  const radarData = CRITERIA.map(c => ({ subject:c.label.split(" ")[0], value:(scores as any)[c.key]*20, fullMark:100 }));

  if (loadingApp) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh"}}><div style={{width:36,height:36,border:"3px solid rgba(245,160,0,.2)",borderTop:"3px solid #f5a000",borderRadius:"50%",animation:"spin .8s linear infinite"}}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;

  return (
    <div style={{ padding:"28px", maxWidth:860, margin:"0 auto" }}>
      <div style={{ fontSize:10, letterSpacing:3, color:"rgba(245,160,0,.6)", fontWeight:700, marginBottom:6 }}>AUTO-ÉVALUATION</div>
      <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:"#fff", margin:"0 0 4px" }}>📊 Évaluer mon projet</h1>
      <p style={{ color:"rgba(255,255,255,.4)", fontSize:14, marginBottom:24 }}>Note ton projet honnêtement — l'IA te donne un retour de jury.</p>

      {!app?.proj_title && (
        <div style={{ background:"rgba(245,160,0,.06)", border:"1px solid rgba(245,160,0,.2)", borderRadius:12, padding:"16px 20px", marginBottom:20, fontSize:14, color:"rgba(255,200,100,.8)" }}>
          ⚠️ Remplis d'abord ton <a href="/application/form" style={{color:"#f5a000"}}>formulaire de candidature</a> avec les détails de ton projet pour obtenir une évaluation personnalisée.
        </div>
      )}

      {app?.proj_title && (
        <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:12, padding:"12px 16px", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:20 }}>💡</span>
          <div><div style={{ color:"#fff", fontWeight:600, fontSize:14 }}>{app.proj_title}</div><div style={{ color:"rgba(255,255,255,.3)", fontSize:12 }}>{app.proj_domain}</div></div>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:20, marginBottom:20 }}>
        {/* Sliders */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {CRITERIA.map(c => {
            const val = (scores as any)[c.key];
            return (
              <div key={c.key} style={{ background:"rgba(255,255,255,.025)", border:"1px solid rgba(255,255,255,.06)", borderRadius:14, padding:"16px 18px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:18 }}>{c.icon}</span>
                    <span style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:700, color:"#fff" }}>{c.label}</span>
                  </div>
                  <span style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:(COLORS as any)[val] }}>{val}/5</span>
                </div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", marginBottom:10 }}>{c.desc}</div>
                <input type="range" min={1} max={5} value={val} onChange={e=>set(c.key,+e.target.value)}
                  style={{ width:"100%", accentColor:(COLORS as any)[val], cursor:"pointer" }}/>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"rgba(255,255,255,.2)", marginTop:4 }}>
                  <span>Faible</span><span>Excellent</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Radar */}
        <div style={{ background:"rgba(255,255,255,.025)", border:"1px solid rgba(255,255,255,.06)", borderRadius:16, padding:"16px", display:"flex", flexDirection:"column", alignItems:"center" }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:700, color:"rgba(255,255,255,.5)", marginBottom:8, letterSpacing:1 }}>RADAR</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,.08)"/>
              <PolarAngleAxis dataKey="subject" tick={{ fill:"rgba(255,255,255,.4)", fontSize:11 }}/>
              <Radar dataKey="value" stroke="#f5a000" fill="#f5a000" fillOpacity={0.2} strokeWidth={2}/>
            </RadarChart>
          </ResponsiveContainer>
          <div style={{ textAlign:"center", marginTop:8 }}>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.3)" }}>Score auto-évaluation</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:"#f5a000" }}>
              {Math.round(Object.values(scores).reduce((a,b)=>a+b,0)/5*20)}%
            </div>
          </div>
        </div>
      </div>

      <button onClick={evaluate} disabled={loading}
        style={{ width:"100%", background:"linear-gradient(135deg,#f5a000,#c27800)", border:"none", borderRadius:12, padding:"15px", color:"#fff", fontWeight:800, fontSize:15, cursor:"pointer", fontFamily:"'Syne',sans-serif", opacity:loading?.7:1, marginBottom:24 }}>
        {loading?"🤖 Analyse en cours...":"🎯 Obtenir le retour du jury IA"}
      </button>

      {/* Result */}
      {result && (
        <div style={{ animation:"fadeIn .4s ease" }}>
          <div style={{ background:`rgba(255,255,255,.03)`, border:`2px solid ${VERDICTS[result.verdict]||"#f5a000"}33`, borderRadius:20, padding:"24px", marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:12 }}>
              <div>
                <div style={{ fontSize:9, letterSpacing:2, color:"rgba(255,255,255,.4)", fontWeight:700, marginBottom:4 }}>VERDICT DU JURY IA</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:VERDICTS[result.verdict]||"#f5a000" }}>{result.verdict}</div>
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:48, fontWeight:800, color:VERDICTS[result.verdict]||"#f5a000", lineHeight:1 }}>{result.globalScore}</div>
                <div style={{ color:"rgba(255,255,255,.3)", fontSize:12 }}>/100</div>
              </div>
            </div>
            <p style={{ color:"rgba(255,255,255,.7)", fontSize:14, lineHeight:1.7, margin:"0 0 16px" }}>{result.summary}</p>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
              <div style={{ background:"rgba(0,245,160,.05)", border:"1px solid rgba(0,245,160,.15)", borderRadius:12, padding:"14px" }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:700, color:"#00f5a0", marginBottom:8 }}>✅ POINTS FORTS</div>
                {result.strengths?.map((s:string,i:number)=><div key={i} style={{color:"rgba(255,255,255,.7)",fontSize:13,marginBottom:6,paddingLeft:8,borderLeft:"2px solid #00f5a0"}}>• {s}</div>)}
              </div>
              <div style={{ background:"rgba(245,160,0,.05)", border:"1px solid rgba(245,160,0,.15)", borderRadius:12, padding:"14px" }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:700, color:"#f5a000", marginBottom:8 }}>⚡ À AMÉLIORER</div>
                {result.improvements?.map((s:string,i:number)=><div key={i} style={{color:"rgba(255,255,255,.7)",fontSize:13,marginBottom:6,paddingLeft:8,borderLeft:"2px solid #f5a000"}}>• {s}</div>)}
              </div>
            </div>

            <div style={{ background:"rgba(204,68,255,.08)", border:"1px solid rgba(204,68,255,.2)", borderRadius:12, padding:"14px" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:700, color:"#cc44ff", marginBottom:6 }}>🎯 CONSEIL SECRET DU JURY</div>
              <div style={{ color:"rgba(255,255,255,.8)", fontSize:14, fontStyle:"italic" }}>"{result.juryTip}"</div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
    </div>
  );
}
