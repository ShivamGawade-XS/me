const DEFAULT_USERNAME = "ShivamGawade-XS";
const username = new URLSearchParams(window.location.search).get("username")?.trim() || DEFAULT_USERNAME;
const apiRoot = "https://api.github.com";
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
  contactLink: document.querySelector("#contact-link"),
  footerGithub: document.querySelector("#footer-github"),
  heroBio: document.querySelector("#hero-bio"),
  heroGithub: document.querySelector("#hero-github"),
  heroHandle: document.querySelector("#hero-handle"),
  heroName: document.querySelector("#hero-name"),
  location: document.querySelector("#profile-location"),
  projectList: document.querySelector("#project-list"),
  projectStatus: document.querySelector("#project-status"),
  languageChips: document.querySelector("#language-chips"),
  joined: document.querySelector("#profile-joined"),
  statFollowers: document.querySelector("#stat-followers"),
  statRepos: document.querySelector("#stat-repos"),
  statStars: document.querySelector("#stat-stars"),
  aboutGithub: document.querySelector("#about-github"),
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

function setProfile(profile) {
  const name = profile.name || profile.login;
  elements.heroName.textContent = name;
  elements.heroBio.textContent = profile.bio || "A tech enthusiast building thoughtful things with code.";
  elements.aboutBio.textContent = profile.bio || `${name} is a curious builder exploring ideas and turning them into useful things.`;
  elements.statRepos.textContent = formatNumber(profile.public_repos || 0);
  elements.statFollowers.textContent = formatNumber(profile.followers || 0);
  elements.avatar.alt = `${name}'s GitHub avatar`;
  elements.avatar.addEventListener("load", () => elements.avatarFrame.classList.add("has-avatar"), { once: true });
  elements.avatar.src = profile.avatar_url;

  elements.location.textContent = profile.location ? `⌖  ${profile.location}` : "⌖  Somewhere on Earth";
  elements.joined.textContent = `✳  On GitHub since ${new Date(profile.created_at).getFullYear()}`;
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

  if (repo.visibility === "private") {
    titleLine.append(createTextElement("span", "project-visibility", "Private"));
  }

  main.append(titleLine);
  if (repo.description) {
    main.append(createTextElement("p", "project-description", repo.description));
  }

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

function setProjects(repositories) {
  const publicRepos = repositories
    .filter((repo) => !repo.fork && !repo.archived && !repo.disabled)
    .sort((a, b) => {
      const starsDifference = b.stargazers_count - a.stargazers_count;
      return starsDifference || new Date(b.pushed_at) - new Date(a.pushed_at);
    })
    .slice(0, projectLimit);

  const totalStars = repositories.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
  elements.statStars.textContent = formatNumber(totalStars);
  const languages = new Map();
  repositories.forEach((repo) => {
    if (repo.language) languages.set(repo.language, (languages.get(repo.language) || 0) + 1);
  });
  const topLanguages = [...languages.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 5)
    .map(([language]) => createTextElement("span", "language-chip", language));
  elements.languageChips.replaceChildren(...topLanguages);
  elements.projectList.replaceChildren(...publicRepos.map(createProjectCard));
  elements.projectStatus.textContent = publicRepos.length
    ? `Showing ${publicRepos.length} of ${repositories.length} public repositories`
    : "No public projects to show yet.";
}

async function fetchJson(path) {
  const response = await fetch(`${apiRoot}${path}`, {
    headers: { Accept: "application/vnd.github+json" },
  });

  if (!response.ok) {
    const detail = response.status === 404
      ? "That GitHub profile could not be found."
      : response.status === 403
        ? "GitHub's public API rate limit has been reached. Please try again later."
        : `GitHub returned an error (${response.status}).`;
    throw new Error(detail);
  }

  return response.json();
}

async function loadPortfolio() {
  setProfileLinks(username);
  try {
    const [profile, repositories] = await Promise.all([
      fetchJson(`/users/${encodeURIComponent(username)}`),
      fetchJson(`/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`),
    ]);
    setProfile(profile);
    setProjects(repositories);
  } catch (error) {
    elements.projectStatus.classList.add("is-error");
    elements.projectStatus.textContent = `${error.message} Check the username or try again shortly.`;
  }
}

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
