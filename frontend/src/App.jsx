import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import axios from 'axios'
// import jwt_decode from 'jwt-decode'
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
  const [viduToken, setViduToken] = useState(''); // OpenVidu Session 참여 관련 Token
  const [state, setState] = useState({}); //OpenVidu Session Status

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // 여기서 토큰을 디코딩하거나 백엔드에서 사용자 정보를 가져올 수 있습니다.
      setIsLoggedIn(true)
      setName('이현규') // 실제 사용자 이름을 설정합니다.
      console.log(token) // undefined

      // try {
      //   const decodedToken = jwt_decode(token)
      //   setName(decodedToken.name)
      //   setIsLoggedIn(true)

      //   // 또는 백엔드에서 사용자 정보를 가져올 수 있습니다.
      //   // fetchUserData(token)
      // } catch (error) {
      //   console.error('Failed to decode token:', error)
      // }
    }
  }, [])


  const handleLoginSuccess = (name) => {
    setIsLoggedIn(true)
    setName(name)
  }

  return (
    // <BrowserRouter>
    <>
      <Navbar isLoggedIn={isLoggedIn} name={name} onLoginSuccess={handleLoginSuccess} />

      <Routes>
        <Route path='/' element={<MainPage />}></Route>
        <Route path='/game-list' element={<GameListPage setViduToken={setViduToken} setState={setState}/>}></Route>
        <Route path={'/game-room/:id'} element={<GamePage viduToken={viduToken} setState={setState}/>}></Route>
        <Route path='/achievements' element={<AchievementsPage />}></Route>
        <Route path='/profile' element={<ProfilePage />}></Route>
      </Routes>
      {/* </BrowserRouter> */}
    </>
  )
}

export default App

