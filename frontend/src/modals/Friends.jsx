import React, { useState } from "react";
import FriendsAddTab from "./FriendsAddTab";
import FriendsListTab from "./FriendsListTab";
import FriendsSearchTab from "./FriendsSearchTab";
import styles from "./Friends.module.css"

function Friends() {
    const [ openModal, setOpenModal ] = useState(false)
    function openFriendsModal() {
        setOpenModal(true)
    }
    return (
        <>
            <button className={styles.btn} onClick={openFriendsModal}>동지들</button>
            { openModal ? (
                <div className={styles.container}>
                    <FriendsAddTab />
                    <FriendsListTab />
                    <FriendsSearchTab />
               </div> 
            )   
            : null }
        </>
    )
}

export default Friends;