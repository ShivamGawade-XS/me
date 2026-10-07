const DEFAULT_USERNAME = "ShivamGawade-XS";
const username = new URLSearchParams(window.location.search).get("username")?.trim() || DEFAULT_USERNAME;
const apiRoot = "https://api.github.com";
const cacheLifetime = 5 * 60 * 1000;
const projectLimit = 6;
const languageColors = {
  JavaScript: "#e6c45a",
  TypeScript: "#4d83c4",
  Python: "#5797b5",
  HTML: "#df7956",
  CSS: "#8a74c9",
  Go: "#54a7ae",
  Java: "#bd7557",
  PHP: "#7c85bd",
  Rust: "#a96748",
  Ruby: "#c65b63",
};

const elements = {
  aboutBio: document.querySelector("#about-bio"),
  avatar: document.querySelector("#avatar"),
  avatarFrame: document.querySelector(".avatar-frame"),
  avatarFallback: document.querySelector("#avatar-fallback"),
  contactLink: document.querySelector("#contact-link"),
  footerGithub: document.querySelector("#footer-github"),
  heroBio: document.querySelector("#hero-bio"),
  heroGithub: document.querySelector("#hero-github"),
  heroHandle: document.querySelector("#hero-handle"),
  heroName: document.querySelector("#hero-name"),
  profileStatus: document.querySelector("#profile-status"),
  location: document.querySelector("#profile-location"),
  projectList: document.querySelector("#project-list"),
  projectStatus: document.querySelector("#project-status"),
  languageChips: document.querySelector("#language-chips"),
  joined: document.querySelector("#profile-joined"),
  statFollowers: document.querySelector("#stat-followers"),
  statRepos: document.querySelector("#stat-repos"),
  statStars: document.querySelector("#stat-stars"),
  aboutGithub: document.querySelector("#about-github"),
  motionToggle: document.querySelector("#motion-toggle"),
};

function profileUrl(login) {
  return `https://github.com/${encodeURIComponent(login)}`;
}

function setProfileLinks(login) {
  const url = profileUrl(login);
  [
    elements.heroGithub,
    elements.aboutGithub,
    elements.contactLink,
    elements.footerGithub,
    document.querySelector("#all-projects-link"),
    document.querySelector("#projects-more"),
  ].forEach((link) => {
    link.href = link.id === "all-projects-link" || link.id === "projects-more"
      ? `${url}?tab=repositories`
      : url;
  });
  elements.heroHandle.textContent = `@${login}`;
  elements.footerGithub.textContent = `@${login} ↗`;
}

function formatNumber(value) {
  return new Intl.NumberFormat("en", { notation: value > 9999 ? "compact" : "standard" }).format(value);
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(value));
}

function getDisplayName(profile) {
  return (profile.name || profile.login).replace(/_/g, " ").replace(/\s+/g, " ").trim();
}

function setProfile(profile) {
  const name = getDisplayName(profile);
  const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  elements.heroName.textContent = name;
  elements.heroBio.textContent = profile.bio || "A tech enthusiast building thoughtful things with code.";
  elements.aboutBio.textContent = profile.bio || `${name} is a curious builder exploring ideas and turning them into useful things.`;
  elements.statRepos.textContent = formatNumber(profile.public_repos || 0);
  elements.statFollowers.textContent = formatNumber(profile.followers || 0);
  elements.avatarFallback.textContent = initials;
  elements.avatar.alt = `${name}'s GitHub avatar`;
  elements.avatar.addEventListener("load", () => elements.avatarFrame.classList.add("has-avatar"), { once: true });
  elements.avatar.addEventListener("error", () => {
    elements.avatarFrame.classList.remove("has-avatar");
    elements.avatar.removeAttribute("src");
  }, { once: true });
  if (profile.avatar_url) elements.avatar.src = profile.avatar_url;

  elements.location.textContent = profile.location ? `⌖  ${profile.location}` : "⌖  Location not listed";
  const joinedYear = profile.created_at ? new Date(profile.created_at).getFullYear() : null;
  elements.joined.textContent = joinedYear ? `✳  On GitHub since ${joinedYear}` : "✳  GitHub profile";
  setProfileLinks(profile.login);
}

function createTextElement(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

function createProjectCard(repo) {
  const card = document.createElement("article");
  card.className = "project-card";
  card.setAttribute("role", "listitem");
  card.style.setProperty("--card-accent", languageColors[repo.language] || "#82ad8f");

  const main = document.createElement("div");
  main.className = "project-main";
  const titleLine = document.createElement("div");
  titleLine.className = "project-title-line";

  const title = document.createElement("a");
  title.className = "project-title";
  title.href = repo.html_url;
  title.target = "_blank";
  title.rel = "noreferrer";
  title.textContent = repo.name;
  titleLine.append(title);
  main.append(titleLine);

  if (repo.description) main.append(createTextElement("p", "project-description", repo.description));

  const meta = document.createElement("div");
  meta.className = "project-meta";
  if (repo.language) {
    const language = createTextElement("span", "project-language", repo.language);
    language.style.setProperty("--language-color", languageColors[repo.language] || "#7b9384");
    language.prepend(Object.assign(document.createElement("span"), { className: "language-dot", ariaHidden: "true" }));
    meta.append(language);
  }
  if (repo.stargazers_count) {
    meta.append(createTextElement("span", "project-stat", `★ ${formatNumber(repo.stargazers_count)}`));
  }
  if (repo.forks_count) {
    meta.append(createTextElement("span", "project-stat", `⑂ ${formatNumber(repo.forks_count)} forks`));
  }
  if (repo.pushed_at) {
    meta.append(createTextElement("span", "project-updated", `Updated ${formatDate(repo.pushed_at)}`));
  }
  main.append(meta);

  const arrow = createTextElement("span", "project-arrow", "↗");
  arrow.setAttribute("aria-hidden", "true");
  card.append(main, arrow);
  return card;
}

function getShowcaseRepositories(repositories) {
  return repositories
    .filter((repo) => !repo.fork && !repo.archived && !repo.disabled)
    .sort((a, b) => {
      const starsDifference = b.stargazers_count - a.stargazers_count;
      return starsDifference || new Date(b.pushed_at) - new Date(a.pushed_at);
    });
}

function setProjects(repositories, profile) {
  const showcaseRepositories = getShowcaseRepositories(repositories);
  const displayedRepositories = showcaseRepositories.slice(0, projectLimit);
  const totalStars = repositories.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
  elements.statStars.textContent = formatNumber(totalStars);

  const languages = new Map();
  showcaseRepositories.forEach((repo) => {
    if (repo.language) languages.set(repo.language, (languages.get(repo.language) || 0) + 1);
  });
  const topLanguages = [...languages.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 5)
    .map(([language, count]) => {
      const chip = createTextElement("span", "language-chip", language);
      chip.title = `${count} repositories`;
      return chip;
    });
  elements.languageChips.replaceChildren(...topLanguages);
  elements.projectList.replaceChildren(...displayedRepositories.map(createProjectCard));
  elements.projectStatus.classList.remove("is-error");
  elements.projectStatus.textContent = displayedRepositories.length
    ? `Showing ${displayedRepositories.length} of ${showcaseRepositories.length} active, non-fork repositories`
    : "No active, non-fork repositories to show yet.";

  if (profile && repositories.length < profile.public_repos) {
    elements.projectStatus.textContent += ` (${profile.public_repos - repositories.length} older repositories not loaded)`;
  }
}

function getCache(key) {
  try {
    const cached = JSON.parse(sessionStorage.getItem(key));
    if (cached && Date.now() - cached.savedAt < cacheLifetime) return cached.data;
  } catch (error) {
    if (error instanceof SyntaxError) sessionStorage.removeItem(key);
  }
  return null;
}

function setCache(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data }));
  } catch (error) {
    console.warn(`Unable to cache GitHub data for ${username}.`, error);
  }
}

async function fetchJson(path) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(`${apiRoot}${path}`, {
      headers: { Accept: "application/vnd.github+json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = response.status === 404
        ? "That GitHub profile could not be found."
        : response.status === 403
          ? "GitHub's public API rate limit has been reached. Please try again later."
          : `GitHub returned an error (${response.status}).`;
      throw new Error(detail);
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") throw new Error("GitHub took too long to respond. Please try again shortly.");
    if (error instanceof TypeError) throw new Error("Unable to reach GitHub. Check your connection and try again.");
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

function showProfileError(error, hasCachedProfile) {
  const prefix = hasCachedProfile ? "Live profile refresh failed. Showing saved profile data. " : "";
  elements.profileStatus.textContent = `${prefix}${error.message}`;
  elements.profileStatus.classList.add("is-error");
}

function showProjectError(error, hasCachedRepositories) {
  elements.projectStatus.classList.add("is-error");
  elements.projectStatus.textContent = hasCachedRepositories
    ? `Live project refresh failed. Showing saved projects. ${error.message}`
    : `Projects could not be loaded. ${error.message}`;
}

async function loadPortfolio() {
  setProfileLinks(username);
  if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(username)) {
    showProfileError(new Error("The username in the URL is not a valid GitHub username."), false);
    showProjectError(new Error("Please check the username and try again."), false);
    return;
  }

  const profileKey = `github-profile:${username.toLowerCase()}`;
  const repositoriesKey = `github-repositories:${username.toLowerCase()}`;
  const cachedProfile = getCache(profileKey);
  const cachedRepositories = getCache(repositoriesKey);
  if (cachedProfile?.login && cachedProfile.login.toLowerCase() === username.toLowerCase()) {
    setProfile(cachedProfile);
  }
  if (Array.isArray(cachedRepositories)) {
    setProjects(cachedRepositories, cachedProfile);
  }

  const [profileResult, repositoriesResult] = await Promise.allSettled([
    fetchJson(`/users/${encodeURIComponent(username)}`),
    fetchJson(`/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`),
  ]);

  if (profileResult.status === "fulfilled" && profileResult.value.login) {
    const profile = profileResult.value;
    setProfile(profile);
    setCache(profileKey, profile);
    elements.profileStatus.textContent = "";
    elements.profileStatus.classList.remove("is-error");
  } else {
    const error = profileResult.status === "rejected"
      ? profileResult.reason
      : new Error("GitHub returned incomplete profile data.");
    showProfileError(error, Boolean(cachedProfile));
  }

  if (repositoriesResult.status === "fulfilled" && Array.isArray(repositoriesResult.value)) {
    const repositories = repositoriesResult.value;
    setCache(repositoriesKey, repositories);
    setProjects(repositories, profileResult.status === "fulfilled" ? profileResult.value : cachedProfile);
  } else {
    const error = repositoriesResult.status === "rejected"
      ? repositoriesResult.reason
      : new Error("GitHub returned an invalid repository list.");
    showProjectError(error, Array.isArray(cachedRepositories));
  }
}

function setMotionPaused(paused) {
  document.body.classList.toggle("motion-paused", paused);
  elements.motionToggle.setAttribute("aria-pressed", String(paused));
  elements.motionToggle.querySelector("span").textContent = paused ? "Resume animation" : "Pause animation";
  elements.motionToggle.querySelector("svg").innerHTML = paused
    ? '<path d="m8 5 11 7-11 7z" />'
    : '<rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" />';
}

const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
setMotionPaused(motionPreference.matches);
elements.motionToggle.addEventListener("click", () => {
  const paused = elements.motionToggle.getAttribute("aria-pressed") !== "true";
  setMotionPaused(paused);
});
motionPreference.addEventListener("change", (event) => setMotionPaused(event.matches));

loadPortfolio();

const sections = [...document.querySelectorAll(".section-anchor")];
const navLinks = [...document.querySelectorAll(".nav-link")];
const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;

    navLinks.forEach((link) => {
      const active = link.hash === `#${visible.target.id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  },
  { rootMargin: "-20% 0px -58% 0px", threshold: [0, 0.1, 0.3, 0.6] },
);

sections.forEach((section) => observer.observe(section));
