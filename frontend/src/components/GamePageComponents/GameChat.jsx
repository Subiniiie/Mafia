import React, { useState } from "react";
import styles from "./GameChat.module.css"
import GameChatInput from "./GameChatInput";
import GameChatHistory from "./GameChatHistory";
import System from "./System";
import {jwtDecode} from "jwt-decode";

function GameChat({ systemMessage, session, chatMode, chatHistory, players }) {
    
    const isEmissaryOrBetrayer = (player) => {
        return player.role === 'emissary' || player.role === 'betrayer';
    }

    const nickname = jwtDecode(localStorage.getItem("access")).username;
    // console.log(nickname);

    // session.signal을 통해 채팅 signal 전송
    // chatMode.mode에 따라 모든 유저에게 전송할 지, 밀정/변절자에게만 전송할 지 결정
    // 밤일 경우, 밀정/변절자가 아닌 유저면 전송하면 안 됨 => 조건 분기 필요
    const handleChatSubmit = (message) => {
        const valid = players.filter(player => player.isMe).map(player => await isEmissaryOrBetrayer(player))[0];
        console.log("mode",chatMode.mode);
        if (chatMode.mode === 'signal:chat' || valid) {
            session.signal({
              data: JSON.stringify({nickname, message}),
              type: chatMode.mode,
              to: chatMode.to
            }).then(() => {
              console.log("send message complete");
            }).catch((e) => {
              console.error(e);
            });
        }
    }

    const [ clickUpBtn, setClickUpBtn ] = useState(false)

    function OpenChat() {
        setClickUpBtn(!clickUpBtn)
    }

    const unvisibleChat = <div className={styles.closed}>
                             <button onClick={OpenChat} className={styles.chatBtn}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="25" viewBox="0 -960 960 960" width="25" fill="#5f6368"><path d="m296-224-56-56 240-240 240 240-56 56-184-183-184 183Zm0-240-56-56 240-240 240 240-56 56-184-183-184 183Z"/></svg>
                             </button>
                             <System systemMessage={systemMessage} />
                          </div>

    const visibleChat = <div className={styles.opened}>
                            <button onClick={OpenChat} className={styles.chatBtn}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="25" viewBox="0 -960 960 960" width="25" fill="#5f6368"><path d="M480-200 240-440l56-56 184 183 184-183 56 56-240 240Zm0-240L240-680l56-56 184 183 184-183 56 56-240 240Z"/></svg>
                            </button>
                            <System />
                            <GameChatHistory chatHistory={chatHistory}/>
                            <GameChatInput onChatSubmit={handleChatSubmit}/>
                        </div>
    return (
        <>  
            <div className={styles.container}>
                {clickUpBtn ? visibleChat : unvisibleChat}  
            </div>
        </>
    )
}

export default GameChat;