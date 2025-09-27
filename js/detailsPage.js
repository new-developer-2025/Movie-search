import { fetchMovieDetails } from "./api.js";
import { renderMovieDetails } from "./render.js";

// init
export async function initDetailsPage(containerId) {
  const resultsContainer = document.getElementById(containerId);
  resultsContainer.classList.add("results");

  const params = new URLSearchParams(window.location.search);
  const movieId = params.get("id");

  if (!movieId) {
    resultsContainer.textContent = "Movie ID not found.";
    return;
  }

  try {
    const movie = await fetchMovieDetails(movieId);
    renderMovieDetails(movie, resultsContainer);
  } catch (err) {
    resultsContainer.textContent = `Error: ${err.message}`;
  }
}
