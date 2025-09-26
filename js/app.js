// app.js
import { loadGenres, searchMovies } from "./api.js";
import { renderResults } from "./render.js";
// Dom elements
const form = document.querySelector("#search-form");
const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("results");
const errorMessage = document.getElementById("error-message");
const loader = document.getElementById("loader");

let genreMap = {};
// showLoader
function showLoader(show) {
  loader.style.display = show ? "block" : "none";
}
// init
async function init() {
  genreMap = await loadGenres();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMessage.textContent = "";
    const query = searchInput.value.trim();

    if (!query) {
      errorMessage.textContent = "Please enter a movie name.";
      return;
    }

    showLoader(true);
    try {
      const data = await searchMovies(query);
      renderResults(data.results, genreMap, resultsContainer);
    } catch (err) {
      errorMessage.textContent = `Error: ${err.message}`;
    } finally {
      showLoader(false);
    }
  });
}

init();
