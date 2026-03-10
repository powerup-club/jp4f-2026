"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

function InfoRow({ label, value }: any) {
  if (!value) return null;
  return (
    <div style={{ display:"flex", gap:12, padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
      <span style={{ color:"rgba(255,255,255,.3)", fontSize:12, width:150, flexShrink:0 }}>{label}</span>
      <span style={{ color:"rgba(255,255,255,.8)", fontSize:13 }}>{value}</span>
    </div>
  );
}
function Section({ title, icon, children }: any) {
  return (
    <div style={{ background:"rgba(255,255,255,.025)", border:"1px solid rgba(255,255,255,.07)", borderRadius:16, padding:"20px 22px", marginBottom:14 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
        <span style={{ fontSize:16 }}>{icon}</span>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, color:"#f5a000", margin:0, letterSpacing:.5 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function PortalHome() {
  const { data: session } = useSession();
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/application").then(r=>r.json()).then(d=>{setApp(d.application);setLoading(false);}).catch(()=>setLoading(false));
  }, []);

  if (loading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh"}}><div style={{width:36,height:36,border:"3px solid rgba(245,160,0,.2)",borderTop:"3px solid #f5a000",borderRadius:"50%",animation:"spin .8s linear infinite"}}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;

  const isSubmitted = app?.status === "submitted";
  const hasDraft = app && (app.full_name || app.proj_title);

  const quickLinks = [
    { icon:"📊", label:"Évaluer mon projet", href:"/application/evaluate", color:"#00f5a0" },
    { icon:"🗺️", label:"Mon orientation",    href:"/application/orientation", color:"#0088ff" },
    { icon:"🎮", label:"Mini-jeux",           href:"/application/games",      color:"#cc44ff" },
    { icon:"💬", label:"Assistant IA",        href:"/application/chat",       color:"#f5a000" },
  ];

  return (
    <div style={{ padding:"28px", maxWidth:860, margin:"0 auto" }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:10, letterSpacing:3, color:"rgba(245,160,0,.6)", fontWeight:700, marginBottom:6 }}>ESPACE CANDIDAT</div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:"#fff", margin:"0 0 4px" }}>Bonjour, {session?.user?.name?.split(" ")[0]} 👋</h1>
        <p style={{ color:"rgba(255,255,255,.4)", fontSize:14, margin:0 }}>Innov'Dom Challenge 2026 · ENSA Fès</p>
      </div>

      {/* Team ID */}
      <div style={{ background:"linear-gradient(135deg,rgba(245,160,0,.08),rgba(194,120,0,.04))", border:"1px solid rgba(245,160,0,.2)", borderRadius:16, padding:"16px 20px", marginBottom:20, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ fontSize:9, letterSpacing:2, color:"rgba(245,160,0,.5)", fontWeight:700, marginBottom:4 }}>TON IDENTIFIANT ÉQUIPE</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:"#f5a000", letterSpacing:2 }}>{app?.team_id||"—"}</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", marginTop:2 }}>Utilise cet ID pour contacter l'équipe organisatrice</div>
        </div>
        <div style={{ padding:"6px 14px", borderRadius:20, fontSize:12, fontWeight:700, background:isSubmitted?"rgba(0,245,160,.1)":"rgba(245,160,0,.1)", color:isSubmitted?"#00f5a0":"#f5a000", border:`1px solid ${isSubmitted?"rgba(0,245,160,.25)":"rgba(245,160,0,.25)"}` }}>
          {isSubmitted?"✅ Soumis":"📝 Brouillon"}
        </div>
      </div>

      {/* Quick links */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))", gap:10, marginBottom:24 }}>
        {quickLinks.map(ql => (
          <Link key={ql.href} href={ql.href} style={{ background:`${ql.color}0d`, border:`1px solid ${ql.color}25`, borderRadius:14, padding:"16px", textDecoration:"none", display:"flex", flexDirection:"column", gap:8, transition:"all .2s" }}>
            <span style={{ fontSize:24 }}>{ql.icon}</span>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:700, color:ql.color }}>{ql.label}</span>
          </Link>
        ))}
      </div>

      {/* CTA */}
      {!hasDraft && !isSubmitted && (
        <div style={{ background:"rgba(245,160,0,.04)", border:"2px dashed rgba(245,160,0,.2)", borderRadius:16, padding:"32px", textAlign:"center", marginBottom:20 }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🚀</div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:"#fff", marginBottom:8 }}>Commence ta candidature</h2>
          <p style={{ color:"rgba(255,255,255,.4)", fontSize:14, marginBottom:20 }}>Remplis le formulaire pour soumettre ton projet.</p>
          <Link href="/application/form" style={{ background:"linear-gradient(135deg,#f5a000,#c27800)", color:"#fff", textDecoration:"none", padding:"12px 28px", borderRadius:10, fontWeight:700, fontSize:14, fontFamily:"'Syne',sans-serif" }}>Remplir le formulaire →</Link>
        </div>
      )}

      {hasDraft && !isSubmitted && (
        <div style={{ marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
          <Link href="/application/form" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"linear-gradient(135deg,#f5a000,#c27800)", color:"#fff", textDecoration:"none", padding:"10px 20px", borderRadius:10, fontWeight:700, fontSize:14, fontFamily:"'Syne',sans-serif" }}>✏️ Modifier le formulaire</Link>
          <span style={{ color:"rgba(255,255,255,.3)", fontSize:12 }}>Brouillon sauvegardé</span>
        </div>
      )}

      {isSubmitted && (
        <div style={{ background:"rgba(0,245,160,.06)", border:"1px solid rgba(0,245,160,.2)", borderRadius:12, padding:"14px 18px", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
          <span>✅</span>
          <div><div style={{ color:"#00f5a0", fontWeight:700, fontSize:13 }}>Candidature soumise !</div><div style={{ color:"rgba(255,255,255,.4)", fontSize:12 }}>{app?.submitted_at?`Le ${new Date(app.submitted_at).toLocaleDateString("fr-FR")}`:""}</div></div>
        </div>
      )}

      {/* Info sections */}
      {hasDraft && (
        <>
          <Section title="INFORMATIONS PERSONNELLES" icon="👤">
            <InfoRow label="Nom complet" value={app?.full_name}/>
            <InfoRow label="Email" value={session?.user?.email}/>
            <InfoRow label="Téléphone" value={app?.phone}/>
            <InfoRow label="Université" value={app?.university}/>
            <InfoRow label="Filière" value={app?.branch}/>
            <InfoRow label="Niveau" value={app?.year_of_study}/>
            <InfoRow label="LinkedIn" value={app?.linkedin}/>
          </Section>
          {app?.type==="team" && app?.team_name && (
            <Section title="ÉQUIPE" icon="👥">
              <InfoRow label="Nom de l'équipe" value={app?.team_name}/>
              <InfoRow label="Membre 2" value={app?.member2_name?`${app.member2_name} — ${app.member2_email}`:""}/>
              <InfoRow label="Membre 3" value={app?.member3_name?`${app.member3_name} — ${app.member3_email}`:""}/>
              <InfoRow label="Membre 4" value={app?.member4_name?`${app.member4_name} — ${app.member4_email}`:""}/>
            </Section>
          )}
          {app?.proj_title && (
            <Section title="PROJET" icon="💡">
              <InfoRow label="Titre" value={app?.proj_title}/>
              <InfoRow label="Domaine" value={app?.proj_domain}/>
              <InfoRow label="Description" value={app?.proj_desc}/>
              <InfoRow label="Innovation" value={app?.innovation}/>
              <InfoRow label="Format démo" value={app?.demo_format}/>
              {app?.file_link&&<div style={{display:"flex",gap:12,padding:"8px 0"}}><span style={{color:"rgba(255,255,255,.3)",fontSize:12,width:150,flexShrink:0}}>Fichier</span><a href={app.file_link} target="_blank" rel="noreferrer" style={{color:"#f5a000",fontSize:13}}>📄 Voir</a></div>}
            </Section>
          )}
        </>
      )}
    </div>
  );
}
