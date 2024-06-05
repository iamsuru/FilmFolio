import React from 'react'
import Header from './components/Header'
import Login from './components/Login'
import './App.css'
import Signup from './components/Signup'
import { Route, Routes } from 'react-router-dom'
import Homepage from './components/Homepage'
import PlaylistShower from './components/PlaylistShower'
import SharedPlaylist from './components/Shared/SharedPlaylist'

import SearchResult from './components/SearchResult'
import ResetPassword from './components/ResetPassword'

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path='*' element={<Login />} />
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/homepage' element={<Homepage />} />
        <Route path='/my-playlist' element={<PlaylistShower />} />
        <Route path='/shared-playlist' element={<SharedPlaylist />} />
        <Route path='/search-result' element={<SearchResult />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
    </>
  )
}

export default App