import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalHeader from "../components/ModalHeader"
import RoomName from "../components/GamePageComponents/RoomName";
import SecretMode from "../components/GamePageComponents/SecretMode";
import Password from "../components/GamePageComponents/Password";
import Turncoat from "../components/GamePageComponents/Turncoat";
import styles from "./GameSettingsModal.module.css";
import { decode } from "jwt-js-decode";

function GameSettingsModal({ openModal, roomId }) {

    const [roomName, setRoomName] = useState('')
    const [isSecret, setIsSecret] = useState(false)
    const [password, setPassword] = useState('')
    const [isTurncoat, setIsTurncoat] = useState(false)

    useEffect(() => {
        const openGameSettingModal = async() => {
            console.log(roomId)
            try {
                const access = localStorage.getItem('access')
                console.log('access를 보자', access)
                const decodedAccess = decode(access)
                console.log('디코딩된 access를 보자 :', decodedAccess)
                const response = await axios.get(`https://i11e106.p.ssafy.io/api/options/rooms/${roomId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${access}`,
                    }
                })
                console.log('게임방 세팅 정보야', response.data)
            } catch (error) {
                console.log("게임방 설정 정보를 가져오지 못했습니다", error)
            }
        }
        openGameSettingModal()
    }, [roomId])

    // 변경 버튼을 누르면 바뀐 내용이 새롭게 저장됨
    const handleSave = async function() {
        try {
            const access = localStorage.getItem('access')
            const response = await fetch(`https://i11e106.p.ssafy.io/api/options/rooms/${roomId}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`,
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