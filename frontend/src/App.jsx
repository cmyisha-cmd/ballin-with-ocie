
export default function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
      <h1 className="text-purple-500 text-4xl font-extrabold drop-shadow-lg">
        Welcome to Ballin' with Ocie!
      </h1>
      <div className="flex gap-4 mt-6">
        <button className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl shadow-lg">Register</button>
        <button className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl shadow-lg">Get Tickets</button>
        <button className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl shadow-lg">Leave a Message</button>
      </div>
    </div>
  );
}
