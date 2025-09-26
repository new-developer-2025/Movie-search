import { fetchMovieDetails } from "./api.js";
import { renderMovieDetails } from "./render.js";4
import { renderResults } from "./render.js";
// resultsContainer
const resultsContainer = document.getElementById("results");
resultsContainer.classList.add("results");
// init
async function init() {
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

init();
