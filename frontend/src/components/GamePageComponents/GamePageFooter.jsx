import React, { useState } from "react";
import JobModal from "../../modals/JobModal";
import GameChat from "./GameChat";
import GameReadyStartBtn from "./GameReadyStartBtn";
import styles from "./GamePageFooter.module.css"

function GamePageFooter({ systemMessage, stompClient, gameData, nowGameState, gameResponse, session, chatHistory, chatMode, players, roomId, myJob }) {
    console.log('GamePageFooter에서 gameResponse', gameResponse)
    // 모달을 열고 닫을 변수
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ blackBackground, setBlackBackground ] = useState(false)


    function openModal() {
        setIsModalOpen(preState => !preState)
        setBlackBackground(preState => !preState)
    }

    const jobModalOpen = <JobModal isOpen={isModalOpen} openModal={openModal} gameData={gameData} myJob={myJob} />
    return (
        <>
            <div className={styles.container}>
                <div className={styles.footer}>
                    <button className={styles.btn} onClick={openModal}>직업</button>
                    <GameChat   systemMessage={systemMessage}
                                session={session}
                                chatMode={chatMode}
                                chatHistory={chatHistory}
                                players={players}
                                />
                    <GameReadyStartBtn stompClient={stompClient} nowGameState={nowGameState} gameData={gameData} gameResponse={gameResponse} roomId={roomId}/>
                </div>
                <div>
                    { isModalOpen ? jobModalOpen : null}
                </div>
            </div>
            {blackBackground ? <div className={styles.black} onClick={openModal}></div> : null}
        </>
    )
}

export default GamePageFooter;