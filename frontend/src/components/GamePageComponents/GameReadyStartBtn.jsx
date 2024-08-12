import React, { useState, useEffect } from "react";
import axios from "axios";
import { Client } from '@stomp/stompjs';
import styles from './GameReadyStartBtn.module.css';

function GameReadyStartBtn({ stompClient, nowGameState, gameData, gameResponse, roomId }) {
    const [ clickedBtn, setClickedBtn ] = useState(false)
    const [ gameReady, setGameReady ] = useState(false)

    const roomManager = gameData.userList.find(user => user.owner === true && user.me === true);

    const access = localStorage.getItem('access');
    const header =  {'Authorization': `Bearer ${access}`}

    // 일반 플레이어가 준비 버튼을 누름
    const handleReadyBtnClick = () => {
        if (stompClient.current && stompClient.current.connected) {
            console.log("일반 플레이어가 준비 버튼을 누른 걸 알려주자")
            stompClient.current.send(
                `/ws/pub/ready/${roomId}`,
                header, 
                {}
            )
            setClickedBtn(true)
            // gameResponse에서 어떻게 응답해주냐에 따라 
            // handleStartGameBtn 활성화되게 하기
        } else {
            console.error("STOMP 클라이언트가 연결되지 않았습니다.");
        }
    }

    // 일반 플레이어가 준비 취소 버튼을 누름
    const handleCancelReadyBtnClick = () => {
        if (stompClient.current && stompClient.current.connected) {
            console.log("일반 플레이어가 준비 취소 버튼을 누른 걸 알려주자")
            stompClient.current.send(
                `/ws/pub/ready/${roomId}`, 
                header, 
                {}
            )
            setClickedBtn(false)
        } else {
            console.error("STOMP 클라이언트가 연결되지 않았습니다.");
        }
    }

    // 방장 시작 버튼 활성화되고 버튼을 누름
    const handleStartGameBtn = () => {
        if (stompClient.current && stompClient.current.connected) {
            console.log("방장이 게임 시작 요청을 보냈다")
            stompClient.current.send(`/ws/pub/start/${roomId}`, header, {})
            console.log('나옴', nowGameState)
            console.log('나감', gameResponse)
        } else {
            console.error("STOMP 클라이언트가 연결되지 않았습니다.")
        }
    }

    return (
        <>
            { roomManager ? (
                // 방장일 때
                <>
                    {/* {gameReady ? ( */}
                        <button
                            className={styles.btnClass}
                            onClick={handleStartGameBtn}
                        >
                            게임 시작
                        </button>
                        {/* ) : ( */}
                        {/* <button
                            className={styles.btnDisabled}
                        > 
                            게임 시작
                        {</button>
                    )} */}
                </> 
            ) :(
                // 방장이 아닐 때
                <button
                    className={styles.btnClass}
                    onClick={clickedBtn ? handleCancelReadyBtnClick : handleReadyBtnClick}
                >
                    {clickedBtn ? "준비 취소" : "준비"}
                </button>
            )
            }
        </>
    )

}

export default GameReadyStartBtn;