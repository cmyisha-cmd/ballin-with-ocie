import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [event, setEvent] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Registered: ${name}, Age: ${age}, Events: ${event.join(", ")}`);
  };

  const toggleEvent = (ev) => {
    setEvent(prev => prev.includes(ev) ? prev.filter(e => e !== ev) : [...prev, ev]);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h2 className="text-4xl font-bold text-purple-500 mb-4">Player Registration</h2>
      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
        <input type="text" placeholder="Player Name" value={name} onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700"/>
        <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700"/>
        <div className="flex flex-col space-y-2 text-left">
          <label><input type="checkbox" onChange={() => toggleEvent("Shooting Contest")} /> Shooting Contest</label>
          <label><input type="checkbox" onChange={() => toggleEvent("Team Tournament")} /> Team Tournament</label>
        </div>
        <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full">
          Register
        </button>
      </form>
    </div>
  );
}
