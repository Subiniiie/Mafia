import React, {useEffect, useState, useRef} from "react";
import { useParams } from "react-router-dom";
import GamePageHeader from "../components/GamePageComponents/GamePageHeader";
import GamePageMain from "../components/GamePageComponents/GamePageMain";
import GamePageFooter from "../components/GamePageComponents/GamePageFooter";
import styles from "./GamePage.module.css"
import {OpenVidu} from "openvidu-browser";

function GamePage({token}) {

    // 게임방 주소에 id 추가해서 리스트에서 들어가는 게임방마다 다른 경로로 가게 하기
    const { id } = useParams()
    return (
        <>
            <div className={styles.container}>
                <GamePageHeader />
                <GamePageMain sessionId={id} token={token}/>
                <GamePageFooter />
            </div>
        </>
    )
}

export default GamePage;