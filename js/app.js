import { loadGenres, searchMovies } from "./api.js";
import { renderResults } from "./render.js";

// Dom elements
const form = document.querySelector("#search-form");
const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("results");
const errorMessage = document.getElementById("error-message");
const loader = document.getElementById("loader");
const dropdownContent = document.getElementById("dropdown-content");

// escapeHTML
function escapeUser(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// genreMap
let genreMap = {};
// showLoader
function showLoader(show) {
  loader.style.display = show ? "block" : "none";
}
// init
async function init() {
  // genreMap
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
// searchInput
searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim();
  dropdownContent.innerHTML = "";

  if (query.length < 2) {
    dropdownContent.style.display = "none";
    return;
  }

  try {
    // data
    const data = await searchMovies(query);
    if (!data.results.length) {
      dropdownContent.style.display = "none";
      return;
    }
    // for fill all items
    data.results.slice(0, 4).forEach((movie) => {
      const option = document.createElement("a");
      option.className = "dropdown-item";
      // posterPath
      const posterPath = movie.poster_path
        ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
        : "../images/placeholder.png";
      // genres
      const genres = movie.genre_ids?.length
        ? movie.genre_ids.map((id) => genreMap[id]).join(" ")
        : "Unknown";
      // genres
      option.innerHTML = `
        <div class="dropdown-movie">
        <img src=${escapeUser(posterPath)}" alt="${escapeUser(
        movie.title
      )}" class="dropdown-poster"/>
          <div class="dropdown-info">
            <p class="movie-title">${movie.title}</p>
            <p class="movie-genres">${genres}</p>
          </div>
        </div>
      `;
      // when i want to clik item go to details page
      option.addEventListener("click", () => {
        // searchInput.value = item.show.name;
        searchInput.value = movie.title;
        dropdownContent.innerHTML = "";
        dropdownContent.style.display = "none";
        // redirect to details page with TMDB movie id
        window.location.href = `genres.html?id=${movie.id}`;
        
      });
      dropdownContent.appendChild(option);
    });
    // open dropdown menu
    dropdownContent.style.display = "block";
  } catch (err) {
    console.error(err);
    dropdownContent.style.display = "none";
  }
});

// when i want to close dropdown menu
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-box")) {
    dropdownContent.style.display = "none";
  }
});
