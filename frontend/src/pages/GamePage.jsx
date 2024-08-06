import React, {useEffect, useState, useRef} from "react";
import { useParams } from "react-router-dom";
import GamePageHeader from "../components/GamePageComponents/GamePageHeader";
import GamePageMain from "../components/GamePageComponents/GamePageMain";
import GamePageFooter from "../components/GamePageComponents/GamePageFooter";
import styles from "./GamePage.module.css"
import {OpenVidu} from "openvidu-browser";
import {isReturningOnlyNull} from "eslint-plugin-react/lib/util/jsx.js";

function GamePage({viduToken}) {
  window.onbeforeunload = () => {
    leaveSession(); // 화면이동할때 LeaveSession
  }
  // 게임방 주소에 id 추가해서 리스트에서 들어가는 게임방마다 다른 경로로 가게 하기
  const { id } = useParams()
  // 여기서 connection

  // OpenViduSession Variables
  let OV = new OpenVidu();
  const [session, setSession] = useState();
  const [streamManagers, setStreamManagers] = useState([]);


  // User Info
  const [userId, setUserId] = useState();
  const [nickname, setNickname] = useState();

  // ViduChat
  const [chatHistory, setChatHistory] = useState([]);

  useEffect( () => {
    // Todo: get nickname & userId from accessToken
    const nickname = "ssafy";
    const userId = "ssafy@ssafy.com";

    setNickname(nickname);
    setUserId(userId);

    let mySession = OV.initSession();
    setSession(mySession);

    const addStreamManager = (streamManager) => {
      setStreamManagers(subs => [...subs, streamManager]);
    }

    const deleteStreamManager = (streamManager) => {
      setStreamManagers(subs => subs.filter(s => s !== streamManager));
    }

    const handleStreamCreated = (event) => {
      mySession.subscribeAsync(event.stream, undefined).then((streamManager) => {
        addStreamManager(streamManager);
      });
    };

    const handleChatSignal = (event) => {
      const chatData = JSON.parse(event.data);
      setChatHistory(prevHistory => [...prevHistory, chatData]);
    }

    mySession.on("streamCreated", handleStreamCreated);

    mySession.on("streamDestroyed", (event) => {
      deleteStreamManager(event.stream.streamManager);
    });

    mySession.on("signal:chat", handleChatSignal);

    mySession.on("exception", (exception) => {
      console.warn(exception);
    })

    const data = {
      nickname: nickname,
      id: id
    }

    mySession
      // .connect(viduToken, JSON.stringify(data))
      .connect(viduToken, data)
      .then(async () => {
        let publisher = OV.initPublisher(undefined, {
          audioSource: undefined,
          videoSource: undefined,
          publishAudio: true,
          publishVideo: true,
          resolution: '300x200',
          frameRate: 30,
          insertMode: 'APPEND',
          mirror: true,
        });

        await mySession.publish(publisher);
        addStreamManager(publisher);

      })
      .catch((error) => {
        console.warn(error)
      })
    return () => {
      window.onbeforeunload = () => {};
    }
  }, []);

  const leaveSession = () => {
    const mySession = session;
    if(mySession) {
      mySession.disconnect();
    }

    this.OV = null;
    setSession(undefined);
    setStreamManagers([]);
    window.location.reload();
  }

  const getSortedStreamManagers = (streamManagers) => {
    return [...streamManagers].sort((a, b) => a.stream.creationTime - b.stream.creationTime);
  }

    return (
        <>
            <div className={styles.container}>
                <GamePageHeader leaveSession={leaveSession}/>
                <GamePageMain streamManagers={getSortedStreamManagers(streamManagers)}/>
                <GamePageFooter chatHistory={chatHistory} setChatHistory={setChatHistory} session={session}/>
            </div>
        </>
    )
}

export default GamePage;