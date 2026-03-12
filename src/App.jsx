import './App.css'
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter, Route, Routes } from "react-router-dom"
import DefaultLayout from './pages/DefaultLayout'
import DetailPage from './pages/DetailPage'
import { GlobalProvider } from "./context/GlobalContext"
import WatchlistPage from './pages/Watchlist';
import Favourites from './pages/Favourites';
import Homepage from './pages/Homepage'
import NotFound from './pages/NotFound'
import ErrorBoundary from './components/ErrorBoundary'

function App() {

  return (
    <GlobalProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route Component={DefaultLayout}>
              <Route path='/' Component={Homepage} />
              <Route path='/:type/:id' Component={DetailPage} />
              <Route path='/watchlist' Component={WatchlistPage}/>
              <Route path='/favourites' Component={Favourites}/>
              <Route path='*' Component={NotFound}/>
            </Route>
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </GlobalProvider>
  )
}

export default App
