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


    const [ playerReadyCnt, setPlayerReadyCnt ] = useState(0)

    const playerCnt = function() {
            setPlayerReadyCnt(prevCnt => prevCnt + 1)
        }

    console.log(playerReadyCnt)

    return (
        <>
            <ReadyStartBtn 
                onClick={playerCnt}
                disabled = {playerReadyCnt === 8}
                
            >
                {roomManager && playerReadyCnt === 7 ? "시작" : "준비"}
            </ReadyStartBtn>
        </>
    )
}

export default GameReadyStartBtn;