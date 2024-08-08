import React from "react";
import styles from "./ChoiceDieOrTurncoat.module.css";

const ChoiceDieOrTurncoat = function({ onChioce }) {
    const choiceDie = function() {
        onChioce("죽임")
    }
    const choiceDefeat = function() {
        onChioce("변절")
    }
    return (
        <>
           <div className={styles.modal}>
                <div className={styles.container}>
                    <p>당신이 선택한 독립운동가를 죽이겠습니까? 변절시키겠습니까?</p>
                <div className={styles.btnContainer}>
                    <button onClick={choiceDie}>죽임</button>
                    <button onClick={choiceDefeat}>변절</button>
                </div>
                </div>
            </div> 
        </>
    )
}

export default ChoiceDieOrTurncoat;