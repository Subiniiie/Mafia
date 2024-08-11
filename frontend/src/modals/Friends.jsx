import { useState } from "react";
import ModalHeader from "../components/ModalHeader"
import FriendsAddTab from "./FriendsAddTab";
import FriendsListTab from "./FriendsListTab";
import FriendsSearchTab from "./FriendsSearchTab";
import styles from "./Friends.module.css"

function Friends({ isOpen, openModal }) {

    if (!isOpen) return null; // 모달이 열리지 않았다면 렌더링하지 않음

    // 동지 / 동지 요청 / 동지 찾기 중 어느 화면을 보여줄지 정하는 변수
    const [activeTab, setActivetab] = useState("list")

    function handleTabChange(tab) {
        setActivetab(tab)
    }

    const friends = 
        <div className={styles.modal}>
            <div className={styles.container}>
                <div className={styles.modalTitle}>
                    <ModalHeader modalTitle="동지들" openModal={openModal} />
                </div>
                    <div className={styles.content}>
                        <button className={styles.btn} onClick={() => handleTabChange("list")}>동지</button>
                        <button className={styles.btn} onClick={() => handleTabChange("add")}>동지 요청</button>
                        <button className={styles.btn} onClick={() => handleTabChange("search")}>동지 찾기</button>
                        <div>
                            {activeTab === "list" && <FriendsListTab />}
                            {activeTab === "add" && <FriendsAddTab />}
                            {activeTab === "search" && <FriendsSearchTab />}
                        </div>
                    </div>
            </div>
        </div>

    return (
        <>
            {isOpen ? friends : null}
        </>
    )
}

export default Friends;