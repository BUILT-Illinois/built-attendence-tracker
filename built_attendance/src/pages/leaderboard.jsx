import Header from "../components/Header";
import LeaderboardPlayer from "../components/LeaderboardPlayer";
import { useEffect, useMemo, useState } from "react";
import { listUsers } from "../api/users";
import "../assets/leaderboard.css";

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const myUserId = localStorage.getItem("user_id");

  useEffect(() => {
    (async () => {
      try {
        const data = await listUsers();
        setUsers(data);
      } catch (e) {
        setError(e?.response?.data?.error || e.message);
      }
    })();
  }, []);

  const sorted = useMemo(() => {
    return users?.slice().sort((a, b) => (b.points || 0) - (a.points || 0));
  }, [users]);

  const myIndex = useMemo(() => {
    if (!myUserId) return -1;
    return sorted.findIndex((u) => String(u._id) === String(myUserId));
  }, [sorted, myUserId]);

  const myUser = myIndex >= 0 ? sorted[myIndex] : null;

  return (
    <div>
      <h1 className="leaderboard_title">Leaderboard</h1>

      <div className="main_box">
        <div className="upper_half_bar">
          <div className="upper_bar_1">Ranking</div>

          <div className="upper_bar_2">
            <img
              src="https://built-illinois.org/built-logo.png"
              className="Name_logo"
              alt="built"
            />
            Name
          </div>

          <div className="upper_bar_3">Points</div>
        </div>

        {sorted.map((u, i) => {
          const isMe = myUserId && String(u._id) === String(myUserId);
          return (
            <div
              className={`lower_half_bar ${isMe ? "my_row" : ""}`}
              key={u._id || i}
            >
              <div className="lower_bar_1">#{i + 1}</div>

              <div className="lower_bar_2">
                <img className="pfp_circle" src={u.img} alt="" />
                <span>{u.name}</span>
              </div>

              <div className="lower_bar_3">{u.points}</div>
            </div>
          );
        })}

        {/* Your Rank inside the component */}
        <div className="your_rank_section">
          <div className="your_rank_label">Your Rank</div>

          {myUser ? (
            <div className="lower_half_bar your_rank_row">
              <div className="lower_bar_1">#{myIndex + 1}</div>

              <div className="lower_bar_2">
                <img className="pfp_circle" src={myUser.img} alt="" />
                <span>{myUser.name}</span>
              </div>

              <div className="lower_bar_3">{myUser.points}</div>
            </div>
          ) : (
            <div className="your_rank_empty">—</div>
          )}
        </div>
      </div>

      {error && <p className="leaderboard_error">{error}</p>}
    </div>
  );
}

export default Leaderboard;
