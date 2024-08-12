import { useEffect, useRef } from "react";
import GLHeader from "../components/GameListComponents/GLHeader";
import GLMain from "../components/GameListComponents/GLMain";
import GLFooter from "../components/GameListComponents/GLFooter";
import BGM from "../assets/BGM/LobbyBGM.mp3"


function GameListPage({ setViduToken, isSpeakerOn }) {
    const audioRef = useRef(null);

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
        <div>
            <audio ref={audioRef} autoPlay loop >
                <source src={BGM} type="audio/mp3" />
            </audio>
            <GLHeader setViduToken={setViduToken} />
            <main>
                <GLMain setViduToken={setViduToken} />
            </main>
            <GLFooter />
        </div>
    );
}

export default GameListPage;
