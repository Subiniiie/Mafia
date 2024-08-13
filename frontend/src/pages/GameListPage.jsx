import { useState, useEffect, useRef } from "react";
import GLHeader from "../components/GameListComponents/GLHeader";
import GLMain from "../components/GameListComponents/GLMain";
import GLFooter from "../components/GameListComponents/GLFooter";
import React from "react";
import BGM from "../assets/BGM/LobbyBGM.mp3"
import styles from "./GameListPage.module.css";



function GameListPage({ setViduToken, isSpeakerOn }) {
    const audioRef = useRef(null);
    const [checkPublic, setCheckPublic] = useState(false)
    const [checkPrivate, setCheckPrivate] = useState(false)
    const [checkCanEnter, setCheckCanEnter] = useState(false)

    useEffect(() => {
        const audio = audioRef.current;
        if (isSpeakerOn) {
            audio.play().catch((error) => {
                console.log("Autoplay failed. User interaction required.")
            })
        } else {
            audio.pause()
        }
    }, [isSpeakerOn])

    return (
        <div className={styles.pageContainer}>
            <audio ref={audioRef} autoPlay loop >
                <source src={BGM} type="audio/mp3" />
            </audio>
            <GLHeader
                setViduToken={setViduToken}
                checkPublic={checkPublic}
                setCheckPublic={setCheckPublic}
                checkPrivate={checkPrivate}
                setCheckPrivate={setCheckPrivate}
                checkCanEnter={checkCanEnter}
                setCheckCanEnter={setCheckCanEnter}
            />
            <div className={styles.contentWrapper}>
                <main className={styles.mainContent}>
                    <GLMain
                        setViduToken={setViduToken}
                        checkPublic={checkPublic}
                        checkPrivate={checkPrivate}
                        checkCanEnter={checkCanEnter}
                    />
                </main>
                <GLFooter className={styles.footer} />
            </div>
        </div>
    );

}

export default GameListPage;
