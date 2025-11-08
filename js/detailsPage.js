import { fetchMovieDetails } from "./api.js";
import { renderMovieDetails } from "./render.js";
import { genreDesign } from "./genreDesign.js";
const { manageInfo, params, movieId } = genreDesign();

// initDetailsPage
export async function initDetailsPage() {
  const resultsContainer = document.getElementById("results");
  resultsContainer.classList.add("results");

  genreDesign(manageInfo, params);

  try {
    genreDesign();
    const movie = await fetchMovieDetails(movieId);
    renderMovieDetails(movie, resultsContainer);
  } catch (err) {
    resultsContainer.textContent = `Error: ${err.message}`;
  }

  if (!movieId) {
    resultsContainer.textContent = "Movie ID not found.";
    return;
  }
}
