import './App.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter, Route, Routes } from "react-router-dom"
import DefaultLayout from './pages/DefaultLayout'
import MainComponent from './pages/MainComponent'
import DetailPage from './pages/DetailPage'
import { GlobalProvider } from "./context/GlobalContext"
import WatchlistPage from './pages/Watchlist';

function App() {

  return (
    <GlobalProvider>
      <BrowserRouter>
        <Routes>
          <Route Component={DefaultLayout}>
            <Route path='/' Component={MainComponent} />
            <Route path='/:type/:id' Component={DetailPage} />
            <Route path='/watchlist' Component={WatchlistPage}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  )
}

export default App
