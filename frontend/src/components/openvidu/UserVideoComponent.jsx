import React, {useEffect, useState} from "react";
import OpenViduVideoComponnet from "./OvVideo";
import axios from "axios";

import styles from "./UserVideo.module.css";

const UserVideoComponent = ({streamManager}) => {
    const nicknameTag = "ssafy_test"
    const id = 1;

    return (
        <>
            {streamManager !== undefined ? (
                <div className="streamcomponent">
                    <OpenViduVideoComponnet
                        streamManager={streamManager}
                        id={id}
                    />
                    <span>{nicknameTag}</span>
                </div>
            ):null}
        </>
    );
};

export default UserVideoComponent;