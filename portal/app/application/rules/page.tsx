"use client";
export default function RulesPage() {
  const sections = [
    { icon:"🎯", title:"Objectif", content:"L'Innov'Dom Challenge est une compétition d'innovation ouverte aux étudiants de l'ENSA Fès. L'objectif est de proposer des solutions innovantes aux défis du domaine de l'habitat intelligent, de l'énergie, de la mobilité et de la digitalisation industrielle." },
    { icon:"👥", title:"Participants", content:"La compétition est ouverte aux étudiants inscrits dans une formation de Génie Industriel (GESI, Génie Mécanique, Mécatronique, GI). Les candidatures peuvent être individuelles ou en équipe de 2 à 4 membres." },
    { icon:"💡", title:"Domaines de projets", content:"Habitat intelligent & domotique · Énergie propre & efficacité énergétique · Mobilité intelligente & transport · Digitalisation & Industrie 4.0 · Agriculture connectée · Santé & bien-être technologique" },
    { icon:"📅", title:"Calendrier", content:"Ouverture des candidatures : Mars 2026\nDate limite de soumission : À confirmer\nJournées de présentation : JESI 2026, ENSA Fès\nAnnonce des résultats : Lors de la cérémonie de clôture" },
    { icon:"📊", title:"Critères d'évaluation", content:"Innovation & Originalité (25%) · Faisabilité technique (25%) · Impact & utilité sociale (20%) · Qualité de la présentation (15%) · Valeur ajoutée au contexte marocain (15%)" },
    { icon:"🏆", title:"Prix & Récompenses", content:"Les équipes sélectionnées seront récompensées lors de la cérémonie de clôture des Journées Pédagogiques JESI 2026. Des prix spéciaux seront décernés par le jury dans différentes catégories." },
    { icon:"📝", title:"Format de présentation", content:"Chaque équipe dispose de 10 minutes de présentation suivies de 5 minutes de questions du jury. Un prototype fonctionnel, une démonstration ou une maquette est fortement encouragé." },
    { icon:"⚠️", title:"Règles générales", content:"• Chaque étudiant ne peut participer qu'à un seul projet\n• Les projets doivent être originaux et non présentés dans d'autres compétitions\n• Tout plagiat entraîne la disqualification immédiate\n• Le règlement complet sera mis à jour prochainement" },
  ];
  return (
    <div style={{ padding:"28px", maxWidth:800, margin:"0 auto" }}>
      <div style={{ fontSize:10, letterSpacing:3, color:"rgba(245,160,0,.6)", fontWeight:700, marginBottom:6 }}>OFFICIEL</div>
      <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:"#fff", margin:"0 0 4px" }}>📋 Règlement</h1>
      <p style={{ color:"rgba(255,255,255,.4)", fontSize:14, marginBottom:24 }}>Innov'Dom Challenge · JESI 2026 · ENSA Fès · Département Génie Industriel</p>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {sections.map((s,i)=>(
          <div key={i} style={{ background:"rgba(255,255,255,.025)", border:"1px solid rgba(255,255,255,.07)", borderRadius:16, padding:"20px 22px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <span style={{ fontSize:20 }}>{s.icon}</span>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, color:"#f5a000", margin:0 }}>{s.title.toUpperCase()}</h3>
            </div>
            <div style={{ color:"rgba(255,255,255,.7)", fontSize:14, lineHeight:1.7, whiteSpace:"pre-line" }}>{s.content}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:20, background:"rgba(245,160,0,.06)", border:"1px solid rgba(245,160,0,.2)", borderRadius:12, padding:"14px 18px", fontSize:13, color:"rgba(255,200,100,.7)", textAlign:"center" }}>
        ℹ️ Le règlement complet sera publié prochainement. Pour toute question, utilise l'onglet Contact.
      </div>
    </div>
  );
}
