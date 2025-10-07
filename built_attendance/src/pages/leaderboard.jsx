import Header from "../components/Header";
import LeaderboardPlayer from "../components/LeaderboardPlayer";
import "../assets/LeaderboardPlayer.css"
function Leaderboard() {
    return (
    <div class= "card">
        <div class ="container">
            <h4 style ={{color: "#f78b07c7"}}><b>Leaderboard</b></h4>
        </div>
        <Header></Header>
        Leaderboard Page
        <LeaderboardPlayer/>
    </div>
    );
}

export default Leaderboard;