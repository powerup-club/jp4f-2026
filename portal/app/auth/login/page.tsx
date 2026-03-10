"use client";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
export default function AuthLogin() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/application";
  const error = params.get("error");
  return (
    <div style={{ minHeight:"100vh", background:"#04080f", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ position:"fixed", inset:0, backgroundImage:"linear-gradient(rgba(245,160,0,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(245,160,0,.015) 1px,transparent 1px)", backgroundSize:"40px 40px", pointerEvents:"none" }}/>
      <div style={{ position:"relative", background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.08)", borderRadius:24, padding:"48px 40px", maxWidth:420, width:"90%", textAlign:"center" }}>
        <div style={{ width:64, height:64, borderRadius:16, background:"linear-gradient(135deg,#f5a000,#c27800)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:800, color:"#fff", margin:"0 auto 20px", fontFamily:"'Syne',sans-serif" }}>JP</div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:"#fff", marginBottom:6 }}>Espace Candidat</h1>
        <p style={{ color:"rgba(255,255,255,.4)", fontSize:14, marginBottom:28 }}>Innov'Dom Challenge · JESI 2026 · ENSA Fès</p>
        {error && <div style={{ background:"rgba(255,80,80,.08)", border:"1px solid rgba(255,80,80,.15)", borderRadius:10, padding:"10px 16px", color:"#f88", fontSize:13, marginBottom:18 }}>Erreur de connexion. Réessaie.</div>}
        <button onClick={() => signIn("google", { callbackUrl })}
          style={{ background:"linear-gradient(135deg,#f5a000,#c27800)", color:"#fff", border:"none", borderRadius:12, padding:"14px 28px", fontSize:15, fontWeight:700, cursor:"pointer", width:"100%", fontFamily:"'Syne',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Se connecter avec Google
        </button>
        <p style={{ color:"rgba(255,255,255,.15)", fontSize:11, marginTop:20 }}>Accès réservé aux candidats de l'Innov'Dom Challenge 2026</p>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
    </div>
  );
}
