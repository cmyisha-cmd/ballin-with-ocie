export default function Tickets() {
  return (
    <div className="bg-black min-h-screen text-white p-8">
      <h1 className="text-4xl font-bold text-purple-400 mb-6">Get Tickets</h1>
      <form className="space-y-4 max-w-md mx-auto bg-gray-900 p-6 rounded-xl shadow-lg">
        <div>
          <label className="block mb-1">Name</label>
          <input type="text" placeholder="Your Name" className="w-full p-2 rounded bg-gray-800 border border-gray-700"/>
        </div>
        <div>
          <label className="block mb-1">Number of Tickets</label>
          <input type="number" min="1" placeholder="Tickets" className="w-full p-2 rounded bg-gray-800 border border-gray-700"/>
        </div>
        <button type="submit" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded w-full">Request Tickets</button>
      </form>
    </div>
  );
}
