import React, { useState } from "react";
import styles from "./EmissaryModal.module.css"

const EmissaryModal = function({ gameResponse, onAction, myId }) {
    console.log('밀정 모달에서보는 myId', myId)
    console.log('밀정이 선택할 수 있는 플레이어들의 목록', gameResponse)
    const choicedPlayer = function(choicedId) {
        onAction(choicedId)
    }
    return (
        <>
            <div className={styles.modal}>
                <div className={styles.container}>
                    <p>어떤 독립운동가를 변절, 혹은 죽이겠습니까?</p>
                <div className={styles.btnContainer}>
                   { Object.values(gameResponse.playerMap)
                        .filter(player => player.id !== myId) 
                        .map((player, index) => (
                        <button onClick={() => choicedPlayer(player.id)} key={index}>
                            {player.nickname}
                        </button>
                        ))
                    }
                </div>
                </div>
            </div>
        </>
    )
}

export default EmissaryModal;