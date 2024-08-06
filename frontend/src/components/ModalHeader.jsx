import classNames from 'classnames'
import styles from './ModalHeader.module.css'
import ModalCloseButton from '../assets/Buttons/ModalCloseButton.png'


const ModalHeader = ({ modalTitle, openModal }) => {

    const modalTitleClass = classNames('kimjungchul-gothic-bold', styles.modalTitle)
    return (
        <>
            <div className={styles.modalHeader}>
                <div className={modalTitleClass}>
                    {modalTitle}
                </div>
                <img src={ModalCloseButton} alt="ModalCloseButton" className={styles.modalCloseButton} onClick={openModal} />
            </div>
        </>
    )
}

export default ModalHeader
