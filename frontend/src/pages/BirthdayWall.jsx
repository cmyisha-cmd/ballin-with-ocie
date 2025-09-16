import { useEffect, useMemo, useState } from "react";

/**
 * BirthdayWall.jsx
 * Ballin' with Ocie: 13th Edition
 * - Festive UI, threaded messages, emoji reactions
 * - Admin tools (login: ocie2025) to delete messages/replies + reset sample data
 * - Persists to localStorage so you can test live without server wiring
 */

const ADMIN_PASSWORD = "ocie2025";
const LS_KEY = "bwo_birthday_wall_v1";

// ---------- Sample Data ----------
const seedSample = () => ({
  messages: [
    {
      id: "m1",
      name: "Tasha P.",
      text:
        "Happy Birthday, Ocie!! Wishing you buckets of joy and a day full of Ws! 🏀💜",
      ts: Date.now() - 1000 * 60 * 60 * 8, // 8h ago
      reactions: { "👍": 4, "❤️": 6, "🔥": 2, "😂": 0, "🎉": 7 },
      replies: [
        {
          id: "r1",
          name: "Coach D",
          text: "Couldn’t agree more — let’s get this win! 💪",
          ts: Date.now() - 1000 * 60 * 60 * 7,
        },
      ],
    },
    {
      id: "m2",
      name: "Jamal",
      text:
        "Big 1–3! Appreciate you for hosting the tourney every year. You’re the real MVP! 🏆",
      ts: Date.now() - 1000 * 60 * 60 * 5,
      reactions: { "👍": 3, "❤️": 2, "🔥": 5, "😂": 1, "🎉": 4 },
      replies: [],
    },
    {
      id: "m3",
      name: "Mya",
      text:
        "Happy birthday!! Can’t wait for the Shooting Contest — I’ve been practicing 🤞🎯",
      ts: Date.now() - 1000 * 60 * 60 * 2,
      reactions: { "👍": 2, "❤️": 3, "🔥": 1, "😂": 0, "🎉": 3 },
      replies: [
        {
          id: "r2",
          name: "Trey",
          text: "Same here! Saving my best for the finals 😎",
          ts: Date.now() - 1000 * 60 * 60 * 1.5,
        },
      ],
    },
  ],
});

// ---------- Helpers ----------
const EMOJI_SET = ["👍", "❤️", "🔥", "😂", "🎉"];

const fmtTime = (ts) => {
  const d = new Date(ts);
  return d.toLocaleString();
};

const uid = () => Math.random().toString(36).slice(2, 10);

// ---------- Styles ----------
const wrap = {
  minHeight: "calc(100vh - 120px)",
  background:
    "radial-gradient(1100px 600px at 10% -20%, rgba(138,43,226,.25), transparent 60%), radial-gradient(900px 500px at 110% 0%, rgba(80,0,120,.25), transparent 55%), #090909",
  color: "#fff",
  padding: "24px",
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial",
};

const board = {
  maxWidth: 980,
  margin: "0 auto",
};

const header = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 20,
};

const title = {
  fontSize: 28,
  fontWeight: 800,
  letterSpacing: "0.2px",
  color: "#EAE6FF",
  textShadow: "0 8px 32px rgba(138,43,226,.45)",
};

const adminBox = {
  background: "rgba(255,255,255,.06)",
  border: "1px solid rgba(138,43,226,.35)",
  borderRadius: 14,
  padding: "10px 12px",
  display: "flex",
  gap: 8,
  alignItems: "center",
};

const input = {
  background: "#111",
  color: "#fff",
  border: "1px solid rgba(255,255,255,.12)",
  borderRadius: 12,
  padding: "12px 14px",
  outline: "none",
  width: "100%",
  fontSize: 16,
};

const inputWhite = {
  ...input,
  background: "#fff",
  color: "#111",
  border: "1px solid rgba(0,0,0,.1)",
};

const btn = {
  background: "linear-gradient(180deg,#8A2BE2,#5d14a6)",
  border: "none",
  color: "#fff",
  fontWeight: 700,
  padding: "12px 16px",
  borderRadius: 12,
  cursor: "pointer",
  boxShadow: "0 8px 30px rgba(138,43,226,.35)",
};

const btnGhost = {
  background: "transparent",
  border: "1px solid rgba(255,255,255,.18)",
  color: "#EAE6FF",
  fontWeight: 600,
  padding: "10px 14px",
  borderRadius: 12,
  cursor: "pointer",
};

const card = {
  background: "rgba(255,255,255,.06)",
  border: "1px solid rgba(255,255,255,.12)",
  borderRadius: 16,
  padding: 16,
};

const subgrid = {
  display: "grid",
  gridTemplateColumns: "minmax(0,1fr)",
  gap: 10,
};

const row = { display: "flex", gap: 10, flexWrap: "wrap" };

const emojiPicker = {
  display: "flex",
  gap: 6,
  flexWrap: "wrap",
  padding: 6,
  background: "rgba(255,255,255,.06)",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,.08)",
};

const small = {
  fontSize: 12,
  opacity: 0.8,
};

// ---------- Component ----------
export default function BirthdayWall() {
  const [state, setState] = useState(() => {
    const fromLS = localStorage.getItem(LS_KEY);
    return fromLS ? JSON.parse(fromLS) : seedSample();
  });

  const [admin, setAdmin] = useState(false);
  const [pw, setPw] = useState("");

  // compose top-level message
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  // persist
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }, [state]);

  const sorted = useMemo(
    () => [...state.messages].sort((a, b) => b.ts - a.ts),
    [state.messages]
  );

  // --- actions ---
  const postMessage = () => {
    if (!name.trim() || !msg.trim()) return;
    const newMsg = {
      id: uid(),
      name: name.trim(),
      text: msg.trim(),
      ts: Date.now(),
      reactions: { "👍": 0, "❤️": 0, "🔥": 0, "😂": 0, "🎉": 0 },
      replies: [],
    };
    setState((s) => ({ ...s, messages: [newMsg, ...s.messages] }));
    setMsg("");
  };

  const reactTo = (id, emoji) => {
    setState((s) => ({
      ...s,
      messages: s.messages.map((m) =>
        m.id === id
          ? {
              ...m,
              reactions: {
                ...m.reactions,
                [emoji]: (m.reactions?.[emoji] ?? 0) + 1,
              },
            }
          : m
      ),
    }));
  };

  const replyTo = (id, replyName, replyText) => {
    if (!replyName.trim() || !replyText.trim()) return;
    setState((s) => ({
      ...s,
      messages: s.messages.map((m) =>
        m.id === id
          ? {
              ...m,
              replies: [
                ...m.replies,
                { id: uid(), name: replyName.trim(), text: replyText.trim(), ts: Date.now() },
              ],
            }
          : m
      ),
    }));
  };

  const adminDeleteMessage = (id) => {
    if (!admin) return;
    setState((s) => ({
      ...s,
      messages: s.messages.filter((m) => m.id !== id),
    }));
  };

  const adminDeleteReply = (msgId, replyId) => {
    if (!admin) return;
    setState((s) => ({
      ...s,
      messages: s.messages.map((m) =>
        m.id === msgId ? { ...m, replies: m.replies.filter((r) => r.id !== replyId) } : m
      ),
    }));
  };

  const adminReset = () => {
    if (!admin) return;
    setState(seedSample());
  };

  const tryLogin = () => {
    if (pw === ADMIN_PASSWORD) {
      setAdmin(true);
      setPw("");
    } else {
      alert("Incorrect password.");
    }
  };

  return (
    <div style={wrap}>
      <div style={board}>
        {/* Header */}
        <div style={header}>
          <div>
            <div style={{ ...small, letterSpacing: "1px", color: "#B899FF" }}>
              BALLIN’ WITH OCIE · 13TH EDITION
            </div>
            <h1 style={title}>Birthday Wall 🎂🎉</h1>
          </div>

          {/* Admin box */}
          {!admin ? (
            <div style={adminBox}>
              <span style={{ fontSize: 12, opacity: 0.8 }}>Admin</span>
              <input
                type="password"
                placeholder="Password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                style={{ ...input, width: 160 }}
              />
              <button style={btn} onClick={tryLogin}>
                Login
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <button style={btnGhost} onClick={adminReset} title="Restore sample data">
                Reset Sample Data
              </button>
              <button style={btnGhost} onClick={() => setAdmin(false)}>
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Composer */}
        <div style={{ ...card, marginBottom: 18 }}>
          <div style={subgrid}>
            <div style={row}>
              <input
                style={{ ...input }}
                placeholder="Your name (required)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <textarea
              rows={4}
              style={{ ...inputWhite, borderRadius: 14, resize: "vertical" }}
              placeholder="Leave a birthday message (you can add emojis below)…"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
            <div style={emojiPicker}>
              <span style={{ fontSize: 12, opacity: 0.8, marginRight: 6 }}>
                Quick emojis:
              </span>
              {EMOJI_SET.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setMsg((t) => (t ? `${t} ${e}` : e))}
                  style={{ ...btnGhost, padding: "6px 10px", borderRadius: 10 }}
                >
                  {e}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button style={btn} onClick={postMessage}>
                Post Message
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ ...small, marginBottom: 10, color: "#CFC3FF" }}>
          {state.messages.length} message{state.messages.length === 1 ? "" : "s"} total
        </div>

        {/* Messages */}
        <div style={{ display: "grid", gap: 14, marginBottom: 40 }}>
          {sorted.map((m) => (
            <MessageCard
              key={m.id}
              m={m}
              admin={admin}
              onReact={(emoji) => reactTo(m.id, emoji)}
              onReply={(n, t) => replyTo(m.id, n, t)}
              onDelete={() => adminDeleteMessage(m.id)}
              onDeleteReply={(rid) => adminDeleteReply(m.id, rid)}
            />
          ))}
          {sorted.length === 0 && (
            <div style={{ ...card, textAlign: "center", opacity: 0.75 }}>
              No messages yet — be the first to leave a wish! 💜
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MessageCard({ m, admin, onReact, onReply, onDelete, onDeleteReply }) {
  const [replyName, setReplyName] = useState("");
  const [replyText, setReplyText] = useState("");

  const addReply = () => {
    onReply(replyName, replyText);
    setReplyName("");
    setReplyText("");
  };

  return (
    <div style={card}>
      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div style={{ fontWeight: 800, letterSpacing: 0.2 }}>{m.name}</div>
            <div style={{ ...small }}>{fmtTime(m.ts)}</div>
          </div>
          {admin && (
            <div style={{ display: "flex", gap: 10 }}>
              <button style={btnGhost} onClick={onDelete} title="Delete message">
                Delete
              </button>
            </div>
          )}
        </div>

        <div style={{ fontSize: 16, lineHeight: 1.5 }}>{m.text}</div>

        {/* Reactions */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {EMOJI_SET.map((e) => (
            <button
              key={e}
              onClick={() => onReact(e)}
              style={{
                ...btnGhost,
                padding: "6px 10px",
                borderRadius: 10,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
              title="React"
            >
              <span>{e}</span>
              <span
                style={{
                  background: "rgba(255,255,255,.12)",
                  borderRadius: 10,
                  padding: "2px 6px",
                  fontSize: 12,
                }}
              >
                {m.reactions?.[e] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* Replies */}
        {m.replies?.length > 0 && (
          <div
            style={{
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: 12,
              padding: 12,
              marginTop: 4,
              display: "grid",
              gap: 10,
            }}
          >
            {m.replies
              .slice()
              .sort((a, b) => a.ts - b.ts)
              .map((r) => (
                <div
                  key={r.id}
                  style={{
                    display: "grid",
                    gap: 4,
                    borderBottom: "1px dashed rgba(255,255,255,.08)",
                    paddingBottom: 8,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{r.name}</div>
                      <div style={small}>{fmtTime(r.ts)}</div>
                    </div>
                    {admin && (
                      <button
                        style={{ ...btnGhost, padding: "6px 10px", borderRadius: 10 }}
                        onClick={() => onDeleteReply(r.id)}
                        title="Delete reply"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <div>{r.text}</div>
                </div>
              ))}
          </div>
        )}

        {/* Reply composer */}
        <div style={{ display: "grid", gap: 8 }}>
          <div style={row}>
            <input
              style={{ ...input, flex: 1, minWidth: 160 }}
              placeholder="Your name"
              value={replyName}
              onChange={(e) => setReplyName(e.target.value)}
            />
          </div>
          <textarea
            rows={2}
            style={{ ...inputWhite, borderRadius: 12 }}
            placeholder="Write a reply…"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <div style={emojiPicker}>
            <span style={{ fontSize: 12, opacity: 0.8, marginRight: 6 }}>Add emoji:</span>
            {EMOJI_SET.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setReplyText((t) => (t ? `${t} ${e}` : e))}
                style={{ ...btnGhost, padding: "6px 10px", borderRadius: 10 }}
              >
                {e}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button style={btn} onClick={addReply}>
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
