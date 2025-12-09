import Header from "../components/Header";
import LeaderboardPlayer from "../components/LeaderboardPlayer";
import "../assets/leaderboard.css";
function Leaderboard() {
    return (
        <div>
                <h1>
                    Leaderboard
                </h1>

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
                <div className="lower_half_bar">
                    Your Rank
                    <div className="lower_bar_1">
                        #3
                    </div>
                    <div className="lower_bar_2">
                        Felix Romero
                    </div>
                    <div className="lower_bar_3">
                        28
                    </div>
                </div>
            </div>
        <LeaderboardPlayer />



    </div>
);
    
}

export default Leaderboard;