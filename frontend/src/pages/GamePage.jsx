import React, { useState } from "react";
import "./GamePage.css"

function GamePage() {
    // 게임 리스트에서 게임 방을 클릭하면 or 방장이 새롭게 게임 방을 만들면 or 방장이 방 이름을 수정하면
    // 게임 방 정보가 나한테 들어올 거임
    // 그때 코드 수정하기 지금은 임시로 설정
    const [ roomTitle, setRoomTitle ] = useState('방이름')
    return (
        <>
            <p>게임 방</p>
            <div>
                {roomTitle}
            </div>
            <div className="moniters">
                <p>플레이어들의 모니터가 들어갈 자리</p>
            </div>
            <div className="job">
                <span>
                    <p>직업</p>
                </span>
            </div>
        </>
    )
}

export default GamePage;