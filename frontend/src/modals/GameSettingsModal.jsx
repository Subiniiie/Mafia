import React from "react";
import ModalHeader from "../components/ModalHeader"
import RoomName from "../components/GamePageComponents/RoomName";
import MaximumNumber from "../components/GamePageComponents/MaximumNumber";
import SecretMode from "../components/GamePageComponents/SecretMode";
import Password from "../components/GamePageComponents/Password";
import Turncoat from "../components/GamePageComponents/Turncoat";
import styles from "./GameSettingsModal.module.css"

function GameSettingsModal({ isOpen, openModal }) {
    function handleCloseModal() {
        closeModal()
    }
    return (
        <>
            <div className={styles.modal}>
                <div>
                    <ModalHeader modalTitle="게임 설정" openModal={openModal}/>
                    <div className={styles.header}>
                        <RoomName />
                        <MaximumNumber />
                    </div>
                    <div className={styles.footer}>
                        <SecretMode />
                        <Password />
                    </div>
                    <div>
                        <Turncoat />
                    </div>
                    <div>
                        <button>변경</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GameSettingsModal;