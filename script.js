const container = document.getElementById("animeContainer");
const loadingText = document.getElementById("loading");

const topBtn = document.getElementById("topBtn");
const trendingBtn = document.getElementById("trendingBtn");

const searchInput = document.getElementById("searchInput");
const filterRating = document.getElementById("filterRating");
const sortOption = document.getElementById("sortOption");
const themeToggle = document.getElementById("themeToggle");

let allAnime = [];

// FETCH FUNCTION
async function fetchAnime(type) {
  loadingText.style.display = "block";
  container.innerHTML = "";

  let url = type === "top"
    ? "https://api.jikan.moe/v4/top/anime"
    : "https://api.jikan.moe/v4/seasons/now";

  try {
    // prevent API rate limit
    await new Promise(res => setTimeout(res, 1000));

    const response = await fetch(url);

    if (!response.ok) throw new Error("API error");

    const data = await response.json();

    allAnime = data.data;
    processAndDisplay();

  } catch (error) {
    container.innerHTML = "<p>⚠️ Failed to load anime</p>";
    console.error(error);
  }

  loadingText.style.display = "none";
}

// PROCESS DATA (HOFs)
function processAndDisplay() {
  let processed = [...allAnime];

  // SEARCH
  const searchText = searchInput.value.toLowerCase();
  processed = processed.filter(anime =>
    anime.title.toLowerCase().includes(searchText)
  );

  // FILTER
  if (filterRating.value !== "all") {
    processed = processed.filter(anime =>
      anime.score && anime.score >= Number(filterRating.value)
    );
  }

  // SORT
  if (sortOption.value === "asc") {
    processed = processed.sort((a, b) => (a.score || 0) - (b.score || 0));
  } else if (sortOption.value === "desc") {
    processed = processed.sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  displayAnime(processed);
}

// DISPLAY
function displayAnime(animeList) {
  container.innerHTML = "";

  animeList.map(anime => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${anime.images.jpg.image_url}" />
      <h3>${anime.title}</h3>
      <p>Rating: ${anime.score || "N/A"}</p>
      <button class="toggleBtn">Show Synopsis</button>
      <p class="synopsis">${anime.synopsis || "No description"}</p>
    `;

    const btn = card.querySelector(".toggleBtn");
    const synopsis = card.querySelector(".synopsis");

    btn.addEventListener("click", () => {
      synopsis.classList.toggle("show");

      btn.textContent = synopsis.classList.contains("show")
        ? "Hide Synopsis"
        : "Show Synopsis";
    });

    container.appendChild(card);
  });
}

// EVENTS
topBtn.addEventListener("click", () => fetchAnime("top"));
trendingBtn.addEventListener("click", () => fetchAnime("trending"));

searchInput.addEventListener("input", processAndDisplay);
filterRating.addEventListener("change", processAndDisplay);
sortOption.addEventListener("change", processAndDisplay);

// DARK MODE
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  themeToggle.textContent =
    document.body.classList.contains("dark")
      ? "☀️ Light Mode"
      : "🌙 Dark Mode";
});

// INITIAL LOAD
fetchAnime("trending");