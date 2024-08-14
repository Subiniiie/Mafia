import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import axios from 'axios'
// import jwt_decode from 'jwt-decode'
import { decode } from "jwt-js-decode";
import Navbar from "./components/Navbar"
import MainPage from './pages/MainPage'
import GameListPage from './pages/GameListPage'
import GamePage from './pages/GamePage'
import AchievementsPage from './pages/AchievementsPage'
import ProfilePage from './pages/ProfilePage'
import './App.css'


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [name, setName] = useState('') // 로그인된 사용자의 이름
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [viduToken, setViduToken] = useState("");

  useEffect(() => {
    const access = localStorage.getItem('access')
    const refresh = localStorage.getItem('refresh')

    if (access && refresh) {
      const decodedAccess = decode(access)
      const currentTime = Math.floor(Date.now() / 1000)
      console.log('currentTime :', currentTime)
      console.log('exp :', decodedAccess.payload.exp)

      if (decodedAccess.payload.exp < currentTime) {
        // 가짜로 만료된 척 하는 중...
        // if (1722826419 < currentTime) {
        // Access token이 만료된 경우
        console.log('Access token expired. Attempting to refresh token...')
        refreshToken(access, refresh)
        console.log('reissue 성공!')
      } else {
        // Access token이 유효한 경우
        setIsLoggedIn(true)
        const { username } = decodedAccess.payload
        setName(username)
      }
    }
  }, [])

  const refreshToken = async (accessToken, refreshToken) => {
    // const cookies = new Cookies();
    try {
      console.log('reissue 해볼게용')

      const body = {
        access: accessToken,
        refresh: refreshToken
      }

      const response = await axios.post('http://localhost:8080/api/reissue', JSON.stringify(body), {
        headers: {
          "Content-Type": "application/json",
        },
        // headers: {
        //   "Authorization": `Bearer ${accessToken}`,
        //   'X-Access-Token': refreshToken
        //   // "Cookie": `Access=${accessToken}; Refresh=${refreshToken}`,
        // },
        withCredentials: true // 필요 시 추가: 이 옵션을 추가하면 쿠키가 포함된 요청을 서버로 보낼 수 있음
      })
      const { access, refresh } = response.data
      localStorage.setItem('access', access)
      localStorage.setItem('refresh', refresh)
      const decodedAccess = decode(access)
      const { username } = decodedAccess.payload
      setName(username)
      setIsLoggedIn(true)
    } catch (error) {
      console.error('Failed to refresh token:', error)
      setIsLoggedIn(false)
    }
  }

  const handleLoginSuccess = (username) => {
    setIsLoggedIn(!isLoggedIn)
    setName(username)
  }

  const toggleSpeaker = () => {
    setIsSpeakerOn(prev => !prev)
  }

  return (
    // <BrowserRouter>
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        name={name}
        onLoginSuccess={handleLoginSuccess}
        isSpeakerOn={isSpeakerOn}
        toggleSpeaker={toggleSpeaker}
      />

      <Routes>
        <Route path='/' element={<MainPage isLoggedIn={isLoggedIn} isSpeakerOn={isSpeakerOn} />}></Route>
        <Route path='/game-list' element={<GameListPage isSpeakerOn={isSpeakerOn} />}></Route>
        <Route path={'/game-room/:roomId'} element={<GamePage isSpeakerOn={isSpeakerOn} />}></Route>
        <Route path='/achievements' element={<AchievementsPage isSpeakerOn={isSpeakerOn} />}></Route>
        <Route path='/profile' element={<ProfilePage isSpeakerOn={isSpeakerOn} />}></Route>
      </Routes>
      {/* </BrowserRouter> */}
    </>
  )
}

export default App

