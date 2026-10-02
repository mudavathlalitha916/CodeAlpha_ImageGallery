# Frame & Field | Advanced Image Gallery

A responsive photography gallery built with semantic HTML, modern CSS, and vanilla JavaScript. It includes live search, category filters, saved favorites, a keyboard-accessible lightbox, and a persistent light/dark theme.

## Run locally

1. Open the `Image-Gallery` folder in VS Code.
2. Install the **Live Server** extension if it is not already installed.
3. Open `index.html` and select **Go Live** from the status bar, or right-click the file and choose **Open with Live Server**.
4. Visit the local URL shown by VS Code, usually `http://127.0.0.1:5500`.

You can also open `index.html` directly in a browser; no build step or package installation is required. An internet connection is needed for the Unsplash photographs and Google Fonts.

## Features

- 24 photographs across Nature, Animals, Architecture, Technology, Travel, and Food.
- Category filters and case-insensitive title/category search work together.
- Favorites are saved in browser `localStorage` and available through the Saved filter.
- The lightbox navigates the currently visible results with its buttons or the left/right arrow keys; Escape and clicking the backdrop close it.
- Light/dark theme preference is saved locally.
- Responsive navigation, keyboard-friendly controls, reduced-motion support, lazy-loaded gallery images, and graceful broken-image fallbacks.

Photographs are served by [Unsplash](https://unsplash.com/) using their image CDN. Favorites and theme preferences stay in the current browser and are not sent to a server.