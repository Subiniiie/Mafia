import React, { useState, useEffect } from "react";
import axios from "axios";
import { Client } from '@stomp/stompjs';
import styles from './GameReadyStartBtn.module.css';

function GameReadyStartBtn({ stompClient, nowGameState, gameData }) {
    const [ clickedBtn, setClickedBtn ] = useState(false)
    const [ gameReady, setGameReady ] = useState(false)
    const [ showModal, setShowModal ] = useState(false)

    console.log('게임 데이터를 볼거야!', gameData)
    const roomManagerCheck = gameData.userList.find(user => user.owner === true)
    console.log('장하오', roomManagerCheck)

    const roomManager = gameData.userList.find(user => user.userId === roomManagerCheck.userId);


    // const roomManager = roomManagerCheck.owner.userId
    console.log('너 방장이야?', roomManagerCheck)


    // 일반 플레이어가 준비 버튼을 누름
    const handleReadyBtnClick = () => {
        if (stompClient.current) {
            console.log("일반 플레이어가 준비 버튼을 누른 걸 알려주자")
        }
        stompClient.current.send(`/pub/ready/${id}`, {}, "")
        setClickedBtn(true)
    }

    // 일반 플레이어가 준비 취소 버튼을 누름
    const handleCancelReadyBtnClick = () => {
        if (stompClient.current) {
            console.log("일반 플레이어가 준비 취소 버튼을 누른 걸 알려주자")
        }
        stompClient.current.send(`/pub/ready/cancel/${id}`, {}, "")
        setClickedBtn(true)
    } 

    // 방장 시작 버튼 활성화되고 버튼을 누름
    const handleStartGameBtn = () => {
        // 게임시작 알람 모달
        setShowModal(true)
        // 모달이 닫힌 후에 게임 시작 요청을 보냄 
        setTimeout(() => {
            if (stompClient.current) {
                console.log("방장이 게임 시작 요청을 보냈다")
            }
            stompClient.current.send(`/pub/start/${id}`, {}, "")
        }, 1500)
    }

    return (
        <>
            { roomManager ? (
                // 방장일 때
                <>
                    {gameReady ? (
                        <button
                            className={styles.btnClass}
                            onClick={handleStartGameBtn}
                        >
                            게임 시작
                        </button>
                    ) : (
                        <button
                            className={styles.btnDisabled}
                        >
                            게임 시작
                        </button>
                    )}
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
            {showModal && <div className={styles.alarm}>지금부터 밀정1931을 시작합니다.</div>}
        </>
    )

}

export default GameReadyStartBtn;