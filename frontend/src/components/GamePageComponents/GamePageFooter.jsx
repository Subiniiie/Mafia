import React, { useState } from "react";
import JobModal from "../../modals/JobModal";
import GameChat from "./GameChat";
import GameReadyStartBtn from "./GameReadyStartBtn";
import styles from "./GamePageFooter.module.css"

function GamePageFooter({ systemMessage }) {
    // 모달을 열고 닫을 변수
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ blackBackground, setBlackBackground ] =useState(false)

    function openModal() {
        setIsModalOpen(preState => !preState)
        setBlackBackground(preState => !preState)
    }

    const jobModalOpen = <JobModal isOpen={isModalOpen} openModal={openModal} />
    return (
        <>
            <div className={styles.container}>
                <div className={styles.footer}>
                    <button className={styles.btn} onClick={openModal}>직업</button>
                    <GameChat systemMessage={systemMessage} />
                    <GameReadyStartBtn />
                </div>
                <div className="job-modals">
                    { isModalOpen ? jobModalOpen : null}
                </div>
            </div>
            {blackBackground ? <div className={styles.black} onClick={openModal}></div> : null}
        </>
    )
}

export default GamePageFooter;