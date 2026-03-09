"use client";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function AdminLogin() {
  const params = useSearchParams();
  const error  = params.get("error");

  return (
    <div style={{ minHeight:"100vh", background:"#04080f", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.08)", borderRadius:24, padding:"48px 40px", maxWidth:400, width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🔐</div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:"#fff", marginBottom:8 }}>Admin Dashboard</h1>
        <p style={{ color:"rgba(255,255,255,.4)", fontSize:14, marginBottom:32 }}>JESI 2026 · ENSA Fès</p>

        {error && (
          <div style={{ background:"rgba(255,80,80,.1)", border:"1px solid rgba(255,80,80,.2)", borderRadius:10, padding:"10px 16px", color:"#f88", fontSize:13, marginBottom:20 }}>
            Accès refusé — email non autorisé
          </div>
        )}

        <button
          onClick={() => signIn("google", { callbackUrl: "/admin" })}
          style={{ background:"linear-gradient(135deg,#f5a000,#c27800)", color:"#fff", border:"none", borderRadius:12, padding:"14px 28px", fontSize:16, fontWeight:700, cursor:"pointer", width:"100%", fontFamily:"'Syne',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#fff"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff"/>
          </svg>
          Se connecter avec Google
        </button>

        <p style={{ color:"rgba(255,255,255,.2)", fontSize:11, marginTop:20 }}>Accès réservé aux administrateurs</p>
      </div>
    </div>
  );
}
