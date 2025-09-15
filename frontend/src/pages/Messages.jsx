export default function Messages() {
  return (
    <div className="bg-black min-h-screen text-white p-8">
      <h1 className="text-4xl font-bold text-purple-400 mb-6">Message Board</h1>
      <div className="max-w-2xl mx-auto space-y-4">
        <textarea placeholder="Leave a message..." className="w-full p-3 rounded bg-gray-900 border border-gray-700"/>
        <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">Post Message</button>
        <div className="bg-gray-900 p-4 rounded shadow">
          <p><strong>Coach K:</strong> Let's go Ocie! 🏀🔥</p>
        </div>
      </div>
    </div>
  );
}
