import React, { useState } from "react"
import styles from "./Monitor.module.css"
import axios from 'axios'
import { data } from "autoprefixer"

<<<<<<< HEAD
// 닉네임 정보 받기 
// function({ nickname }) 요런 식으로
// const Monitor = function({ nickname, isMe, isAlive, hasEveryoneVoted, onVote }) {
// streamManager => StreamManager 타입
// streamManager => 비디오 창에 표시되는 유저, (비디오 표시, 음소거, 강퇴) 기능 구현을 위해 필요
const Monitor = function({ nickname, isRoomManager, isMe, isAlive, onVote, roomId, streamManager }) {
=======
const Monitor = function({ id, isMe, isAlive, onVote, isVote }) {
>>>>>>> 23a3153c37ac5670952fac2e986b5d9677099681

    // 투표 상태를 나타내는 상태
    // const [ isVote, setIsVote ] = useState(false)
    // 투표한 플레이어의 닉네임을 저장하는 변수
    const [ votedPlayer, setVotedPlayer ] = useState(null)

<<<<<<< HEAD
    // 비디오가 실제로 추가될 부분
    const videoRef = useRef()

    // 비디오 추가
    useEffect(() => {
        if (streamManager && videoRef.current) {
            streamManager.addVideoElement(videoRef.current)
        }
    }, [streamManager]);

=======
    const [localIsVote, setLocalIsVote] = useState(isVote)

    useEffect(() => {
        setLocalIsVote(isVote); // Prop으로 받은 isVote 상태 업데이트
    }, [isVote]);
>>>>>>> 23a3153c37ac5670952fac2e986b5d9677099681

    const handleVote = function() {
        // setIsVote(prevState => !prevState)
        // 투표 당한 플레이어의 닉네임을 GamePageMain에 보낼거야
        onVote(id)
    }

    const [ isMuteVoice, setIsMuteVoice ] = useState(false)

    const handleVoice = function() {
        if (!isMuteVoice) streamManager.subscribeToAudio(false);
        else streamManager.subscribeToAudio(true);

        setIsMuteVoice(prevState => !prevState)
    }

    // 강퇴 기능
    // 방장만 클릭할 수 있도록
    const getOutPlayer = async function() {
        console.log('넌 나가라')

        // 백엔드 서버에 강퇴 요청 => 해당 streamManager에 대해 SessionDisconnected Event 발생
        // event.reason === 'forceDisconnectByServer' 인지 확인 후 조건 분기하여 처리
        axios.delete('/api/rooms/kick', { data: { roomId, connectionId } })
             .then(response => console.log('Player kicked successfully:', response.data))
             .catch(error => console.error('Error kicking player:', error))
    }

    return (
        <>
            <div className={styles.monitor}>
                <video autoPlay={true} ref={videoRef} />
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