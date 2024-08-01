import React from "react";
import ModalHeader from "../components/ModalHeader"
import RoomName from "../components/GamePageComponents/RoomName";
import SecretMode from "../components/GamePageComponents/SecretMode";
import Password from "../components/GamePageComponents/Password";
import Turncoat from "../components/GamePageComponents/Turncoat";
import styles from "./GameSettingsModal.module.css"

function GameSettingsModal({ openModal }) {
    return (
        <>
            <div className={styles.modal}>
                    <ModalHeader modalTitle="게임 설정" openModal={openModal}/>
                <div className={styles.container}>
                    <div className={styles.content}>
                        <RoomName />
                        <div className={styles.rowStyle}>
                            <SecretMode />
                            <Password />
                        </div>
                        <Turncoat />
                        <div>
                            <button className={styles.btn} onClick={openModal}>변경</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GameSettingsModal;