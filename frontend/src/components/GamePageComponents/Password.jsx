import React from "react";
import styles from "./Password.module.css"

function Password({ value, onChange }) {
    return(
        <>
            <div className={styles.containerStyle}>
                <span className={styles.labelStyle}>비밀번호</span>
                <input 
                    className={styles.inputStyle} 
                    type="text" 
                    placeholder="비밀번호를 입력해주세요."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                ></input>
            </div>
        </>
    )
}

export default Password;