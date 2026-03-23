"use client";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

type Msg = { role:"user"|"assistant"; content:string };

const SUGGESTIONS = [
  "Quelles sont les règles de l'Innov'Dom Challenge ?",
  "Quels domaines de projets sont acceptés ?",
  "Comment préparer ma présentation ?",
  "Quelle filière correspond à mon projet IoT ?",
  "Conseils pour travailler en équipe ?",
];

export default function ChatPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/chat/portal").then(r=>r.json()).then(d=>{
      if (d.messages) setMessages(d.messages.map((m:any)=>({ role:m.role, content:m.content })));
      setLoadingHistory(false);
    }).catch(()=>setLoadingHistory(false));
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
    setMessages(m => [...m, { role:"user", content:msg }]);
    setLoading(true);
    const res = await fetch("/api/chat/portal", {
      method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ message:msg })
    });
    const data = await res.json();
    setMessages(m => [...m, { role:"assistant", content:data.reply || "Désolé, réessaie." }]);
    setLoading(false);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh" }}>
      <div style={{ padding:"16px 24px", borderBottom:"1px solid rgba(255,255,255,.06)", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#f5a000,#c27800)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🤖</div>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, color:"#fff" }}>Assistant IA ENGINOV DAYS</div>
          <div style={{ fontSize:11, color:"rgba(0,245,160,.7)" }}>● En ligne · Propulsé par Groq</div>
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"20px 24px", display:"flex", flexDirection:"column", gap:14 }}>
        {loadingHistory && <div style={{ textAlign:"center", color:"rgba(255,255,255,.3)", fontSize:13, padding:"20px" }}>Chargement...</div>}
        {!loadingHistory && messages.length === 0 && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flex:1, textAlign:"center", gap:16 }}>
            <div style={{ fontSize:48 }}>🤖</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:"#fff" }}>Comment puis-je t'aider ?</div>
            <div style={{ color:"rgba(255,255,255,.4)", fontSize:14, maxWidth:400 }}>Je suis ton assistant pour l'Innov'Dom Challenge 2026. Pose-moi tes questions !</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8, width:"100%", maxWidth:440 }}>
              {SUGGESTIONS.map((s,i)=>(
                <button key={i} onClick={()=>send(s)} style={{ background:"rgba(245,160,0,.06)", border:"1px solid rgba(245,160,0,.15)", borderRadius:10, padding:"10px 14px", color:"rgba(255,255,255,.6)", cursor:"pointer", textAlign:"left", fontSize:13 }}>{s}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
            {m.role==="assistant" && (
              <div style={{ width:28, height:28, borderRadius:8, background:"linear-gradient(135deg,#f5a000,#c27800)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0, marginRight:8, marginTop:2 }}>🤖</div>
            )}
            <div style={{ maxWidth:"75%", padding:"12px 16px", borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px", background:m.role==="user"?"linear-gradient(135deg,#f5a000,#c27800)":"rgba(255,255,255,.06)", border:m.role==="user"?"none":"1px solid rgba(255,255,255,.08)", color:"#fff", fontSize:14, lineHeight:1.6, whiteSpace:"pre-wrap" }}>
              {m.content}
            </div>
            {m.role==="user" && session?.user?.image && (
              <img src={session.user.image} style={{ width:28, height:28, borderRadius:"50%", flexShrink:0, marginLeft:8, marginTop:2 }} alt=""/>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:8, background:"linear-gradient(135deg,#f5a000,#c27800)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🤖</div>
            <div style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.08)", borderRadius:"18px 18px 18px 4px", padding:"12px 16px", display:"flex", gap:6, alignItems:"center" }}>
              {[0,1,2].map(i=><div key={i} style={{ width:6, height:6, borderRadius:"50%", background:"#f5a000", animation:`dot .9s ${i*.2}s infinite` }}/>)}
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>
      <div style={{ padding:"16px 24px", borderTop:"1px solid rgba(255,255,255,.06)", flexShrink:0, display:"flex", gap:10 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),send())}
          placeholder="Pose ta question..."
          style={{ flex:1, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:12, padding:"12px 16px", color:"#fff", fontSize:14, outline:"none", fontFamily:"'DM Sans',sans-serif" }}/>
        <button onClick={()=>send()} disabled={!input.trim()||loading}
          style={{ background:"linear-gradient(135deg,#f5a000,#c27800)", border:"none", borderRadius:12, width:46, height:46, color:"#fff", fontSize:18, cursor:"pointer", flexShrink:0, opacity:!input.trim()||loading?.5:1 }}>↑</button>
      </div>
      <style>{`@keyframes dot{0%,80%,100%{opacity:.2;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}
