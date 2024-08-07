import React from "react";
import styles from "./PoliceModal.module.css"

const PoliceModal = function({ gameData, onChioce }) {
    const choicedPlayer = function(playerId) {
        onChioce(playerId)
    }
    return (
        <>
            <div className={styles.modal}>
                <div className={styles.container}>
                    <p>누구를 조사하시겠습니까?</p>
                    <div className={styles.btnContainer}>
                        {gameData.playerMap
                            .filter(player => player.isAlive)
                            .map((player, index) => (
                                <button
                                    onClick={() => choicedPlayer(player.id)}
                                    key={index}
                                >
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

export default PoliceModal;

