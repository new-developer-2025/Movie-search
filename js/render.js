import { IMAGE_BASE } from "./config.js";

// createPosterImg
function createPosterImg(movie, { width = 300, height = 450 } = {}) {
  const img = document.createElement("img");

  const placeholder =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9ImNlbnRyYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNHB4Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";

  const src = movie?.poster_path
    ? `${IMAGE_BASE}${movie.poster_path}`
    : placeholder;

  img.src = src;
  img.alt = movie?.title || "Poster";
  img.width = width;
  img.height = height;
  img.loading = "lazy";
  img.decoding = "async";

  // Responsive images using known TMDB sizes if poster exists
  if (movie?.poster_path) {
    const TMDB_BASE_ROOT = "https://image.tmdb.org/t/p/";
    // img
    img.srcset = [
      `${TMDB_BASE_ROOT}w92${movie.poster_path} 92w`,
      `${TMDB_BASE_ROOT}w154${movie.poster_path} 154w`,
      `${TMDB_BASE_ROOT}w342${movie.poster_path} 342w`,
      `${TMDB_BASE_ROOT}w500${movie.poster_path} 500w`,
      `${TMDB_BASE_ROOT}w780${movie.poster_path} 780w`,
    ].join(", ");
    img.sizes = "(max-width: 600px) 50vw, 300px";
    img.classList.add("res-img");
  }

  img.onerror = () => {
    img.onerror = null;
    img.removeAttribute("srcset");
    img.removeAttribute("sizes");
    img.src = placeholder;
  };
  
  return img;
}
// renderResults for TMDB
export function renderResults(movies, genreMap, resultsContainer) {
  resultsContainer.textContent = "";

  if (!movies.length) {
    resultsContainer.textContent = "No movies found.";
    resultsContainer.classList.add("error");
    return;
  }

  movies.forEach((movie) => {
    // card
    const card = document.createElement("div");
    card.className = "movie-card";
    // Poster
    const poster = createPosterImg(movie);
    // section
    const section = document.createElement("section");
    section.classList.add("bg-black");
    // title
    const title = document.createElement("h3");
    title.classList.add("title-video");
    title.textContent = movie.title;
    // genres
    const genres = document.createElement("p");
    genres.classList.add("movie-genre");
    genres.textContent = movie.genre_ids?.length
      ? movie.genre_ids.map((id) => genreMap[id]).join("/  ")
      : "Unknown genres";

    section.appendChild(title);
    section.appendChild(genres);

    // ratingStar
    const ratingStar = document.createElement("img");
    ratingStar.src = "../images/Star.svg";
    ratingStar.classList.add("ratingStar");
    // Add View Info button
    const viewInfoBtn = document.createElement("button");
    viewInfoBtn.className = "view-info-btn";
    viewInfoBtn.innerHTML = `
      <a href="movie-details.html?id=${movie.id}" class="view-info-link">
        View Info
      </a>
    `;
    // actionRow
    const actionRow = document.createElement("div");
    actionRow.classList.add("action-row");

    // voteAverage
    const voteAverage = document.createElement("p");
    voteAverage.classList.add("vote-average");
    voteAverage.textContent = `${movie.vote_average}`;

    card.appendChild(poster);
    card.appendChild(section);
    actionRow.appendChild(ratingStar);
    actionRow.appendChild(voteAverage);
    actionRow.appendChild(viewInfoBtn);
    resultsContainer.appendChild(card);
    // add to the card
    card.appendChild(actionRow);
  });
}
// renderMovieDetails
export function renderMovieDetails(movie, resultsContainer) {
  resultsContainer.textContent = "";

  // Add backButton
  const backButton = document.createElement("button");
  backButton.className = "back-btn";
  backButton.innerHTML = `
      <a href="index.html" class="back-link">
        Back to Search
      </a>
    `;
  // section
  const section = document.createElement("section");
  section.classList.add("movie-details");

  // poster
  const poster = createPosterImg(movie, { width: 300, height: 450 });
  poster.classList.add("picture-style");

  // genres
  const genres = document.createElement("div");
  genres.classList.add("genres");

  // genresText
  const genresText =
    movie.genres?.map((g) => g.name).join("  ") || "Unknown genres";
  genres.innerHTML = `<p><span class="letter-color">Genre </span>${genresText}</p>`;

  // overview
  const overview = document.createElement("div");
  overview.innerHTML = `<p><span class="letter-color">overview </span>${movie.overview}</p>`;
  overview.classList.add("overview");

  // release
  const release = document.createElement("div");
  release.innerHTML = `<p>Release: ${movie.release_date}</p>`;
  release.classList.add("release");

  section.appendChild(poster);
  section.appendChild(genres);
  section.appendChild(overview);
  section.appendChild(release);
  resultsContainer.appendChild(section);
}
