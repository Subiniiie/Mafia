import { useState } from "react"
import classNames from "classnames"
import FilterBox from "./FilterBox"
import SearchBar from "../../components/SearchBar"
import CreateRoomModal from "../../modals/CreateRoomModal"
import styles from "./GLHeader.module.css";


const GLHeader = ({setViduToken}) => {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const openModal = () => setIsModalOpen(!isModalOpen)

    const GLHeaderClass = classNames('east-sea-dokdo-regular', styles.container)

    return (
<<<<<<< HEAD
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
=======
        <div className="east-sea-dokdo-regular">
            <div>
                <div>
                    <FilterBox />
                </div>
                <div>
                    <SearchBar placeholder="터전을 찾아보세요." />
                </div>
                <div>
                    <button onClick={openModal}>새로운 도전</button>
                    <CreateRoomModal isOpen={isModalOpen} openModal={openModal} setViduToken={setViduToken}/>
                </div>
>>>>>>> e2c5f4ddfbe6e4956d714d3c6c51e658f12d301b
            </div>
        </div >
    )
}

export default GLHeader