import React, { useState } from "react"
import styles from "./Monitor.module.css"

// 닉네임 정보 받기 
// function({ nickname }) 요런 식으로
// const Monitor = function({ nickname, isMe, isAlive, hasEveryoneVoted, onVote }) {
const Monitor = function({ nickname, isRoomManager, isMe, isAlive, onVote }) {

    // 투표 상태를 나타내는 상태
    const [ isVote, setIsVote ] = useState(false)
    // 투표한 플레이어의 닉네임을 저장하는 변수
    const [ votedPlayer, setVotedPlayer ] = useState(null)

    const handleVote = function() {
        setIsVote(prevState => !prevState)
        // 투표 당한 플레이어의 닉네임을 GamePageMain에 보낼거야
        onVote(nickname)
    }

    const [ isMuteVoice, setIsMuteVoice ] = useState(false)

    const handleVoice = function() {
        setIsMuteVoice(prevState => !prevState)
    }

    // 강퇴 기능
    const getOutPlayer = function() {
        console.log('넌 나가라')
    }

    return (
        <>
            <div className={styles.monitor}>
                <div className={styles.monitorHeader}>
                    <div>
                        {/* 닉네임 출력하기
                        {nickname} */}
                        { isMe ? 'me' : nickname}
                    </div>
                    {/* 죽으면 어쩔겨 
                    투표창은 회색으로 하고 인덱스는 그대로 유지
                    */}
                    <button 
                        className={isAlive ? isVote ? styles.voteBtnRed : styles.voteBtnGreen : styles.deadBtn} 
                        disabled={!isAlive}
                        // 투표 당한 플레이어의 닉네임 전송
                        onClick={handleVote}>
                    </button>
                </div>
                <div className={styles.monitorFooter}>
                    {/* 클릭해서 음소거 가능 */}
                    <img className={styles.voiceBtn} onClick={handleVoice} src={ isMuteVoice ? "/volume_mute.png" : "/volume.png"} alt="volume"></img>
                    {isRoomManager ? null : <button className={styles.outBtn} onClick={getOutPlayer}>내보내기</button>}
                </div>
            </div>
        </>
    )
}

export default Monitor;