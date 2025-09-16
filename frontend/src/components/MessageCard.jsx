export default function MessageCard({ message, setMessages, adminMode }) {
  const addReaction = (emoji) => {
    setMessages(prev =>
      prev.map(m =>
        m.id === message.id ? { ...m, reactions: { ...m.reactions, [emoji]: (m.reactions[emoji] || 0) + 1 } } : m
      )
    );
  };

  const deleteMessage = () => {
    setMessages(prev => prev.filter(m => m.id !== message.id));
  };

  return (
    <div style={{ background:"#222", margin:"1rem 0", padding:"1rem", borderRadius:"8px" }}>
      <p>{message.text}</p>
      <div style={{ display:"flex", gap:"0.5rem" }}>
        {["👍", "❤️", "🎂", "🔥"].map(emoji => (
          <button key={emoji} onClick={() => addReaction(emoji)}>{emoji} {message.reactions[emoji] || ""}</button>
        ))}
      </div>
      {adminMode && <button onClick={deleteMessage} style={{ color:"red" }}>Delete</button>}
    </div>
  );
}