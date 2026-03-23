"use client";
import { useState, useRef } from "react";

// ── Translations ──────────────────────────────────────────────────────────────
const T = {
  fr: {
    badge      : "ENSA FÈS · JESI 2025",
    title      : ["Innov'Dom", "Challenge"],
    subtitle   : "Connecter à l'Avenir — Compétition Technologique",
    deadline   : "📅 Dépôt des candidatures : avant le 15 Avril 2025",
    steps      : ["Type", "Participant", "Équipe", "Projet", "Fichier"],
    typeTitle  : "Mode de participation",
    individual : "Individuel",
    team       : "En équipe",
    individualDesc: "Tu participes seul(e) avec ton propre projet.",
    teamDesc   : "2 à 4 membres autour d'un projet commun.",
    nextBtn    : "Continuer →",
    prevBtn    : "← Retour",
    submitBtn  : "Soumettre ma candidature →",
    submitting : "Envoi en cours...",
    // Step 2 — Participant
    participantTitle: "Tes informations",
    fullName   : "Nom complet *",
    fullNamePH : "Prénom Nom",
    email      : "Email *",
    emailPH    : "exemple@email.com",
    phone      : "Téléphone *",
    phonePH    : "+212 6XX XXX XXX",
    university : "Université / École *",
    universityPH: "Ex: ENSA Fès, FST, ENCG...",
    branch     : "Filière / Spécialité *",
    branchPH   : "Ex: GESI, Génie Mécanique, Informatique...",
    yearOfStudy: "Niveau d'études *",
    yearOptions: ["Bac+1 / CP1","Bac+2 / CP2","Bac+3","Bac+4 / 1ère année cycle ingénieur","Bac+5 / 2ème année cycle ingénieur","Bac+5+ / Master / Doctorat","Chercheur / Professionnel"],
    linkedin   : "LinkedIn (optionnel)",
    linkedinPH : "https://linkedin.com/in/...",
    // Step 3 — Team
    teamTitle  : "Informations équipe",
    teamName   : "Nom de l'équipe *",
    teamNamePH : "Ex: Team Innov, PowerBots...",
    teamNote   : "Remplis les informations des autres membres (2 à 4 membres au total)",
    memberN    : n => `Membre ${n}`,
    memberName : "Nom complet",
    memberEmail: "Email",
    // Step 4 — Project
    projectTitle_: "Ton projet",
    projTitle  : "Titre du projet *",
    projTitlePH: "Un titre court et percutant",
    projDomain : "Domaine *",
    domains    : ["Habitat intelligent / Domotique","Gestion énergétique","Mobilité & Transport","Digitalisation & IA","Environnement & Durabilité","Santé & Bien-être","Agriculture intelligente","Autre"],
    projDesc   : "Description du projet *",
    projDescPH : "Décris ton projet en quelques phrases : problème traité, solution proposée, technologies utilisées... (min 100 caractères)",
    innovation : "Valeur ajoutée & Innovation *",
    innovationPH: "En quoi ton projet est innovant ? Quel impact concret sur la société ou l'industrie ?",
    demoFormat : "Format de présentation prévu *",
    demoOptions: ["Pitch oral (5–10 min) + diaporama","Prototype fonctionnel","Démonstration en réalité augmentée","Application interactive","Vidéo de démonstration","Combinaison de plusieurs formats"],
    heardFrom  : "Comment as-tu entendu parler de cette compétition ?",
    heardOptions:["Réseaux sociaux","Affiche / flyer","Bouche à oreille","Professeur / encadrant","Site de l'ENSA Fès","Autre"],
    // Step 5 — File
    fileTitle  : "Document de candidature",
    fileSub    : "Dépose ton CV ou un résumé de ton projet (PDF recommandé, max 5 Mo)",
    fileBtn    : "Choisir un fichier",
    fileOptional: "Optionnel — tu peux soumettre sans fichier",
    fileName_  : "Fichier sélectionné :",
    fileRemove : "Supprimer",
    // Done
    doneTitle  : "Candidature reçue ! 🎉",
    doneSub    : "Merci pour ton inscription à l'Innov'Dom Challenge. Tu recevras une confirmation par email. Bonne chance !",
    doneDate   : "📅 Résultats de sélection : 19 Avril 2025",
    doneEvent  : "📍 Événement : 21 Avril 2025 · ENSA Fès",
    restartBtn : "Nouvelle inscription",
    // Validation
    required   : "Ce champ est obligatoire",
    emailInvalid: "Email invalide",
    descMin    : "Minimum 100 caractères",
    fileBig    : "Fichier trop volumineux (max 5 Mo)",
    fileType   : "Format accepté : PDF, DOC, DOCX, PPT, PPTX",
  },
  en: {
    badge      : "ENSA FÈS · JESI 2025",
    title      : ["Innov'Dom", "Challenge"],
    subtitle   : "Connecting to the Future — Technology Competition",
    deadline   : "📅 Submission deadline: April 15, 2025",
    steps      : ["Type","Participant","Team","Project","File"],
    typeTitle  : "Participation type",
    individual : "Individual",
    team       : "Team",
    individualDesc: "You participate alone with your own project.",
    teamDesc   : "2 to 4 members around a shared project.",
    nextBtn    : "Continue →",
    prevBtn    : "← Back",
    submitBtn  : "Submit my application →",
    submitting : "Submitting...",
    participantTitle: "Your information",
    fullName   : "Full name *",
    fullNamePH : "First Last",
    email      : "Email *",
    emailPH    : "example@email.com",
    phone      : "Phone *",
    phonePH    : "+212 6XX XXX XXX",
    university : "University / School *",
    universityPH: "e.g. ENSA Fès, FST, ENCG...",
    branch     : "Branch / Speciality *",
    branchPH   : "e.g. GESI, Mechanical Eng, Computer Science...",
    yearOfStudy: "Year of study *",
    yearOptions: ["Bac+1 / Prep Year 1","Bac+2 / Prep Year 2","Bac+3","Bac+4 / Engineering Year 1","Bac+5 / Engineering Year 2","Bac+5+ / Master / PhD","Researcher / Professional"],
    linkedin   : "LinkedIn (optional)",
    linkedinPH : "https://linkedin.com/in/...",
    teamTitle  : "Team information",
    teamName   : "Team name *",
    teamNamePH : "e.g. Team Innov, PowerBots...",
    teamNote   : "Fill in the details of the other members (2 to 4 total)",
    memberN    : n => `Member ${n}`,
    memberName : "Full name",
    memberEmail: "Email",
    projectTitle_: "Your project",
    projTitle  : "Project title *",
    projTitlePH: "A short and catchy title",
    projDomain : "Domain *",
    domains    : ["Smart Home / Home Automation","Energy Management","Mobility & Transport","Digitalization & AI","Environment & Sustainability","Health & Wellbeing","Smart Agriculture","Other"],
    projDesc   : "Project description *",
    projDescPH : "Describe your project: problem addressed, proposed solution, technologies used... (min 100 chars)",
    innovation : "Added value & Innovation *",
    innovationPH: "What makes your project innovative? What concrete impact on society or industry?",
    demoFormat : "Planned presentation format *",
    demoOptions: ["Oral pitch (5–10 min) + slides","Functional prototype","Augmented reality demonstration","Interactive application","Demo video","Combination of formats"],
    heardFrom  : "How did you hear about this competition?",
    heardOptions:["Social media","Poster / flyer","Word of mouth","Teacher / supervisor","ENSA Fès website","Other"],
    fileTitle  : "Application document",
    fileSub    : "Upload your CV or project summary (PDF recommended, max 5 MB)",
    fileBtn    : "Choose a file",
    fileOptional: "Optional — you can submit without a file",
    fileName_  : "Selected file:",
    fileRemove : "Remove",
    doneTitle  : "Application received! 🎉",
    doneSub    : "Thank you for registering for the Innov'Dom Challenge. You will receive a confirmation by email. Good luck!",
    doneDate   : "📅 Selection results: April 19, 2025",
    doneEvent  : "📍 Event: April 21, 2025 · ENSA Fès",
    restartBtn : "New registration",
    required   : "This field is required",
    emailInvalid: "Invalid email",
    descMin    : "Minimum 100 characters",
    fileBig    : "File too large (max 5 MB)",
    fileType   : "Accepted: PDF, DOC, DOCX, PPT, PPTX",
  },
};

const AC = "#f5a000"; // Innov'Dom orange accent

// ── Helpers ──────────────────────────────────────────────────────────────────
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const fileToB64 = file => new Promise((res, rej) => {
  const r = new FileReader();
  r.onload  = () => res(r.result.split(",")[1]);
  r.onerror = rej;
  r.readAsDataURL(file);
});

// ── Main Component ────────────────────────────────────────────────────────────
export default function InnovForm() {
  const [lang, setLang]   = useState("fr");
  const [step, setStep]   = useState(0); // 0=type 1=participant 2=team 3=project 4=file
  const [done, setDone]   = useState(false);
  const [submitting, setSub] = useState(false);
  const [errors, setErrors]  = useState({});
  const fileRef = useRef(null);

  const t = T[lang];

  // ── Form state ──────────────────────────────────────────────────────────────
  const [type,       setType]       = useState("individual");
  const [fullName,   setFullName]   = useState("");
  const [email,      setEmail]      = useState("");
  const [phone,      setPhone]      = useState("");
  const [university, setUniversity] = useState("");
  const [branch,     setBranch]     = useState("");
  const [yearOfStudy,setYear]       = useState("");
  const [linkedin,   setLinkedin]   = useState("");
  const [teamName,   setTeamName]   = useState("");
  const [members,    setMembers]    = useState([
    {name:"",email:""},{name:"",email:""},{name:"",email:""}
  ]);
  const [projTitle,  setProjTitle]  = useState("");
  const [projDomain, setProjDomain] = useState("");
  const [projDesc,   setProjDesc]   = useState("");
  const [innovation, setInnovation] = useState("");
  const [demoFormat, setDemoFormat] = useState("");
  const [heardFrom,  setHeardFrom]  = useState("");
  const [file,       setFile]       = useState(null);
  const [fileErr,    setFileErr]    = useState("");

  const updateMember = (i, field, val) => {
    const m = [...members]; m[i] = { ...m[i], [field]: val }; setMembers(m);
  };

  // ── Validation per step ──────────────────────────────────────────────────────
  const validate = (s) => {
    const e = {};
    if (s === 1) {
      if (!fullName.trim())            e.fullName   = t.required;
      if (!email.trim())               e.email      = t.required;
      else if (!isEmail(email))        e.email      = t.emailInvalid;
      if (!phone.trim())               e.phone      = t.required;
      if (!university.trim())          e.university = t.required;
      if (!branch.trim())              e.branch     = t.required;
      if (!yearOfStudy)                e.yearOfStudy= t.required;
    }
    if (s === 2 && type === "team") {
      if (!teamName.trim())            e.teamName   = t.required;
    }
    if (s === 3) {
      if (!projTitle.trim())           e.projTitle  = t.required;
      if (!projDomain)                 e.projDomain = t.required;
      if (!projDesc.trim())            e.projDesc   = t.required;
      else if (projDesc.trim().length < 100) e.projDesc = t.descMin;
      if (!innovation.trim())          e.innovation = t.required;
      if (!demoFormat)                 e.demoFormat = t.required;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate(step)) return;
    // skip team step for individual
    if (step === 1 && type === "individual") { setStep(3); return; }
    setStep(s => s + 1);
  };
  const prev = () => {
    if (step === 3 && type === "individual") { setStep(1); return; }
    setStep(s => s - 1);
  };

  const handleFile = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const allowed = ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/vnd.ms-powerpoint","application/vnd.openxmlformats-officedocument.presentationml.presentation"];
    if (!allowed.includes(f.type)) { setFileErr(t.fileType); return; }
    if (f.size > 5 * 1024 * 1024)  { setFileErr(t.fileBig);  return; }
    setFileErr("");
    setFile(f);
  };

  const submit = async () => {
    setSub(true);
    let fileBase64 = "", fileName = "";
    if (file) {
      try { fileBase64 = await fileToB64(file); fileName = file.name; } catch {}
    }
    await fetch("/api/register", {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify({
        lang, type, fullName, email, phone, university, branch, yearOfStudy, linkedin,
        teamName,
        member2Name : members[0].name, member2Email: members[0].email,
        member3Name : members[1].name, member3Email: members[1].email,
        member4Name : members[2].name, member4Email: members[2].email,
        projTitle, projDomain, projDesc, innovation, demoFormat, heardFrom,
        fileBase64, fileName,
      }),
    });
    setSub(false);
    setDone(true);
  };

  const restart = () => {
    setDone(false); setStep(0); setType("individual");
    setFullName(""); setEmail(""); setPhone(""); setUniversity(""); setBranch("");
    setYear(""); setLinkedin(""); setTeamName("");
    setMembers([{name:"",email:""},{name:"",email:""},{name:"",email:""}]);
    setProjTitle(""); setProjDomain(""); setProjDesc(""); setInnovation("");
    setDemoFormat(""); setHeardFrom(""); setFile(null); setFileErr(""); setErrors({});
  };

  // ── Visible step index (for progress bar, skipping team for individual) ──────
  const visibleSteps = type === "individual"
    ? [t.steps[0], t.steps[1], t.steps[3], t.steps[4]]
    : t.steps;
  const visibleIdx = type === "individual"
    ? [0,1,3,4].indexOf(step)
    : step;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:"#04080f", fontFamily:"'DM Sans',sans-serif", color:"#e8f4f0", display:"flex", flexDirection:"column", alignItems:"center", padding:"20px 16px 60px", position:"relative", overflow:"hidden" }}>

      {/* BG */}
      <div style={{ position:"fixed", inset:0, backgroundImage:"linear-gradient(rgba(245,160,0,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(245,160,0,.025) 1px,transparent 1px)", backgroundSize:"46px 46px", pointerEvents:"none" }}/>
      <div style={{ position:"fixed", top:"-15%", right:"-10%", width:600, height:600, background:"radial-gradient(circle,rgba(245,160,0,.1) 0%,transparent 65%)", pointerEvents:"none" }}/>
      <div style={{ position:"fixed", bottom:"-15%", left:"-8%",  width:500, height:500, background:"radial-gradient(circle,rgba(0,100,200,.08) 0%,transparent 65%)", pointerEvents:"none" }}/>

      <div style={{ maxWidth:600, width:"100%", position:"relative", zIndex:1 }}>

        {/* Lang toggle */}
        <div style={{ display:"flex", justifyContent:"flex-end", gap:6, marginBottom:18 }}>
          {["fr","en"].map(l => (
            <button key={l} onClick={()=>setLang(l)} style={{ background:lang===l?"rgba(245,160,0,.1)":"rgba(255,255,255,.04)", border:`1px solid ${lang===l?"rgba(245,160,0,.35)":"rgba(255,255,255,.09)"}`, color:lang===l?AC:"rgba(255,255,255,.35)", borderRadius:8, padding:"5px 14px", fontSize:12, fontWeight:700, cursor:"pointer", letterSpacing:1 }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Header */}
        <div className="fadeUp" style={{ textAlign:"center", marginBottom:28 }}>
          <span style={{ display:"inline-block", background:"rgba(245,160,0,.08)", border:"1px solid rgba(245,160,0,.2)", color:AC, fontSize:10, fontWeight:700, letterSpacing:3, padding:"4px 14px", borderRadius:20, marginBottom:14 }}>{t.badge}</span>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(36px,7vw,52px)", fontWeight:800, lineHeight:1.05, background:"linear-gradient(135deg,#fff 0%,#f5a000 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:8 }}>
            {t.title[0]}<br/>{t.title[1]}
          </h1>
          <p style={{ color:"rgba(255,255,255,.4)", fontSize:14, marginBottom:10 }}>{t.subtitle}</p>
          <div style={{ display:"inline-block", background:"rgba(245,160,0,.08)", border:"1px solid rgba(245,160,0,.18)", borderRadius:10, padding:"6px 16px", color:"rgba(245,160,0,.9)", fontSize:12, fontWeight:500 }}>{t.deadline}</div>
        </div>

        {/* ═══ DONE ═══ */}
        {done ? (
          <Card>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:60, marginBottom:16 }}>🎉</div>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:700, color:AC, marginBottom:12 }}>{t.doneTitle}</h2>
              <p style={{ color:"rgba(255,255,255,.55)", fontSize:15, lineHeight:1.75, marginBottom:20 }}>{t.doneSub}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:28 }}>
                {[t.doneDate, t.doneEvent].map(line => (
                  <div key={line} style={{ background:"rgba(245,160,0,.07)", border:"1px solid rgba(245,160,0,.18)", borderRadius:10, padding:"10px 16px", color:"rgba(255,255,255,.7)", fontSize:14 }}>{line}</div>
                ))}
              </div>
              <button onClick={restart} style={{ background:"transparent", border:"1px solid rgba(255,255,255,.1)", color:"rgba(255,255,255,.35)", borderRadius:12, padding:"12px 28px", cursor:"pointer", fontSize:14, width:"100%" }}>{t.restartBtn}</button>
            </div>
          </Card>
        ) : (
          <>
            {/* Progress bar */}
            {step > 0 && (
              <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:24 }} className="fadeUp">
                {visibleSteps.map((s,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", flex: i<visibleSteps.length-1?1:"none" }}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                      <div style={{ width:28, height:28, borderRadius:"50%", background: i<visibleIdx?"#f5a000": i===visibleIdx?"#f5a000":"rgba(255,255,255,.08)", border:`2px solid ${i<=visibleIdx?"#f5a000":"rgba(255,255,255,.1)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color: i<=visibleIdx?"#04080f":"rgba(255,255,255,.3)", transition:"all .3s", animation: i===visibleIdx?"glow 1.5s ease infinite":"none" }}>
                        {i < visibleIdx ? "✓" : i+1}
                      </div>
                      <span style={{ fontSize:10, color:i<=visibleIdx?AC:"rgba(255,255,255,.25)", fontWeight:600, letterSpacing:.5, whiteSpace:"nowrap" }}>{s}</span>
                    </div>
                    {i < visibleSteps.length-1 && (
                      <div style={{ flex:1, height:2, background: i<visibleIdx?"#f5a000":"rgba(255,255,255,.07)", margin:"0 4px", marginBottom:16, transition:"background .3s" }}/>
                    )}
                  </div>
                ))}
              </div>
            )}

            <Card key={step}>
              {/* ── STEP 0: Type ── */}
              {step === 0 && (
                <>
                  <SectionTitle>{t.typeTitle}</SectionTitle>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:28 }}>
                    {[
                      { key:"individual", label:t.individual, desc:t.individualDesc, icon:"👤" },
                      { key:"team",       label:t.team,       desc:t.teamDesc,       icon:"👥" },
                    ].map(opt => (
                      <button key={opt.key} onClick={()=>setType(opt.key)} style={{ background:type===opt.key?"rgba(245,160,0,.1)":"rgba(255,255,255,.03)", border:`2px solid ${type===opt.key?AC:"rgba(255,255,255,.08)"}`, borderRadius:16, padding:"20px 14px", cursor:"pointer", textAlign:"center", transition:"all .2s" }}>
                        <div style={{ fontSize:32, marginBottom:8 }}>{opt.icon}</div>
                        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, color:type===opt.key?AC:"#fff", marginBottom:6 }}>{opt.label}</div>
                        <div style={{ fontSize:12, color:"rgba(255,255,255,.4)", lineHeight:1.5 }}>{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                  <PrimaryBtn onClick={()=>setStep(1)}>{t.nextBtn}</PrimaryBtn>
                </>
              )}

              {/* ── STEP 1: Participant info ── */}
              {step === 1 && (
                <>
                  <SectionTitle>{t.participantTitle}</SectionTitle>
                  <FieldGroup>
                    <Field label={t.fullName} error={errors.fullName}>
                      <Input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder={t.fullNamePH} hasError={!!errors.fullName}/>
                    </Field>
                    <Row>
                      <Field label={t.email} error={errors.email}>
                        <Input value={email} onChange={e=>setEmail(e.target.value)} placeholder={t.emailPH} hasError={!!errors.email} type="email"/>
                      </Field>
                      <Field label={t.phone} error={errors.phone}>
                        <Input value={phone} onChange={e=>setPhone(e.target.value)} placeholder={t.phonePH} hasError={!!errors.phone} type="tel"/>
                      </Field>
                    </Row>
                    <Field label={t.university} error={errors.university}>
                      <Input value={university} onChange={e=>setUniversity(e.target.value)} placeholder={t.universityPH} hasError={!!errors.university}/>
                    </Field>
                    <Row>
                      <Field label={t.branch} error={errors.branch}>
                        <Input value={branch} onChange={e=>setBranch(e.target.value)} placeholder={t.branchPH} hasError={!!errors.branch}/>
                      </Field>
                      <Field label={t.yearOfStudy} error={errors.yearOfStudy}>
                        <Select value={yearOfStudy} onChange={e=>setYear(e.target.value)} hasError={!!errors.yearOfStudy}>
                          <option value="">—</option>
                          {t.yearOptions.map(y=><option key={y} value={y}>{y}</option>)}
                        </Select>
                      </Field>
                    </Row>
                    <Field label={t.linkedin}>
                      <Input value={linkedin} onChange={e=>setLinkedin(e.target.value)} placeholder={t.linkedinPH}/>
                    </Field>
                  </FieldGroup>
                  <NavRow onPrev={prev} onNext={next} nextLabel={t.nextBtn} prevLabel={t.prevBtn}/>
                </>
              )}

              {/* ── STEP 2: Team info ── */}
              {step === 2 && type === "team" && (
                <>
                  <SectionTitle>{t.teamTitle}</SectionTitle>
                  <FieldGroup>
                    <Field label={t.teamName} error={errors.teamName}>
                      <Input value={teamName} onChange={e=>setTeamName(e.target.value)} placeholder={t.teamNamePH} hasError={!!errors.teamName}/>
                    </Field>
                  </FieldGroup>
                  <p style={{ color:"rgba(255,255,255,.35)", fontSize:13, marginBottom:16, marginTop:4 }}>{t.teamNote}</p>
                  {members.map((m,i) => (
                    <div key={i} style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", borderRadius:12, padding:"16px", marginBottom:10 }}>
                      <p style={{ color:AC, fontSize:11, fontWeight:700, letterSpacing:2, marginBottom:12 }}>{t.memberN(i+2)}</p>
                      <Row>
                        <Field label={t.memberName}>
                          <Input value={m.name} onChange={e=>updateMember(i,"name",e.target.value)} placeholder={t.fullNamePH}/>
                        </Field>
                        <Field label={t.memberEmail}>
                          <Input value={m.email} onChange={e=>updateMember(i,"email",e.target.value)} placeholder={t.emailPH} type="email"/>
                        </Field>
                      </Row>
                    </div>
                  ))}
                  <NavRow onPrev={prev} onNext={next} nextLabel={t.nextBtn} prevLabel={t.prevBtn}/>
                </>
              )}

              {/* ── STEP 3: Project ── */}
              {step === 3 && (
                <>
                  <SectionTitle>{t.projectTitle_}</SectionTitle>
                  <FieldGroup>
                    <Field label={t.projTitle} error={errors.projTitle}>
                      <Input value={projTitle} onChange={e=>setProjTitle(e.target.value)} placeholder={t.projTitlePH} hasError={!!errors.projTitle}/>
                    </Field>
                    <Row>
                      <Field label={t.projDomain} error={errors.projDomain}>
                        <Select value={projDomain} onChange={e=>setProjDomain(e.target.value)} hasError={!!errors.projDomain}>
                          <option value="">—</option>
                          {t.domains.map(d=><option key={d} value={d}>{d}</option>)}
                        </Select>
                      </Field>
                      <Field label={t.demoFormat} error={errors.demoFormat}>
                        <Select value={demoFormat} onChange={e=>setDemoFormat(e.target.value)} hasError={!!errors.demoFormat}>
                          <option value="">—</option>
                          {t.demoOptions.map(d=><option key={d} value={d}>{d}</option>)}
                        </Select>
                      </Field>
                    </Row>
                    <Field label={t.projDesc} error={errors.projDesc}>
                      <Textarea value={projDesc} onChange={e=>setProjDesc(e.target.value)} placeholder={t.projDescPH} rows={5} hasError={!!errors.projDesc}/>
                      <div style={{ textAlign:"right", fontSize:11, color: projDesc.length<100?"rgba(245,100,100,.6)":"rgba(0,245,160,.5)", marginTop:4 }}>
                        {projDesc.length} / 100+ chars
                      </div>
                    </Field>
                    <Field label={t.innovation} error={errors.innovation}>
                      <Textarea value={innovation} onChange={e=>setInnovation(e.target.value)} placeholder={t.innovationPH} rows={3} hasError={!!errors.innovation}/>
                    </Field>
                    <Field label={t.heardFrom}>
                      <Select value={heardFrom} onChange={e=>setHeardFrom(e.target.value)}>
                        <option value="">—</option>
                        {t.heardOptions.map(h=><option key={h} value={h}>{h}</option>)}
                      </Select>
                    </Field>
                  </FieldGroup>
                  <NavRow onPrev={prev} onNext={next} nextLabel={t.nextBtn} prevLabel={t.prevBtn}/>
                </>
              )}

              {/* ── STEP 4: File + Submit ── */}
              {step === 4 && (
                <>
                  <SectionTitle>{t.fileTitle}</SectionTitle>
                  <p style={{ color:"rgba(255,255,255,.45)", fontSize:14, lineHeight:1.7, marginBottom:20 }}>{t.fileSub}</p>

                  <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={handleFile}/>

                  {!file ? (
                    <button onClick={()=>fileRef.current.click()}
                      style={{ width:"100%", border:"2px dashed rgba(245,160,0,.25)", borderRadius:16, padding:"32px 20px", background:"rgba(245,160,0,.04)", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:10, marginBottom:8, transition:"all .2s" }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(245,160,0,.5)";e.currentTarget.style.background="rgba(245,160,0,.08)";}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(245,160,0,.25)";e.currentTarget.style.background="rgba(245,160,0,.04)";}}>
                      <span style={{ fontSize:36 }}>📄</span>
                      <span style={{ color:AC, fontWeight:600, fontSize:15 }}>{t.fileBtn}</span>
                      <span style={{ color:"rgba(255,255,255,.3)", fontSize:12 }}>PDF, DOC, DOCX, PPT, PPTX · max 5 Mo</span>
                    </button>
                  ) : (
                    <div style={{ background:"rgba(0,245,160,.06)", border:"1px solid rgba(0,245,160,.2)", borderRadius:12, padding:"14px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{ fontSize:22 }}>📄</span>
                        <div>
                          <div style={{ color:"rgba(0,245,160,.9)", fontSize:13, fontWeight:600 }}>{t.fileName_}</div>
                          <div style={{ color:"rgba(255,255,255,.5)", fontSize:12 }}>{file.name}</div>
                        </div>
                      </div>
                      <button onClick={()=>setFile(null)} style={{ background:"rgba(255,80,80,.1)", border:"1px solid rgba(255,80,80,.2)", color:"rgba(255,100,100,.8)", borderRadius:8, padding:"4px 10px", cursor:"pointer", fontSize:12 }}>{t.fileRemove}</button>
                    </div>
                  )}

                  {fileErr && <p style={{ color:"#f77", fontSize:12, marginBottom:8 }}>{fileErr}</p>}
                  <p style={{ color:"rgba(255,255,255,.25)", fontSize:12, marginBottom:24, fontStyle:"italic" }}>{t.fileOptional}</p>

                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    <PrimaryBtn onClick={submit} disabled={submitting}>
                      {submitting ? (
                        <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                          <span style={{ width:18, height:18, border:"2px solid rgba(0,0,0,.2)", borderTop:"2px solid #04080f", borderRadius:"50%", display:"inline-block", animation:"spin .7s linear infinite" }}/>
                          {t.submitting}
                        </span>
                      ) : t.submitBtn}
                    </PrimaryBtn>
                    <button onClick={prev} style={{ background:"transparent", border:"none", color:"rgba(255,255,255,.3)", cursor:"pointer", fontSize:14, padding:"8px" }}>{t.prevBtn}</button>
                  </div>
                </>
              )}
            </Card>
          </>
        )}

        <p style={{ textAlign:"center", color:"rgba(255,255,255,.12)", fontSize:10, letterSpacing:2.5, marginTop:10 }}>
          INNOV&apos;DOM CHALLENGE · DÉPARTEMENT GÉNIE INDUSTRIEL · ENSA FÈS
        </p>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Card({ children }) {
  return (
    <div className="fadeUp" style={{ background:"rgba(255,255,255,.025)", border:"1px solid rgba(255,255,255,.07)", borderRadius:24, padding:"32px 28px", backdropFilter:"blur(24px)", marginBottom:14, position:"relative", overflow:"hidden" }}>
      {children}
    </div>
  );
}
function SectionTitle({ children }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:22 }}>
      <div style={{ width:3, height:22, background:"#f5a000", borderRadius:2 }}/>
      <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:700, color:"#fff" }}>{children}</h2>
    </div>
  );
}
function FieldGroup({ children }) { return <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:22 }}>{children}</div>; }
function Row({ children })        { return <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>{children}</div>; }
function Field({ label, error, children }) {
  return (
    <div>
      <label style={{ display:"block", color:"rgba(255,255,255,.55)", fontSize:12, fontWeight:600, letterSpacing:.5, marginBottom:6 }}>{label}</label>
      {children}
      {error && <p style={{ color:"#f77", fontSize:11, marginTop:4 }}>{error}</p>}
    </div>
  );
}
function Input({ hasError, ...props }) {
  return <input {...props} style={{ background:"rgba(255,255,255,.05)", border:`1px solid ${hasError?"#f55":"rgba(255,255,255,.1)"}`, borderRadius:10, padding:"11px 14px", color:"#fff", fontSize:15, fontFamily:"'DM Sans',sans-serif", width:"100%", transition:"border .2s" }}
    onFocus={e=>!hasError&&(e.target.style.borderColor="rgba(245,160,0,.5)")}
    onBlur={e=>!hasError&&(e.target.style.borderColor="rgba(255,255,255,.1)")}/>;
}
function Select({ hasError, children, ...props }) {
  return <select {...props} style={{ background:"#0d1520", border:`1px solid ${hasError?"#f55":"rgba(255,255,255,.1)"}`, borderRadius:10, padding:"11px 14px", color:"#fff", fontSize:15, fontFamily:"'DM Sans',sans-serif", width:"100%", transition:"border .2s", cursor:"pointer" }}>{children}</select>;
}
function Textarea({ hasError, ...props }) {
  return <textarea {...props} style={{ background:"rgba(255,255,255,.04)", border:`1px solid ${hasError?"#f55":"rgba(245,160,0,.2)"}`, borderRadius:10, padding:"12px 14px", color:"#fff", fontSize:15, resize:"vertical", fontFamily:"'DM Sans',sans-serif", lineHeight:1.6, width:"100%", display:"block" }}/>;
}
function PrimaryBtn({ children, onClick, disabled=false }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ background:"linear-gradient(135deg,#f5a000,#c27800)", color:"#fff", border:"none", borderRadius:12, padding:"14px 28px", fontSize:16, fontWeight:700, cursor:disabled?"not-allowed":"pointer", width:"100%", fontFamily:"'Syne',sans-serif", opacity:disabled?.6:1, transition:"opacity .2s" }}>
      {children}
    </button>
  );
}
function NavRow({ onPrev, onNext, nextLabel, prevLabel }) {
  return (
    <div style={{ display:"flex", gap:10, marginTop:4 }}>
      <button onClick={onPrev} style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.08)", color:"rgba(255,255,255,.45)", borderRadius:12, padding:"12px 20px", cursor:"pointer", fontSize:14, fontWeight:500 }}>{prevLabel}</button>
      <PrimaryBtn onClick={onNext}>{nextLabel}</PrimaryBtn>
    </div>
  );
}
