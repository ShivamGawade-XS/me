# Shivam Gawade Portfolio

A responsive, single-page portfolio that uses the GitHub REST API to display a profile, repository highlights, and public account statistics.

## Features

- Loads profile details, avatar, repository and follower counts, and links from GitHub.
- Shows up to six active, non-fork repositories, ordered by stars and recent updates.
- Summarizes stars and the most common repository languages.
- Caches API responses in session storage and provides retry and saved-data states when GitHub is unavailable.
- Supports reduced-motion preferences and a control to pause or resume animations.
- Includes keyboard-friendly navigation, skip link, and live status messages.

## Run locally

No build step or package installation is required. With Python 3 installed, start a local web server from the repository root:

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000> in a browser. The page requests live data from GitHub, so it needs an internet connection. GitHub's unauthenticated API rate limits apply.

To preview a different public GitHub profile, pass its username in the query string:

```text
http://localhost:8000/?username=octocat
```

Without that parameter, the page uses `ShivamGawade-XS`. To change the default, edit `DEFAULT_USERNAME` in `script.js`.

## Tests

The tests use Node.js's built-in test runner and do not require third-party packages:

```sh
node --test tests/portfolio.test.js
```

## Project files

- `index.html` — page structure and content.
- `styles.css` — responsive layout, visual styling, and motion preferences.
- `script.js` — GitHub API requests, rendering, caching, and interactions.
- `tests/portfolio.test.js` — behavior tests for profile and project loading, errors, caching, and motion controls.