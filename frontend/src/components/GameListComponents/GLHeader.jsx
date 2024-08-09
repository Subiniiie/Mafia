import { useState } from "react"
import classNames from "classnames"
import FilterBox from "./FilterBox"
import SearchBar from "../../components/SearchBar"
import CreateRoomModal from "../../modals/CreateRoomModal"
import styles from "./GLHeader.module.css";


const GLHeader = () => {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const openModal = () => setIsModalOpen(!isModalOpen)

    const GLHeaderClass = classNames('east-sea-dokdo-regular', styles.container)

    return (
        <div className={GLHeaderClass}>
            <div className={styles.filterBoxContainer}>
                <FilterBox />
            </div>
            <div className={styles.searchBarContainer}>
                <SearchBar placeholder="터전을 찾아보세요." />
            </div>
            <div className={styles.CreateRoomButtonContainer}>
                <button onClick={openModal}>새로운 도전</button>
                <CreateRoomModal isOpen={isModalOpen} openModal={openModal} />
            </div>
        </div >
    )
}

export default GLHeader