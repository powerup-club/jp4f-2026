"use client";
import { useEffect, useState } from "react";

const BRANCHES: Record<string,any> = {
  "GESI": {
    color:"#00f5a0", emoji:"⚡",
    fullName:"Génie des Systèmes et de l'Énergie Intelligents",
    description:"Tu es attiré par l'énergie propre, les systèmes embarqués et l'intelligence artificielle appliquée à l'industrie. Tu veux construire le futur énergétique du Maroc.",
    modules:["Énergie solaire & éolienne","Hydrogène vert","Machine Learning industriel","Systèmes embarqués","Thermodynamique avancée","Stockage d'énergie"],
    careers:["Ingénieur en énergies renouvelables","Data Scientist industrie","Chercheur en systèmes intelligents","Chef de projet SmartGrid"],
    companies:["MASEN","ONEE","Schneider Electric Maroc","Leoni","Yazaki"],
    projects:["Système de monitoring solaire IoT","Optimisation énergétique par IA","Micro-réseau intelligent"],
  },
  "Génie Mécanique": {
    color:"#f5a000", emoji:"⚙️",
    fullName:"Génie Mécanique",
    description:"Tu aimes concevoir, calculer, simuler. Les matériaux, les structures et la fabrication te passionnent. Tu veux créer des objets réels qui résistent et performent.",
    modules:["Résistance des matériaux","Éléments finis","Aérodynamique","CAO/FAO","Fabrication additive","Matériaux composites"],
    careers:["Ingénieur de conception","Bureau d'études","Ingénieur en simulation numérique","Responsable production"],
    companies:["Renault Tanger","PSA Kenitra","Boeing Maroc","Airbus Morocco"],
    projects:["Conception d'une prothèse légère","Optimisation aérodynamique","Impression 3D industrielle"],
  },
  "Mécatronique": {
    color:"#cc44ff", emoji:"🤖",
    fullName:"Mécatronique",
    description:"Tu es au carrefour du mécanique, de l'électronique et de l'informatique. La robotique, les drones et les systèmes autonomes sont ta passion.",
    modules:["Robotique industrielle","RTOS & systèmes temps réel","Vision par ordinateur","Bond Graphs","Commande moderne","Soft robotique"],
    careers:["Ingénieur robotique","Développeur systèmes embarqués","Ingénieur automation","Chercheur en IA robotique"],
    companies:["Continental Maroc","Aptiv","Delphi Technologies","Valeo Maroc"],
    projects:["Bras robotique contrôlé par IA","Drone autonome","Système de vision industrielle"],
  },
  "Génie Industriel": {
    color:"#0088ff", emoji:"📊",
    fullName:"Génie Industriel",
    description:"Tu optimises, organises, décides. Les flux de production, la qualité et la supply chain sont tes terrains de jeu. Tu transforms les systèmes pour les rendre plus efficaces.",
    modules:["Lean Manufacturing","Supply Chain 4.0","Industrie 4.0","Gestion qualité (ISO)","Logistique avancée","Outils de décision"],
    careers:["Responsable production","Consultant Lean","Supply Chain Manager","Ingénieur qualité"],
    companies:["BMCE Bank","OCP Group","Marsa Maroc","Decathlon Maroc","Auchan"],
    projects:["Optimisation d'entrepôt logistique","Dashboard production temps réel","Système qualité automatisé"],
  },
};

export default function OrientationPage() {
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string|null>(null);
  const [tab, setTab] = useState<"modules"|"careers"|"companies"|"projects">("modules");

  useEffect(() => {
    fetch("/api/application").then(r=>r.json()).then(d=>{
      setApp(d.application);
      setLoading(false);
    });
  }, []);

  const matchedBranch = app?.branch?.replace("Génie Industriel (GI)","Génie Industriel") || null;
  const displayBranch = selected || matchedBranch;
  const branch = displayBranch ? BRANCHES[displayBranch] : null;

  if (loading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh"}}><div style={{width:36,height:36,border:"3px solid rgba(245,160,0,.2)",borderTop:"3px solid #f5a000",borderRadius:"50%",animation:"spin .8s linear infinite"}}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;

  return (
    <div style={{ padding:"28px", maxWidth:860, margin:"0 auto" }}>
      <div style={{ fontSize:10, letterSpacing:3, color:"rgba(245,160,0,.6)", fontWeight:700, marginBottom:6 }}>PROFIL FILIÈRE</div>
      <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:"#fff", margin:"0 0 4px" }}>🗺️ Mon Orientation</h1>
      <p style={{ color:"rgba(255,255,255,.4)", fontSize:14, marginBottom:24 }}>Explore les filières du Génie Industriel et découvre ton profil.</p>

      {/* Branch selector */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10, marginBottom:24 }}>
        {Object.entries(BRANCHES).map(([key, val]) => {
          const isMatch = key === matchedBranch;
          const isActive = key === displayBranch;
          return (
            <button key={key} onClick={()=>setSelected(key)}
              style={{ background:isActive?`${val.color}18`:"rgba(255,255,255,.025)", border:`2px solid ${isActive?val.color:"rgba(255,255,255,.06)"}`, borderRadius:14, padding:"16px", cursor:"pointer", textAlign:"left", transition:"all .2s" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:24 }}>{val.emoji}</span>
                {isMatch && <span style={{ background:`${val.color}22`, color:val.color, fontSize:9, fontWeight:700, letterSpacing:1, padding:"3px 8px", borderRadius:8 }}>TON PROFIL</span>}
              </div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, color:isActive?val.color:"#fff" }}>{key}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", marginTop:2 }}>{val.fullName}</div>
            </button>
          );
        })}
      </div>

      {/* Branch detail */}
      {branch && (
        <div style={{ background:"rgba(255,255,255,.025)", border:`1px solid ${branch.color}30`, borderRadius:20, padding:"24px", animation:"fadeIn .3s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
            <span style={{ fontSize:36 }}>{branch.emoji}</span>
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:branch.color }}>{displayBranch}</div>
              <div style={{ color:"rgba(255,255,255,.4)", fontSize:12 }}>{branch.fullName}</div>
            </div>
          </div>

          <p style={{ color:"rgba(255,255,255,.7)", fontSize:14, lineHeight:1.7, marginBottom:20 }}>{branch.description}</p>

          {/* Connection to project */}
          {app?.proj_title && (
            <div style={{ background:`${branch.color}0d`, border:`1px solid ${branch.color}25`, borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:700, color:branch.color, marginBottom:6 }}>🔗 LIEN AVEC TON PROJET</div>
              <div style={{ color:"rgba(255,255,255,.7)", fontSize:13 }}>
                Ton projet <strong style={{color:"#fff"}}>{app.proj_title}</strong> dans le domaine <strong style={{color:"#fff"}}>{app.proj_domain}</strong> correspond bien aux compétences développées en {displayBranch}.
              </div>
            </div>
          )}

          {/* Tabs */}
          <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
            {(["modules","careers","companies","projects"] as const).map(t=>(
              <button key={t} onClick={()=>setTab(t)}
                style={{ background:tab===t?`${branch.color}18`:"rgba(255,255,255,.04)", border:`1px solid ${tab===t?branch.color:"rgba(255,255,255,.08)"}`, color:tab===t?branch.color:"rgba(255,255,255,.4)", borderRadius:8, padding:"6px 14px", cursor:"pointer", fontSize:12, fontWeight:tab===t?700:500 }}>
                {t==="modules"?"📚 Modules":t==="careers"?"💼 Carrières":t==="companies"?"🏢 Entreprises":"🚀 Projets types"}
              </button>
            ))}
          </div>

          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {branch[tab].map((item:string,i:number)=>(
              <span key={i} style={{ background:`${branch.color}12`, border:`1px solid ${branch.color}25`, color:branch.color, borderRadius:8, padding:"6px 12px", fontSize:13 }}>{item}</span>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
    </div>
  );
}
