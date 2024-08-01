import React from "react";
import styles from "./SecretMode.module.css"

function SecretMode() {
    return (
        <>
            <div className={styles.container}>
                <span className={styles.labelStyle}>비공개</span>
                <input className={styles.inputStyle} type="checkbox"></input>
            </div>
        </>
    )
}

export default SecretMode;