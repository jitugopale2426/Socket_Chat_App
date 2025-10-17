
import './App.css'
import { BrowserRouter as Router , Route, Routes } from 'react-router-dom'
import RegisterPage from './components/RegisterPage'
import LoginPage from './components/LoginPage'
import ChatPage from './components/ChatPage'
import { useState } from 'react'

function App() {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  return (
    <>
    <Router>
      <Routes>
         <Route path='/' element={<RegisterPage/>}/>
         <Route path='/login' element={<LoginPage setUser={setUser} setToken={setToken}/>}/>
         <Route path='/chat' element={<ChatPage setUser={setUser} setToken={setToken}/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
