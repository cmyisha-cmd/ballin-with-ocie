export default function Register() {
  return (
    <div className="bg-black min-h-screen text-white p-8">
      <h1 className="text-4xl font-bold text-purple-400 mb-6">Player Registration</h1>
      <form className="space-y-4 max-w-md mx-auto bg-gray-900 p-6 rounded-xl shadow-lg">
        <div>
          <label className="block mb-1">Name</label>
          <input type="text" placeholder="Enter name" className="w-full p-2 rounded bg-gray-800 border border-gray-700"/>
        </div>
        <div>
          <label className="block mb-1">Age</label>
          <input type="number" placeholder="Enter age" className="w-full p-2 rounded bg-gray-800 border border-gray-700"/>
        </div>
        <fieldset className="space-y-2">
          <legend className="mb-2">Select Event(s):</legend>
          <label className="flex items-center gap-2">
            <input type="checkbox"/> Shooting Contest
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox"/> Team Tournament
          </label>
        </fieldset>
        <button type="submit" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded w-full">Register</button>
      </form>
    </div>
  );
}
