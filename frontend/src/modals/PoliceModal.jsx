import React from "react";
import styles from "./PoliceModal.module.css"

const PoliceModal = function({ players, onChioce }) {
    const choicedPlayer = function(choicedNickname, choicedRole) {
        onChioce(choicedNickname, choicedRole)
    }
    return (
        <>
            <div className={styles.modal}>
                <div className={styles.container}>
                    <p>누구를 조사하시겠습니까?</p>
                    <div className={styles.btnContainer}>
                        {players
                            .filter(player => player.isAlive)
                            .map((player, index) => (
                                <button
                                    onClick={() => choicedPlayer(player.nickname, player.role)}
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

