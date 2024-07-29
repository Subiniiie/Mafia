import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from "./components/Navbar"
import MainPage from './pages/MainPage'
import GameListPage from './pages/GameListPage'
import GamePage from './pages/GamePage'
import AchievementsPage from './pages/AchievementsPage'
import ProfilePage from './pages/ProfilePage'
import './App.css'
import PrivateRoute from "./routes/PrivateRoute.jsx";

function App() {
  // const [isLoggedIn] = useState(false);  // 로그인 상태를 여기에 맞게 설정하세요
  const [isLoggedIn, setIsLoggedIn] = useState(true);  // 로그인 상태를 여기에 맞게 설정하세요
  const username = "이현규";  // 로그인된 사용자의 이름
  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} username={username} />

        <Routes>
          <Route path='/' element={<MainPage />}></Route>
          <Route element={<PrivateRoute />}>
            <Route path='/game-list' element={<GameListPage />}></Route>
            <Route path={'/game-room/:id'} element={<GamePage />}></Route>
            <Route path='/achievements' element={<AchievementsPage />}></Route>
            <Route path='/profile' element={<ProfilePage />}></Route>
          </Route>
        </Routes>
    </>
  )
}

export default App