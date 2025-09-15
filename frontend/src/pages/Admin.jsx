export default function Admin() {
  return (
    <div className="bg-black min-h-screen text-white p-8">
      <h1 className="text-4xl font-bold text-purple-400 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Shooting Scores</h2>
          <p>Enter player scores and times here.</p>
        </div>
        <div className="bg-gray-900 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Team Management</h2>
          <p>Auto-assign players to teams and update results.</p>
        </div>
        <div className="bg-gray-900 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Ticket Requests</h2>
          <p>View spectator names and ticket counts.</p>
        </div>
      </div>
      <button className="mt-6 bg-red-600 hover:bg-red-700 px-4 py-2 rounded">Reset Data</button>
    </div>
  );
}
