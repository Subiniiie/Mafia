import React, {useState} from "react";
import styled from "styled-components"



const ReadyStartBtn = styled.button`
width: 90px;
background-color: rgba(255, 0, 0, 0.5);
color: white;
border: 1px solid rgba(255, 0, 0, 0.7);
border-radius: 15px;
margin-top: 10px;
margin-right: 10px;
`

function GameReadyStartBtn({roomManager}) {

    // 준비 상태를 나타내는 변수
    const [ playerReadyCnt, setPlayerReadyCnt ] = useState(0)

    // 플레이어 준비 카운트를 증가시키는 함수
    const playerCnt = function() {
            setPlayerReadyCnt(prevCnt => prevCnt + 1)
        }

    const btnText = roomManager && playerReadyCnt >= 7 ? "시작" : "준비"

    return (
        <>
            <ReadyStartBtn 
                onClick={playerCnt}
                disabled = {playerReadyCnt >= 8}
            >
                {btnText}
            </ReadyStartBtn>
        </>
    )
}

export default GameReadyStartBtn;