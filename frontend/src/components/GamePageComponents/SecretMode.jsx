import React from "react";
import styles from "./SecretMode.module.css"

function SecretMode({ checked, onChange }) {
    return (
        <>
            <div className={styles.container}>
                <span className={styles.labelStyle}>비공개</span>
                <input 
                    className={styles.inputStyle} 
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                ></input>
            </div>
        </>
    )
}

export default SecretMode;