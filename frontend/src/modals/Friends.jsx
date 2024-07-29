import React, { useState } from "react";
import ModalHeader from "../components/ModalHeader"
import FriendsAddTab from "./FriendsAddTab";
import FriendsListTab from "./FriendsListTab";
import FriendsSearchTab from "./FriendsSearchTab";
import styles from "./Friends.module.css"

function Friends() {
    // 모달을 열고 닫을 변수
    const [ openFriendsMOdal, setOpenFriendsModal ] = useState(false)
    function openModal() {
        setOpenFriendsModal(preState => !preState)
    }

    // 동지 / 동지 요청 / 동지 찾기 중 어느 화면을 보여줄지 정하는 변수
    const [ activeTab, setActivetab ] = useState("list")
    function handleTabChange(tab) {
        setActivetab(tab)
    }


    const friends = <div className={styles.container}>
        <ModalHeader modalTitle="동지들" openModal={openModal}/>
        <button onClick={() => handleTabChange("list")}>동지</button>
        <button onClick={() => handleTabChange("add")}>동지 요청</button>
        <button onClick={() => handleTabChange("search")}>동지 찾기</button>
        <div>
            {activeTab === "list" && <FriendsListTab />}
            {activeTab === "add" && <FriendsAddTab />}
            {activeTab === "search" && <FriendsSearchTab />}
        </div>
    </div>
    return (
        <>
            <button className={styles.btn} onClick={openModal}>동지들</button>
            { openFriendsMOdal ? friends : null }
        </>
    )
}

export default Friends;