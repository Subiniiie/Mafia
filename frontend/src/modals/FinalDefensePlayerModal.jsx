import React, { useState } from "react";
import styles from "./FinalDefensePlayerModal.module.css"
import { Client } from '@stomp/stompjs';

const FinalDefensePlayerModal = function({ suspect, onMessage, roomId, stompClient, setFinalDefensePlayer }) {

    const access = localStorage.getItem('access');
    const header =  {'Authorization': `Bearer ${access}`}

    const choiceDie = () => {
        onMessage = "찬성"

        // body에다가 JSON으로
        // confirm: true
        setFinalDefensePlayer(false)

        stompClient.current.send(
            `/ws/pub/confirm/${roomId}`, 
            header,
            JSON.stringify({
                confirm: true
            })
        )
    }


    const choiceAlive = () => {
        onMessage = "반대"

        setFinalDefensePlayer(false)

        stompClient.current.send(
            `/ws/pub/confirm/${roomId}`, 
            header,
            JSON.stringify({
                confirm: false
            })
        )
    }

    return (
        <>
           <div className={styles.modal}>
                <div className={styles.container}>
                    <p>{suspect}님을 죽이시겠습니까?</p>
                <div className={styles.btnContainer}>
                    <button onClick={choiceDie}>찬성</button>
                    <button onClick={choiceAlive}>반대</button>
                </div>
                </div>
            </div> 
        </>
    )
}

export default FinalDefensePlayerModal;