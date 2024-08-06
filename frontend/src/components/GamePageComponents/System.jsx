import React from "react";
import styles from "./System.module.css"

function System({ systemMessage }) {
    return(
        <>
            <p className={styles.content}>{systemMessage}</p>
        </>
    )
}

export default System;