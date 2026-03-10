"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BRANCHES = ["GESI","Génie Mécanique","Mécatronique","Génie Industriel (GI)"];
const YEARS = ["1ère année","2ème année","3ème année","4ème année","5ème année","Master / Doctorat"];
const DOMAINS = ["Habitat intelligent & domotique","Énergie propre & efficacité énergétique","Mobilité intelligente & transport","Digitalisation & Industrie 4.0","Agriculture connectée","Santé & bien-être","Eau & environnement","Autre"];
const DEMOS = ["Prototype fonctionnel","Maquette physique","Simulation numérique","Application mobile / web","Présentation slides","Vidéo démo","Autre"];
const HEARD = ["Réseaux sociaux","Affiche / Flyer ENSA","Professeur / Encadrant","Camarade de classe","Site web JP4F","Email","Autre"];

function Input({ label, value, onChange, placeholder, type="text", required=false }: any) {
  return (
    <div>
      <label style={{ fontSize:12, color:"rgba(255,255,255,.5)", display:"block", marginBottom:6 }}>{label}{required&&<span style={{color:"#f5a000"}}>*</span>}</label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{ width:"100%", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:10, padding:"11px 14px", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'DM Sans',sans-serif" }}/>
    </div>
  );
}
function Select({ label, value, onChange, options, required=false }: any) {
  return (
    <div>
      <label style={{ fontSize:12, color:"rgba(255,255,255,.5)", display:"block", marginBottom:6 }}>{label}{required&&<span style={{color:"#f5a000"}}>*</span>}</label>
      <select value={value} onChange={e=>onChange(e.target.value)}
        style={{ width:"100%", background:"#0d1520", border:"1px solid rgba(255,255,255,.1)", borderRadius:10, padding:"11px 14px", color:value?"#fff":"rgba(255,255,255,.3)", fontSize:14, outline:"none", boxSizing:"border-box" }}>
        <option value="">Sélectionner...</option>
        {options.map((o:string)=><option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
function Textarea({ label, value, onChange, placeholder, rows=4, required=false }: any) {
  return (
    <div>
      <label style={{ fontSize:12, color:"rgba(255,255,255,.5)", display:"block", marginBottom:6 }}>{label}{required&&<span style={{color:"#f5a000"}}>*</span>}</label>
      <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows}
        style={{ width:"100%", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:10, padding:"11px 14px", color:"#fff", fontSize:14, outline:"none", resize:"vertical", fontFamily:"'DM Sans',sans-serif", lineHeight:1.6, boxSizing:"border-box" }}/>
    </div>
  );
}

const STEPS = ["Type","Participant","Équipe","Projet","Soumettre"];

export default function FormPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [d, setD] = useState({
    type:"individual",
    fullName:"", phone:"", university:"ENSA Fès", branch:"", yearOfStudy:"", linkedin:"",
    teamName:"", member2Name:"", member2Email:"", member3Name:"", member3Email:"", member4Name:"", member4Email:"",
    projTitle:"", projDomain:"", projDesc:"", innovation:"", demoFormat:"", heardFrom:"", fileLink:"",
  });
  const set = (k: string, v: string) => setD(prev=>({...prev,[k]:v}));

  useEffect(() => {
    fetch("/api/application").then(r=>r.json()).then(data=>{
      const a = data.application;
      if (!a) return;
      if (a.status==="submitted") { setSubmitted(true); return; }
      setD({
        type:a.type||"individual",
        fullName:a.full_name||"", phone:a.phone||"", university:a.university||"ENSA Fès", branch:a.branch||"", yearOfStudy:a.year_of_study||"", linkedin:a.linkedin||"",
        teamName:a.team_name||"", member2Name:a.member2_name||"", member2Email:a.member2_email||"", member3Name:a.member3_name||"", member3Email:a.member3_email||"", member4Name:a.member4_name||"", member4Email:a.member4_email||"",
        projTitle:a.proj_title||"", projDomain:a.proj_domain||"", projDesc:a.proj_desc||"", innovation:a.innovation||"", demoFormat:a.demo_format||"", heardFrom:a.heard_from||"", fileLink:a.file_link||"",
      });
    });
  }, []);

  const save = async (status="draft") => {
    setSaving(true);
    await fetch("/api/application", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ ...d, status }) });
    setSaving(false);
    if (status==="draft") { setSaved(true); setTimeout(()=>setSaved(false),2000); }
  };

  const next = async () => {
    await save("draft");
    if (step === 1 && d.type === "individual") { setStep(3); return; }
    setStep(s=>Math.min(s+1, STEPS.length-1));
  };

  const back = () => {
    if (step === 3 && d.type === "individual") { setStep(1); return; }
    setStep(s=>Math.max(s-1,0));
  };

  const submit = async () => {
    setSubmitting(true);
    await save("submitted");
    setSubmitted(true);
    setSubmitting(false);
    setTimeout(()=>router.push("/application"), 2000);
  };

  if (submitted) return (
    <div style={{ padding:"28px", maxWidth:600, margin:"0 auto", textAlign:"center" }}>
      <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
      <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:"#00f5a0", marginBottom:8 }}>Candidature soumise !</h2>
      <p style={{ color:"rgba(255,255,255,.5)", fontSize:14 }}>Ta candidature a bien été enregistrée. Bonne chance pour l'Innov'Dom Challenge 2026 !</p>
    </div>
  );

  return (
    <div style={{ padding:"28px", maxWidth:720, margin:"0 auto" }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:"#fff", margin:"0 0 16px" }}>📝 Formulaire de candidature</h1>
        {/* Progress */}
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          {STEPS.filter((_,i)=> d.type==="individual" ? i!==2 : true).map((s,i)=>{
            const realStep = d.type==="individual" && i>=2 ? i+1 : i;
            const active = realStep===step;
            const done = realStep<step;
            return (
              <div key={s} style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:done?"#f5a000":active?"rgba(245,160,0,.2)":"rgba(255,255,255,.06)", border:`2px solid ${done||active?"#f5a000":"rgba(255,255,255,.1)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:done?"#04080f":active?"#f5a000":"rgba(255,255,255,.3)" }}>
                  {done?"✓":i+1}
                </div>
                <span style={{ fontSize:11, color:active?"#f5a000":"rgba(255,255,255,.3)", fontWeight:active?700:400 }}>{s}</span>
                {i<(d.type==="individual"?3:4)&&<div style={{width:20,height:1,background:"rgba(255,255,255,.08)"}}/>}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ background:"rgba(255,255,255,.025)", border:"1px solid rgba(255,255,255,.07)", borderRadius:20, padding:"24px" }}>
        {/* Step 0: Type */}
        {step===0 && (
          <div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:"#fff", marginBottom:20 }}>Tu participes en tant que :</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[["individual","👤","Individuel","Participe seul(e)"],["team","👥","Équipe","2 à 4 membres"]].map(([val,icon,label,desc])=>(
                <button key={val} onClick={()=>set("type",val)}
                  style={{ background:d.type===val?"rgba(245,160,0,.1)":"rgba(255,255,255,.03)", border:`2px solid ${d.type===val?"#f5a000":"rgba(255,255,255,.08)"}`, borderRadius:16, padding:"24px 16px", cursor:"pointer", textAlign:"center" }}>
                  <div style={{ fontSize:36, marginBottom:10 }}>{icon}</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, color:d.type===val?"#f5a000":"#fff", marginBottom:4 }}>{label}</div>
                  <div style={{ color:"rgba(255,255,255,.4)", fontSize:12 }}>{desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Participant */}
        {step===1 && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:"#fff", margin:"0 0 4px" }}>Tes informations</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Input label="Nom complet" value={d.fullName} onChange={(v:string)=>set("fullName",v)} placeholder="Prénom Nom" required/>
              <Input label="Téléphone" value={d.phone} onChange={(v:string)=>set("phone",v)} placeholder="+212 6XX XXX XXX"/>
            </div>
            <Input label="Email" value={session?.user?.email||""} onChange={()=>{}} placeholder="" />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Input label="Université / École" value={d.university} onChange={(v:string)=>set("university",v)} placeholder="ENSA Fès" required/>
              <Select label="Filière" value={d.branch} onChange={(v:string)=>set("branch",v)} options={BRANCHES} required/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Select label="Niveau d'études" value={d.yearOfStudy} onChange={(v:string)=>set("yearOfStudy",v)} options={YEARS} required/>
              <Input label="LinkedIn (optionnel)" value={d.linkedin} onChange={(v:string)=>set("linkedin",v)} placeholder="linkedin.com/in/..."/>
            </div>
          </div>
        )}

        {/* Step 2: Team */}
        {step===2 && d.type==="team" && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:"#fff", margin:"0 0 4px" }}>Informations équipe</h2>
            <Input label="Nom de l'équipe" value={d.teamName} onChange={(v:string)=>set("teamName",v)} placeholder="Nom de votre équipe" required/>
            {[[2,"member2Name","member2Email"],[3,"member3Name","member3Email"],[4,"member4Name","member4Email"]].map(([n,nameKey,emailKey])=>(
              <div key={String(n)} style={{ background:"rgba(255,255,255,.03)", borderRadius:12, padding:"14px" }}>
                <div style={{ fontSize:12, color:"rgba(255,255,255,.4)", marginBottom:10 }}>Membre {n} (optionnel)</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <Input label="Nom" value={(d as any)[nameKey]} onChange={(v:string)=>set(String(nameKey),v)} placeholder="Prénom Nom"/>
                  <Input label="Email" value={(d as any)[emailKey]} onChange={(v:string)=>set(String(emailKey),v)} placeholder="email@exemple.com" type="email"/>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 3: Project */}
        {step===3 && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:"#fff", margin:"0 0 4px" }}>Ton projet</h2>
            <Input label="Titre du projet" value={d.projTitle} onChange={(v:string)=>set("projTitle",v)} placeholder="Nom de ton projet" required/>
            <Select label="Domaine d'innovation" value={d.projDomain} onChange={(v:string)=>set("projDomain",v)} options={DOMAINS} required/>
            <Textarea label="Description du projet" value={d.projDesc} onChange={(v:string)=>set("projDesc",v)} placeholder="Décris ton projet, le problème résolu, comment ça fonctionne..." required rows={4}/>
            <Textarea label="Innovation & valeur ajoutée" value={d.innovation} onChange={(v:string)=>set("innovation",v)} placeholder="Qu'est-ce qui rend ton projet unique ? Quelle est sa valeur ajoutée pour le Maroc ?" required rows={3}/>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Select label="Format de démo" value={d.demoFormat} onChange={(v:string)=>set("demoFormat",v)} options={DEMOS}/>
              <Select label="Comment as-tu entendu parler de nous ?" value={d.heardFrom} onChange={(v:string)=>set("heardFrom",v)} options={HEARD}/>
            </div>
            <Input label="Lien fichier / CV (Google Drive, etc.)" value={d.fileLink} onChange={(v:string)=>set("fileLink",v)} placeholder="https://drive.google.com/..."/>
          </div>
        )}

        {/* Step 4: Submit */}
        {step===4 && (
          <div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:"#fff", marginBottom:20 }}>Résumé de ta candidature</h2>
            {[
              ["Type", d.type==="individual"?"Individuel":"Équipe"],
              ["Nom", d.fullName], ["Email", session?.user?.email||""],
              ["Université", d.university], ["Filière", d.branch], ["Niveau", d.yearOfStudy],
              d.type==="team"?["Équipe", d.teamName]:null,
              ["Projet", d.projTitle], ["Domaine", d.projDomain],
            ].filter(Boolean).map((row:any,i)=>(
              <div key={i} style={{ display:"flex", gap:12, padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                <span style={{ color:"rgba(255,255,255,.3)", fontSize:12, width:120, flexShrink:0 }}>{row[0]}</span>
                <span style={{ color:"rgba(255,255,255,.8)", fontSize:13 }}>{row[1]||"—"}</span>
              </div>
            ))}
            <div style={{ background:"rgba(245,160,0,.05)", border:"1px solid rgba(245,160,0,.15)", borderRadius:12, padding:"14px", marginTop:16, fontSize:13, color:"rgba(255,200,100,.8)" }}>
              ⚠️ Une fois soumise, tu ne pourras plus modifier ta candidature. Vérifie bien toutes les informations avant de confirmer.
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:16 }}>
        <div style={{ display:"flex", gap:8 }}>
          {step>0 && <button onClick={back} style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.1)", borderRadius:10, padding:"11px 20px", color:"rgba(255,255,255,.5)", cursor:"pointer", fontSize:14 }}>← Retour</button>}
          {step<4 && <button onClick={()=>save()} style={{ background:"transparent", border:"1px solid rgba(255,255,255,.08)", borderRadius:10, padding:"11px 16px", color:saved?"#00f5a0":"rgba(255,255,255,.3)", cursor:"pointer", fontSize:13 }}>{saved?"✅ Sauvegardé":saving?"...":"💾 Sauvegarder"}</button>}
        </div>
        {step<4 ? (
          <button onClick={next} style={{ background:"linear-gradient(135deg,#f5a000,#c27800)", border:"none", borderRadius:10, padding:"11px 24px", color:"#fff", fontWeight:800, fontSize:14, cursor:"pointer", fontFamily:"'Syne',sans-serif" }}>
            {step===3?"Vérifier →":"Suivant →"}
          </button>
        ) : (
          <button onClick={submit} disabled={submitting} style={{ background:"linear-gradient(135deg,#00f5a0,#00c27a)", border:"none", borderRadius:10, padding:"13px 28px", color:"#04080f", fontWeight:800, fontSize:15, cursor:"pointer", fontFamily:"'Syne',sans-serif", opacity:submitting?.6:1 }}>
            {submitting?"Envoi en cours...":"🚀 Soumettre la candidature"}
          </button>
        )}
      </div>
    </div>
  );
}
