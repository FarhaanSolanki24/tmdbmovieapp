import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {

    const API_KEY = "4755bfd52ed699ba65ceafa0d34e55d2";

    const { sessionId, accountId } = useContext(AuthContext)
    const [favorites, setFavorites] = useState([])

    useEffect(() => {
        if (accountId && sessionId) {
            fetchFavorites()
        }
    }, [accountId, sessionId])

    const fetchFavorites = async () => {
        try {
            const [moviesRes, tvRes] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/account/${accountId}/favorite/movies`, {
                    params: { session_id: sessionId, api_key: API_KEY }
                }),
                axios.get(`https://api.themoviedb.org/3/account/${accountId}/favorite/tv`, {
                    params: { session_id: sessionId, api_key: API_KEY }
                })
            ]);
            
            const movies = moviesRes.data.results.map(m => ({ ...m, media_type: "movie" }));
            const tv = tvRes.data.results.map(t => ({ ...t, media_type: "tv" }));

            setFavorites([...movies, ...tv]);
        } catch (error) {
            console.log("Error fetching favorites", error);
        }
    };

    const toggleFavorite = async (mediaId, mediaType, isFav) => {
        try {
            await axios.post(`https://api.themoviedb.org/3/account/${accountId}/favorite`,
                {
                    media_type: mediaType,
                    media_id: mediaId,
                    favorite: !isFav
                },
                { params: { session_id: sessionId, api_key: API_KEY } }
            )
            fetchFavorites()
        } catch (error) {
            console.log("Error Updating Favorites", error)
        }
    }

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    )
}