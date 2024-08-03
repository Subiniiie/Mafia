import React, { useState, useEffect } from "react";
import ModalHeader from "../components/ModalHeader"
import RoomName from "../components/GamePageComponents/RoomName";
import SecretMode from "../components/GamePageComponents/SecretMode";
import Password from "../components/GamePageComponents/Password";
import Turncoat from "../components/GamePageComponents/Turncoat";
import styles from "./GameSettingsModal.module.css"

function GameSettingsModal({ openModal, roomId }) {

    const [roomName, setRoomName] = useState('')
    const [isSecret, setIsSecret] = useState(false)
    const [password, setPassword] = useState('')
    const [isTurncoat, setIsTurncoat] = useState(false)

    useEffect(() => {
        const fetchRoomData = async function() {
            try {
                const response = await fetch(`https://i11e106.p.ssafy.io/api/options/rooms/${roomId}`)
                const data = await response.json()
                // 데이터에서 변수명(?) 어떻게 되어있냐에 따라 넣을 거 바꾸기
                // 이름 바꾸기
                 setRoomName(data.roomName || '')
                //  비밀모드 바꾸기
                // 비밀모드면 비밀번호 필수 -> 어케함
                setIsSecret(data.isSecret || false)
                // 비밀번호 바꾸기
                // 공개글이면 설정할 필요 없음 -> 어케함
                setPassword(data.password || '')
                // 변절자 유무
                setIsTurncoat(data.turncoat || false)
            } catch(error) {
                console.log(error)
            }
        }
        fetchRoomData()
    }, [roomId])

    // 변경 버튼을 누르면 바뀐 내용이 새롭게 저장됨
    const handleSave = async function() {
        try {
            const response = await fetch(`https://i11e106.p.ssafy.io/api/options/rooms/${roomId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    roomName,
                    isSecret,
                    password: isSecret ? password : '',
                    isTurncoat
                })
            })
            if (!response.ok) {
                throw new Error('Failed to update room data')
            }

            openModal()
        } catch(error) {
            console.log(error)
        }
    }

    return (
        <>
            {/* 각 컴포넌트들이랑 값을 주고 받아서 바뀌는 걸 알아야 함 */}
            <div className={styles.modal}>
                    <ModalHeader modalTitle="게임 설정" openModal={openModal} />
                <div className={styles.container}>
                    <div className={styles.content}>
                        <RoomName value={roomName} onChange={setRoomName} />
                        <div className={styles.rowStyle}>
                            <SecretMode checked={isSecret} onChange={setIsSecret} />
                            <Password 
                                value={password} 
                                onChange={setPassword} 
                                required={isSecret}  //비공개일 때 필수임
                            />
                        </div>
                        <Turncoat checked={isTurncoat} />
                        <div>
                            {/* 변경 버튼을 누르면 변경된 내용이 서버에 적용되고 모달 닫힘 */}
                            <button className={styles.btn} onClick={handleSave}>변경</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GameSettingsModal;