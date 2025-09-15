import { useState } from "react";

export default function Tickets() {
  const [name, setName] = useState("");
  const [count, setCount] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="bg-black min-h-screen text-white p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-purple-500 mb-6">Get Tickets</h1>
      {!submitted ? (
        <form className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
          <input className="w-full p-3 rounded bg-gray-800 text-white" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="number" className="w-full p-3 rounded bg-gray-800 text-white" placeholder="Number of Tickets" value={count} onChange={(e) => setCount(e.target.value)} />
          <button type="button" onClick={() => setSubmitted(true)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full">
            Submit Request
          </button>
        </form>
      ) : (
        <p className="text-green-400 text-xl mt-6">Thank you! Your tickets will be available at the Box Office.</p>
      )}
    </div>
  );
}