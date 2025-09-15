import { useState } from "react";

export default function Messages(){
  const [entries, setEntries] = useState([
    { name:"Jordan", text:"Happy 13th Birthday Ocie! 🏀🎉", replies:["Let’s go!", "Can’t wait!"] },
    { name:"Taylor", text:"Big day coming — good luck to all players! 🔥", replies:["Yessir!", "Bring the energy!"] },
    { name:"Sam", text:"Family in the stands and vibes on 100!", replies:["We outside!", "🙌🙌🙌"] },
  ]);
  const [text, setText] = useState("");

  const add = (e)=>{
    e.preventDefault();
    if(!text.trim()) return;
    setEntries([{ name:"Guest", text, replies:[] }, ...entries]);
    setText("");
  };

  return (
    <div style={{padding:"24px"}}>
      <h2 style={{color:"#8A2BE2", fontSize:"34px", fontWeight:900, marginBottom:12}}>Birthday Messages</h2>
      <form onSubmit={add} style={{background:"#111", padding:16, borderRadius:12, maxWidth:720}}>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Write a message..." rows={3}
          style={{width:"100%", padding:"10px 12px", borderRadius:8, border:"1px solid #333", background:"#1c1c1c", color:"#fff"}}/>
        <button type="submit" style={{marginTop:10, background:"#8A2BE2", color:"#fff", border:"none", borderRadius:8, padding:"10px 12px", cursor:"pointer", fontWeight:700}}>Post</button>
      </form>

      <div style={{marginTop:20, display:"grid", gap:12, maxWidth:720}}>
        {entries.map((m, idx)=>(
          <div key={idx} style={{background:"#151515", border:"1px solid #2a2a2a", padding:"12px 14px", borderRadius:10}}>
            <div><strong>{m.name}:</strong> {m.text}</div>
            {m.replies?.length>0 && (
              <ul style={{marginTop:8, marginBottom:0, paddingLeft:18, color:"#cfcfcf"}}>
                {m.replies.map((r,i)=>(<li key={i} style={{marginBottom:4}}>↳ {r}</li>))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
