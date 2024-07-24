import styles from './ModalHeader.module.css'

const ModalHeader = ({ modalTitle, openModal }) => {

    return (
        <>
            <div>
                <div>
                    {modalTitle}
                </div>
                <button onClick={openModal} className={styles.closeButton}>닫기</button>
            </div>
        </>
    )
}

export default ModalHeader;