import { discoverTVmaze } from "./api.js";

// escape helper
function escapeUser(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// show results
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
      <h3>${escapeUser(show.name)}</h3>
      <p><strong>Genres:</strong> ${escapeUser(show.genres)}</p>
    `;
    fragment.appendChild(card);
  });

  resultsContainer.appendChild(fragment);
}

// get URL from 
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const genre = params.get("genre");
  const resultsContainer = document.getElementById("results");

  if (!genre) {
    resultsContainer.textContent = "No genre selected.";
    return;
  }

  resultsContainer.textContent = `Loading ${genre} shows...`;

  try {
    const shows = await discoverTVmaze(genre);
    renderTVmazeShows(shows, resultsContainer);
  } catch (error) {
    console.error("Error fetching TVmaze data:", error);
    resultsContainer.textContent = "Failed to load shows.";
  }
});
