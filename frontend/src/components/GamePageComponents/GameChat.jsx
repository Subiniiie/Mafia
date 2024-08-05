import React, { useState } from "react";
import styles from "./GameChat.module.css"
import GameChatInput from "./GameChatInput";
import GameChatHistory from "./GameChatHistory";
import System from "./System";

function GameChat({chatHistory, setChatHistory, session}) {

  const handleChatSubmit = (message) => {
    setChatHistory(prevHistory => [...prevHistory, message])
  }

  const [ clickUpBtn, setClickUpBtn ] = useState(false)

    function OpenChat() {
        setClickUpBtn(!clickUpBtn)
    }

    const unvisibleChat = <div className={styles.closed}>
                             <button onClick={OpenChat} className={styles.chatBtn}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="25" viewBox="0 -960 960 960" width="25" fill="#5f6368"><path d="m296-224-56-56 240-240 240 240-56 56-184-183-184 183Zm0-240-56-56 240-240 240 240-56 56-184-183-184 183Z"/></svg>
                             </button>
                             <System />
                          </div>

    const visibleChat = <div className={styles.opened}>
                            <button onClick={OpenChat} className={styles.chatBtn}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="25" viewBox="0 -960 960 960" width="25" fill="#5f6368"><path d="M480-200 240-440l56-56 184 183 184-183 56 56-240 240Zm0-240L240-680l56-56 184 183 184-183 56 56-240 240Z"/></svg>
                            </button>
                            <System />
                            <GameChatHistory chatHistory={chatHistory}/>
                            <GameChatInput onChatSubmit={handleChatSubmit} session={session}/>
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