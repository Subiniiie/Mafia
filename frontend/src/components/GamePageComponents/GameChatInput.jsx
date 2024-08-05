import React, {useState} from "react";
import styles from "./GameChatInput.module.css"

function GameChatInput({ onChatSubmit }) {
    const [ enteredChat, setEnteredChat ] = useState('')

    function enteredChatHandle(event) {
        setEnteredChat(event.target.value)
    }

    function submitHandle(event) {
        event.preventDefault()
        onChatSubmit(enteredChat)
        setEnteredChat('')
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
                            >
                        </input>
                        <button type="submit">보내기</button>
                    </div>
                </form>
        </>
    )

}

export default GameChatInput;