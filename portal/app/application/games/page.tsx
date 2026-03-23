"use client";
import Link from "next/link";

const GAMES = [
  { href:"/application/games/quiz", icon:"🧠", title:"Industry 4.0 Quiz", desc:"30 questions sur l'industrie intelligente, l'IoT et l'automatisation. Compare ton score sur le leaderboard !", color:"#00f5a0", tag:"Classement mondial" },
  { href:"/application/games/pitch", icon:"🎤", title:"Pitch Timer",       desc:"Simule ta présentation en 3 minutes devant un jury IA. Reçois un feedback détaillé avec scores.", color:"#f5a000", tag:"IA Jury" },
  { href:"/application/games/match", icon:"🃏", title:"Filière Match",      desc:"Swipe des cartes de technologies et découvre à quelle filière tu appartiens vraiment !", color:"#cc44ff", tag:"Swipe cards" },
  { href:"/application/games/scenario", icon:"⚡", title:"Scenario Challenge", desc:"Résous des problèmes industriels réels du Maroc. L'IA évalue ton approche d'ingénieur.", color:"#0088ff", tag:"IA Expert" },
];

export default function GamesHub() {
  return (
    <div style={{ padding:"28px", maxWidth:860, margin:"0 auto" }}>
      <div style={{ fontSize:10, letterSpacing:3, color:"rgba(245,160,0,.6)", fontWeight:700, marginBottom:6 }}>MINI-JEUX</div>
      <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:"#fff", margin:"0 0 4px" }}>🎮 Jeux & Défis</h1>
      <p style={{ color:"rgba(255,255,255,.4)", fontSize:14, marginBottom:28 }}>Entraîne-toi, apprends et prépare-toi pour la compétition en t'amusant.</p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(360px,1fr))", gap:16 }}>
        {GAMES.map(game => (
          <Link key={game.href} href={game.href}
            style={{ background:"rgba(255,255,255,.025)", border:`1px solid ${game.color}20`, borderRadius:20, padding:"24px", textDecoration:"none", display:"flex", flexDirection:"column", gap:12, transition:"all .25s", cursor:"pointer" }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
              <span style={{ fontSize:40 }}>{game.icon}</span>
              <span style={{ background:`${game.color}18`, color:game.color, fontSize:10, fontWeight:700, letterSpacing:1, padding:"4px 10px", borderRadius:8 }}>{game.tag}</span>
            </div>
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:"#fff", marginBottom:6 }}>{game.title}</div>
              <div style={{ color:"rgba(255,255,255,.5)", fontSize:13, lineHeight:1.6 }}>{game.desc}</div>
            </div>
            <div style={{ color:game.color, fontSize:13, fontWeight:700, marginTop:"auto" }}>Jouer →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
