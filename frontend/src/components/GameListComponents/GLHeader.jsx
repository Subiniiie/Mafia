// import { useState } from "react"
// import FilterBox from "./FilterBox"
// import SearchBar from "./SearchBar"
// import CreateRoomModal from "../../modals/CreateRoomModal"
// import styles from "./GLHeader.module.css"

// const GLHeader = () => {

//     const [isModalOpen, setIsModalOpen] = useState(false)

//     return (
//         <>
//             <div className={styles.headerContainer}>
//                 <div>
//                     <FilterBox />
//                 </div>
//                 <div>
//                     <SearchBar />
//                 </div>
//                 <div>
//                     <button onClick={() => { setIsModalOpen(!isModalOpen) }}>새로운 도전</button>
//                     {isModalOpen === true ? <CreateRoomModal /> : null}
//                 </div>
//             </div>
//         </>
//     )
// }

// export default GLHeader



import { useState } from "react"
import FilterBox from "./FilterBox"
import SearchBar from "./SearchBar"
import CreateRoomModal from "../../modals/CreateRoomModal"
import styles from "./GLHeader.module.css"

const GLHeader = () => {

    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)


    return (
        <>
            <div className={styles.headerContainer}>
                <div className={styles.filterSection}>
                    <FilterBox />
                </div>
                <div className={styles.searchSection}>
                    <SearchBar />
                </div>
                <div className={styles.buttonSection}>
                    <button onClick={openModal}>새로운 도전</button>
                    <CreateRoomModal isOpen={isModalOpen} onClose={closeModal} />
                </div>
            </div>
        </>
    )
}

export default GLHeader