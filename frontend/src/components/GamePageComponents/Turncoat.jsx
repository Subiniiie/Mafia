import React from "react";
import styles from "./Turncoat.module.css"

function Turncoat() {
    return (
        <>
            <div className={styles.container}>
                <span className={styles.labelStyle}>변절자 여부</span>
                <input className={styles.inputStyle} type="checkbox"></input>
            </div>
        </>
    )
}

export default Turncoat;