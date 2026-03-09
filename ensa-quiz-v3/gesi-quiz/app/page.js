"use client";
import { useState, useRef } from "react";

// ── Translations ─────────────────────────────────────────────────────────────
const T = {
  fr: {
    badge       : "ENSA FÈS · JOURNÉES PÉDAGOGIQUES",
    title       : ["Quel ingénieur", "es-tu ?"],
    subtitle    : "5 questions pour découvrir ta filière idéale",
    tags        : ["Énergie", "Mécatronique", "Mécanique", "Industriel"],
    startBtn    : "Découvrir mon profil →",
    nameTitle   : "Avant de commencer",
    nameSub     : "Pour personnaliser ton résultat",
    fnLabel     : "Prénom",
    lnLabel     : "Nom de famille",
    continueBtn : "Continuer →",
    qOf         : n => `Question ${n} sur 5`,
    thinking    : "Réflexion en cours...",
    freeHint    : "✏️  Autre réponse...",
    freePH      : "Écris ta réponse ici...",
    sendBtn     : "Envoyer →",
    profileHead : "TON PROFIL D'INGÉNIEUR",
    branchHead  : "FILIÈRE RECOMMANDÉE",
    whyHead     : "POURQUOI CETTE FILIÈRE ?",
    journeyHead : "TON PARCOURS",
    reviewTitle : "Que penses-tu du quiz ?",
    reviewPH    : "Un commentaire, une impression... (optionnel)",
    submitBtn   : "Valider et enregistrer →",
    saving      : "Enregistrement...",
    doneTitle   : "C'est enregistré !",
    doneSub     : "Merci pour ta participation. À très bientôt à l'ENSA Fès !",
    restartBtn  : "Recommencer",
    nameErr     : "Merci d'entrer ton prénom et ton nom.",
    branches    : {
      GESI        : "Génie Énergétique & Systèmes Intelligents",
      MECA        : "Génie Mécanique",
      MECATRONIQUE: "Mécatronique",
      GI          : "Génie Industriel",
    },
  },
  en: {
    badge       : "ENSA FÈS · PEDAGOGICAL DAYS",
    title       : ["What kind of", "engineer are you?"],
    subtitle    : "5 questions to discover your ideal branch",
    tags        : ["Energy", "Mechatronics", "Mechanical", "Industrial"],
    startBtn    : "Discover my profile →",
    nameTitle   : "Before we start",
    nameSub     : "To personalize your result",
    fnLabel     : "First name",
    lnLabel     : "Last name",
    continueBtn : "Continue →",
    qOf         : n => `Question ${n} of 5`,
    thinking    : "Thinking...",
    freeHint    : "✏️  Other answer...",
    freePH      : "Write your answer here...",
    sendBtn     : "Send →",
    profileHead : "YOUR ENGINEER PROFILE",
    branchHead  : "RECOMMENDED BRANCH",
    whyHead     : "WHY THIS BRANCH?",
    journeyHead : "YOUR JOURNEY",
    reviewTitle : "What do you think of the quiz?",
    reviewPH    : "A comment, an impression... (optional)",
    submitBtn   : "Submit & save →",
    saving      : "Saving...",
    doneTitle   : "All saved!",
    doneSub     : "Thank you for participating. See you at ENSA Fès!",
    restartBtn  : "Start over",
    nameErr     : "Please enter your first and last name.",
    branches    : {
      GESI        : "Energy Engineering & Intelligent Systems",
      MECA        : "Mechanical Engineering",
      MECATRONIQUE: "Mechatronics Engineering",
      GI          : "Industrial Engineering",
    },
  },
};

const ICONS   = { GESI:"⚡", MECA:"⚙️", MECATRONIQUE:"🤖", GI:"📊" };
const COLORS  = { GESI:"#00f5a0", MECA:"#f5a000", MECATRONIQUE:"#cc44ff", GI:"#0088ff" };
const GLOWS   = { GESI:"rgba(0,245,160,.13)", MECA:"rgba(245,160,0,.13)", MECATRONIQUE:"rgba(204,68,255,.13)", GI:"rgba(0,136,255,.13)" };

async function callChat(messages, lang) {
  const r = await fetch("/api/chat", {
    method : "POST",
    headers: { "Content-Type": "application/json" },
    body   : JSON.stringify({ messages, lang }),
  });
  return r.json();
}
async function saveData(payload) {
  await fetch("/api/save", {
    method : "POST",
    headers: { "Content-Type": "application/json" },
    body   : JSON.stringify(payload),
  });
}

// ── Component ────────────────────────────────────────────────────────────────
export default function Home() {
  const [lang, setLang]     = useState("fr");
  const [phase, setPhase]   = useState("intro"); // intro|name|quiz|review|done
  const [fn, setFn]         = useState("");
  const [ln, setLn]         = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [msgs, setMsgs]     = useState([]);
  const [cur, setCur]       = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoad]  = useState(false);
  const [freeText, setFree] = useState("");
  const [showFree, setSF]   = useState(false);
  const [qNum, setQNum]     = useState(0);
  const [history, setHist]  = useState([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover]   = useState(0);
  const [comment, setCmt]   = useState("");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  const t  = T[lang];
  const ac = result ? COLORS[result.branch] : "#00f5a0";
  const gl = result ? GLOWS[result.branch]  : "rgba(0,245,160,.12)";

  const goName = () => setPhase("name");

  const startQuiz = async () => {
    if (!fn.trim() || !ln.trim()) { setNameErr(true); return; }
    setNameErr(false);
    setPhase("quiz");
    setLoad(true);
    const init = [{ role:"user", content: lang==="en" ? "Start the quiz. Ask the first question." : "Commence le quiz. Pose la première question." }];
    const res  = await callChat(init, lang);
    setMsgs(init); setCur(res); setQNum(1);
    setLoad(false);
  };

  const answer = async (text) => {
    if (!text.trim()) return;
    setLoad(true); setFree(""); setSF(false);
    const newHist = [...history, { q: cur.question, a: text }];
    setHist(newHist);
    const newMsgs = [...msgs, { role:"assistant", content:JSON.stringify(cur) }, { role:"user", content:text }];
    setMsgs(newMsgs);
    const res = await callChat(newMsgs, lang);
    if (res.done) { setResult(res); setPhase("review"); }
    else          { setCur(res); setQNum(n => n+1); }
    setLoad(false);
  };

  const submit = async () => {
    setSaving(true);
    await saveData({ firstName:fn, lastName:ln, lang, branch:result.branch, profile:result.profile, history, rating, comment });
    setSaving(false);
    setPhase("done");
  };

  const reset = () => {
    setPhase("intro"); setFn(""); setLn(""); setNameErr(false);
    setMsgs([]); setCur(null); setResult(null); setLoad(false);
    setFree(""); setSF(false); setQNum(0); setHist([]);
    setRating(0); setHover(0); setCmt(""); setSaving(false);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:"#04080f", fontFamily:"'DM Sans',sans-serif", color:"#e8f4f0", display:"flex", flexDirection:"column", alignItems:"center", padding:"20px 16px 48px", position:"relative", overflow:"hidden" }}>

      {/* Background layers */}
      <div style={{ position:"fixed", inset:0, backgroundImage:"linear-gradient(rgba(0,245,160,.028) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,160,.028) 1px,transparent 1px)", backgroundSize:"46px 46px", pointerEvents:"none" }}/>
      <div style={{ position:"fixed", top:"-18%", right:"-12%", width:700, height:700, background:`radial-gradient(circle,${gl} 0%,transparent 65%)`, pointerEvents:"none", transition:"background .7s ease" }}/>
      <div style={{ position:"fixed", bottom:"-18%", left:"-10%", width:600, height:600, background:"radial-gradient(circle,rgba(0,80,200,.08) 0%,transparent 65%)", pointerEvents:"none" }}/>

      <div style={{ maxWidth:580, width:"100%", position:"relative", zIndex:1 }}>

        {/* Lang toggle */}
        <div style={{ display:"flex", justifyContent:"flex-end", gap:6, marginBottom:18 }}>
          {["fr","en"].map(l => (
            <button key={l} onClick={()=>setLang(l)} style={{ background: lang===l?"rgba(0,245,160,.1)":"rgba(255,255,255,.04)", border:`1px solid ${lang===l?"rgba(0,245,160,.3)":"rgba(255,255,255,.09)"}`, color:lang===l?"#00f5a0":"rgba(255,255,255,.35)", borderRadius:8, padding:"5px 14px", fontSize:12, fontWeight:700, cursor:"pointer", letterSpacing:1, transition:"all .2s" }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Header */}
        <div className="fadeUp" style={{ textAlign:"center", marginBottom:28 }}>
          <span style={{ display:"inline-block", background:"rgba(0,245,160,.07)", border:"1px solid rgba(0,245,160,.18)", color:"#00f5a0", fontSize:10, fontWeight:700, letterSpacing:3, padding:"4px 14px", borderRadius:20, marginBottom:16 }}>{t.badge}</span>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:clamp(34,46), fontWeight:800, lineHeight:1.1, background:`linear-gradient(140deg,#fff 0%,${ac} 100%)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:10, transition:"background .6s ease" }}>
            {t.title[0]}<br/>{t.title[1]}
          </h1>
          <p style={{ color:"rgba(255,255,255,.38)", fontSize:14 }}>{t.subtitle}</p>
        </div>

        {/* ═══ INTRO ═══ */}
        {phase==="intro" && (
          <Card key="intro">
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <div style={{ display:"flex", justifyContent:"center", gap:14, fontSize:34, marginBottom:20 }}>
                {Object.entries(ICONS).map(([k,ic])=>(
                  <div key={k} style={{ width:56, height:56, borderRadius:14, background:`${COLORS[k]}15`, border:`1px solid ${COLORS[k]}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>{ic}</div>
                ))}
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginBottom:24 }}>
                {t.tags.map((tag,i)=>{
                  const colors=Object.values(COLORS);
                  return <span key={tag} style={{ background:`${colors[i]}10`, border:`1px solid ${colors[i]}28`, color:colors[i], fontSize:12, padding:"4px 14px", borderRadius:20, fontWeight:500 }}>{tag}</span>;
                })}
              </div>
            </div>
            <PrimaryBtn onClick={goName} color="#00f5a0">{t.startBtn}</PrimaryBtn>
          </Card>
        )}

        {/* ═══ NAME ═══ */}
        {phase==="name" && (
          <Card key="name">
            <h2 style={cTitle}>{t.nameTitle}</h2>
            <p style={cSub}>{t.nameSub}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:nameErr?8:20 }}>
              <input style={{ ...inputStyle, ...(nameErr&&!fn.trim()?{borderColor:"#f55"}:{}) }} placeholder={t.fnLabel} value={fn} onChange={e=>setFn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&startQuiz()}/>
              <input style={{ ...inputStyle, ...(nameErr&&!ln.trim()?{borderColor:"#f55"}:{}) }} placeholder={t.lnLabel} value={ln} onChange={e=>setLn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&startQuiz()}/>
            </div>
            {nameErr && <p style={{ color:"#f77", fontSize:12, marginBottom:14, marginTop:-4 }}>{t.nameErr}</p>}
            <PrimaryBtn onClick={startQuiz} color="#00f5a0">{t.continueBtn}</PrimaryBtn>
          </Card>
        )}

        {/* ═══ QUIZ ═══ */}
        {phase==="quiz" && (
          <Card key="quiz">
            {/* Dots */}
            <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:26 }}>
              {[1,2,3,4,5].map(i=>(
                <div key={i} style={{ width:9, height:9, borderRadius:"50%", transition:"all .3s ease", background: i<qNum?"#00f5a0": i===qNum?"#00f5a0":"rgba(255,255,255,.1)", transform: i===qNum?"scale(1.5)":"scale(1)", boxShadow: i===qNum?"0 0 10px #00f5a0":"none" }}/>
              ))}
            </div>

            {loading ? (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"38px 0", gap:14 }}>
                <div style={{ width:38, height:38, border:"3px solid rgba(0,245,160,.15)", borderTop:"3px solid #00f5a0", borderRadius:"50%", animation:"spin .8s linear infinite" }}/>
                <p style={{ color:"rgba(255,255,255,.3)", fontSize:13, animation:"pulse 1.5s ease infinite" }}>{t.thinking}</p>
              </div>
            ) : cur && (
              <>
                <p style={{ color:"rgba(0,245,160,.55)", fontSize:11, fontWeight:700, letterSpacing:2, marginBottom:8 }}>{t.qOf(qNum)}</p>
                <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:700, color:"#fff", lineHeight:1.45, marginBottom:22 }}>{cur.question}</h2>
                <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                  {cur.options?.map((opt,i)=>(
                    <button key={i}
                      style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.09)", borderRadius:12, padding:"13px 15px", color:"#fff", fontSize:15, cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:12, transition:"all .18s ease", fontFamily:"'DM Sans',sans-serif" }}
                      onClick={()=>answer(opt)}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor="#00f5a0";e.currentTarget.style.background="rgba(0,245,160,.07)";e.currentTarget.style.transform="translateX(5px)";}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.09)";e.currentTarget.style.background="rgba(255,255,255,.03)";e.currentTarget.style.transform="translateX(0)";}}
                    >
                      <span style={{ width:27, height:27, borderRadius:7, background:"rgba(0,245,160,.09)", color:"#00f5a0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0 }}>{["A","B","C"][i]}</span>
                      <span style={{ flex:1 }}>{opt}</span>
                    </button>
                  ))}
                  {!showFree ? (
                    <button style={{ background:"transparent", border:"1px dashed rgba(255,255,255,.1)", borderRadius:10, padding:"11px 15px", color:"rgba(255,255,255,.28)", fontSize:13, cursor:"pointer", textAlign:"left", marginTop:2, fontFamily:"'DM Sans',sans-serif", width:"100%" }}
                      onClick={()=>{ setSF(true); setTimeout(()=>inputRef.current?.focus(),50); }}>
                      {t.freeHint}
                    </button>
                  ):(
                    <div>
                      <textarea ref={inputRef} value={freeText} onChange={e=>setFree(e.target.value)} placeholder={t.freePH} rows={3}
                        style={{ ...taStyle, marginBottom:8 }}
                        onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();answer(freeText);}}}
                      />
                      <PrimaryBtn onClick={()=>answer(freeText)} color="#00f5a0" disabled={!freeText.trim()} small>{t.sendBtn}</PrimaryBtn>
                    </div>
                  )}
                </div>
              </>
            )}
          </Card>
        )}

        {/* ═══ REVIEW (result + rating) ═══ */}
        {phase==="review" && result && (
          <Card key="review">
            {/* Glow accent */}
            <div style={{ position:"absolute", top:-80, right:-80, width:280, height:280, background:`radial-gradient(circle,${ac}15 0%,transparent 70%)`, pointerEvents:"none" }}/>

            {/* Profile result */}
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <div style={{ fontSize:52, marginBottom:12 }}>{ICONS[result.branch]}</div>
              <div style={{ color:ac, fontSize:10, fontWeight:700, letterSpacing:3, marginBottom:6 }}>{t.profileHead}</div>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:ac, marginBottom:10 }}>{result.profile}</h2>
              <p style={{ color:"rgba(255,255,255,.55)", fontSize:15, lineHeight:1.75, marginBottom:16 }}>{result.description}</p>
              <p style={{ color:`${ac}cc`, fontSize:14, fontStyle:"italic", marginBottom:20 }}>&ldquo;{result.tagline}&rdquo;</p>

              {/* Branch pill */}
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, border:`1px solid ${ac}40`, borderRadius:24, padding:"7px 18px", background:`${ac}0d` }}>
                <span style={{ fontSize:16 }}>{ICONS[result.branch]}</span>
                <div style={{ textAlign:"left" }}>
                  <div style={{ color:ac, fontSize:10, fontWeight:700, letterSpacing:2 }}>{t.branchHead}</div>
                  <div style={{ color:"#fff", fontSize:13, fontWeight:600 }}>{t.branches[result.branch]}</div>
                </div>
              </div>
            </div>

            {/* Why */}
            {result.why && (
              <div style={{ background:"rgba(255,255,255,.025)", border:`1px solid ${ac}20`, borderRadius:14, padding:"14px 16px", marginBottom:20 }}>
                <div style={{ color:ac, fontSize:10, fontWeight:700, letterSpacing:2, marginBottom:8 }}>{t.whyHead}</div>
                <p style={{ color:"rgba(255,255,255,.5)", fontSize:14, lineHeight:1.7 }}>{result.why}</p>
              </div>
            )}

            {/* Journey */}
            <div style={{ background:"rgba(255,255,255,.02)", borderRadius:12, padding:"14px 16px", marginBottom:22 }}>
              <div style={{ color:"rgba(255,255,255,.22)", fontSize:10, fontWeight:700, letterSpacing:2.5, marginBottom:10 }}>{t.journeyHead}</div>
              {history.map((h,i)=>(
                <div key={i} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"flex-start" }}>
                  <span style={{ border:`1px solid ${ac}`, color:ac, fontSize:9, fontWeight:700, padding:"2px 5px", borderRadius:4, flexShrink:0, marginTop:3, letterSpacing:1 }}>Q{i+1}</span>
                  <span style={{ color:"rgba(255,255,255,.4)", fontSize:13, lineHeight:1.55 }}>{h.a}</span>
                </div>
              ))}
            </div>

            {/* Rating */}
            <div style={{ marginBottom:20 }}>
              <p style={{ color:"rgba(255,255,255,.6)", fontSize:15, marginBottom:10 }}>{t.reviewTitle}</p>
              <div style={{ display:"flex", gap:4, marginBottom:12 }}>
                {[1,2,3,4,5].map(n=>(
                  <button key={n} style={{ background:"none", border:"none", cursor:"pointer", padding:"2px 3px", lineHeight:1 }}
                    onClick={()=>setRating(n)} onMouseEnter={()=>setHover(n)} onMouseLeave={()=>setHover(0)}>
                    <span style={{ fontSize:30, color: n<=(hover||rating)?"#f5c400":"rgba(255,255,255,.15)", transition:"color .15s" }}>★</span>
                  </button>
                ))}
              </div>
              <textarea value={comment} onChange={e=>setCmt(e.target.value)} placeholder={t.reviewPH} rows={3} style={taStyle}/>
            </div>

            <PrimaryBtn onClick={submit} color={ac} disabled={saving}>
              {saving ? t.saving : t.submitBtn}
            </PrimaryBtn>
          </Card>
        )}

        {/* ═══ DONE ═══ */}
        {phase==="done" && (
          <Card key="done">
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:56, marginBottom:16 }}>🎉</div>
              <h2 style={{ ...cTitle, fontSize:24 }}>{t.doneTitle}</h2>
              <p style={cSub}>{t.doneSub}</p>
              {rating>0 && (
                <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:20, marginTop:-4 }}>
                  {[1,2,3,4,5].map(n=><span key={n} style={{ fontSize:26, color:n<=rating?"#f5c400":"rgba(255,255,255,.12)" }}>★</span>)}
                </div>
              )}
              <button onClick={reset} style={{ background:"transparent", color:"rgba(255,255,255,.32)", border:"1px solid rgba(255,255,255,.1)", borderRadius:12, padding:"12px 28px", fontSize:14, cursor:"pointer", width:"100%" }}>{t.restartBtn}</button>
            </div>
          </Card>
        )}

        <p style={{ textAlign:"center", color:"rgba(255,255,255,.12)", fontSize:10, letterSpacing:2.5, marginTop:10, fontWeight:500 }}>DÉPARTEMENT GÉNIE INDUSTRIEL · ENSA FÈS</p>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Card({ children }) {
  return (
    <div className="fadeUp" style={{ background:"rgba(255,255,255,.025)", border:"1px solid rgba(255,255,255,.07)", borderRadius:24, padding:"34px 30px", backdropFilter:"blur(28px)", marginBottom:14, position:"relative", overflow:"hidden" }}>
      {children}
    </div>
  );
}
function PrimaryBtn({ children, onClick, color="#00f5a0", disabled=false, small=false }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ background:`linear-gradient(135deg,${color},${darken(color)})`, color:luma(color)<128?"#fff":"#04080f", border:"none", borderRadius:12, padding: small?"10px 22px":"14px 28px", fontSize: small?14:16, fontWeight:700, cursor:disabled?"not-allowed":"pointer", width:"100%", fontFamily:"'Syne',sans-serif", letterSpacing:.3, opacity:disabled?.6:1, transition:"opacity .2s" }}>
      {children}
    </button>
  );
}

// ── Style helpers ─────────────────────────────────────────────────────────────
const cTitle    = { fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:700, color:"#fff", marginBottom:8 };
const cSub      = { color:"rgba(255,255,255,.48)", fontSize:15, lineHeight:1.7, marginBottom:22 };
const inputStyle= { background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:10, padding:"12px 16px", color:"#fff", fontSize:15, fontFamily:"'DM Sans',sans-serif", width:"100%", transition:"border .2s" };
const taStyle   = { background:"rgba(255,255,255,.04)", border:"1px solid rgba(0,245,160,.22)", borderRadius:10, padding:"12px 15px", color:"#fff", fontSize:15, resize:"none", fontFamily:"'DM Sans',sans-serif", lineHeight:1.6, width:"100%", display:"block" };

function clamp(min,max){ return `clamp(${min}px,6vw,${max}px)`; }
function darken(hex){
  const n=parseInt(hex.slice(1),16);
  const r=Math.max(0,((n>>16)&255)-40);
  const g=Math.max(0,((n>>8)&255)-40);
  const b=Math.max(0,(n&255)-40);
  return `#${[r,g,b].map(v=>v.toString(16).padStart(2,"0")).join("")}`;
}
function luma(hex){
  const n=parseInt(hex.slice(1),16);
  return .299*((n>>16)&255)+.587*((n>>8)&255)+.114*(n&255);
}
