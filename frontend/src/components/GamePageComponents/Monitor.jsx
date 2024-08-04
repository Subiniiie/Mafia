import React, { useState } from "react"
import styles from "./Monitor.module.css"

// 닉네임 정보 받기 
// function({ nickname }) 요런 식으로
const Monitor = function() {

    const [ isvote, setIsVote ] = useState(false)

    const handleVote = function() {
        setIsVote(prevState => !prevState)
    }

    const [ isMuteVoice, setIsMuteVoice ] = useState(false)

    const handleVoice = function() {
        setIsMuteVoice(prevState => !prevState)
    }

    return (
        <>
            <div className={styles.monitor}>
                <div className={styles.monitorHeader}>
                    <div>
                        {/* 닉네임 출력하기
                        {nickname} */}
                        닉네임
                    </div>
                    {/* 죽으면 어쩔겨 */}
                    <button className={isvote ? styles.voteBtnRed : styles.voteBtnGreen} onClick={handleVote}></button>
                </div>
                    {/* 클릭해서 음소거 가능 */}
                        <img className={styles.voiceBtn} onClick={handleVoice} src={ isMuteVoice ? "/volume_mute.png" : "/volume.png"} alt="volume"></img>
            </div>
        </>
    )
}

export default Monitor;