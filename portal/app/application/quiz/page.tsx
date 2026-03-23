"use client";
export default function QuizPage() {
  return (
    <div style={{ padding:"28px", maxWidth:860, margin:"0 auto" }}>
      <div style={{ fontSize:10, letterSpacing:3, color:"rgba(245,160,0,.6)", fontWeight:700, marginBottom:6 }}>TEST D'ORIENTATION</div>
      <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:"#fff", margin:"0 0 4px" }}>🧪 Quiz d'Orientation</h1>
      <p style={{ color:"rgba(255,255,255,.4)", fontSize:14, marginBottom:20 }}>Découvre quelle filière du Génie Industriel te correspond.</p>
      <div style={{ borderRadius:16, overflow:"hidden", border:"1px solid rgba(255,255,255,.08)", height:"calc(100vh - 200px)", minHeight:500 }}>
        <iframe src="/quiz" style={{ width:"100%", height:"100%", border:"none" }} title="Quiz orientation"/>
      </div>
    </div>
  );
}
