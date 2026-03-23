"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ContactPage() {
  const { data: session } = useSession();
  const [app, setApp] = useState<any>(null);
  const [form, setForm] = useState({ phone:"", message:"" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/application").then(r=>r.json()).then(d=>setApp(d.application));
  }, []);

  const submit = async () => {
    if (!form.message.trim()) return;
    setLoading(true);
    await fetch("/api/contact", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ userName:session?.user?.name, userEmail:session?.user?.email, teamId:app?.team_id, phone:form.phone, message:form.message })
    });
    setSent(true);
    setLoading(false);
  };

  return (
    <div style={{ padding:"28px", maxWidth:680, margin:"0 auto" }}>
      <div style={{ fontSize:10, letterSpacing:3, color:"rgba(245,160,0,.6)", fontWeight:700, marginBottom:6 }}>SUPPORT</div>
      <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:"#fff", margin:"0 0 4px" }}>📞 Contacter l'équipe</h1>
      <p style={{ color:"rgba(255,255,255,.4)", fontSize:14, marginBottom:24 }}>Une question sur la compétition ? L'équipe organisatrice te répondra rapidement.</p>

      {sent ? (
        <div style={{ background:"rgba(0,245,160,.06)", border:"2px solid rgba(0,245,160,.2)", borderRadius:20, padding:"40px", textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:"#00f5a0", marginBottom:8 }}>Message envoyé !</div>
          <div style={{ color:"rgba(255,255,255,.4)", fontSize:14 }}>L'équipe te répondra dans les plus brefs délais.</div>
          <button onClick={()=>{setSent(false);setForm({phone:"",message:""})}} style={{ marginTop:20, background:"rgba(0,245,160,.1)", border:"1px solid rgba(0,245,160,.3)", borderRadius:10, padding:"10px 20px", color:"#00f5a0", cursor:"pointer", fontSize:14 }}>Envoyer un autre message</button>
        </div>
      ) : (
        <div style={{ background:"rgba(255,255,255,.025)", border:"1px solid rgba(255,255,255,.07)", borderRadius:20, padding:"24px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
            <div>
              <label style={{ fontSize:12, color:"rgba(255,255,255,.4)", display:"block", marginBottom:6 }}>Nom</label>
              <div style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:10, padding:"11px 14px", color:"rgba(255,255,255,.5)", fontSize:14 }}>{session?.user?.name}</div>
            </div>
            <div>
              <label style={{ fontSize:12, color:"rgba(255,255,255,.4)", display:"block", marginBottom:6 }}>Email</label>
              <div style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:10, padding:"11px 14px", color:"rgba(255,255,255,.5)", fontSize:14 }}>{session?.user?.email}</div>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
            <div>
              <label style={{ fontSize:12, color:"rgba(255,255,255,.4)", display:"block", marginBottom:6 }}>ID Équipe</label>
              <div style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:10, padding:"11px 14px", color:"#f5a000", fontSize:14, fontWeight:700 }}>{app?.team_id||"—"}</div>
            </div>
            <div>
              <label style={{ fontSize:12, color:"rgba(255,255,255,.4)", display:"block", marginBottom:6 }}>Téléphone (optionnel)</label>
              <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="+212 6XX XXX XXX"
                style={{ width:"100%", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:10, padding:"11px 14px", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box" }}/>
            </div>
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, color:"rgba(255,255,255,.4)", display:"block", marginBottom:6 }}>Message *</label>
            <textarea value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} placeholder="Ta question ou demande..." rows={5}
              style={{ width:"100%", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:10, padding:"12px 14px", color:"#fff", fontSize:14, outline:"none", resize:"vertical", fontFamily:"'DM Sans',sans-serif", lineHeight:1.6, boxSizing:"border-box" }}/>
          </div>
          <button onClick={submit} disabled={!form.message.trim()||loading}
            style={{ width:"100%", background:"linear-gradient(135deg,#f5a000,#c27800)", border:"none", borderRadius:12, padding:"14px", color:"#fff", fontWeight:800, fontSize:15, cursor:"pointer", fontFamily:"'Syne',sans-serif", opacity:!form.message.trim()||loading?.5:1 }}>
            {loading?"Envoi...":"📤 Envoyer le message"}
          </button>
        </div>
      )}

      <div style={{ marginTop:20, display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {[["📧","Email","Innov'Industry@usmba.ac.ma"],["📍","Lieu","ENSA Fès, Avenue My Abdallah"]].map(([icon,label,val])=>(
          <div key={label} style={{ background:"rgba(255,255,255,.025)", border:"1px solid rgba(255,255,255,.07)", borderRadius:12, padding:"14px 16px", display:"flex", gap:10, alignItems:"center" }}>
            <span style={{ fontSize:20 }}>{icon}</span>
            <div><div style={{ color:"rgba(255,255,255,.4)", fontSize:11 }}>{label}</div><div style={{ color:"#fff", fontSize:13 }}>{val}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}
