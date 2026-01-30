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
    <section className="welcome-container">
      <div className="welcome__wrapper">
      <h1 className="welcome__title">
        Welcome {localStorage.getItem("user")?.split(" ")[0]}
      </h1>

  
        <div className="welcome__card">
          <div className="welcome__logo">
            <img src="https://built-illinois.org/built-logo.png" alt="Logo" />
          </div>
  
          <div className="welcome__stats">
            <div className="welcome__mini">
              <h3>Ranking</h3>
              <p className="stat">{rank ? `#${rank}` : "—"}</p>
            </div>
  
            <div className="welcome__mini">
              <h3>Points</h3>
              <p className="stat">{myPoints}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
  
  
}

export default Welcome;
