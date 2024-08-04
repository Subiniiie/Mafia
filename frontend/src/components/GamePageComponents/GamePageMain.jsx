import axios from 'axios';
import React, {Component, useEffect, useState} from 'react';
import styles from "./GamePageMain.module.css"
import UserVideoComponent from "../openvidu/UserVideoComponent.jsx";

const GamePageMain = ({publisher, subscribers}) => {

    console.log(subscribers);

    return (
      <>
        <div id="container" className={styles.monitors}>
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
        </div>
      </>
    )
}

export default GamePageMain;