import { useState, useEffect } from 'react';
import { fetchMovies } from './Data';
import { Card, Button} from 'react-bootstrap';
import { useNavigate, link } from 'react-router-dom';
import { useAuth } from './Contexts/AuthContext';
import NavBar from './NavBar';
export default function DashBoard() {
    const { userid} = useAuth();
    const navigate = useNavigate();
    const [movies, setMovies] = useState(null);
    const [search, setSearch] = useState("");
    const changeHandler = (e) => {
        setSearch(e.target.value);
    }
    useEffect(() => {
        if (userid) {
            const  results  = fetchMovies();
            setMovies(results);
        }
    },[userid]);
    const SearchAlgo = (movie) => {
        if (movie.title.toLowerCase().indexOf(search) != -1 || movie.description.toLowerCase().indexOf(search)!=-1) {
            return true;
        }
        for (var i = 0; i < movie.genres.length; i++) {
            if (movie.genres[i].name.toLowerCase().indexOf(search) == 0) {
                return true;
            }
        }
        return false;
    }
    if (userid) {
        return (
            <>
                <NavBar/>
                <input type="text" className='form-control-lg ' value={search} onChange={changeHandler} style={{ marginLeft: "25%", width: "50vw", marginTop: "2vw" }} placeholder='Search by Genre or Title'></input>
                {
                    movies ?
                        <div className="grid-movies">
                            {
                                movies.map((movie) => {
                                    return SearchAlgo(movie) ?
                                        <Card key={movie._id} className='card m-1 movie-card' onClick={(e) => { e.preventDefault(); navigate("/movies/" + movie._id) }}>
                                            <img src={movie.image} style={{ height: "100%" }}></img>
                                        </Card> : null
                                })}
                        </div> : <h1 className='loading'>Loading</h1>
                }
            </>
        )
    }
    else {
        return <h1 style={{ textAlign: "center" }}>SignIn to Access this Page</h1>
    }
}
