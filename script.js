const container = document.getElementById("animeContainer");
const loadingText = document.getElementById("loading");

const topBtn = document.getElementById("topBtn");
const trendingBtn = document.getElementById("trendingBtn");
async function fetchAnime(type) {
  loadingText.style.display = "block";
  container.innerHTML = "";

  let url = "";

  if (type === "top") {
    url = "https://api.jikan.moe/v4/top/anime";
  } else {
    url = "https://api.jikan.moe/v4/seasons/now";
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    displayAnime(data.data);
  } catch (error) {
    container.innerHTML = "<p>Error loading data</p>";
    console.log(error);
  }

  loadingText.style.display = "none";
}

// display anime cards
function displayAnime(animeList) {
  animeList.forEach(anime => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${anime.images.jpg.image_url}" />
      <h3>${anime.title}</h3>
      <p>Rating: ${anime.score || "N/A"}</p>
      <button class="toggleBtn">Show Synopsis</button>
      <p class="synopsis">${anime.synopsis || "No description available"}</p>
    `;

    const button = card.querySelector(".toggleBtn");
    const synopsis = card.querySelector(".synopsis");

    button.addEventListener("click", () => {
      synopsis.classList.toggle("show");

      if (synopsis.classList.contains("show")) {
        button.textContent = "Hide Synopsis";
      } else {
        button.textContent = "Show Synopsis";
      }
    });

    container.appendChild(card);
  });
}
topBtn.addEventListener("click", () => fetchAnime("top"));
trendingBtn.addEventListener("click", () => fetchAnime("trending"));
fetchAnime("trending");