import { IMAGE_BASE } from "./config.js";

// Helper: create elements for properties
function createElement(tag, options = {}) {
  const element = document.createElement(tag);
  const { className, text, html, attrs, children } = options;

  if (className) element.className = className;
  if (text) element.textContent = text;
  if (html) element.innerHTML = html;
  if (attrs)
    Object.entries(attrs).forEach(([k, v]) => element.setAttribute(k, v));
  if (children) children.forEach((child) => element.appendChild(child));

  return element;
}

// Helper: create img with poster
function createPosterImg(movie, { width = 300, height = 450 } = {}) {
  const img = document.createElement("img");

  const placeholder =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9ImNlbnRyYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNHB4Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";

  const src = movie?.poster_path
    ? `${IMAGE_BASE}${movie.poster_path}`
    : placeholder;

  Object.assign(img, {
    src,
    alt: movie?.title || "Poster",
    width,
    height,
    loading: "lazy",
    decoding: "async",
  });

  if (movie?.poster_path) {
    const TMDB_BASE_ROOT = "https://image.tmdb.org/t/p/";
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
    img.removeAttribute("srcset");
    img.removeAttribute("sizes");
    img.src = placeholder;
  };

  return img;
}

// Component: for film cart
function createMovieCard(movie, genreMap) {
  const poster = createPosterImg(movie);
  const title = createElement("h3", {
    className: "title-video",
    text: movie.title,
  });

  const genreText =
    movie.genre_ids?.map((id) => genreMap[id]).join(" ") || "Unknown genres";
    
  const genres = createElement("p", {
    className: "movie-genre",
    text: genreText,
  });

  const section = createElement("section", {
    className: "bg-black",
    children: [title, genres],
  });

  const ratingStar = createElement("img", {
    className: "ratingStar",
    attrs: { src: "../images/Star.svg", alt: "Rating Star" },
  });

  const voteAverage = createElement("p", {
    className: "vote-average",
    text: movie.vote_average?.toFixed(1),
  });

  const viewInfoBtn = createElement("a", {
    className: "view-info-link",
    text: "View Info",
    attrs: { href: `movie-details.html?id=${movie.id}` },
  });

  const actionRow = createElement("div", {
    className: "action-row",
    children: [ratingStar, voteAverage, viewInfoBtn],
  });

  return createElement("div", {
    className: "movie-card",
    children: [poster, section, actionRow],
  });
}

// Render: List of movie results
export function renderResults(movies, genreMap, resultsContainer) {
  resultsContainer.textContent = "";

  if (!movies?.length) {
    resultsContainer.textContent = "No movies found.";
    resultsContainer.classList.add("error");
    return;
  }

  const fragment = document.createDocumentFragment();

  movies.forEach((movie) => {
    const card = createMovieCard(movie, genreMap);
    fragment.appendChild(card);
  });

  resultsContainer.appendChild(fragment);
}

// Render: details of film
export function renderMovieDetails(movie, resultsContainer) {
  resultsContainer.textContent = "";

  const section = createElement("section", { className: "movie-details" });

  const poster = createPosterImg(movie, { width: 300, height: 450 });
  poster.classList.add("picture-style");

  const genresText =
    movie.genres?.map((g) => g.name).join("  ") || "Unknown genres";

  const genres = createElement("div", {
    className: "genres",
    html: `<p><span class="letter-color">Genre </span>${genresText}</p>`,
  });

  const overview = createElement("div", {
    className: "overview",
    html: `<p><span class="letter-color">Overview </span>${movie.overview}</p>`,
  });

  const release = createElement("div", {
    className: "release",
    html: `<p>Release: ${movie.release_date}</p>`,
  });

  section.append(poster, genres, overview, release);
  resultsContainer.appendChild(section);
}
