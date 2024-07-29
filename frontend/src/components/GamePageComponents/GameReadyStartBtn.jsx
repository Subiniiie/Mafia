import React, {useState} from "react";
// import styled from "styled-components"

// const ReadyStartBtn = styled.button`
// color: red;
// `

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