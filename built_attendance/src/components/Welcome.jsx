import { useEffect, useMemo, useState } from "react";
import "../assets/Welcome.css";
import { api } from "../api/client"; // your axios client

function Welcome() {
  const [users, setUsers] = useState([]);

  const myUserId = localStorage.getItem("user_id");
  const myPoints = Number(localStorage.getItem("points") || 0);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const rank = useMemo(() => {
    if (!users.length || !myUserId) return null;

    const sorted = users
      .slice()
      .sort((a, b) => (b.points || 0) - (a.points || 0));

    const idx = sorted.findIndex((u) => String(u._id) === String(myUserId));
    return idx === -1 ? null : idx + 1;
  }, [users, myUserId]);

  return (
    <div className="welcome-container">
      <div className="welcome">
        <h1>Welcome {localStorage.getItem("user")}</h1>
      </div>

      <div className="card">
        <img src="https://built-illinois.org/built-logo.png" alt="Logo" />
      </div>

      <div className="mini_card_1">
        <h3>Ranking</h3>
        <p className="stat">{rank ? `#${rank}` : "—"}</p>
      </div>

      <div className="mini_card_2">
        <h3>Points</h3>
        <p className="stat">{myPoints}</p>
      </div>
    </div>
  );
}

export default Welcome;
