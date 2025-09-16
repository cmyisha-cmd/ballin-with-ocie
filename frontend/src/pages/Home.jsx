import React from 'react'

export default function Home(){
  return (
    <section className="min-h-[calc(100vh-160px)] grid place-items-center bg-gradient-to-b from-black to-purple-950/20">
      <div className="text-center px-6">
        <h2 className="text-4xl md:text-6xl font-black text-purple-400 drop-shadow-[0_6px_18px_rgba(138,43,226,0.35)]">
          Welcome to Ballin’ with Ocie!
        </h2>
        <p className="mt-4 text-neutral-300 max-w-2xl mx-auto">
          Register for the Shooting Contest and Team Tournament, secure tickets, and leave a birthday message.
          Track live scores and brackets during the event.
        </p>
      </div>
    </section>
  )
}
