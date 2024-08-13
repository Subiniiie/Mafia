import { useState } from "react"
import classNames from "classnames"
import SearchBar from "../../components/SearchBar"
import CreateRoomModal from "../../modals/CreateRoomModal"
import styles from "./GLHeader.module.css";
import FilterChecked from "../../assets/Buttons/FilterChecked.png"
import FilterUnchecked from "../../assets/Buttons/FilterUnchecked.png"
import SearchButton from "../../assets/Buttons/SearchButton.png"


const GLHeader = ({ setViduToken }) => {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const openModal = () => setIsModalOpen(!isModalOpen)

    const [isCheckedPublic, setIsCheckedPublic] = useState(false)
    const checkFilterPublic = () => setIsCheckedPublic(!isCheckedPublic)

    const [isCheckedPrivate, setIsCheckedPrivate] = useState(false)
    const checkFilterPrivate = () => setIsCheckedPrivate(!isCheckedPrivate)

    const [isCheckedPlaying, setIsCheckedPlaying] = useState(false)
    const checkFilterPlaying = () => setIsCheckedPlaying(!isCheckedPlaying)

    const GLHeaderClass = classNames('east-sea-dokdo-regular', styles.container)

    return (
        <header className={GLHeaderClass}>
            <div className={styles.filterBoxContainer}>
                <div className={styles.filterBoxContainerLarge}>
                    <div className={styles.filterContainer}>
                        공개 임무
                        {isCheckedPublic ? (
                            <img src={FilterChecked} alt="FilterChecked" className={styles.filterButtons} onClick={checkFilterPublic} />
                        ) : (
                            <img src={FilterUnchecked} alt="FilterUnchecked" className={styles.filterButtons} onClick={checkFilterPublic} />
                        )}
                    </div>

                    <div className={styles.filterContainer}>
                        극비 임무
                        {isCheckedPrivate ? (
                            <img src={FilterChecked} alt="FilterChecked" className={styles.filterButtons} onClick={checkFilterPrivate} />
                        ) : (
                            <img src={FilterUnchecked} alt="FilterUnchecked" className={styles.filterButtons} onClick={checkFilterPrivate} />
                        )}
                    </div>
                </div>
                <div className={styles.filterBoxContainerMini}>
                    <div className={styles.filterContainer}>
                        임무 시작 전
                        {isCheckedPlaying ? (
                            <img src={FilterChecked} alt="FilterChecked" className={styles.filterButtons} onClick={checkFilterPlaying} />
                        ) : (
                            <img src={FilterUnchecked} alt="FilterUnchecked" className={styles.filterButtons} onClick={checkFilterPlaying} />
                        )}
                    </div>
                </div>
            </div>

            {/* <div className={styles.searchBarContainer}>
                <SearchBar placeholder="터전을 찾아보세요." />
            </div> */}

            <div>
                <form className={styles.searchBarContainer}>
                    <div className={styles.inputUnderline}>
                        <input
                            required
                            type="text"
                            placeholder={"터전을 찾아보세요."}
                            className={styles.searchBarInput}
                        />
                    </div>
                    <img src={SearchButton} alt="SearchButton" className={styles.searchButton} />
                </form>
            </div>

            <div className={styles.CreateRoomButtonContainer}>
                <button onClick={openModal} className={styles.CreateRoomButton}>새로운 도전 +</button>
                <CreateRoomModal isOpen={isModalOpen} openModal={openModal} setViduToken={setViduToken} />
            </div>
        </header >
    )
}

export default GLHeader