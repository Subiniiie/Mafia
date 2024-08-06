import React, { useState } from "react";

const FinalDefensePlayer = function({ finalDefensePlayer, onMessage }) {
    const [ dieCnt, setDieCnt ] = useState(0)
    const [ aliveCnt, setAliveCnt ] = useState(0)

    const choiceDie = () => setDieCnt(dieCnt + 1)
    const choiceAlive = () => setAliveCnt(aliveCnt + 1)

    const handleFinalize = function() {
        let message = "동점"
        if (dieCnt > aliveCnt) {
            message = "죽음"
        } else if (dieCnt < aliveCnt) {
            message = "생존"
        }
        onMessage(message)
    }
    return (
        <>
           <div className={styles.modal}>
                <div className={styles.container}>
                    <p>{finalDefensePlayer}님이 용의 선상에 올랐습니다. <br />
                        죽이겠습니까?
                    </p>
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