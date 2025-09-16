import React, { useState } from "react";

export default function BirthdayWall() {
  const [messages, setMessages] = useState([
    { id: 1, name: "Kayla", text: "Happy Birthday Ocie! 🎉", reactions: { "🎉": 2, "❤️": 3 }, replies: [] },
    { id: 2, name: "Shon", text: "We love you! 🏀", reactions: { "🏀": 1 }, replies: [] }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [newName, setNewName] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojis = ["🎉", "❤️", "😂", "👍", "🙌"];

  const handlePost = () => {
    if (!newMessage.trim()) return;
    const newMsg = {
      id: Date.now(),
      name: newName || "Guest",
      text: newMessage,
      reactions: {},
      replies: []
    };
    setMessages([newMsg, ...messages]);
    setNewMessage("");
  };

  const handleReact = (id, emoji) => {
    setMessages(messages.map(msg => {
      if (msg.id === id) {
        return {
          ...msg,
          reactions: {
            ...msg.reactions,
            [emoji]: (msg.reactions[emoji] || 0) + 1
          }
        };
      }
      return msg;
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-yellow-100 p-6">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-4">
        🎂 Kay'Loni’s Birthday Wall 🎂
      </h1>

      {/* New Message Form */}
      <div className="bg-white shadow-lg rounded-xl p-4 max-w-lg mx-auto mb-6">
        <input
          className="w-full p-2 border rounded mb-3"
          placeholder="Your Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <textarea
          className="w-full p-3 border rounded"
          placeholder="Write a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <div className="flex justify-between mt-2">
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-xl">
            😀
          </button>
          <button
            onClick={handlePost}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Post
          </button>
        </div>
        {showEmojiPicker && (
          <div className="mt-2 flex flex-wrap gap-2">
            {emojis.map((emoji) => (
              <span
                key={emoji}
                className="cursor-pointer text-2xl"
                onClick={() => setNewMessage(newMessage + emoji)}
              >
                {emoji}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-white p-4 rounded-xl shadow-md max-w-xl mx-auto">
            <p className="font-bold text-purple-700">{msg.name}</p>
            <p className="text-gray-800">{msg.text}</p>
            <div className="flex gap-3 mt-2">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReact(msg.id, emoji)}
                  className="hover:scale-110 transition"
                >
                  {emoji} {msg.reactions[emoji] || ""}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
