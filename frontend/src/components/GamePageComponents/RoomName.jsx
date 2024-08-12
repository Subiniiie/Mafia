import React from "react";
import styles from "./RoomName.module.css"


function RoomName({ value, onChange }) {


    return (
        <>
            <div className={styles.containerStyle}>
                <span className={styles.labelStyle}>방 이름</span>
                <input 
                    className={styles.inputStyle} 
                    type="text" 
                    placeholder="방 이름을 입력해주세요."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                ></input>
            </div>
        </>
    )
}

export default RoomName;