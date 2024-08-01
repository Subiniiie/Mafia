import React from "react";
import styles from "./RoomName.module.css"

function RoomName() {

    return (
        <>
            <div className={styles.containerStyle}>
                <span className={styles.labelStyle}>방 이름</span>
                <input className={styles.inputStyle} type="text" placeholder="방 이름을 입력해주세요."></input>
            </div>
        </>
    )
}

export default RoomName;