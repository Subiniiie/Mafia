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

    // 플레이어의 정보를 어디서 받지??
    // 플레이어의 정보가 필요한 화면 
    // 1) Header : 방장은 게임 설정 해야함
    // 2) Main : 내가 누구한테 투표했는지 / 누가 죽었는지 / 누가 어떤 역할인지
    // 3) Footer : 내 직업이 뭔지(독립운동가가 변절자가 되는 거 체크) / 내 역할이 뭔지(준비/시작 버튼 체크)
    // 방장 정보는 여기서 받아서 Header랑 Footer로 쏘기??
    // const [ roomManager, setRoomManager ] = useState(true)

        
    return (
        <>
            <div className={styles.container}>
                <GamePageHeader />
                <GamePageMain />
                {/* <GamePageFooter roomManager={roomManager} /> */}
                <GamePageFooter />
            </div>
        </>
    )
}

export default GamePage;