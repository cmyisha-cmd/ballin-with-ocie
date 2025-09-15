
export default function Home() {
  return (
    <div style={{
      backgroundColor: "#000",
      color: "#fff",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "2rem",
    }}>
      <h1 style={{
        fontSize: "3rem",
        fontWeight: "900",
        color: "#8A2BE2",
        textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
        marginBottom: "1rem",
      }}>
        Welcome to Ballin’ with Ocie!
      </h1>
      <p style={{
        fontSize: "1.5rem",
        maxWidth: "700px",
        lineHeight: "2rem",
        color: "#E5E5E5"
      }}>
        Join us for the 13th Edition Basketball Tournament! Register for the
        Shooting Contest or Team Tournament, get tickets, and cheer for your
        favorite players.
      </p>
    </div>
  );
}
