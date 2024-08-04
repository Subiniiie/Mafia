import React, { useState, useEffect } from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import styles from "./GamePageHeader.module.css"
import GameSettingsModal from "../../modals/GameSettingsModal";

function GamePageHeader({leaveSession}) {
    // 게임 리스트에서 게임 방을 클릭하면 or 방장이 새롭게 게임 방을 만들면 or 방장이 방 이름을 수정하면
    // 게임 방 정보가 나한테 들어올 거임
    // 그때 코드 수정하기 지금은 임시로 설정

    // 2-1.
    // useState(response.data.roomTitle) 이런 식
    const [ roomTitle, setRoomTitle ] = useState('대한의 독립을 위하여')

    // 2-2.
    // 방장 정보는 어디서 얻음??
    // 백에서 주겠지
    // response 안에 있나
    const [ roomManager, setRoomManager ] = useState(true)


    // 방장만 게임 설정 바꿀 수 있게
    // 버튼을 클릭하면 게임 설정 모달이 열림
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ blackBackground, setBlackBackground ] = useState(false)

    function openModal() {
        setIsModalOpen(!isModalOpen)
        setBlackBackground((preState) => !preState)
    }

    // 1.
    // 방제목을 가져옴
    // 아마 response 안에 roomTitle이 있겠지??
    // 그럼 response.data.roomTitle 이런 식??

    const roomManagerSettings = <button className={styles.settings} onClick={openModal}>게임설정</button>
    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.roomTitle}>
                        {roomTitle}
                    </div>
                    <div className={styles.right}>
                        {roomManager ? roomManagerSettings : null}
                            <Link to="/game-list" className={styles.exit} onClick={leaveSession}>
                                <img src="/exit.png" alt="exit.png" className={styles.exitImage}/>
                                나가기
                            </Link>
                    </div>
                </div>
                <div>
                    {isModalOpen ? <GameSettingsModal isOpen={isModalOpen} openModal={openModal}/> : null}
                </div>
            </div>
            { blackBackground ? <div className={styles.black} onClick={openModal}></div> : null}
        </>
    )
}

export default GamePageHeader;