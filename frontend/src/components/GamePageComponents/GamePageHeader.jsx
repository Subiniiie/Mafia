import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./GamePageHeader.module.css"
import GameSettingsModal from "../../modals/GameSettingsModal";

function GamePageHeader() {
    // 게임 리스트에서 게임 방을 클릭하면 or 방장이 새롭게 게임 방을 만들면 or 방장이 방 이름을 수정하면
    // 게임 방 정보가 나한테 들어올 거임
    // 그때 코드 수정하기 지금은 임시로 설정
    const [ roomTitle, setRoomTitle ] = useState('방이름')

    // 방장 정보는 어디서 얻음??
    // 백에서 주겠지
    const [ roomManager, setRoomManager ] = useState(true)


    // 방장만 게임 설정 바꿀 수 있게
    // 버튼을 클릭하면 게임 설정 모달이 열림
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ blackBackground, setBlackBackground ] = useState(false)

    function openModal() {
        setIsModalOpen(!isModalOpen)
        setBlackBackground((preState) => !preState)
    }

    const roomManagerSettings = <button className={styles.settings} onClick={openModal}>게임설정</button>
    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    {roomTitle}
                    <div className={styles.right}>
                        {roomManager ? roomManagerSettings : null}
                            <Link to="/game-list" className={styles.exit}>
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