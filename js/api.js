import { API_KEY, BASE_URL } from "./config.js";
// loadGenres
export async function loadGenres() {
  try {
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
    );
    const data = await response.json();
    const genreMap = {};
    data.genres.forEach((g) => {
      genreMap[g.id] = g.name;
    });
    return genreMap;
  } catch (error) {
    console.error("Error loading genres:", error);
    return {};
  }
}
// searchMovies
export async function searchMovies(query) {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}`
  );
  if (!response.ok) throw new Error("Failed to fetch movies");
  return response.json();
}
// fetchMovieDetails
export async function fetchMovieDetails(movieId) {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
  );
  if (!response.ok) throw new Error("Failed to fetch details");
  return response.json();
}
// search TVmaze shows
export async function searchShows(query) {
  const res = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Failed to fetch shows");
  return res.json(); // returns an array
}


