import React from "react";
import { Link } from "react-router-dom";

function MainPage() {
    return (
        <>
            <p>메인 페이지</p>
            <ul>
                <li><Link to="/game-list">게임 리스트 페이지</Link></li>
                <li><Link to="/game-room">게임 방 페이지</Link></li>
                <li><Link to="/achievements">업적 페이지</Link></li>
            </ul>
        
        </>
    )
}

export default MainPage;