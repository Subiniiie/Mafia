import { useState } from "react"
import FilterBox from "./FilterBox"
import SearchBar from "../../components/SearchBar"
import CreateRoomModal from "../../modals/CreateRoomModal"

const GLHeader = () => {

    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => setIsModalOpen(!isModalOpen)

    return (
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
                    <CreateRoomModal isOpen={isModalOpen} openModal={openModal} />
                </div>
            </div>
        </div >
    )
}

export default GLHeader