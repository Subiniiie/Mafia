import axios from 'axios';
import React, {Component, useEffect, useState} from 'react';
import styles from "./GamePageMain.module.css"
import UserVideoComponent from "../openvidu/UserVideoComponent.jsx";

const GamePageMain = ({streamManagers}) => {

    console.log(streamManagers);

    return (
      <>
        {/* <div id="container" className={styles.monitors}>
            {publisher !== undefined ? (
              <div className={styles.streamContainer}
              >
                  <UserVideoComponent
                      streamManager={publisher}
                  />
              </div>
            ):null}
            {subscribers.map((sub,i) => (
              <div key={i}
              className={styles.streamContainer}
              >
                  <UserVideoComponent streamManager={sub} />
              </div>
            ))}
        </div> */}
        <div id="container" className={styles.monitors}>
            {streamManagers.map((sub,i) => (
              <div key={sub.id}
              className={styles.streamContainer}
              >
                  <UserVideoComponent streamManager={sub} />
              </div>
            ))}
        </div>
      </>
    )
}

export default GamePageMain;