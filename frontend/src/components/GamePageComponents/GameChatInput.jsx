import React, {useState} from "react";
import styles from "./GameChatInput.module.css"

function GameChatInput({ onChatSubmit,session }) {
    const [ enteredChat, setEnteredChat ] = useState('')

    function enteredChatHandle(event) {
        setEnteredChat(event.target.value)
    }

    function submitHandle(event) {
        event.preventDefault()
        sendChatMessage()
        // onChatSubmit({userId: "ssafy", message:enteredChat})
    }

    const sendChatMessage = () => {
        const message = enteredChat.trim();
        if(message && session){
            session.signal({
                data: JSON.stringify({userId:"ssafy", message}),
                type: 'chat',
                to: []
            }).then(() => {
                console.log("successfuly send: "+message);
                setEnteredChat('')
            }).catch((error) => {
                console.error(error);
            })
        }
    }

    return (
        <>
            <form onSubmit={submitHandle}>
                    <div className={styles.main}>
                        <input 
                            type="text" 
                            value={enteredChat}
                            onChange={enteredChatHandle}
                            placeholder="채팅을 입력하세요."
                        />
                        <button type="submit">보내기</button>
                    </div>
                </form>
        </>
    )
}

export default GameChatInput;