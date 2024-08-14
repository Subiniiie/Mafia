import React from "react";
import styles from "./PoliceModal.module.css"

const PoliceModal = function({ gameResponse, onChioce, myId }) {
    const choicedPlayer = function(playerId, playerNickname, palyerRole) {
        onChioce(playerId, playerNickname, palyerRole)
    }
    return (
        <>
            <div className={styles.modal}>
                <div className={styles.container}>
                    <p>누구를 조사하시겠습니까?</p>
                    <div className={styles.btnContainer}>
                        {Object.values(gameResponse.playerMap)
                            .filter(player => player.alive)
                            .map((player, index) => (
                                <button
                                    onClick={() => choicedPlayer(player.id, player.nickname, player.role)}
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

