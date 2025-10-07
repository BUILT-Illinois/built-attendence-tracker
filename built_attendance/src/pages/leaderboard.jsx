import Header from "../components/Header";
import LeaderboardPlayer from "../components/LeaderboardPlayer";

function Leaderboard() {
    return (
        <div>
        <Header />
        Leaderboard Page
        <LeaderboardPlayer />

        <div className="card">
            <img src="img_avatar.png" alt="Avatar" style={{ width: "100%" }} />
            <div className="container">
                <h4><b>John Doe</b></h4>
                <p>Architect & Engineer</p>
            </div>
        </div>
        <div className="mini_card_1">
            <div className="container">
                <h4><b>Ranking</b></h4>
            </div>
        </div>
        <div className="mini_card_2">
            <div className="container">
                <h4><b>Points</b></h4>
            </div>
        </div>
    </div>
);
    
}

export default Leaderboard;