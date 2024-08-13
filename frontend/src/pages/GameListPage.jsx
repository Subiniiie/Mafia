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
    const [search, setSearch] = useState("") // 검색어 상태 추가
    const [triggerSearch, setTriggerSearch] = useState(false) // 검색 트리거 상태

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

    const handleSearchTrigger = () => {
        setTriggerSearch(!triggerSearch) // 트리거 상태 변경
    }

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
                setSearch={setSearch} // 검색어 설정 함수 전달
                handleSearchTrigger={handleSearchTrigger} // 검색 트리거 함수 전달
            />
            <div className={styles.contentWrapper}>
                <main className={styles.mainContent}>
                    <GLMain
                        setViduToken={setViduToken}
                        checkPublic={checkPublic}
                        checkPrivate={checkPrivate}
                        checkCanEnter={checkCanEnter}
                        search={search} // 검색어 전달
                        triggerSearch={triggerSearch} // 트리거 상태 전달
                    />
                </main>
                <GLFooter className={styles.footer} />
            </div>
        </div>
    );

}

export default GameListPage;
