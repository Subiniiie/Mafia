import { useState } from "react"
import classNames from "classnames"
import CreateRoomModal from "../../modals/CreateRoomModal"
import styles from "./GLHeader.module.css";
import FilterChecked from "../../assets/Buttons/FilterChecked.png"
import FilterUnchecked from "../../assets/Buttons/FilterUnchecked.png"
import SearchButton from "../../assets/Buttons/SearchButton.png"


const GLHeader = ({ setViduToken, checkPublic, setCheckPublic, checkPrivate, setCheckPrivate, checkCanEnter, setCheckCanEnter, setSearch, handleSearchTrigger }) => {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("") // 로컬 검색어 상태 관리

    const openModal = () => setIsModalOpen(!isModalOpen)

    const checkFilterPublic = () => setCheckPublic(!checkPublic)
    const checkFilterPrivate = () => setCheckPrivate(!checkPrivate)
    const checkFilterCanEnter = () => setCheckCanEnter(!checkCanEnter)

    const handleSearch = (e) => {
        e.preventDefault() // 기본 폼 제출 동작 방지
        setSearch(searchTerm) // 입력된 검색어를 상위 컴포넌트에 전달
        handleSearchTrigger() // 검색어 설정 후 방 목록 갱신
    }

    const GLHeaderClass = classNames('east-sea-dokdo-regular', styles.container)

    return (
        <header className={GLHeaderClass}>
            <div className={styles.filterBoxContainer}>
                <div className={styles.filterBoxContainerLarge}>
                    <div className={styles.filterContainer}>
                        공개 임무
                        {checkPublic ? (
                            <img src={FilterChecked} alt="FilterChecked" className={styles.filterButtons} onClick={checkFilterPublic} />
                        ) : (
                            <img src={FilterUnchecked} alt="FilterUnchecked" className={styles.filterButtons} onClick={checkFilterPublic} />
                        )}
                    </div>

                    <div className={styles.filterContainer}>
                        극비 임무
                        {checkPrivate ? (
                            <img src={FilterChecked} alt="FilterChecked" className={styles.filterButtons} onClick={checkFilterPrivate} />
                        ) : (
                            <img src={FilterUnchecked} alt="FilterUnchecked" className={styles.filterButtons} onClick={checkFilterPrivate} />
                        )}
                    </div>
                </div>
                <div className={styles.filterBoxContainerMini}>
                    <div className={styles.filterContainer}>
                        임무 시작 전
                        {checkCanEnter ? (
                            <img src={FilterChecked} alt="FilterChecked" className={styles.filterButtons} onClick={checkFilterCanEnter} />
                        ) : (
                            <img src={FilterUnchecked} alt="FilterUnchecked" className={styles.filterButtons} onClick={checkFilterCanEnter} />
                        )}
                    </div>
                </div>
            </div>

            <div>
                <form className={styles.searchBarContainer} onSubmit={handleSearch}>
                    <div className={styles.inputUnderline}>
                        <input
                            required
                            type="text"
                            placeholder={"터전을 찾아보세요."}
                            className={styles.searchBarInput}
                            value={searchTerm} // 입력된 검색어를 바인딩
                            onChange={(e) => setSearchTerm(e.target.value)} // 입력값 변경 시 상태 업데이트
                        />
                    </div>
                    <img src={SearchButton} alt="SearchButton" className={styles.searchButton} onClick={handleSearch} />
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