import React, {useState} from "react";

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
                    <div>
                        <label>채팅창</label>
                        <input 
                            type="text" 
                            value={enteredChat}
                            onChange={enteredChatHandle}
                            placeholder="채팅을 입력하세요."
                            style={{ width: "600px" }}
                            >
                        </input>
                        <button type="submit">보내기</button>
                    </div>
                </form>
        </>
    )

}

export default GameChatInput;