import { API_KEY } from "./config.js";
import { fetchMovieDetails } from "./api.js";
import { renderMovieDetails } from "./render.js";
import { genreDesign } from "./genreDesign.js";
import { discoverTVmaze } from "./api.js";

const { manageInfo, params, movieId } = genreDesign();

// escape HTML
function escapeUser(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// collectionData
export async function collectionData() {
  try {
    genreDesign();
    const movie = await fetchMovieDetails(movieId);
    renderMovieDetails(movie, params, manageInfo);
  } catch (error) {
    manageInfo.textContent = `Error: ${error.message}`;
  }

  if (!movieId) {
    manageInfo.textContent = "Movie ID not found.";
    return;
  }
}

// loadMovieDetails
export async function loadMovieDetails() {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
    );
    if (!response.ok)
      throw new Error(`${response.status} ${response.statusText}`);
    const movie = await response.json();
    // posterPath
    const posterPath = movie.poster_path
      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
      : "../images/placeholder.png";

    // genres
    const genres =
      movie.genres && movie.genres.length > 0
        ? movie.genres.map((g) => g.name).join(", ")
        : "Unknown";

    manageInfo.innerHTML = `
      <img src="${escapeUser(posterPath)}" alt="${escapeUser(
      movie.title
    )}" class="picture-style"/>
      <div>
        <p class="genres"><strong class="letter-color">Genres:</strong> ${genres}</p>
        <p class="overview"><strong class="letter-color">Overview:</strong> ${
          movie.overview
        }</p>
        <p class="release top-position"><strong class="letter-color">Release:</strong> ${
          movie.release_date
        }</p>
      </div>
    `;
  } catch (error) {
    console.error(error);
  }
}

// renderTVmazeShows
function renderTVmazeShows(shows, resultsContainer) {
  resultsContainer.textContent = "";

  if (!shows.length) {
    resultsContainer.textContent = "No shows found for this genre.";
    return;
  }

  const fragment = document.createDocumentFragment();

  shows.forEach((show) => {
    const card = document.createElement("div");
    card.className = "tv-show-card";
    card.innerHTML = `
      <img src="${escapeUser(show.image)}" alt="${escapeUser(
      show.name
    )}" class="picture-style" />
      <h3>${escapeUser(show.name)}</h3>
      <p><strong>Genres:</strong> ${escapeUser(show.genres)}</p>
      <p>${show.summary}</p>
    `;
    fragment.appendChild(card);
  });

  resultsContainer.appendChild(fragment);
}

// dropdown event (optional)
document.addEventListener("DOMContentLoaded", () => {
  const dropdownItems = document.querySelectorAll(".dropdown-list a");

  dropdownItems.forEach((item) => {
    item.addEventListener("click", async (event) => {
      event.preventDefault();
      const genre = event.target.textContent.trim();
      manageInfo.textContent = `Loading ${genre} shows...`;

      try {
        const shows = await discoverTVmaze(genre);
        renderTVmazeShows(shows, manageInfo);
      } catch (error) {
        console.error("Error fetching TVmaze data:", error);
        manageInfo.textContent = "Failed to load shows. Please try again.";
      }
    });
  });
});
