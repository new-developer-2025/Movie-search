// genreDesign
export function genreDesign() {
  const manageInfo = document.getElementById("str-manage");
  const params = new URLSearchParams(window.location.search);
  const movieId = params.get("id");
  return { manageInfo, params, movieId };
}
// up function export to the collectionData and loadMovieDetails file
