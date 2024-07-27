import React, { useState } from "react";
import JobModal from "../../modals/JobModal";
import GameReadyStartBtn from "./GameReadyStartBtn";
import styles from "./GamePageFooter.module.css"

function GamePageFooter() {
    // 모달을 열고 닫을 변수
    const [ isModalOpen, setIsModalOpen ] = useState(false)

    function openModal() {
        setIsModalOpen(!isModalOpen)
    }


    const jobModalOpen = <JobModal isOpen={isModalOpen} openModal={openModal}/>
    return (
        <>
            <div className={styles.footer}>
            <button onClick={openModal}>직업</button>
            채팅창이 들어갈 자리
            <GameReadyStartBtn />
            </div>
                <div className="job-modals">
                    { isModalOpen ? jobModalOpen : null}
                </div>
        </>
    )
}

export default GamePageFooter;