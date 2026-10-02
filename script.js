const images = [
  { id: "morning-light", title: "Where the Day Begins", category: "Nature", src: "photo-1470252649378-9c29740c9fa8" },
  { id: "quiet-peak", title: "A Quiet Kind of Vast", category: "Nature", src: "photo-1500530855697-b586d89ba3ee" },
  { id: "green-cathedral", title: "The Green Cathedral", category: "Nature", src: "photo-1441974231531-c6227db76b6e" },
  { id: "blue-hour", title: "Stillness at Blue Hour", category: "Nature", src: "photo-1470770841072-f978cf4d019e" },
  { id: "wild-look", title: "A Curious Look", category: "Animals", src: "photo-1474511320723-9a56873867b5" },
  { id: "gentle-giant", title: "The Gentle Giant", category: "Animals", src: "photo-1549366021-9f761d450615" },
  { id: "sunny-snooze", title: "An Afternoon Pause", category: "Animals", src: "photo-1533738363-b7f9aef128ce" },
  { id: "open-pasture", title: "Out in the Open", category: "Animals", src: "photo-1500595046743-cd271d694d30" },
  { id: "city-lines", title: "Lines of the City", category: "Architecture", src: "photo-1511818966892-d7d671e672a2" },
  { id: "soft-structure", title: "A Softer Structure", category: "Architecture", src: "photo-1487958449943-2429e8be8625" },
  { id: "glass-and-light", title: "Glass, Light, Height", category: "Architecture", src: "photo-1486406146926-c627a92ad1ab" },
  { id: "evening-facade", title: "After the Last Light", category: "Architecture", src: "photo-1519608487953-e999c86e7455" },
  { id: "small-circuits", title: "A World in Miniature", category: "Technology", src: "photo-1518770660439-4636190af475" },
  { id: "ideas-together", title: "Ideas in Good Company", category: "Technology", src: "photo-1519389950473-47ba0277781c" },
  { id: "daily-tools", title: "Tools for Tomorrow", category: "Technology", src: "photo-1516321318423-f06f85e504b3" },
  { id: "makers-desk", title: "The Maker's Desk", category: "Technology", src: "photo-1517694712202-14dd9538aa97" },
  { id: "far-horizon", title: "Somewhere Beyond", category: "Travel", src: "photo-1464822759023-fed622ff2c3b" },
  { id: "open-road", title: "The Longer Way Around", category: "Travel", src: "photo-1500534623283-312aade485b7" },
  { id: "island-drift", title: "A Place to Drift", category: "Travel", src: "photo-1476514525535-07fb3b4ae5f1" },
  { id: "salt-air", title: "Salt in the Air", category: "Travel", src: "photo-1507525428034-b723cf961d3e" },
  { id: "color-on-a-plate", title: "A Little More Color", category: "Food", src: "photo-1540189549336-e6e99c3679fe" },
  { id: "slow-sunday", title: "Slow Sunday Lunch", category: "Food", src: "photo-1565299624946-b28f40a0ae38" },
  { id: "gather-round", title: "Gather Around", category: "Food", src: "photo-1504674900247-0877df9cc836" },
  { id: "fresh-start", title: "Something Fresh", category: "Food", src: "photo-1512621776951-a57141f2eefd" }
].map((image) => ({
  ...image,
  url: `https://images.unsplash.com/${image.src}?auto=format&fit=crop&w=1000&q=85`
}));

const gallery = document.querySelector("#gallery-grid");
const imageCount = document.querySelector("#image-count");
const countLabel = document.querySelector("#count-label");
const totalCount = document.querySelector("#total-count");
const emptyState = document.querySelector("#empty-state");
const searchInput = document.querySelector("#gallery-search");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxFallback = document.querySelector(".lightbox-fallback");
const lightboxTitle = document.querySelector(".lightbox-title");
const lightboxCategory = document.querySelector(".lightbox-category");
const lightboxPosition = document.querySelector(".lightbox-position");
const previousButton = document.querySelector(".lightbox-prev");
const nextButton = document.querySelector(".lightbox-next");
const favoriteStorageKey = "frame-field-favorites";
const themeStorageKey = "frame-field-theme";

let selectedCategory = "All";
let searchTerm = "";
let favorites = readFavorites();
let visibleImages = [];
let lightboxIndex = -1;

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(favoriteStorageKey) || "[]");
    return new Set(Array.isArray(saved) ? saved.filter((id) => images.some((image) => image.id === id)) : []);
  } catch {
    return new Set();
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(favoriteStorageKey, JSON.stringify([...favorites]));
  } catch {
    // The gallery remains usable when browser storage is unavailable.
  }
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function updateFilterCounts() {
  document.querySelector('[data-filter-count="All"]').textContent = images.length;
  document.querySelector('[data-filter-count="Favorites"]').textContent = favorites.size;
}

function getVisibleImages() {
  const query = searchTerm.trim().toLocaleLowerCase();
  return images.filter((image) => {
    const matchesCategory = selectedCategory === "All" ||
      (selectedCategory === "Favorites" ? favorites.has(image.id) : image.category === selectedCategory);
    const matchesSearch = !query || `${image.title} ${image.category}`.toLocaleLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
}

function renderGallery() {
  visibleImages = getVisibleImages();
  gallery.replaceChildren();
  imageCount.textContent = visibleImages.length;
  countLabel.textContent = visibleImages.length === 1 ? "photograph" : "photographs";
  totalCount.textContent = images.length;
  emptyState.hidden = visibleImages.length > 0;
  updateFilterCounts();

  visibleImages.forEach((image, index) => {
    const card = createElement("article", "gallery-card");
    card.style.animationDelay = `${Math.min(index, 8) * 35}ms`;

    const imageWrap = createElement("div", "card-image-wrap");
    imageWrap.tabIndex = 0;
    imageWrap.setAttribute("role", "button");
    imageWrap.setAttribute("aria-label", `Open ${image.title}, ${image.category}`);
    const photo = createElement("img", "card-image");
    photo.src = image.url;
    photo.alt = image.title;
    photo.loading = "lazy";
    photo.decoding = "async";
    photo.addEventListener("error", () => imageWrap.classList.add("is-broken"), { once: true });
    imageWrap.append(photo, createElement("span", "broken-image", "Image unavailable"));
    imageWrap.addEventListener("click", () => openLightbox(index));
    imageWrap.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(index);
      }
    });

    const favoriteButton = createElement("button", `favorite-button${favorites.has(image.id) ? " is-favorite" : ""}`);
    favoriteButton.type = "button";
    favoriteButton.setAttribute("aria-label", `${favorites.has(image.id) ? "Remove" : "Add"} ${image.title} ${favorites.has(image.id) ? "from" : "to"} favorites`);
    favoriteButton.setAttribute("aria-pressed", String(favorites.has(image.id)));
    favoriteButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>';
    favoriteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleFavorite(image.id);
    });
    imageWrap.append(favoriteButton, createElement("span", "card-open-hint", "View photograph  ↗"));

    const caption = createElement("div", "card-caption");
    const text = createElement("div");
    text.append(createElement("h3", "", image.title), createElement("p", "", image.category));
    caption.append(text, createElement("span", "card-number", String(images.indexOf(image) + 1).padStart(2, "0")));
    card.append(imageWrap, caption);
    gallery.append(card);
  });
}

function toggleFavorite(id) {
  if (favorites.has(id)) favorites.delete(id);
  else favorites.add(id);
  saveFavorites();
  renderGallery();
}

function updateLightbox() {
  const image = visibleImages[lightboxIndex];
  if (!image) return;
  lightboxImage.src = image.url.replace("w=1000", "w=1800");
  lightboxImage.alt = image.title;
  lightboxImage.hidden = false;
  lightboxFallback.hidden = true;
  lightboxTitle.textContent = image.title;
  lightboxCategory.textContent = image.category;
  lightboxPosition.textContent = `${String(lightboxIndex + 1).padStart(2, "0")} / ${String(visibleImages.length).padStart(2, "0")}`;
  previousButton.disabled = visibleImages.length < 2;
  nextButton.disabled = visibleImages.length < 2;
}

function openLightbox(index) {
  lightboxIndex = index;
  updateLightbox();
  if (!lightbox.open) lightbox.showModal();
  document.body.classList.add("no-scroll");
  document.querySelector(".lightbox-close").focus();
}

function closeLightbox() {
  if (lightbox.open) lightbox.close();
  document.body.classList.remove("no-scroll");
  lightboxIndex = -1;
}

function moveLightbox(direction) {
  if (visibleImages.length < 2) return;
  lightboxIndex = (lightboxIndex + direction + visibleImages.length) % visibleImages.length;
  updateLightbox();
}

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;
    document.querySelectorAll(".filter-button").forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle("is-active", active);
      filter.setAttribute("aria-pressed", String(active));
    });
    renderGallery();
  });
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value;
  renderGallery();
});

document.querySelector("#reset-filters").addEventListener("click", () => {
  selectedCategory = "All";
  searchTerm = "";
  searchInput.value = "";
  document.querySelector('[data-category="All"]').click();
});

document.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
previousButton.addEventListener("click", () => moveLightbox(-1));
nextButton.addEventListener("click", () => moveLightbox(1));
lightboxImage.addEventListener("error", () => {
  lightboxImage.hidden = true;
  lightboxFallback.hidden = false;
});
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
lightbox.addEventListener("close", () => document.body.classList.remove("no-scroll"));
lightbox.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !lightbox.open && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
  if (!lightbox.open) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
});

const themeToggle = document.querySelector(".theme-toggle");
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    // Theme switching still works for the current page when storage is unavailable.
  }
}

let initialTheme = "light";
try {
  initialTheme = localStorage.getItem(themeStorageKey) === "dark" ? "dark" : "light";
} catch {
  initialTheme = "light";
}
setTheme(initialTheme);
themeToggle.addEventListener("click", () => {
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});
navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  navLinks.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}));

const backToTop = document.querySelector(".back-to-top");
window.addEventListener("scroll", () => backToTop.classList.toggle("is-visible", window.scrollY > 500), { passive: true });
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
document.querySelector("#current-year").textContent = new Date().getFullYear();

renderGallery();