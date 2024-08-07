import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import GamePageHeader from "../components/GamePageComponents/GamePageHeader";
import GamePageMain from "../components/GamePageComponents/GamePageMain";
import GamePageFooter from "../components/GamePageComponents/GamePageFooter";
import styles from "./GamePage.module.css"
import {OpenVidu} from "openvidu-browser";

function GamePage() {
    const { roomId } = useParams();
    return (
        <>
            <div className={styles.container}>
                <GamePageHeader />
                <GamePageMain setSystemMessage={setSystemMessage} roomId={roomId} streamManagers={streamManagers} />
                <GamePageFooter systemMessage={systemMessage} />
            </div>
        </>
    )
}

export default GamePage;