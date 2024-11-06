const API_KEY = "8de232a8599962d748e3f0e7ecc228a9";
const BASE_URL = `https://api.themoviedb.org/3`;

export function getMovies() {
  return fetch(`${BASE_URL}/movie/nowplaying?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}
