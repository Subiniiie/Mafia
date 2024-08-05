import React from "react";
import styled from "./GameChatHistory.module.css"

function GameChatHistory({chatHistory}) {
    // 누가 어떤 메시지를 보냈는지 알기 위해 플레이어 정보도 알아야함
    // 닉네임만 있으면 될듯??
    const player = '현규'
    console.log(chatHistory);
    return (
        <>
            <div className={styled.box}>
                <ul>
                    {chatHistory.map((data, index) => (
                        <li key={index}>{data.userId} : {data.message}</li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default GameChatHistory;