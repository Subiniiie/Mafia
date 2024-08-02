import React, {useEffect, useState, useRef} from "react";
import { useParams } from "react-router-dom";
import GamePageHeader from "../components/GamePageComponents/GamePageHeader";
import GamePageMain from "../components/GamePageComponents/GamePageMain";
import GamePageFooter from "../components/GamePageComponents/GamePageFooter";
import styles from "./GamePage.module.css"
import {OpenVidu} from "openvidu-browser";

function GamePage({token}) {
  window.onbeforeunload = () =>{
    leaveSession();
  }

  // OpenVidu Sessions
  let OV = new OpenVidu();
  const [session, setSession] = useState();
  const [mainStreamManager, setMainStreamManager] = useState();
  const [publisher, setPublisher] = useState();
  const [subscribers, setSubscribers] = useState([]);

  // User Info
  const [userId, setUserId] = useState();
  const [nickname, setNickname] = useState();

  useEffect(() => {
    // Todo: decode userId & nickname from accessToken
    const nickname = "ssafy";
    const userId = "ssafy@ssafy.com";

    setNickname(nickname);
    setUserId(userId);

    let mySession = OV.initSession();
    setSession(mySession);

    mySession.on("streamCreated", (event) => {
      mySession.subscribeAsync(event.stream, undefined).then((subscriber) => {
        setSubscribers((subs) => [subscriber, ...subs]);
      });
    });

    mySession.on("streamDestroyed", (event)=>{
      deleteSubscriber(event.stream.streamManager);
    });

    mySession.on("exception", (exception) => {
      console.warn(exception);
    });

    mySession
      .connect(token, {nickname: nickname, id})
      .then(() => {
        let publisher = OV.initPublisher(undefined, {
          audioSource: undefined,
          videoSource: undefined,
          publishAudio: true,
          publishVideo: true,
          resolution: '640x480',
          frameRate: 30,
          insertMode: 'APPEND',
          mirror: false,
        });

        mySession.publish(publisher);

        setMainStreamManager(publisher);
        setPublisher(publisher);
      })
      .catch((error) => {
        console.log(error)
      })
    return () => {
      window.onbeforeunload = () =>{};
    }
  },[]);

  const deleteSubscriber = (streamManager) => {
    setSubscribers ((subs) => {
      let index = subs.indexOf(streamManager, 0);
      if (index > -1) {
        subs.splice(index,1);
        return subs;
      }
      return subs;
    });
  };

  const leaveSession = () => {
    // 방장일경우

    // 유저일경우

    // OV properties 초기화
    OV = null;
    setSession(undefined);
    setSubscribers([]);
    setMainStreamManager(undefined);
    window.location.reload();
  }

  const handleMainVideoStream = (stream) => {
    if(mainStreamManager !== stream){
      setMainStreamManager(stream);
    }
  }

    // 게임방 주소에 id 추가해서 리스트에서 들어가는 게임방마다 다른 경로로 가게 하기
    const { id } = useParams()
    return (
        <>
            <div className={styles.container}>
                <GamePageHeader />
                <GamePageMain sessionId={id} token={token}/>
                <GamePageFooter />
            </div>
        </>
    )
}

export default GamePage;