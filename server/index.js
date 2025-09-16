import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let messages = [
  {
    id: 1,
    name: "Coach Mike",
    text: "Happy 13th Birthday Ocie!",
    emoji: "🎉",
    replies: []
  }
];

// Fetch all messages
app.get("/api/messages", (req, res) => {
  res.json(messages);
});

// Post a new message
app.post("/api/messages", (req, res) => {
  const { name, text, emoji } = req.body;
  const newMessage = {
    id: Date.now(),
    name,
    text,
    emoji: emoji || "",
    replies: []
  };
  messages.push(newMessage);
  res.json(newMessage);
});

// Add reply to a message
app.post("/api/messages/:id/replies", (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const msg = messages.find(m => m.id == id);
  if (msg) {
    msg.replies.push({ id: Date.now(), text });
    res.json(msg);
  } else {
    res.status(404).json({ error: "Message not found" });
  }
});

// Admin delete a message
app.delete("/api/messages/:id", (req, res) => {
  const { id } = req.params;
  messages = messages.filter(m => m.id != id);
  res.json({ success: true });
});

// Admin reset (clear all messages)
app.delete("/api/messages", (req, res) => {
  messages = [];
  res.json({ success: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
