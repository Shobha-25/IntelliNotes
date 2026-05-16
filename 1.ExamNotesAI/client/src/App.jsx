import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home';
import Auth from './pages/Auth';
import History from './pages/History';
import Notes from './pages/Notes';
import Pricing from './pages/Pricing'

import { getCurrentUser } from './services/api';
import { useDispatch, useSelector } from 'react-redux'

export const serverUrl = "https://mern-stack-ai.onrender.com"

 
function App() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() =>{
    getCurrentUser(dispatch).finally(() => setLoading(false))
  }, [dispatch])

  const {userData} = useSelector((state)=>state.user)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <>
    <Routes>
      <Route path='/' element={userData ? <Home/> : <Navigate to="/auth" replace/>}/>
      <Route path='/auth' element={userData ? <Navigate to="/" replace/> : <Auth/>}/>
      <Route path='/history' element={userData? <History/> : <Navigate to="/auth" replace/>}/>
      <Route path='/notes' element={userData? <Notes/> : <Navigate to="/auth" replace/>}/>
      <Route path='/pricing' element={userData? <Pricing/> : <Navigate to="/auth" replace/>}/>
    </Routes>

    </>
  )
}

export default App

/*import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import { getCurrentUser } from './services/api';
import { useDispatch, useSelector } from 'react-redux';

export const serverUrl = "http://localhost:8000"

function App() {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getCurrentUser(dispatch).finally(() => setLoading(false))
    }, [dispatch])

    const { userData } = useSelector((state) => state.user)

    if (loading) return null  // or a spinner

    return (
        <>
            <Routes>
                <Route path='/' element={userData ? <Home/> : <Navigate to="/auth" replace/>}/>
                <Route path='/auth' element={userData ? <Navigate to="/" replace/> : <Auth/>}/>
            </Routes>
        </>
    )
}

export default App*/





/*import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import { getCurrentUser } from './services/api';
import { useDispatch, useSelector } from 'react-redux';

export const serverUrl = "http://localhost:8000"

function App() {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const { userData } = useSelector((state) => state.user)

    useEffect(() => {
        const fetchUser = async () => {
            await getCurrentUser(dispatch)
            setLoading(false)
        }
        fetchUser()
    }, [dispatch])

    if (loading) return (
        <div className="min-h-screen flex items-center 
        justify-center bg-white">
            <div className="w-8 h-8 border-4 border-black 
            border-t-transparent rounded-full animate-spin">
            </div>
        </div>
    )

    return (
        <>
            <Routes>
                <Route path='/' 
                    element={userData 
                        ? <Home/> 
                        : <Navigate to="/auth" replace/>}
                />
                <Route path='/auth' 
                    element={userData 
                        ? <Navigate to="/" replace/> 
                        : <Auth/>}
                />
            </Routes>
        </>
    )
}

export default App*/


