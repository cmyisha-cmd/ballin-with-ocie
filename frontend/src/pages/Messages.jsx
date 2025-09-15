export default function Messages() {
  const sampleMessages = [
    { name: "Coach D", text: "Let's go Ocie! 🏀🔥" },
    { name: "Mom", text: "Good luck, we are so proud!" },
    { name: "Fan123", text: "Can't wait to watch the tournament! 🎉" }
  ];

  return (
    <div className="bg-black min-h-screen text-white p-8">
      <h1 className="text-4xl font-bold text-purple-500 mb-6 text-center">Send a Birthday Message</h1>
      <div className="bg-gray-900 p-4 rounded-lg max-w-2xl mx-auto">
        {sampleMessages.map((msg, idx) => (
          <div key={idx} className="border-b border-gray-700 py-2">
            <strong>{msg.name}</strong>: {msg.text}
          </div>
        ))}
        <textarea className="w-full bg-gray-800 text-white rounded p-2 mt-4" placeholder="Type your message..."></textarea>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full mt-2">
          Post Message
        </button>
      </div>
    </div>
  );
}