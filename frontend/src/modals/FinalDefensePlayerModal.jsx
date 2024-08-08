import React, { useState } from "react";

const FinalDefensePlayer = function({ suspect, onMessage }) {

    const choiceDie = () => {
        onMessage = "찬성"
    }
    const choiceAlive = () => {
        onMessage = "반대"
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

export default FinalDefensePlayer;