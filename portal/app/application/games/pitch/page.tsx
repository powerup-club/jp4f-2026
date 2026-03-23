"use client";
import { useState, useEffect, useRef } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import Link from "next/link";

const MAX_SECONDS = 180;

export default function PitchTimer() {
  const [phase, setPhase] = useState<"intro"|"write"|"timer"|"judging"|"result">("intro");
  const [pitch, setPitch] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (running && phase==="timer") {
      intervalRef.current = setInterval(()=>setSeconds(s=>{
        if(s>=MAX_SECONDS){clearInterval(intervalRef.current);setRunning(false);return MAX_SECONDS;}
        return s+1;
      }),1000);
    }
    return ()=>clearInterval(intervalRef.current);
  }, [running, phase]);

  const judge = async () => {
    setPhase("judging");
    const res = await fetch("/api/pitch-judge", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ pitch, duration:seconds }) });
    setResult(await res.json());
    setPhase("result");
  };

  const reset = () => { setPhase("intro"); setPitch(""); setSeconds(0); setRunning(false); setResult(null); };

  const fmt = (s:number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`;
  const pct = (seconds/MAX_SECONDS)*100;
  const timerColor = seconds<90?"#00f5a0":seconds<150?"#f5a000":"#ff4444";

  if (phase==="intro") return (
    <div style={{padding:"28px",maxWidth:680,margin:"0 auto",textAlign:"center"}}>
      <Link href="/application/games" style={{color:"rgba(255,255,255,.4)",fontSize:13,textDecoration:"none",display:"inline-block",marginBottom:20}}>← Retour aux jeux</Link>
      <div style={{fontSize:56,marginBottom:16}}>🎤</div>
      <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:"#fff",marginBottom:8}}>Pitch Timer</h1>
      <p style={{color:"rgba(255,255,255,.4)",fontSize:14,marginBottom:28}}>Présente ton projet en 3 minutes max. Un jury IA te donnera un retour comme un vrai jury.</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:28,textAlign:"left"}}>
        {[["📝","Écris ou colle ton pitch","Rédige ton texte de présentation"],["⏱️","Lance le chronomètre","Simule le timing réel (3 min max)"],["🤖","Soumets au jury IA","L'IA joue le rôle du jury"],["📊","Reçois ton score","Scores détaillés + conseils"]].map(([icon,title,desc],i)=>(
          <div key={i} style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",borderRadius:12,padding:"14px"}}>
            <div style={{fontSize:22,marginBottom:6}}>{icon}</div>
            <div style={{fontWeight:700,color:"#fff",fontSize:13,marginBottom:2}}>{title}</div>
            <div style={{color:"rgba(255,255,255,.3)",fontSize:11}}>{desc}</div>
          </div>
        ))}
      </div>
      <button onClick={()=>setPhase("write")} style={{background:"linear-gradient(135deg,#f5a000,#c27800)",border:"none",borderRadius:12,padding:"14px 32px",color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:"'Syne',sans-serif"}}>Commencer →</button>
    </div>
  );

  if (phase==="write") return (
    <div style={{padding:"28px",maxWidth:680,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <button onClick={()=>setPhase("intro")} style={{background:"none",border:"1px solid rgba(255,255,255,.1)",borderRadius:8,padding:"6px 14px",color:"rgba(255,255,255,.4)",cursor:"pointer",fontSize:13}}>← Retour</button>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:"#fff",margin:0}}>✍️ Ton pitch</h2>
        <div/>
      </div>
      <p style={{color:"rgba(255,255,255,.4)",fontSize:13,marginBottom:16}}>Écris ou colle le texte de ta présentation. Tu pourras aussi lancer le chronomètre pour t'entraîner au timing.</p>
      <textarea value={pitch} onChange={e=>setPitch(e.target.value)} placeholder="Bonjour, je m'appelle... Notre projet s'appelle... Nous avons identifié le problème... Notre solution est... L'innovation est... L'impact est..."
        rows={10} style={{width:"100%",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,padding:"16px",color:"#fff",fontSize:14,fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box",resize:"vertical",lineHeight:1.6,outline:"none"}}/>
      <div style={{color:"rgba(255,255,255,.3)",fontSize:11,marginTop:6,marginBottom:20}}>{pitch.length} caractères · ~{Math.round(pitch.split(" ").length/130)} min de lecture</div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={()=>setPhase("timer")} disabled={pitch.length<50} style={{background:"rgba(245,160,0,.1)",border:"1px solid rgba(245,160,0,.3)",borderRadius:10,padding:"11px 20px",color:"#f5a000",fontSize:14,cursor:"pointer",opacity:pitch.length<50?.5:1}}>⏱️ Entraîner le timing</button>
        <button onClick={judge} disabled={pitch.length<50} style={{flex:1,background:"linear-gradient(135deg,#f5a000,#c27800)",border:"none",borderRadius:10,padding:"11px",color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer",opacity:pitch.length<50?.5:1,fontFamily:"'Syne',sans-serif"}}>🎯 Soumettre au jury IA →</button>
      </div>
    </div>
  );

  if (phase==="timer") return (
    <div style={{padding:"28px",maxWidth:480,margin:"0 auto",textAlign:"center"}}>
      <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:"#fff",marginBottom:24}}>⏱️ Chronomètre</h2>
      <div style={{position:"relative",width:220,height:220,margin:"0 auto 28px",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <svg viewBox="0 0 100 100" style={{position:"absolute",inset:0,transform:"rotate(-90deg)"}}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="6"/>
          <circle cx="50" cy="50" r="45" fill="none" stroke={timerColor} strokeWidth="6" strokeDasharray={`${pct*2.83} 283`} strokeLinecap="round" style={{transition:"stroke-dasharray .5s, stroke .5s"}}/>
        </svg>
        <div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:42,fontWeight:800,color:timerColor}}>{fmt(seconds)}</div>
          <div style={{color:"rgba(255,255,255,.3)",fontSize:12}}>/ {fmt(MAX_SECONDS)}</div>
        </div>
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:16}}>
        <button onClick={()=>setRunning(r=>!r)} style={{background:running?"rgba(255,60,60,.1)":"rgba(0,245,160,.1)",border:`1px solid ${running?"rgba(255,60,60,.3)":"rgba(0,245,160,.3)"}`,borderRadius:12,padding:"12px 24px",color:running?"#ff6060":"#00f5a0",fontWeight:700,cursor:"pointer",fontSize:15}}>
          {running?"⏸ Pause":"▶ Démarrer"}
        </button>
        <button onClick={()=>setSeconds(0)} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,padding:"12px 18px",color:"rgba(255,255,255,.4)",cursor:"pointer",fontSize:14}}>↺ Reset</button>
      </div>
      <button onClick={()=>setPhase("write")} style={{background:"linear-gradient(135deg,#f5a000,#c27800)",border:"none",borderRadius:10,padding:"11px 24px",color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"'Syne',sans-serif"}}>Retour au pitch → Soumettre au jury</button>
    </div>
  );

  if (phase==="judging") return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"60vh",gap:16}}>
      <div style={{width:48,height:48,border:"4px solid rgba(245,160,0,.2)",borderTop:"4px solid #f5a000",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
      <div style={{color:"rgba(255,255,255,.6)",fontSize:16,fontFamily:"'Syne',sans-serif",fontWeight:700}}>Le jury délibère...</div>
      <div style={{color:"rgba(255,255,255,.3)",fontSize:13}}>Analyse de ton pitch en cours</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (phase==="result" && result) {
    const radarData = Object.entries(result.scores||{}).map(([key,val])=>({ subject:{clarity:"Clarté",innovation:"Innovation",impact:"Impact",confidence:"Confiance",structure:"Structure"}[key]||key, value:(val as number)*10, fullMark:100 }));
    return (
      <div style={{padding:"28px",maxWidth:760,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:"#fff",margin:0}}>📊 Retour du jury</h2>
          <button onClick={reset} style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:10,padding:"8px 16px",color:"rgba(255,255,255,.5)",cursor:"pointer",fontSize:13}}>Recommencer</button>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 260px",gap:16,marginBottom:16}}>
          <div style={{background:"rgba(255,255,255,.03)",border:`2px solid ${result.globalScore>=70?"#00f5a0":result.globalScore>=50?"#f5a000":"#ff6060"}30`,borderRadius:20,padding:"24px"}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:52,fontWeight:800,color:result.globalScore>=70?"#00f5a0":result.globalScore>=50?"#f5a000":"#ff6060",marginBottom:4}}>{result.globalScore}</div>
            <div style={{color:"rgba(255,255,255,.3)",fontSize:13,marginBottom:10}}>/100 · {result.verdict}</div>
            <p style={{color:"rgba(255,255,255,.7)",fontSize:14,lineHeight:1.7,margin:"0 0 14px"}}>{result.juryComment}</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div style={{background:"rgba(0,245,160,.05)",border:"1px solid rgba(0,245,160,.15)",borderRadius:10,padding:"10px"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#00f5a0",marginBottom:4}}>✅ MEILLEURE PHRASE</div>
                <div style={{color:"rgba(255,255,255,.6)",fontSize:12,fontStyle:"italic"}}>"{result.bestLine}"</div>
              </div>
              <div style={{background:"rgba(245,160,0,.05)",border:"1px solid rgba(245,160,0,.15)",borderRadius:10,padding:"10px"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#f5a000",marginBottom:4}}>⚡ CE QUI MANQUE</div>
                <div style={{color:"rgba(255,255,255,.6)",fontSize:12}}>{result.missingElement}</div>
              </div>
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.06)",borderRadius:16,padding:"16px",display:"flex",flexDirection:"column",alignItems:"center"}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:700,color:"rgba(255,255,255,.4)",marginBottom:8}}>SCORES DÉTAILLÉS</div>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,.08)"/>
                <PolarAngleAxis dataKey="subject" tick={{fill:"rgba(255,255,255,.4)",fontSize:10}}/>
                <Radar dataKey="value" stroke="#f5a000" fill="#f5a000" fillOpacity={0.2} strokeWidth={2}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{background:"rgba(204,68,255,.06)",border:"1px solid rgba(204,68,255,.2)",borderRadius:12,padding:"16px"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:700,color:"#cc44ff",marginBottom:6}}>💡 CONSEIL POUR LA PROCHAINE FOIS</div>
          <div style={{color:"rgba(255,255,255,.7)",fontSize:14}}>{result.nextTip}</div>
        </div>
      </div>
    );
  }
  return null;
}
