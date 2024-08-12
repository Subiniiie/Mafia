import React from "react";
import styled from "./GameChatHistory.module.css"

function GameChatHistory({chatHistory}) {
    // 누가 어떤 메시지를 보냈는지 알기 위해 플레이어 정보도 알아야함
    // 닉네임만 있으면 될듯??
    // const player = '현규'

    // [24.08.09] 추가
    // chatHistory를 { nickname, message } 객체의 배열 형식으로 정의
    // info.nickname, info.message로 메시지 출력
    return (
        <>
            <div className={styled.box}>
                <ul>
                    {chatHistory.map((info, index) => (
                        <li key={index}>{info.nickname} : {info.message}</li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default GameChatHistory;