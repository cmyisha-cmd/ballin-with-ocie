
import { useState } from "react";

export default function Tickets() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{
      backgroundColor: "#000",
      color: "#fff",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "2rem"
    }}>
      <h1 style={{ fontSize: "2.5rem", color: "#8A2BE2", marginBottom: "1rem" }}>
        Get Tickets
      </h1>
      {!submitted ? (
        <div style={{
          backgroundColor: "#111",
          padding: "1.5rem",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "400px"
        }}>
          <input style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "4px",
            border: "1px solid #555",
            backgroundColor: "#222",
            color: "white"
          }} placeholder="Your Name"/>
          <input style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "4px",
            border: "1px solid #555",
            backgroundColor: "#222",
            color: "white"
          }} placeholder="Number of Tickets"/>
          <button onClick={()=>setSubmitted(true)} style={{
            backgroundColor: "#8A2BE2",
            color: "#fff",
            fontWeight: "bold",
            marginTop: "1rem",
            padding: "10px",
            width: "100%",
            borderRadius: "5px",
            border: "none"
          }}>Submit Request</button>
        </div>
      ) : (
        <p style={{ fontSize: "1.5rem", color: "limegreen" }}>
          ✅ Thank you! Your tickets will be available at the Box Office.
        </p>
      )}
    </div>
  );
}
