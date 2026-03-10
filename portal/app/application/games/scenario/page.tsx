"use client";
import { useState } from "react";
import Link from "next/link";

export default function ScenarioChallenge() {
  const [phase, setPhase] = useState<"intro"|"loading"|"game"|"judging"|"result">("intro");
  const [scenario, setScenario] = useState<any>(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<any>(null);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<any>(null);

  const loadScenario = async () => {
    setPhase("loading");
    const res = await fetch("/api/scenario");
    const data = await res.json();
    setScenario(data.scenario);
    setAnswer("");
    setResult(null);
    setTimer(0);
    const t = setInterval(()=>setTimer(s=>s+1), 1000);
    setTimerInterval(t);
    setPhase("game");
  };

  const submit = async () => {
    if (answer.trim().length < 50) return alert("Développe davantage ta réponse (min. 50 caractères).");
    clearInterval(timerInterval);
    setPhase("judging");
    const res = await fetch("/api/scenario", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ scenario, answer }) });
    setResult(await res.json());
    setPhase("result");
  };

  const fmt = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`;

  const LEVELS: Record<string,string> = { "Expert 🏆":"#00f5a0", "Avancé ⭐":"#88cc44", "Intermédiaire 📈":"#f5a000", "Débutant 🌱":"#ff8844" };

  if (phase==="intro") return (
    <div style={{ padding:"28px", maxWidth:680, margin:"0 auto", textAlign:"center" }}>
      <Link href="/application/games" style={{ color:"rgba(255,255,255,.4)", fontSize:13, textDecoration:"none", display:"inline-block", marginBottom:20 }}>← Retour aux jeux</Link>
      <div style={{ fontSize:56, marginBottom:16 }}>⚡</div>
      <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:"#fff", marginBottom:8 }}>Scenario Challenge</h1>
      <p style={{ color:"rgba(255,255,255,.4)", fontSize:14, marginBottom:8 }}>Un problème industriel réel du Maroc. Tu as 15 minutes pour proposer une solution d'ingénieur.</p>
      <p style={{ color:"rgba(255,255,255,.3)", fontSize:13, marginBottom:28 }}>L'IA expert évalue ta réponse et te donne un score détaillé avec un corrigé.</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:28 }}>
        {[["🏭","Industrie & Usines","Problèmes de production réels"],["🏠","Habitat & Énergie","Logement et domotique"],["🚗","Mobilité & Ville","Transport et smart city"]].map(([icon,title,desc],i)=>(
          <div key={i} style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", borderRadius:12, padding:"14px 10px" }}>
            <div style={{ fontSize:24, marginBottom:6 }}>{icon}</div>
            <div style={{ fontWeight:700, color:"#fff", fontSize:12, marginBottom:2 }}>{title}</div>
            <div style={{ color:"rgba(255,255,255,.3)", fontSize:10 }}>{desc}</div>
          </div>
        ))}
      </div>
      <button onClick={loadScenario} style={{ background:"linear-gradient(135deg,#0088ff,#0055cc)", border:"none", borderRadius:12, padding:"14px 32px", color:"#fff", fontWeight:800, fontSize:15, cursor:"pointer", fontFamily:"'Syne',sans-serif" }}>Démarrer un scénario →</button>
    </div>
  );

  if (phase==="loading") return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"60vh", gap:16 }}>
      <div style={{ width:48, height:48, border:"4px solid rgba(0,136,255,.2)", borderTop:"4px solid #0088ff", borderRadius:"50%", animation:"spin .8s linear infinite" }}/>
      <div style={{ color:"rgba(255,255,255,.6)", fontSize:16, fontFamily:"'Syne',sans-serif", fontWeight:700 }}>Chargement du scénario...</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (phase==="game") return (
    <div style={{ padding:"28px", maxWidth:720, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:10 }}>
        <Link href="/application/games" style={{ color:"rgba(255,255,255,.4)", fontSize:13, textDecoration:"none" }}>← Quitter</Link>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <span style={{ background:"rgba(0,136,255,.1)", border:"1px solid rgba(0,136,255,.3)", color:"#0088ff", padding:"4px 12px", borderRadius:8, fontSize:12, fontWeight:700 }}>{scenario?.domain}</span>
          <span style={{ fontFamily:"'Syne',sans-serif", color:"rgba(255,255,255,.4)", fontSize:14 }}>⏱ {fmt(timer)}</span>
        </div>
      </div>

      {/* Scenario card */}
      <div style={{ background:"rgba(0,136,255,.05)", border:"2px solid rgba(0,136,255,.2)", borderRadius:20, padding:"24px", marginBottom:20 }}>
        <div style={{ fontSize:10, letterSpacing:2, color:"rgba(0,136,255,.6)", fontWeight:700, marginBottom:8 }}>SCÉNARIO — {scenario?.title?.toUpperCase()}</div>
        <div style={{ color:"rgba(255,255,255,.8)", fontSize:14, lineHeight:1.7, marginBottom:16 }}>{scenario?.situation}</div>
        <div style={{ background:"rgba(0,136,255,.08)", border:"1px solid rgba(0,136,255,.25)", borderRadius:12, padding:"14px 16px" }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, color:"#0088ff", marginBottom:6 }}>🎯 TON DÉFI</div>
          <div style={{ color:"#fff", fontSize:14, fontWeight:600 }}>{scenario?.challenge}</div>
        </div>
      </div>

      {/* Tips */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
        {["Identifie le problème précisément","Propose une solution concrète","Chiffre ton impact","Pense aux contraintes"].map((tip,i)=>(
          <span key={i} style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:8, padding:"4px 10px", color:"rgba(255,255,255,.4)", fontSize:11 }}>💡 {tip}</span>
        ))}
      </div>

      <textarea value={answer} onChange={e=>setAnswer(e.target.value)} placeholder={`Commence par analyser le problème...\n\nPar exemple :\n- Diagnostic : le problème principal est...\n- Solution proposée : ...\n- Technologies utilisées : ...\n- Impact estimé : ...\n- Budget approximatif : ...`}
        rows={12} style={{ width:"100%", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.1)", borderRadius:12, padding:"16px", color:"#fff", fontSize:14, fontFamily:"'DM Sans',sans-serif", boxSizing:"border-box", resize:"vertical", lineHeight:1.7, outline:"none", marginBottom:8 }}/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <span style={{ color:"rgba(255,255,255,.2)", fontSize:11 }}>{answer.length} caractères · min. 50</span>
        <span style={{ color:timer>600?"#ff8844":"rgba(255,255,255,.2)", fontSize:11 }}>⏱ {fmt(timer)}</span>
      </div>

      <div style={{ display:"flex", gap:10 }}>
        <button onClick={loadScenario} style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.1)", borderRadius:10, padding:"12px 18px", color:"rgba(255,255,255,.4)", cursor:"pointer", fontSize:14 }}>🔄 Autre scénario</button>
        <button onClick={submit} disabled={answer.trim().length<50}
          style={{ flex:1, background:"linear-gradient(135deg,#0088ff,#0055cc)", border:"none", borderRadius:10, padding:"12px", color:"#fff", fontWeight:800, fontSize:14, cursor:"pointer", opacity:answer.trim().length<50?.5:1, fontFamily:"'Syne',sans-serif" }}>
          ⚡ Soumettre à l'expert IA →
        </button>
      </div>
    </div>
  );

  if (phase==="judging") return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"60vh", gap:16 }}>
      <div style={{ width:48, height:48, border:"4px solid rgba(0,136,255,.2)", borderTop:"4px solid #0088ff", borderRadius:"50%", animation:"spin .8s linear infinite" }}/>
      <div style={{ color:"rgba(255,255,255,.6)", fontSize:16, fontFamily:"'Syne',sans-serif", fontWeight:700 }}>L'expert IA analyse ta solution...</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (phase==="result" && result) {
    const levelColor = LEVELS[result.level] || "#f5a000";
    return (
      <div style={{ padding:"28px", maxWidth:720, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:10 }}>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:"#fff", margin:0 }}>⚡ Évaluation expert</h2>
          <button onClick={loadScenario} style={{ background:"rgba(0,136,255,.1)", border:"1px solid rgba(0,136,255,.3)", borderRadius:10, padding:"8px 16px", color:"#0088ff", cursor:"pointer", fontSize:13, fontWeight:700 }}>Nouveau scénario →</button>
        </div>

        <div style={{ background:"rgba(255,255,255,.03)", border:`2px solid ${levelColor}30`, borderRadius:20, padding:"24px", marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16, flexWrap:"wrap", gap:12 }}>
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:52, fontWeight:800, color:levelColor, lineHeight:1 }}>{result.score}</div>
              <div style={{ color:"rgba(255,255,255,.3)", fontSize:13 }}>/100</div>
            </div>
            <div style={{ background:`${levelColor}18`, border:`1px solid ${levelColor}30`, borderRadius:12, padding:"10px 16px", textAlign:"center" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:levelColor }}>{result.level}</div>
              <div style={{ color:"rgba(255,255,255,.3)", fontSize:11, marginTop:2 }}>Niveau</div>
            </div>
          </div>
          <p style={{ color:"rgba(255,255,255,.7)", fontSize:14, lineHeight:1.7, margin:"0 0 16px" }}>{result.analysis}</p>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
            <div style={{ background:"rgba(0,245,160,.05)", border:"1px solid rgba(0,245,160,.15)", borderRadius:12, padding:"14px" }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#00f5a0", marginBottom:8 }}>✅ POINTS POSITIFS</div>
              {result.goodPoints?.map((p:string,i:number)=><div key={i} style={{color:"rgba(255,255,255,.7)",fontSize:13,marginBottom:6,paddingLeft:8,borderLeft:"2px solid #00f5a0"}}>• {p}</div>)}
            </div>
            <div style={{ background:"rgba(245,160,0,.05)", border:"1px solid rgba(245,160,0,.15)", borderRadius:12, padding:"14px" }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#f5a000", marginBottom:8 }}>⚡ LACUNES</div>
              {result.gaps?.map((g:string,i:number)=><div key={i} style={{color:"rgba(255,255,255,.7)",fontSize:13,marginBottom:6,paddingLeft:8,borderLeft:"2px solid #f5a000"}}>• {g}</div>)}
            </div>
          </div>

          <div style={{ background:"rgba(0,136,255,.06)", border:"1px solid rgba(0,136,255,.2)", borderRadius:12, padding:"14px", marginBottom:12 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#0088ff", marginBottom:6 }}>📚 ÉLÉMENTS D'UNE RÉPONSE IDÉALE</div>
            <div style={{ color:"rgba(255,255,255,.7)", fontSize:13, lineHeight:1.7 }}>{result.modelAnswer}</div>
          </div>

          <div style={{ background:"rgba(204,68,255,.06)", border:"1px solid rgba(204,68,255,.2)", borderRadius:12, padding:"12px 14px" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#cc44ff", marginBottom:4 }}>💪 ENCOURAGEMENT</div>
            <div style={{ color:"rgba(255,255,255,.7)", fontSize:13 }}>{result.encouragement}</div>
          </div>
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <button onClick={loadScenario} style={{ flex:1, background:"linear-gradient(135deg,#0088ff,#0055cc)", border:"none", borderRadius:12, padding:"13px", color:"#fff", fontWeight:800, fontSize:14, cursor:"pointer", fontFamily:"'Syne',sans-serif" }}>Nouveau scénario →</button>
          <Link href="/application/games" style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.12)", borderRadius:12, padding:"13px 20px", color:"rgba(255,255,255,.5)", fontSize:14, textDecoration:"none", display:"flex", alignItems:"center" }}>← Jeux</Link>
        </div>
      </div>
    );
  }
  return null;
}
