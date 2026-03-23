"use client";
import { useState } from "react";
import Link from "next/link";

const CARDS = [
  { tech:"Panneau solaire photovoltaïque", branch:"GESI", icon:"☀️", why:"L'énergie renouvelable est au cœur du GESI" },
  { tech:"Bras robotique industriel", branch:"Mécatronique", icon:"🦾", why:"Fusion mécanique + électronique + informatique" },
  { tech:"Simulation par éléments finis", branch:"Génie Mécanique", icon:"🔩", why:"Outil fondamental du calcul de structures" },
  { tech:"Tableau de bord Lean (A3)", branch:"Génie Industriel", icon:"📊", why:"Management visuel au cœur du GI" },
  { tech:"Capteur IoT de température", branch:"GESI", icon:"🌡️", why:"Systèmes intelligents et mesure énergétique" },
  { tech:"Impression 3D métal", branch:"Génie Mécanique", icon:"🖨️", why:"Fabrication additive et matériaux avancés" },
  { tech:"Variateur de vitesse servo", branch:"Mécatronique", icon:"⚡", why:"Commande électrique de systèmes mécaniques" },
  { tech:"Carte kanban de production", branch:"Génie Industriel", icon:"🗂️", why:"Gestion de flux et production tirée" },
  { tech:"Hydrogène vert (électrolyse)", branch:"GESI", icon:"💧", why:"Vecteur énergétique du futur" },
  { tech:"Analyse vibratoire de roulement", branch:"Génie Mécanique", icon:"📈", why:"Mécanique des solides et maintenance" },
  { tech:"PLC Siemens S7", branch:"Mécatronique", icon:"🖥️", why:"Automate programmable industriel" },
  { tech:"Cartographie VSM (Value Stream)", branch:"Génie Industriel", icon:"🗺️", why:"Identifier et éliminer les gaspillages" },
  { tech:"Batterie Li-ion pour stockage", branch:"GESI", icon:"🔋", why:"Stockage d'énergie et systèmes embarqués" },
  { tech:"CAO SolidWorks / CATIA", branch:"Génie Mécanique", icon:"📐", why:"Conception assistée par ordinateur" },
  { tech:"Capteur de force piezoélectrique", branch:"Mécatronique", icon:"🔬", why:"Interface capteur-actionneur mécatronique" },
  { tech:"Diagramme de Gantt projet", branch:"Génie Industriel", icon:"📅", why:"Planification et gestion de projets industriels" },
  { tech:"Éolienne offshore", branch:"GESI", icon:"🌊", why:"Énergies renouvelables marines" },
  { tech:"Soufflerie aérodynamique", branch:"Génie Mécanique", icon:"💨", why:"Mécanique des fluides et aérodynamique" },
  { tech:"Vision par ordinateur (OpenCV)", branch:"Mécatronique", icon:"👁️", why:"Perception machine et traitement d'image" },
  { tech:"Méthode AMDEC", branch:"Génie Industriel", icon:"⚠️", why:"Analyse des risques et qualité" },
];

const COLORS: Record<string,string> = {
  "GESI":"#00f5a0",
  "Génie Mécanique":"#f5a000",
  "Mécatronique":"#cc44ff",
  "Génie Industriel":"#0088ff",
};
const ICONS: Record<string,string> = { "GESI":"⚡","Génie Mécanique":"⚙️","Mécatronique":"🤖","Génie Industriel":"📊" };

export default function FilièreMatch() {
  const [shuffled] = useState(() => [...CARDS].sort(()=>Math.random()-.5));
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<Record<string,number>>({ GESI:0, "Génie Mécanique":0, Mécatronique:0, "Génie Industriel":0 });
  const [history, setHistory] = useState<{tech:string,branch:string,chose:string}[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const [drag, setDrag] = useState<null|"left"|"right">(null);

  const current = shuffled[index];

  const choose = (branch: string) => {
    if (revealed || done) return;
    const correct = branch === current.branch;
    setScores(s => ({ ...s, [current.branch]: s[current.branch] + (correct ? 1 : 0) }));
    setHistory(h => [...h, { tech:current.tech, branch:current.branch, chose:branch }]);
    setRevealed(true);
  };

  const next = () => {
    if (index >= shuffled.length - 1) { setDone(true); return; }
    setIndex(i=>i+1);
    setRevealed(false);
    setDrag(null);
  };

  const restart = () => { setIndex(0); setScores({ GESI:0,"Génie Mécanique":0,Mécatronique:0,"Génie Industriel":0 }); setHistory([]); setRevealed(false); setDone(false); setDrag(null); };

  const winner = Object.entries(scores).sort((a,b)=>b[1]-a[1])[0][0];
  const total = Object.values(scores).reduce((a,b)=>a+b,0);

  if (done) return (
    <div style={{ padding:"28px", maxWidth:680, margin:"0 auto", textAlign:"center" }}>
      <div style={{ fontSize:56, marginBottom:12 }}>{ICONS[winner]}</div>
      <div style={{ fontSize:10, letterSpacing:3, color:"rgba(255,255,255,.4)", fontWeight:700, marginBottom:6 }}>TU ES PLUTÔT...</div>
      <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:COLORS[winner], marginBottom:6 }}>{winner}</h2>
      <p style={{ color:"rgba(255,255,255,.4)", fontSize:14, marginBottom:24 }}>{total}/{shuffled.length} bonnes réponses</p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24 }}>
        {Object.entries(scores).map(([branch, score]) => (
          <div key={branch} style={{ background:`${COLORS[branch]}0d`, border:`1px solid ${COLORS[branch]}25`, borderRadius:12, padding:"14px" }}>
            <div style={{ fontSize:20, marginBottom:4 }}>{ICONS[branch]}</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:COLORS[branch] }}>{branch}</div>
            <div style={{ fontSize:24, fontWeight:800, color:"#fff", marginTop:4 }}>{score}<span style={{fontSize:13,color:"rgba(255,255,255,.3)"}}>/{shuffled.length/4|0}</span></div>
          </div>
        ))}
      </div>

      <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:14, padding:"16px", marginBottom:20, textAlign:"left" }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:700, color:"rgba(255,255,255,.4)", marginBottom:12 }}>📋 RÉCAPITULATIF</div>
        {history.map((h,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,.04)", fontSize:13 }}>
            <span>{h.chose===h.branch?"✅":"❌"}</span>
            <span style={{ flex:1, color:"rgba(255,255,255,.7)" }}>{h.tech}</span>
            <span style={{ color:COLORS[h.branch], fontSize:11 }}>{h.branch}</span>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
        <button onClick={restart} style={{ background:"linear-gradient(135deg,#cc44ff,#8844cc)", border:"none", borderRadius:12, padding:"13px 24px", color:"#fff", fontWeight:800, fontSize:14, cursor:"pointer", fontFamily:"'Syne',sans-serif" }}>Rejouer</button>
        <Link href="/application/orientation" style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.12)", borderRadius:12, padding:"13px 20px", color:"rgba(255,255,255,.6)", fontSize:14, textDecoration:"none" }}>🗺️ Mon profil filière</Link>
      </div>
    </div>
  );

  return (
    <div style={{ padding:"28px", maxWidth:560, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <Link href="/application/games" style={{ color:"rgba(255,255,255,.4)", fontSize:13, textDecoration:"none" }}>← Retour</Link>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:"rgba(255,255,255,.5)" }}>🃏 {index+1}/{shuffled.length}</div>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:700, color:"#cc44ff" }}>✅ {total}</div>
      </div>

      <div style={{ height:4, background:"rgba(255,255,255,.06)", borderRadius:2, marginBottom:28 }}>
        <div style={{ height:"100%", width:`${((index)/shuffled.length)*100}%`, background:"#cc44ff", borderRadius:2, transition:"width .3s" }}/>
      </div>

      <p style={{ color:"rgba(255,255,255,.4)", fontSize:13, textAlign:"center", marginBottom:16 }}>Quelle filière utilise cette technologie ?</p>

      {/* Card */}
      <div style={{ background:`rgba(204,68,255,.06)`, border:`2px solid ${revealed?COLORS[current.branch]:"rgba(204,68,255,.2)"}`, borderRadius:24, padding:"40px 28px", textAlign:"center", marginBottom:24, transition:"border-color .3s" }}>
        <div style={{ fontSize:56, marginBottom:16 }}>{current.icon}</div>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:"#fff", marginBottom:8 }}>{current.tech}</div>
        {revealed && (
          <div style={{ marginTop:16, padding:"12px 16px", background:`${COLORS[current.branch]}12`, border:`1px solid ${COLORS[current.branch]}30`, borderRadius:12 }}>
            <div style={{ color:COLORS[current.branch], fontWeight:700, fontSize:14, marginBottom:4 }}>✅ {current.branch}</div>
            <div style={{ color:"rgba(255,255,255,.5)", fontSize:12 }}>{current.why}</div>
          </div>
        )}
      </div>

      {/* Choices */}
      {!revealed ? (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {Object.keys(COLORS).map(branch => (
            <button key={branch} onClick={()=>choose(branch)}
              style={{ background:`${COLORS[branch]}0d`, border:`1px solid ${COLORS[branch]}25`, borderRadius:14, padding:"14px 10px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:6, transition:"all .2s" }}>
              <span style={{ fontSize:22 }}>{ICONS[branch]}</span>
              <span style={{ fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:700, color:COLORS[branch] }}>{branch}</span>
            </button>
          ))}
        </div>
      ) : (
        <button onClick={next} style={{ width:"100%", background:"linear-gradient(135deg,#cc44ff,#8844cc)", border:"none", borderRadius:12, padding:"14px", color:"#fff", fontWeight:800, fontSize:14, cursor:"pointer", fontFamily:"'Syne',sans-serif" }}>
          {index < shuffled.length-1 ? "Carte suivante →" : "Voir mes résultats →"}
        </button>
      )}
    </div>
  );
}
