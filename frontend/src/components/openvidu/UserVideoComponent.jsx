import React, {useEffect, useState} from "react";
import OpenViduVideoComponnet from "./OvVideo";
import axios from "axios";

import styles from "./UserVideoComponent.css";

const UserVideoComponent = ({streamManager, sub, ownerId}) => {
    const nicknameTag = JSON.parse(streamManager.stream.connection.data).nickname;
    const id = JSON.parse(streamManager.stream.connection.data).id;

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