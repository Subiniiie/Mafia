import { useState, useRef } from 'react'
import classNames from "classnames";
import axios from 'axios';
import styles from './CreateRoomModal.module.css'; // 스타일 파일을 별도로 관리합니다.
import ModalHeader from "../components/ModalHeader"

// eslint-disable-next-line react/prop-types
const CreateRoomModal = ({ isOpen, openModal }) => {

    const modalTitle = '새로운 도전'

    const [roomTitle, setRoomTitle] = useState('')
    const [roomPw, setRoomPw] = useState('')

    const roomTitleRef = useRef()
    const roomPwRef = useRef()

    // const [showRoomPwInput, setShowRoomPwInput] = useState(false)
    const [isSecretRoom, setIsSecretRoom] = useState(false)

    const handleCreateRoom = async () => {
        try {
            console.log('방을 한번 만들어볼게')
            const body = {
                title: roomTitle,
                password: roomPw,
                maxPlayer: '8',
                haveBetray: true
            }

            const response = await axios.post('https://i11e106.p.ssafy.io/api/rooms',
                JSON.stringify(body), {
                headers: {
                    "Content-Type": "application/json",
                }
            }
            )
            console.log(response.data)
            // openModal()
        } catch (error) {
            console.error("Create Room failed:", error.response ? error.response.data : error.message)
        }
    }


    const handleRoomTitleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault() // 기본 제출 동작 방지
            console.log('Enter를 눌렀네!')
        }
    }

    const handleRoomPwKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault() // 기본 제출 동작 방지
            console.log('Enter를 눌렀네!')
        }
    }

    const handleSecretRoomChange = (e) => {
        setIsSecretRoom(e.target.checked)
    }

    const CreateRoomModalClass = classNames('kimjungchul-gothic-regular', styles.modalContent)

    if (!isOpen) return null; // 모달이 열리지 않은 경우 아무것도 렌더링하지 않음

    return (
        <div className={styles.modalOverlay}>
            <div className={CreateRoomModalClass} onClick={(e) => e.stopPropagation()}>
                <ModalHeader modalTitle={modalTitle} openModal={openModal} />

                <div className={styles.formContainer}>
                    <h5>터전</h5>
                    <form
                        className="border border-solid border-gray-300 rounded-lg w-[300px] h-[35px] flex items-center"
                    >
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
                        {/* <button type="button" className="w-[10%]">
                            입력
                        </button> */}
                    </form>


                    <div className="w-full flex items-center mt-2">
                        <label htmlFor="secretRoom" className="text-sm mr-1">
                            비밀방
                        </label>
                        <input
                            type="checkbox"
                            id="secretRoom"
                            className="mr-1"
                            onChange={handleSecretRoomChange}
                        />
                    </div>

                    <div className='mt-2'>
                        <h5>암호 설정</h5>
                        <form
                            className="border border-solid border-gray-300 rounded-lg w-[300px] h-[35px] flex items-center"
                        >
                            <input
                                required
                                type="text"
                                placeholder="비밀번호를 입력해주세요."
                                className={styles.inputField}
                                value={roomPw}
                                onChange={(e) => setRoomPw(e.target.value)}
                                onKeyDown={handleRoomPwKeyDown}
                                ref={roomPwRef}
                                disabled={!isSecretRoom}
                            />
                            {/* <button type="button" className="w-[10%]">
                                입력
                            </button> */}
                        </form>
                    </div>
                </div>
                <button className={styles.submitButton} onClick={handleCreateRoom}>
                    도전하기
                </button>
            </div>
        </div>
    );
};

export default CreateRoomModal;
