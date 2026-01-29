import Header from "../components/Header";
import LeaderboardPlayer from "../components/LeaderboardPlayer";
import { useEffect, useState } from "react";
import { listUsers } from '../api/users';
import "../assets/leaderboard.css";
function Leaderboard() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

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
    
    return (
        <div>

            <h1>Leaderboard</h1>

            <div className="main_box">
                <div className="upper_half_bar">
                    <div className="upper_bar_1">
                        Ranking
                    </div>
                    <div className="upper_bar_2">
                        <img src="https://built-illinois.org/built-logo.png" className="Name_logo"/>
                        Name
                    </div>
                    <div className="upper_bar_3">
                        Points
                    </div>
                </div>
                
                {users
                ?.slice()
                .sort((a, b) => b.points - a.points)
                .map((u, i) => (
                    <div className="lower_half_bar" key={u._id || i}>
                    <div className="lower_bar_1">#{i + 1}</div>
                    <div className="lower_bar_2">{u.name}</div>
                    <div className="lower_bar_3">{u.points}</div>
                    </div>
                ))}
                


            </div>
        {/* <LeaderboardPlayer /> */}



    </div>
);
    
}

export default Leaderboard;