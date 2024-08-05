import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GamePageHeader from "../components/GamePageComponents/GamePageHeader";
import GamePageMain from "../components/GamePageComponents/GamePageMain";
import GamePageFooter from "../components/GamePageComponents/GamePageFooter";
import styles from "./GamePage.module.css"
import axios from "axios";

function GamePage() {
    // 게임방 주소에 id 추가해서 리스트에서 들어가는 게임방마다 다른 경로로 가게 하기
    const { id } = useParams()

    // 어디에서 다뤄야할까
    const [ roomManager, setRoomManager ] = useState(true)

        
    return (
        <>
            <div className={styles.container}>
                <GamePageHeader />
                <GamePageMain />
                <GamePageFooter roomManager={roomManager} />
            </div>
        </>
    )
}

export default GamePage;