"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

const QUESTIONS = [
  { q:"Que signifie IoT ?", a:1, opts:["Internet of Things","Industry of Technology","Integrated Operations Technology","Internet of Transfer"] },
  { q:"Qu'est-ce que le 'Digital Twin' ?", a:0, opts:["Réplique numérique d'un objet physique","Un système de sauvegarde cloud","Un protocole de communication industriel","Une technologie de réalité augmentée"] },
  { q:"Quel protocole est le plus utilisé dans l'IoT industriel ?", a:2, opts:["HTTP","FTP","MQTT","SMTP"] },
  { q:"Qu'est-ce que le Lean Manufacturing ?", a:1, opts:["Fabriquer avec le maximum de ressources","Éliminer les gaspillages pour maximiser la valeur","Automatiser toute la production","Fabriquer en grande série"] },
  { q:"La méthode '5S' en gestion de production correspond à :", a:0, opts:["Trier, Ranger, Nettoyer, Standardiser, Soutenir","Simuler, Synchroniser, Simplifier, Standardiser, Suivre","Sécuriser, Stocker, Superviser, Signaler, Soutenir","Structurer, Surveiller, Simplifier, Stabiliser, Soutenir"] },
  { q:"Qu'est-ce que la maintenance prédictive ?", a:2, opts:["Réparer après la panne","Remplacer les pièces à intervalles fixes","Anticiper les pannes grâce aux données","Vérifier manuellement chaque semaine"] },
  { q:"SCADA signifie :", a:3, opts:["Smart Control And Data Automation","System Computing And Data Analysis","Supervisory Control And Data Automation","Supervisory Control And Data Acquisition"] },
  { q:"Qu'est-ce que le Cloud Manufacturing ?", a:1, opts:["Fabriquer des serveurs cloud","Délocaliser les ressources de fabrication sur le cloud","Utiliser des drones en usine","Fabriquer dans des conditions météo difficiles"] },
  { q:"Le protocole OPC-UA est utilisé pour :", a:0, opts:["La communication entre machines industrielles","La gestion des ressources humaines","La comptabilité industrielle","La conception 3D"] },
  { q:"Qu'est-ce que la cobotique ?", a:2, opts:["Robots entièrement autonomes","Robots sous-marins industriels","Robots collaboratifs travaillant avec des humains","Robots de combat militaires"] },
  { q:"La norme ISO 9001 concerne :", a:1, opts:["La sécurité informatique","Le management de la qualité","L'environnement industriel","La sécurité des travailleurs"] },
  { q:"Qu'est-ce que le Big Data dans l'industrie ?", a:0, opts:["Traitement de grands volumes de données pour des insights","Un grand entrepôt de stockage physique","Un réseau de capteurs géants","Un logiciel de gestion d'usine"] },
  { q:"L'additive manufacturing désigne :", a:2, opts:["La soudure industrielle","L'usinage traditionnel","La fabrication par ajout de matière (impression 3D)","La fabrication chimique"] },
  { q:"Qu'est-ce que le MES (Manufacturing Execution System) ?", a:1, opts:["Un robot d'assemblage","Un système de pilotage de la production","Un logiciel de comptabilité","Un outil de CAO"] },
  { q:"La blockchain en industrie est utilisée principalement pour :", a:3, opts:["Améliorer la vitesse des machines","Réduire la consommation électrique","Automatiser la production","Assurer la traçabilité de la supply chain"] },
  { q:"Qu'est-ce que le WMS ?", a:0, opts:["Warehouse Management System","Wireless Machine System","Web Manufacturing Software","Workflow Management Standard"] },
  { q:"Le terme 'Usine 4.0' désigne :", a:2, opts:["La 4ème usine construite par une entreprise","Une usine avec 4 lignes de production","Une usine connectée, intelligente et flexible","Une usine de 4000 employés"] },
  { q:"Qu'est-ce que le kaizen ?", a:1, opts:["Un logiciel japonais de production","L'amélioration continue incrémentale","Une technique de découpe laser","Un système de planification"] },
  { q:"La simulation numérique permet de :", a:0, opts:["Tester des scénarios sans risque physique","Remplacer tous les ingénieurs","Supprimer les prototypes physiques définitivement","Uniquement modéliser les fluides"] },
  { q:"Qu'est-ce que l'ERP ?", a:3, opts:["Extended Robot Programming","Energy Resource Planning","Electronic Resource Platform","Enterprise Resource Planning"] },
  { q:"La 'Supply Chain' désigne :", a:1, opts:["La chaîne de montage","L'ensemble des flux depuis fournisseur jusqu'au client","La ligne de production principale","Le système de contrôle qualité"] },
  { q:"Qu'est-ce que le PLM ?", a:2, opts:["Production Line Management","Plant Logistics Management","Product Lifecycle Management","Process Level Monitoring"] },
  { q:"La méthode Six Sigma vise :", a:0, opts:["Réduire les défauts à moins de 3.4 par million","Avoir 6 contrôleurs qualité par équipe","Produire 6 fois plus vite","Avoir 6 niveaux de vérification"] },
  { q:"Qu'est-ce que la flexibilité dans une ligne de production ?", a:1, opts:["Produire uniquement un type de produit très vite","S'adapter rapidement aux changements de produits/volumes","Employer des travailleurs flexibles","Utiliser des matériaux flexibles"] },
  { q:"L'AMDEC est un outil de :", a:3, opts:["Gestion de projet","Planification de production","Calcul de coûts","Analyse des modes de défaillance"] },
  { q:"Qu'est-ce que le Juste-à-Temps (JAT) ?", a:0, opts:["Produire et livrer au bon moment, sans stocks excessifs","Toujours être à l'heure au travail","Réparer les pannes immédiatement","Planifier la production des années à l'avance"] },
  { q:"La réalité augmentée en industrie sert à :", a:2, opts:["Remplacer les ingénieurs","Créer des produits virtuels vendus en ligne","Guider les techniciens avec informations superposées","Simuler les ventes futures"] },
  { q:"Qu'est-ce que le KPI ?", a:1, opts:["Knowledge Process Indicator","Key Performance Indicator","Key Production Index","Knowledge Performance Interface"] },
  { q:"L'automatisation flexible se distingue de l'automatisation fixe par :", a:3, opts:["Sa vitesse de production supérieure","Son coût moins élevé","Sa précision accrue","Sa capacité à produire plusieurs variantes"] },
  { q:"La cybersécurité industrielle (ICS security) vise à protéger :", a:0, opts:["Les systèmes de contrôle des infrastructures critiques","Les données personnelles des employés","Les brevets de l'entreprise","Les finances de l'entreprise"] },
];

export default function QuizGame() {
  const { data: session } = useSession();
  const [phase, setPhase] = useState<"start"|"game"|"result"|"board">("start");
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number|null>(null);
  const [answered, setAnswered] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [shuffled] = useState(() => [...QUESTIONS].sort(()=>Math.random()-.5).slice(0,15));

  const fetchBoard = async () => {
    const res = await fetch("/api/leaderboard");
    const data = await res.json();
    setLeaderboard(data.leaderboard||[]);
  };

  const answer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === shuffled[current].a) setScore(s=>s+1);
  };

  const next = async () => {
    if (current < shuffled.length-1) {
      setCurrent(c=>c+1); setSelected(null); setAnswered(false);
    } else {
      const finalScore = score + (selected === shuffled[current].a ? 1 : 0);
      await fetch("/api/leaderboard", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ score:finalScore, total:shuffled.length }) });
      await fetchBoard();
      setPhase("result");
    }
  };

  const restart = () => { setCurrent(0); setScore(0); setSelected(null); setAnswered(false); setPhase("start"); };

  const pct = Math.round((score/shuffled.length)*100);

  if (phase === "start") return (
    <div style={{ padding:"28px", maxWidth:700, margin:"0 auto", textAlign:"center" }}>
      <Link href="/application/games" style={{ color:"rgba(255,255,255,.4)", fontSize:13, textDecoration:"none", display:"inline-block", marginBottom:20 }}>← Retour aux jeux</Link>
      <div style={{ fontSize:56, marginBottom:16 }}>🧠</div>
      <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:"#fff", marginBottom:8 }}>Industry 4.0 Quiz</h1>
      <p style={{ color:"rgba(255,255,255,.4)", fontSize:14, marginBottom:8 }}>15 questions tirées aléatoirement parmi 30.</p>
      <p style={{ color:"rgba(255,255,255,.3)", fontSize:13, marginBottom:28 }}>Industrie 4.0 · IoT · Lean · Supply Chain · Robotique</p>
      <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
        <button onClick={()=>setPhase("game")} style={{ background:"linear-gradient(135deg,#00f5a0,#00c27a)", border:"none", borderRadius:12, padding:"14px 32px", color:"#04080f", fontWeight:800, fontSize:15, cursor:"pointer", fontFamily:"'Syne',sans-serif" }}>Commencer le quiz →</button>
        <button onClick={async()=>{await fetchBoard();setPhase("board")}} style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:12, padding:"14px 20px", color:"rgba(255,255,255,.5)", fontSize:14, cursor:"pointer" }}>🏆 Classement</button>
      </div>
    </div>
  );

  if (phase === "game") {
    const q = shuffled[current];
    return (
      <div style={{ padding:"28px", maxWidth:680, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <Link href="/application/games" style={{ color:"rgba(255,255,255,.4)", fontSize:13, textDecoration:"none" }}>← Quitter</Link>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:"#00f5a0" }}>Q{current+1}/{shuffled.length} · Score: {score}</div>
        </div>
        <div style={{ height:4, background:"rgba(255,255,255,.06)", borderRadius:2, marginBottom:24 }}>
          <div style={{ height:"100%", width:`${((current+1)/shuffled.length)*100}%`, background:"#00f5a0", borderRadius:2, transition:"width .3s" }}/>
        </div>
        <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(0,245,160,.15)", borderRadius:18, padding:"28px", marginBottom:20 }}>
          <div style={{ fontSize:11, letterSpacing:2, color:"rgba(0,245,160,.5)", fontWeight:700, marginBottom:10 }}>QUESTION {current+1}</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:700, color:"#fff", lineHeight:1.5 }}>{q.q}</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
          {q.opts.map((opt,i) => {
            let bg = "rgba(255,255,255,.03)", border = "1px solid rgba(255,255,255,.08)", color = "rgba(255,255,255,.7)";
            if (answered) {
              if (i === q.a) { bg="rgba(0,245,160,.1)"; border="1px solid rgba(0,245,160,.3)"; color="#00f5a0"; }
              else if (i === selected) { bg="rgba(255,60,60,.1)"; border="1px solid rgba(255,60,60,.3)"; color="#ff6060"; }
            } else if (selected===i) { bg="rgba(0,245,160,.08)"; border="1px solid rgba(0,245,160,.25)"; }
            return (
              <button key={i} onClick={()=>answer(i)} disabled={answered}
                style={{ background:bg, border, borderRadius:12, padding:"14px 18px", color, cursor:answered?"default":"pointer", textAlign:"left", fontSize:14, transition:"all .2s" }}>
                <span style={{ opacity:.5, marginRight:10 }}>{["A","B","C","D"][i]}.</span>{opt}
              </button>
            );
          })}
        </div>
        {answered && <button onClick={next} style={{ width:"100%", background:"linear-gradient(135deg,#00f5a0,#00c27a)", border:"none", borderRadius:12, padding:"13px", color:"#04080f", fontWeight:800, fontSize:14, cursor:"pointer" }}>{current<shuffled.length-1?"Question suivante →":"Voir mes résultats →"}</button>}
      </div>
    );
  }

  if (phase === "result") return (
    <div style={{ padding:"28px", maxWidth:680, margin:"0 auto", textAlign:"center" }}>
      <div style={{ fontSize:64, marginBottom:12 }}>{pct>=80?"🏆":pct>=60?"⭐":"📚"}</div>
      <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:"#fff", marginBottom:8 }}>Quiz terminé !</h2>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:56, fontWeight:800, color:pct>=80?"#00f5a0":pct>=60?"#f5a000":"#ff8844", marginBottom:4 }}>{pct}%</div>
      <div style={{ color:"rgba(255,255,255,.4)", fontSize:14, marginBottom:28 }}>{score}/{shuffled.length} bonnes réponses · {pct>=80?"Excellent !":pct>=60?"Bien joué !":"Continue à apprendre !"}</div>
      <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
        <button onClick={restart} style={{ background:"linear-gradient(135deg,#00f5a0,#00c27a)", border:"none", borderRadius:12, padding:"13px 24px", color:"#04080f", fontWeight:800, fontSize:14, cursor:"pointer", fontFamily:"'Syne',sans-serif" }}>Rejouer</button>
        <button onClick={()=>setPhase("board")} style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.12)", borderRadius:12, padding:"13px 24px", color:"rgba(255,255,255,.6)", fontSize:14, cursor:"pointer" }}>🏆 Classement</button>
      </div>
    </div>
  );

  return (
    <div style={{ padding:"28px", maxWidth:680, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <button onClick={()=>setPhase("start")} style={{ background:"none", border:"1px solid rgba(255,255,255,.1)", borderRadius:8, padding:"6px 14px", color:"rgba(255,255,255,.4)", cursor:"pointer", fontSize:13 }}>← Retour</button>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:"#fff", margin:0 }}>🏆 Classement</h2>
        <div/>
      </div>
      {leaderboard.length===0 ? <div style={{textAlign:"center",color:"rgba(255,255,255,.3)",padding:"40px"}}>Pas encore de scores. Sois le premier !</div> : (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {leaderboard.map((entry,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, background:i<3?"rgba(245,160,0,.06)":"rgba(255,255,255,.025)", border:`1px solid ${i===0?"rgba(245,160,0,.2)":i===1?"rgba(180,180,180,.15)":i===2?"rgba(150,100,50,.15)":"rgba(255,255,255,.06)"}`, borderRadius:12, padding:"12px 16px" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:i===0?"#f5a000":i===1?"#aaa":i===2?"#cd7f32":"rgba(255,255,255,.3)", width:28, textAlign:"center" }}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}</div>
              {entry.user_image&&<img src={entry.user_image} style={{width:32,height:32,borderRadius:"50%"}} alt=""/>}
              <div style={{ flex:1 }}>
                <div style={{ color:"#fff", fontWeight:600, fontSize:13 }}>{entry.user_name||"Anonyme"}</div>
              </div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:entry.percentage>=80?"#00f5a0":entry.percentage>=60?"#f5a000":"#ff8844" }}>{entry.percentage}%</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
