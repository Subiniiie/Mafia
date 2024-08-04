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
  const [mainStreamManager, setMainStreamManager] = useState();
  const [publisher, setPublisher] = useState();
  const [subscribers, setSubscribers] = useState([]);

  // User Info
  const [userId, setUserId] = useState();
  const [nickname, setNickname] = useState();

  useEffect( () => {
    // Todo: get nickname & userId from accessToken
    const nickname = "ssafy";
    const userId = "ssafy@ssafy.com";

    setNickname(nickname);
    setUserId(userId);

    let mySession = OV.initSession();
    setSession(mySession);

    const handleStreamCreated = (event) => {
      mySession.subscribeAsync(event.stream, undefined).then((subscriber) => {
        setSubscribers((subs) => [subscriber, ...subs]);
      });
    };

    mySession.on("streamCreated", handleStreamCreated);

    mySession.on("streamDestroyed", (event) => {
      deleteSubscriber(event.stream.streamManager);
    });

    mySession.on("exception", (exception) => {
      console.warn(exception);
    })

    const data = {
      nickname: nickname,
      id: id
    }

    mySession
      .connect(viduToken, JSON.stringify(data))
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

        mySession.publish(publisher);

        var devices = await this.OV.getDevices();
        var videoDevices = devices.filter(device => device.kind === 'videoinput');
        var currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
        var currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);

        publisher.videoSource = currentVideoDevice;

        setMainStreamManager(publisher);
        setPublisher(publisher);
      })
      .catch((error) => {
        console.warn(error)
      })
    return () => {
      window.onbeforeunload = () => {};
    }
  }, []);

  const deleteSubscriber = (streamManager) => {
    setSubscribers((subs) => {
      let index = subs.indexOf(streamManager, 0);
      if(index > -1) {
        subs.splice(index, 1);
        return subs;
      }
      return subs;
    });
  };

  const leaveSession = () => {
    const mySession = session;
    if(mySession) {
      mySession.disconnect();
    }

    this.OV = null;
    setSession(undefined);
    setSubscribers([]);
    setMainStreamManager(undefined);
    window.location.reload();
  }

    return (
        <>
            <div className={styles.container}>
                <GamePageHeader leaveSession={leaveSession}/>
                <GamePageMain publisher={publisher} subscribers={subscribers} />
                <GamePageFooter />
            </div>
        </>
    )
}

export default GamePage;