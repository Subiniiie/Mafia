import React, { useState } from "react";
import styles from "./EmissaryModal.module.css"

const EmissaryModal = function({ players, onAction }) {
    const choicedPlayer = function(choicedNickname) {
        onAction(choicedNickname)
    }
    return (
        <>
            <div className={styles.modal}>
                <div className={styles.container}>
                    <p>어떤 독립운동가를 변절, 혹은 죽이겠습니까?</p>
                <div className={styles.btnContainer}>
                   { players.map((player, index) => (
                    <button onClick={() => choicedPlayer(player.nickname)} key={index}>{player.nickname}</button>
                  ) )}
                </div>
                </div>
            </div>
        </>
    )
}

export default EmissaryModal;