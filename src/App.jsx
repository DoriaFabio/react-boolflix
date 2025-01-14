// import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import DefaultLayout from './pages/DefaultLayout'
import MainComponent from './pages/MainComponent'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route Component={DefaultLayout}>
            <Route path='/' Component={MainComponent} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
