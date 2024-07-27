import React from "react";

function MaximumNumber() {
    return (
        <>
            <p>최대 인원</p>
            <input type="number" min={6} max={8}></input>
        </>
    )
}
export default MaximumNumber;