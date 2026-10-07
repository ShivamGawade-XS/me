const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const script = fs.readFileSync(path.join(__dirname, "..", "script.js"), "utf8");

class MockElement {
  constructor(id = "") {
    this.id = id;
    this.textContent = "";
    this.href = "";
    this.children = [];
    this.attributes = new Map();
    this.listeners = new Map();
    this.removedAttributes = [];
    this.hidden = false;
    this.hash = "";
    this.style = { setProperty() {} };
    this.classList = {
      values: new Set(),
      add: (value) => this.classList.values.add(value),
      remove: (value) => this.classList.values.delete(value),
      toggle: (value, force) => {
        const enabled = force ?? !this.classList.values.has(value);
        if (enabled) this.classList.values.add(value);
        else this.classList.values.delete(value);
        return enabled;
      },
      contains: (value) => this.classList.values.has(value),
    };
  }

  append(...items) { this.children.push(...items); }
  prepend(...items) { this.children.unshift(...items); }
  replaceChildren(...items) { this.children = items; }
  addEventListener(type, listener) {
    const handlers = this.listeners.get(type) || [];
    handlers.push(listener);
    this.listeners.set(type, handlers);
  }
  removeAttribute(name) { this.attributes.delete(name); this.removedAttributes.push(name); }
  setAttribute(name, value) { this.attributes.set(name, value); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  querySelector(selector) {
    return this.children.find((child) => child.tagName === selector) || new MockElement(selector);
  }
  click() { this.listeners.get("click")?.forEach((listener) => listener({ target: this })); }
}

function profile(login = "demo") {
  return {
    login,
    name: "Demo_User",
    bio: "Building useful things",
    public_repos: 4,
    followers: 8,
    avatar_url: "https://example.test/avatar.png",
    location: "Goa",
    created_at: "2024-01-01T00:00:00Z",
  };
}

function repository(name, overrides = {}) {
  return {
    name,
    html_url: `https://github.com/demo/${name}`,
    description: `${name} description`,
    language: "TypeScript",
    stargazers_count: 2,
    forks_count: 0,
    pushed_at: "2026-10-01T00:00:00Z",
    fork: false,
    archived: false,
    disabled: false,
    ...overrides,
  };
}

function createHarness({ search = "?username=demo", respond, cache = {}, reducedMotion = false }) {
  const selectors = [
    "#about-bio", "#avatar", ".avatar-frame", "#avatar-fallback", "#contact-link",
    "#footer-github", "#hero-bio", "#hero-github", "#hero-handle", "#hero-name", "#hero-title",
    "#profile-status", "#profile-retry", "#profile-location", "#project-list",
    "#project-status", "#projects-retry", "#language-chips", "#profile-joined",
    "#stat-followers", "#stat-repos", "#stat-stars", "#about-github",
    "#all-projects-link", "#projects-more", "#motion-toggle", "body",
  ];
  const elements = Object.fromEntries(selectors.map((selector) => [selector, new MockElement(selector)]));
  elements["#hero-name"].parentElement = elements["#hero-title"];
  elements["#profile-retry"].hidden = true;
  elements["#projects-retry"].hidden = true;
  elements["#project-list"].setAttribute("aria-busy", "true");
  const motionToggle = elements["#motion-toggle"];
  motionToggle.children = [
    Object.assign(new MockElement(), { tagName: "svg" }),
    Object.assign(new MockElement(), { tagName: "span" }),
  ];
  const sections = ["home", "projects", "about", "contact"].map((id) => ({ id }));
  const navLinks = sections.map(({ id }) => Object.assign(new MockElement(), { hash: `#${id}` }));
  const sessionValues = new Map(Object.entries(cache));
  const storage = {
    getItem: (key) => sessionValues.get(key) ?? null,
    setItem: (key, value) => sessionValues.set(key, value),
    removeItem: (key) => sessionValues.delete(key),
  };
  const requests = [];
  const context = {
    URLSearchParams,
    window: {
      location: { search },
      setTimeout: () => 1,
      clearTimeout() {},
      matchMedia: () => ({ matches: reducedMotion, addEventListener() {} }),
      IntersectionObserver: class { observe() {} },
    },
    document: {
      body: elements.body,
      querySelector: (selector) => elements[selector] || new MockElement(selector),
      querySelectorAll: (selector) => selector === ".section-anchor" ? sections : navLinks,
      createElement: (tag) => Object.assign(new MockElement(tag), { tagName: tag }),
    },
    sessionStorage: storage,
    fetch: async (url, options) => {
      requests.push({ url, options });
      return respond(url, options);
    },
    Intl,
    Date,
    AbortController,
    IntersectionObserver: class { observe() {} },
    console: { warn() {} },
  };
  vm.runInNewContext(script, context, { filename: "script.js" });

  return { elements, requests, sessionValues, storage };
}

function apiResponse(data, { link = "" } = {}) {
  return {
    ok: true,
    headers: { get: (name) => name.toLowerCase() === "link" ? link : null },
    json: async () => data,
  };
}

async function settle() {
  await new Promise((resolve) => setImmediate(resolve));
  await new Promise((resolve) => setImmediate(resolve));
}

test("loads profile, paginated repositories, accurate project stats, and formatted name", async () => {
  const firstPage = [
    repository("starred", { stargazers_count: 5 }),
    repository("fork", { fork: true, stargazers_count: 90 }),
    repository("archived", { archived: true, stargazers_count: 50 }),
  ];
  const secondPage = [repository("python", { language: "Python", stargazers_count: 3 })];
  const { elements, requests, sessionValues } = createHarness({
    respond: async (url) => {
      if (url.endsWith("/users/demo")) return apiResponse(profile());
      const page = new URL(url).searchParams.get("page");
      if (page === "1") return apiResponse(firstPage, { link: '<https://api.github.com/users/demo/repos?page=2>; rel="next"' });
      if (page === "2") return apiResponse(secondPage);
      throw new Error(`Unexpected URL ${url}`);
    },
  });

  await settle();

  assert.equal(elements["#hero-name"].textContent, "Demo User");
  assert.equal(elements["#stat-repos"].textContent, "4");
  assert.equal(elements["#stat-followers"].textContent, "8");
  assert.equal(elements["#stat-stars"].textContent, "8");
  assert.equal(elements["#project-list"].children.length, 2);
  assert.equal(elements["#language-chips"].children.length, 2);
  assert.match(elements["#project-status"].textContent, /2 of 2 active, non-fork/);
  assert.equal(requests.filter(({ url }) => url.includes("/repos?")).length, 2);
  assert.ok(sessionValues.has("github-profile:demo"));
  assert.ok(sessionValues.has("github-repositories:demo"));
});

test("scales long profile names and updates the document title", async () => {
  const longProfile = { ...profile(), name: "A Very Long Display Name That Needs To Wrap" };
  const { elements } = createHarness({
    respond: async (url) => url.endsWith("/users/demo")
      ? apiResponse(longProfile)
      : apiResponse([]),
  });

  await settle();

  assert.equal(elements["#hero-name"].parentElement.classList.contains("is-long-name"), true);
  assert.equal(elements["#hero-name"].textContent, longProfile.name);
});

test("keeps projects available when the profile request fails", async () => {
  const { elements } = createHarness({
    respond: async (url) => {
      if (url.endsWith("/users/demo")) return { ok: false, status: 404, json: async () => ({}) };
      return apiResponse([repository("still-works")]);
    },
  });

  await settle();

  assert.equal(elements["#project-list"].children.length, 1);
  assert.match(elements["#profile-status"].textContent, /could not be found/);
  assert.equal(elements["#profile-retry"].hidden, false);
  assert.equal(elements["#projects-retry"].hidden, true);
});

test("keeps the profile available when the repository request fails", async () => {
  const { elements } = createHarness({
    respond: async (url) => {
      if (url.endsWith("/users/demo")) return apiResponse(profile());
      return { ok: false, status: 403, json: async () => ({}) };
    },
  });

  await settle();

  assert.equal(elements["#hero-name"].textContent, "Demo User");
  assert.match(elements["#project-status"].textContent, /rate limit/);
  assert.equal(elements["#projects-retry"].hidden, false);
});

test("restores initials when the GitHub avatar image fails", async () => {
  const { elements } = createHarness({
    respond: async (url) => url.endsWith("/users/demo")
      ? apiResponse(profile())
      : apiResponse([]),
  });

  await settle();
  elements[".avatar-frame"].classList.add("has-avatar");
  elements["#avatar"].listeners.get("error")[0]();

  assert.equal(elements[".avatar-frame"].classList.contains("has-avatar"), false);
  assert.ok(elements["#avatar"].removedAttributes.includes("src"));
  assert.equal(elements["#avatar-fallback"].textContent, "DU");
});

test("uses saved data when GitHub is unavailable and exposes a retry", async () => {
  const cachedProfile = profile();
  const cachedRepositories = [repository("cached")];
  const savedAt = Date.now();
  const cache = {
    "github-profile:demo": JSON.stringify({ savedAt, data: cachedProfile }),
    "github-repositories:demo": JSON.stringify({ savedAt, data: cachedRepositories }),
  };
  const { elements } = createHarness({
    cache,
    respond: async () => { throw new TypeError("offline"); },
  });

  await settle();

  assert.equal(elements["#hero-name"].textContent, "Demo User");
  assert.equal(elements["#project-list"].children.length, 1);
  assert.match(elements["#profile-status"].textContent, /Showing saved profile data/);
  assert.match(elements["#project-status"].textContent, /Showing saved projects/);
  assert.equal(elements["#profile-retry"].hidden, false);
  assert.equal(elements["#projects-retry"].hidden, false);
});

test("rejects invalid usernames without making API requests", async () => {
  const { elements, requests } = createHarness({
    search: "?username=not/a/user",
    respond: async () => { throw new Error("Should not request GitHub"); },
  });

  await settle();

  assert.equal(requests.length, 0);
  assert.match(elements["#profile-status"].textContent, /not a valid GitHub username/);
  assert.equal(elements["#project-list"].getAttribute("aria-busy"), "false");
});

test("pauses and resumes motion using an accessible toggle", async () => {
  const { elements } = createHarness({ respond: async () => new Promise(() => {}) });
  const button = elements["#motion-toggle"];

  assert.equal(button.getAttribute("aria-pressed"), "false");
  button.click();
  assert.equal(button.getAttribute("aria-pressed"), "true");
  assert.equal(button.children[1].textContent, "Resume animation");
  assert.equal(elements.body.classList.contains("motion-paused"), true);
  button.click();
  assert.equal(button.getAttribute("aria-pressed"), "false");
  assert.equal(elements.body.classList.contains("motion-paused"), false);
});

test("honors reduced-motion preferences without offering a misleading resume action", () => {
  const { elements } = createHarness({
    reducedMotion: true,
    respond: async () => new Promise(() => {}),
  });

  assert.equal(elements["#motion-toggle"].disabled, true);
  assert.equal(elements["#motion-toggle"].getAttribute("aria-pressed"), "true");
  assert.equal(elements["#motion-toggle"].children[1].textContent, "Motion reduced by system");
  assert.equal(elements.body.classList.contains("motion-paused"), true);
});
