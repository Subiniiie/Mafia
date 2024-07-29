import React from "react";

function System() {
    const alarms = ['밤이 되었습니다', '낮이 되었습니다', '밀정이 활동 중입니다.', '첩보원이 활동 중입니다.', 
        '토론을 진행하겠습니다. 토론을 진행하는 동안 밀정으로 의심되는 사람을 투표해주세요.', '최종 반론 중입니다.']
    return(
        <>
            <p>{alarms[2]}</p>
        </>
    )
}

export default System;