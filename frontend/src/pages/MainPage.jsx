import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar"
import { useState } from "react";

function MainPage() {
    const [isLoggedIn] = useState(true);  // 로그인 상태를 여기에 맞게 설정하세요
    // const [isLoggedIn, setIsLoggedIn] = useState(true);  // 로그인 상태를 여기에 맞게 설정하세요
    const username = "이현규";  // 로그인된 사용자의 이름

    return (
        <>

            <Navbar isLoggedIn={isLoggedIn} username={username} />
            <p>메인 페이지</p>
            <ul>
                <li><Link to="/game-list">게임 리스트 페이지</Link></li>
                <li><Link to="/achievements">업적 페이지</Link></li>
            </ul>
        </>
    )
}

export default MainPage;