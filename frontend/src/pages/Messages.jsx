import { useEffect, useState } from 'react';
const API = import.meta.env.VITE_API_BASE || '';

const EMOJIS = ['👍','❤️','🎉','😂','🙌'];

function MessageCard({ msg, onReply, onReact }){
  const [showBox, setShowBox] = useState(false);
  const [replyName, setReplyName] = useState('');
  const [replyText, setReplyText] = useState('');

  const sendReply = async (e)=>{
    e.preventDefault();
    if(!replyName || !replyText) return;
    await onReply(msg.id, replyName, replyText);
    setReplyName(''); setReplyText(''); setShowBox(false);
  };

  return (
    <div className="p-4 rounded-xl bg-black/50 border border-primary/30">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="text-sm text-purple-300">{msg.name}</div>
          <div className="whitespace-pre-wrap">{msg.text}</div>
          <div className="mt-2 flex items-center gap-2">
            {EMOJIS.map(e => (
              <button key={e} onClick={()=>onReact(msg.id, null, e)} className="px-2 py-1 rounded bg-ink/80 hover:bg-ink border border-primary/30 text-sm">
                {e} <span className="opacity-70">{msg.reactions?.[e]||0}</span>
              </button>
            ))}
            <button onClick={()=>setShowBox(v=>!v)} className="ml-2 text-sm text-purple-200 hover:text-white underline underline-offset-4">Reply</button>
          </div>

          {showBox && (
            <form onSubmit={sendReply} className="mt-3 space-y-2">
              <input className="w-full p-2 rounded bg-black/60 border border-primary/40" placeholder="Your name" value={replyName} onChange={e=>setReplyName(e.target.value)} />
              <textarea className="w-full p-2 rounded bg-black/60 border border-primary/40" rows="2" placeholder="Write a reply…" value={replyText} onChange={e=>setReplyText(e.target.value)} />
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded bg-primary hover:bg-primary/80">Post reply</button>
                <button type="button" className="px-3 py-1 rounded bg-black border border-primary/40" onClick={()=>setShowBox(false)}>Cancel</button>
              </div>
            </form>
          )}

          {!!(msg.replies||[]).length && (
            <div className="mt-3 space-y-2 pl-4 border-l border-primary/30">
              {msg.replies.map(r => (
                <div key={r.id} className="p-2 rounded bg-black/40">
                  <div className="text-xs text-purple-300">{r.name}</div>
                  <div className="text-sm">{r.text}</div>
                  <div className="mt-1 flex items-center gap-2">
                    {EMOJIS.map(e => (
                      <button key={e} onClick={()=>onReact(msg.id, r.id, e)} className="px-2 py-0.5 rounded bg-ink/80 hover:bg-ink border border-primary/30 text-xs">
                        {e} <span className="opacity-70">{r.reactions?.[e]||0}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Messages(){
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  const load = async ()=>{
    const r = await fetch(`${API}/api/messages`);
    setItems(await r.json());
  };
  useEffect(()=>{ load(); const id=setInterval(load, 5000); return ()=>clearInterval(id); }, []);

  const submit = async (e)=>{
    e.preventDefault();
    await fetch(`${API}/api/messages`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, text }) });
    setName(''); setText(''); await load();
  };

  const reply = async (parentId, rName, rText)=>{
    await fetch(`${API}/api/messages`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ parentId, name:rName, text:rText }) });
    await load();
  };

  const react = async (messageId, replyId, emoji)=>{
    await fetch(`${API}/api/messages/${messageId}/react`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ replyId, emoji }) });
    await load();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-primary mb-6">Birthday Wall</h2>
      <form onSubmit={submit} className="space-y-3 mb-6 bg-ink/80 border border-primary/30 p-6 rounded-xl">
        <input className="w-full p-3 rounded bg-black/60 border border-primary/40" placeholder="Your Name" value={name} onChange={e=>setName(e.target.value)} required />
        <textarea className="w-full p-3 rounded bg-black/60 border border-primary/40" rows="3" placeholder="Type a message, add emojis, etc." value={text} onChange={e=>setText(e.target.value)} required />
        <button className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/80 font-semibold">Post Message</button>
      </form>
      <div className="space-y-3">
        {items.map(m => (
          <MessageCard key={m.id} msg={m} onReply={reply} onReact={react}/>
        ))}
      </div>
    </div>
  );
}