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
// discoverTVmaze for get data
export async function discoverTVmaze(genre) {
  const response = await fetch(
    `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(genre)}`
  );

  if (!response.ok) throw new Error("Failed to fetch shows");

  const data = await response.json();

  return data.map((item) => ({
    name: item.show.name,
    image: item.show.image?.medium || "../images/placeholder.png",
    genres: item.show.genres?.join(", ") || "Unknown",
    summary: item.show.summary?.slice(0, 130) || "No summary available",
  }));
}
//  Open a second page in a new tab
export function openGenrePage(genre) {
  const url = `genres-list-page.html?genre=${encodeURIComponent(genre)}`;
  window.open(url, "_blank");
  // window.location.href = url;
}
