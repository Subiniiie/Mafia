import React, { useState, useEffect } from "react";
import axios from "axios";
import classNames from "classnames";
import ModalHeader from "../components/ModalHeader"
import RoomName from "../components/GamePageComponents/RoomName";
import SecretMode from "../components/GamePageComponents/SecretMode";
import Password from "../components/GamePageComponents/Password";
import Turncoat from "../components/GamePageComponents/Turncoat";
import styles from "./GameSettingsModal.module.css";
import { decode } from "jwt-js-decode";

function GameSettingsModal({ isOpen, openModal, roomId }) {

    const [roomName, setRoomName] = useState('')
    const [isSecret, setIsSecret] = useState(false)
    const [password, setPassword] = useState('')
    const [isTurncoat, setIsTurncoat] = useState(false)

    const [ gameSettings, setGameSettings ] = useState({})

    // 게임방 정보를 가지고 오자
    useEffect(() => {
        const openGameSettingModal = async () => {
            console.log(roomId)
            try {
                const access = localStorage.getItem('access')
                console.log('access를 보자', access)
                const decodedAccess = decode(access)
                console.log('디코딩된 access를 보자 :', decodedAccess)
                const response = await axios.get(`https://i11e106.p.ssafy.io/api/rooms/${roomId}/options`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${access}`,
                    }
                })
                console.log('게임방 세팅 정보야', response.data)
                setGameSettings(response.data)

            } catch (error) {
                console.log("게임방 설정 정보를 가져오지 못했습니다", error)
            }
        }
        openGameSettingModal()
    }, [roomId])

    useEffect(() => {
        console.log('게임방 정보 바꾸는 걸 알고 싶어', gameSettings)
    }, [gameSettings])

    // 변경 버튼을 누르면 바뀐 내용이 새롭게 저장됨
    const handleSave = async function(roomId, roomName, isSecret, password, isTurncoat) {
        console.log('나 왔다!', roomId, roomName, isSecret, password, isTurncoat)
        // setGameSettings({...gameSettings, title:roomName, password: password, haveBetrayer: isTurncoat})
        try {
            console.log('나 방 바꿀거야')
            const body = {
                title: roomName,
                password: isSecret ? password : '',
                maxPlayer: '8',
                haveBetrayer: isTurncoat
            }

            const access = localStorage.getItem('access')

            const response = await axios.patch(`https://i11e106.p.ssafy.io/api/options/rooms/${roomId}`,
                JSON.stringify(body), {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${access}`,
                    }
                }
            )
            console.log('방 정보 바꿨다', response.data)
        }  catch (error) {
            console.log('방 못 바꿈', error)
        }
        // await axios.patch(`https://i11e106.p.ssafy.io/api/options/rooms/${roomId}`, {

        // })
        // try {
        //     const access = localStorage.getItem('access')
        //     const response = await fetch(`https://i11e106.p.ssafy.io/api/options/rooms/${roomId}`, {
        //         method: 'PUT',
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Authorization": `Bearer ${access}`,
        //         },
        //         body: JSON.stringify({
        //             roomName,
        //             isSecret,
        //             password: isSecret ? password : '',
        //             // isTurncoat
        //         })
        //     })
        //     if (!response.ok) {
        //         throw new Error('게임방 게임설정 못 바꿈')
        //     }
        //     openModal()
        // } catch(error) {
        //     console.log(error)
        // }

    
    }

    useEffect(() => {
        console.log(roomName)
        console.log(isSecret)
        console.log(password)
    }, [roomName, isSecret, password])

    const GSModalClass = classNames('kimjungchul-gothic-regular', styles.modalContent)

    return (
        <>
            <div className={styles.modalOverlay} onclick={openModal}>
                <div className={GSModalClass} onclick={(e) => e.stopPropagation()}>
                    <ModalHeader modalTitle="게임 설정" openModal={openModal}/>
                    <div className={styles.formContainer}>
                        <RoomName value={roomName} onChange={setRoomName}/>
                        <div className={styles.rowStyle}>
                            <SecretMode checked={isSecret} onChange={setIsSecret}/>
                            <Password
                              value={password}
                              onChange={setPassword}
                              required={isSecret}  //비공개일 때 필수임
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <Turncoat checked={isTurncoat} onChange={setIsTurncoat}/>
                </div>
                <div className={styles.btnBox}>
                    <button className={styles.btn}
                            onClick={() => handleSave(roomId, roomName, isSecret, password, isTurncoat)}>변경
                    </button>
                </div>
            </div>
        </>
    )
}

export default GameSettingsModal;