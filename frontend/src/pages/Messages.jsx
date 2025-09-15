
import { useState } from "react";

export default function Messages() {
  const [messages, setMessages] = useState([
    { name: "Jordan", text: "Happy 13th Birthday Ocie! 🏀🎉" },
    { name: "Taylor", text: "Can't wait to watch the tournament! 🔥" },
    { name: "Sam", text: "Good luck to all players! 💪" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const addMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { name: "Guest", text: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div style={{
      backgroundColor: "#000",
      color: "#fff",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "2rem"
    }}>
      <h1 style={{ fontSize: "2.5rem", color: "#8A2BE2", marginBottom: "1rem" }}>
        Birthday Messages
      </h1>
      <div style={{
        backgroundColor: "#111",
        padding: "1rem",
        borderRadius: "8px",
        width: "100%",
        maxWidth: "500px",
        marginBottom: "1rem"
      }}>
        {messages.map((m, i) => (
          <p key={i} style={{
            marginBottom: "8px",
            fontSize: "1.1rem",
            borderBottom: "1px solid #333",
            paddingBottom: "5px"
          }}>
            <strong>{m.name}: </strong>{m.text}
          </p>
        ))}
      </div>
      <textarea
        style={{
          width: "100%",
          maxWidth: "500px",
          backgroundColor: "#222",
          color: "#fff",
          border: "1px solid #555",
          borderRadius: "5px",
          padding: "8px",
          marginBottom: "10px"
        }}
        placeholder="Leave your message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button
        onClick={addMessage}
        style={{
          backgroundColor: "#8A2BE2",
          color: "#fff",
          fontWeight: "bold",
          padding: "10px 15px",
          borderRadius: "5px",
          border: "none"
        }}
      >
        Post Message
      </button>
    </div>
  );
}
