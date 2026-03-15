"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const NAV = [
  { icon:"⌂",  label:"Accueil",     href:"/application",            tip:"Tableau de bord" },
  { icon:"📋", label:"Règlement",   href:"/application/rules",      tip:"Règlement" },
  { icon:"📊", label:"Évaluer",     href:"/application/evaluate",   tip:"Évaluer mon projet" },
  { icon:"🗺️", label:"Orientation", href:"/application/orientation",tip:"Mon profil filière" },
  { icon:"💬", label:"Assistant",   href:"/application/chat",       tip:"Assistant IA" },
  { icon:"📞", label:"Contact",     href:"/application/contact",    tip:"Contacter l'équipe" },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login?callbackUrl=/application");
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") return (
    <div style={{ minHeight:"100vh", background:"#04080f", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:40, height:40, border:"3px solid rgba(245,160,0,.2)", borderTop:"3px solid #f5a000", borderRadius:"50%", animation:"spin .8s linear infinite" }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const w = mobile ? (mobileOpen ? 220 : 0) : (collapsed ? 64 : 230);

  return (
    <div style={{ minHeight:"100vh", background:"#04080f", display:"flex", fontFamily:"'DM Sans',sans-serif", color:"#e8f4f0" }}>
      <div style={{ position:"fixed", inset:0, backgroundImage:"linear-gradient(rgba(245,160,0,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(245,160,0,.015) 1px,transparent 1px)", backgroundSize:"40px 40px", pointerEvents:"none", zIndex:0 }}/>
      {mobile && mobileOpen && <div onClick={()=>setMobileOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.6)", zIndex:40 }}/>}

      {/* Sidebar */}
      <aside style={{ position:mobile?"fixed":"sticky", top:0, left:0, height:"100vh", width:w, background:"rgba(4,8,15,.97)", borderRight:"1px solid rgba(245,160,0,.1)", display:"flex", flexDirection:"column", transition:"width .25s ease", overflow:"hidden", zIndex:mobile?50:10, flexShrink:0 }}>
        {/* Logo */}
        <div style={{ padding:"18px 14px", borderBottom:"1px solid rgba(255,255,255,.05)", display:"flex", alignItems:"center", gap:10, minHeight:68 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#f5a000,#c27800)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, color:"#fff", flexShrink:0 }}>JP</div>
          {(!collapsed||mobile) && <div><div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, color:"#fff" }}>Innov'Industry 2026</div><div style={{ fontSize:9, color:"rgba(255,255,255,.3)", letterSpacing:1.5 }}>ESPACE CANDIDAT</div></div>}
        </div>

        {/* User */}
        <div style={{ padding:"12px 10px", borderBottom:"1px solid rgba(255,255,255,.04)", display:"flex", alignItems:"center", gap:8 }}>
          {session?.user?.image && <img src={session.user.image} style={{ width:30, height:30, borderRadius:"50%", flexShrink:0 }} alt=""/>}
          {(!collapsed||mobile) && <div style={{ overflow:"hidden" }}>
            <div style={{ fontSize:12, fontWeight:600, color:"#fff", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{session?.user?.name}</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,.3)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{session?.user?.email}</div>
          </div>}
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"10px 8px", display:"flex", flexDirection:"column", gap:3, overflowY:"auto" }}>
          {NAV.map(item => {
            const active = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/application");
            return (
              <Link key={item.href} href={item.href} onClick={()=>setMobileOpen(false)} title={collapsed?item.tip:""}
                style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 10px", borderRadius:10, background:active?"rgba(245,160,0,.12)":"transparent", border:`1px solid ${active?"rgba(245,160,0,.22)":"transparent"}`, color:active?"#f5a000":"rgba(255,255,255,.45)", textDecoration:"none", transition:"all .15s", fontSize:13, fontWeight:active?700:500, whiteSpace:"nowrap" }}>
                <span style={{ fontSize:17, flexShrink:0, lineHeight:1 }}>{item.icon}</span>
                {(!collapsed||mobile) && item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding:"10px 8px", borderTop:"1px solid rgba(255,255,255,.05)", display:"flex", flexDirection:"column", gap:4 }}>
          {!mobile && (
            <button onClick={()=>setCollapsed(c=>!c)} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:10, background:"transparent", border:"1px solid rgba(255,255,255,.06)", color:"rgba(255,255,255,.3)", cursor:"pointer", fontSize:12, width:"100%" }}>
              <span>{collapsed?"→":"←"}</span>{!collapsed&&"Réduire"}
            </button>
          )}
          <button onClick={()=>signOut({callbackUrl:"/auth/login"})} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:10, background:"rgba(255,60,60,.05)", border:"1px solid rgba(255,60,60,.1)", color:"rgba(255,100,100,.55)", cursor:"pointer", fontSize:12, width:"100%" }}>
            <span>⏻</span>{(!collapsed||mobile)&&"Déconnexion"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex:1, minHeight:"100vh", position:"relative", zIndex:1, overflowX:"hidden" }}>
        {mobile && (
          <div style={{ position:"sticky", top:0, background:"rgba(4,8,15,.95)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(245,160,0,.08)", padding:"12px 16px", display:"flex", alignItems:"center", gap:12, zIndex:30 }}>
            <button onClick={()=>setMobileOpen(o=>!o)} style={{ background:"none", border:"none", color:"#f5a000", fontSize:22, cursor:"pointer", padding:4 }}>☰</button>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, color:"#fff" }}>Innov'Industry 2026</span>
          </div>
        )}
        {children}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        a:hover{opacity:.85}
        nav a:hover{background:rgba(255,255,255,.04)!important;color:rgba(255,255,255,.7)!important}
      `}</style>
    </div>
  );
}
