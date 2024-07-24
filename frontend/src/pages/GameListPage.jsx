import React from "react";
import { Link } from "react-router-dom";
import GLHeader from "../components/GameListComponents/GLHeader"

function GameListPage() {
    return (
        <>
            <GLHeader />
            <p>게임 리스트 페이지</p>
            <Link to="/game-room">게임 방 페이지</Link>
        </>
    )
}

export default GameListPage;