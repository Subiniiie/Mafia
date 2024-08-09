import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import classNames from "classnames";
import axios from 'axios';
import styles from './CreateRoomModal.module.css'; // 스타일 파일을 별도로 관리합니다.
import ModalHeader from "../components/ModalHeader"
import BoxChecked from "../assets/Buttons/BoxChecked.png"
import BoxUnchecked from "../assets/Buttons/BoxUnchecked.png"

// eslint-disable-next-line react/prop-types
const CreateRoomModal = ({ isOpen, openModal }) => {
    const navigate = useNavigate()

    const modalTitle = '새로운 도전'

    const [roomTitle, setRoomTitle] = useState('')
    const [roomPw, setRoomPw] = useState('')
    const [isPrivateButtonClicked, setIsPrivateButtonClicked] = useState(false)

    const checkButton = () => {
        setIsPrivateButtonClicked(!isPrivateButtonClicked)
        setIsSecretRoom(!isSecretRoom)
    }

    const roomTitleRef = useRef()
    const roomPwRef = useRef()
    const secretRoomRef = useRef()
    const submitButtonRef = useRef()

    // const [showRoomPwInput, setShowRoomPwInput] = useState(false)
    const [isSecretRoom, setIsSecretRoom] = useState(false)


    const handleCreateRoom = async () => {
        if (isSecretRoom && !/^\d{4}$/.test(roomPw)) {
            alert('암호는 숫자 4자리로 설정해주세요.');
            return;
        }

        try {
            console.log('방을 한번 만들어볼게')
            const body = {
                title: roomTitle,
                password: roomPw,
                maxPlayer: '8',
                haveBetray: true
            }

            const access = localStorage.getItem('access')

            const response = await axios.post('https://i11e106.p.ssafy.io/api/rooms',
                JSON.stringify(body), {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`,
                },
                withCredentials: true // 필요 시 추가: 이 옵션을 추가하면 쿠키가 포함된 요청을 서버로 보낼 수 있음
            }
            )
            console.log(response.data)
            // openModal()
            const { roomId } = response.data
            navigate(`/game-rooms/${roomId}`)
        } catch (error) {
            console.error("Create Room failed:", error.response ? error.response.data : error.message)
        }
    }


    const handleRoomTitleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault() // 기본 제출 동작 방지
            console.log('Enter를 눌렀네!')
            secretRoomRef.current.focus()
        }
    }


    const handleRoomPwKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault() // 기본 제출 동작 방지
            console.log('Enter를 눌렀네!')
            if (!/^\d{4}$/.test(roomPw)) {
                alert('암호는 숫자 4자리로 설정해주세요.')
            } else {
                submitButtonRef.current.click()
            }
        }
    }

    // const handleSecretRoomChange = () => {
    //     setIsSecretRoom(!isSecretRoom)
    //     setIsPrivateButtonClicked(!isPrivateButtonClicked)
    // }

    const CreateRoomModalClass = classNames('kimjungchul-gothic-regular', styles.modalContent)

    if (!isOpen) return null; // 모달이 열리지 않은 경우 아무것도 렌더링하지 않음

    return (
        <div className={styles.modalOverlay}>
            <div className={CreateRoomModalClass} onClick={(e) => e.stopPropagation()}>
                <ModalHeader modalTitle={modalTitle} openModal={openModal} />
                <div className={styles.formContainer}>
                    <div className={styles.formContainerMini}>
                        <h5>터전</h5>
                        <input
                            required
                            type="text"
                            placeholder="전설의 독립군"
                            className={styles.inputField}
                            value={roomTitle}
                            onChange={(e) => setRoomTitle(e.target.value)}
                            onKeyDown={handleRoomTitleKeyDown}
                            ref={roomTitleRef}
                        />
                    </div>

                    <div className={styles.formContainerMini}>
                        {/* <div className={styles.privateContainerTitle}>
                            <p className='mr-2'>극비 임무</p>
                            <button
                                className={`${styles.privateButton} ${isPrivateButtonClicked ? styles.privateButtonClicked : ''}`}
                                onClick={handleSecretRoomChange}
                                ref={secretRoomRef}
                            />
                        </div> */}

                        <div className={styles.privateContainerTitle}>
                            <p className='mr-2'>극비 임무</p>
                            {/* <button className={styles.privateButton} onClick={handleSecretRoomChange} ref={secretRoomRef} /> */}
                            {isPrivateButtonClicked ? (
                                <img src={BoxChecked} alt="BoxChecked" className={styles.checkBox} onClick={checkButton} />
                            ) : (
                                <img src={BoxUnchecked} alt="BoxUnchecked" className={styles.checkBox} onClick={checkButton} />
                            )}
                        </div>
                        {/* <h5>암호 설정</h5> */}
                        <input
                            required
                            type="text"
                            placeholder="비밀번호를 입력해주세요."
                            className={`${styles.inputField} ${isPrivateButtonClicked ? '' : styles.privateClickedInput}`}
                            value={roomPw}
                            onChange={(e) => setRoomPw(e.target.value)}
                            onKeyDown={handleRoomPwKeyDown}
                            ref={roomPwRef}
                            disabled={!isSecretRoom}
                        />
                    </div>
                </div>
                <button className={styles.submitButton} onClick={handleCreateRoom} ref={submitButtonRef}>
                    도전하기
                </button>
            </div>
        </div>
    );
}

export default CreateRoomModal;
