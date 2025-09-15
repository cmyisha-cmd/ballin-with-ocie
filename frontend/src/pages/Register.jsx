import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [events, setEvents] = useState([]);

  const toggleEvent = (event) => {
    setEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  };

  return (
    <div className="bg-black min-h-screen text-white p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-purple-500 mb-6">Player Registration</h1>
      <form className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
        <input className="w-full p-3 rounded bg-gray-800 text-white" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full p-3 rounded bg-gray-800 text-white" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
        <div className="space-y-2">
          <label className="block"><input type="checkbox" onChange={() => toggleEvent("Shooting Contest")} /> Shooting Contest</label>
          <label className="block"><input type="checkbox" onChange={() => toggleEvent("Team Tournament")} /> Team Tournament</label>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full">
          Register
        </button>
      </form>
    </div>
  );
}