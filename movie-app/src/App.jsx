import HomePage from './pages/HomePage'
import DetailsPage from './pages/DetailsPage'
import Header from './layout/Header'
import Movies from './pages/Movies'
import TvShows from './pages/TvShows'
import Favorites from './pages/Favorites'
import Upcoming from './pages/Upcoming'
import MovieDetails from './pages/MovieDetails'
import TvDetails from './pages/TvDetails'
import UpcomingDetails from './pages/UpcomingDetails'
import Login from './pages/Login'
import SearchPage from './layout/SearchPage'
import ProtectedRoutes from './protectedRoutes/ProtectedRoutes'

import { BrowserRouter, Routes, Route } from 'react-router-dom'


function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path='/home' element={<HomePage />} />
                <Route path='/details/:type/:id' element={<DetailsPage />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/tvshows" element={<TvShows />} />
                <Route path="/upcoming" element={<Upcoming />} />
                <Route path='/favorites' element={
                    <ProtectedRoutes>
                        <Favorites />
                    </ProtectedRoutes>
                } />
                <Route path='/movie/:id' element={<MovieDetails />} />
                <Route path='/tvshow/:id' element={<TvDetails />} />
                <Route path='/upcoming/:id' element={<UpcomingDetails />} />
                <Route path='/login' element={<Login />} />
                <Route path='/search' element={<SearchPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
