import ModalHeader from "../components/ModalHeader"
import styles from "./SettingsModal.module.css"
import { useState } from "react";


const SettingsModal = ({ isOpen, openModal }) => {
    const modalTitle = '환경 설정';

    const [isVolumeOn, setIsVolumeOn] = useState(true)
    const changeVolume = function () {
        setIsVolumeOn(prevState => !prevState)
    }

    const [isMicOn, setIsMicOn] = useState(true)
    const changeMic = function () {
        setIsMicOn(prevState => !prevState)
    }

    if (!isOpen) return null; // 모달이 열리지 않았다면 렌더링하지 않음

    return (
        <div className={styles.modalOverlay} onClick={openModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <ModalHeader modalTitle={modalTitle} openModal={openModal} />
                <div className={styles.formContainer}>
                    <div className={styles.sound}>
                        <div className={styles.soundText}>음량</div>
                        <div>
                            <img src={isVolumeOn ? "/volume.png" : "volume_mute.png"}
                                alt="volume"
                                width="30px"
                                onClick={changeVolume}
                            />
                        </div>
                    </div>
                    <div className={styles.voice}>
                        <div className={styles.voiceText}>마이크</div>
                        <div>
                            <img src={isMicOn ? "/mic.png" : "mic_mute.png"}
                                alt="mic"
                                width="30px"
                                onClick={changeMic}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsModal;
