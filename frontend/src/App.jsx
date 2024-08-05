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
  // const [isLoggedIn, setIsLoggedIn] = useState(true); // 로그인 상태
  const [name, setName] = useState('') // 로그인된 사용자의 이름

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
      } else {
        // Access token이 유효한 경우
        setIsLoggedIn(true)
        const { username } = decodedAccess.payload
        setName(username)
      }
    }
  }, [])

  const refreshToken = async (accessToken, refreshToken) => {
    try {
      console.log('refresh 해볼게용')
      console.log('access :', accessToken)
      console.log('refresh :', refreshToken)
      const response = await axios.post('https://i11e106.p.ssafy.io/api/reissue', {}, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          'X-Refresh-Token': refreshToken
          // "Cookie": `Access=${accessToken}; Refresh=${refreshToken}`,
        },
        withCredentials: true // 필요 시 추가: 이 옵션을 추가하면 쿠키가 포함된 요청을 서버로 보낼 수 있음
      })
      if (response) {
        console.log('response 가 있긴 있음 :', response)
      }
      // console.log('새로운 response.data 출력해볼게 :', response.data)
      const { access, refresh } = response.data
      localStorage.setItem('access', access)
      localStorage.setItem('refresh', refresh)
      const decodedAccess = decode(access)
      const { username } = decodedAccess.payload
      setName(username)
      setIsLoggedIn(true)
      // } catch (error) {
      //   console.error('Failed to refresh token:', error)
      //   setIsLoggedIn(false)
      console.log('response.data :', response.data)
    } catch (error) {
      // console.log('또 error 인데용... 일단 response.data 출력해볼게용...')
      // console.log(response.data)
      if (error.response) {
        // 서버가 2xx 외의 상태 코드를 반환한 경우
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        // 요청이 만들어졌지만 응답을 받지 못한 경우
        console.error('Error request:', error.request);
      } else {
        // 요청을 설정하는 중에 문제가 발생한 경우
        console.error('Error message:', error.message);
      }
      console.error('Error config:', error.config);
      setIsLoggedIn(false);
    }
  }

  const handleLoginSuccess = (username) => {
    setIsLoggedIn(true)
    setName(username)
  }


  return (
    // <BrowserRouter>
    <>
      <Navbar isLoggedIn={isLoggedIn} name={name} onLoginSuccess={handleLoginSuccess} />

      <Routes>
        <Route path='/' element={<MainPage />}></Route>
        <Route path='/game-list' element={<GameListPage />}></Route>
        <Route path={'/game-room/:id'} element={<GamePage />}></Route>
        <Route path='/achievements' element={<AchievementsPage />}></Route>
        <Route path='/profile' element={<ProfilePage />}></Route>
      </Routes>
      {/* </BrowserRouter> */}
    </>
  )
}

export default App

