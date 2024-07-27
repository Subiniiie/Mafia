import { Link } from "react-router-dom";
import Navbar from "../components/Navbar"
import GLHeader from "../components/GameListComponents/GLHeader"
import GLMain from "../components/GameListComponents/GLMain"

function GameListPage() {
    return (
        <div>
            <Navbar />
            <GLHeader />
            <Link to="/game-room">게임 방 페이지</Link>
            <GLMain />
        </div>
    )
}

export default GameListPage;