
import { loadGenres, searchMovies } from "./api.js";
import { renderResults } from "./render.js";
// Dom elements
const form = document.querySelector("#search-form");
const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("results");
const errorMessage = document.getElementById("error-message");
const loader = document.getElementById("loader");
// dropdownContent
const dropdownContent = document.getElementById("dropdown-content");


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
// searchInput
searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim();
  dropdownContent.innerHTML = "";

  if (query.length < 2) {
    dropdownContent.style.display = "none";
    return;
  }

  try {
    const res = await fetch(
      `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`
    );
    if (!res.ok) throw new Error("Failed to fetch shows");
    const data = await res.json();

    if (data.length === 0) {
      dropdownContent.style.display = "none";
      return;
    }

    // for fill all items
    data.forEach((item) => {
      const option = document.createElement("div");
      option.className = "dropdown-item";
      option.textContent = item.show.name;

      // when i want to clik item go to details page
      option.addEventListener("click", () => {
        searchInput.value = item.show.name;
        dropdownContent.innerHTML = "";
        dropdownContent.style.display = "none";

        // redirect id and go to details page
        window.location.href = `movie-details.html?id=${item.show.id}`;
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
