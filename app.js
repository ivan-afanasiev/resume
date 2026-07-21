/* global document, fetch, window, localStorage */

const STORAGE_KEY = "cv.lang";
const TRACK_STORAGE_KEY = "cv.track";
const THEME_STORAGE_KEY = "cv.theme";
const DEFAULT_LANG = "en";
const DEFAULT_TRACK = "ic";
const SUPPORTED_LANGS = ["en", "ru"];
const SUPPORTED_TRACKS = ["ic", "em"];
const SUPPORTED_THEMES = ["light", "dark"];

const THEME_ICONS = {
    // Sun (shown in dark mode → click to go light)
    light: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0-5a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm0 17a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1zM4.22 4.22a1 1 0 0 1 1.42 0l1.41 1.41a1 1 0 1 1-1.41 1.42L4.22 5.64a1 1 0 0 1 0-1.42zm12.73 12.73a1 1 0 0 1 1.41 0l1.42 1.41a1 1 0 1 1-1.42 1.42l-1.41-1.42a1 1 0 0 1 0-1.41zM2 12a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1zm17 0a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1zM4.22 19.78a1 1 0 0 1 0-1.42l1.41-1.41a1 1 0 1 1 1.42 1.41l-1.42 1.42a1 1 0 0 1-1.41 0zm12.73-12.73a1 1 0 0 1 0-1.42l1.42-1.41a1 1 0 1 1 1.41 1.42l-1.41 1.41a1 1 0 0 1-1.42 0z"/></svg>',
    // Moon (shown in light mode → click to go dark)
    dark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79z"/></svg>'
};

const ICONS = {
    email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v.01L12 13l8-6.99V6H4zm0 12h16V8.236l-7.445 6.51a1 1 0 0 1-1.31 0L4 8.236V18z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.05-.24c1.16.39 2.4.6 3.67.6a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A18 18 0 0 1 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.27.21 2.51.6 3.67a1 1 0 0 1-.25 1.05l-2.23 2.07z"/></svg>',
    location: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a8 8 0 0 0-8 8c0 5.4 7.05 11.5 7.35 11.76a1 1 0 0 0 1.3 0C12.95 21.5 20 15.4 20 10a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 3A2 2 0 0 1 21 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18V9.67H5.67V18h2.67zM7 8.5a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zM18.34 18v-4.56c0-2.4-1.28-3.52-2.99-3.52-1.38 0-2 .76-2.34 1.29V9.67h-2.67c.04.75 0 8.33 0 8.33h2.67v-4.65c0-.24.02-.48.09-.65.18-.48.62-.97 1.34-.97.95 0 1.33.72 1.33 1.78V18h2.57z"/></svg>',
    github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.18c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z"/></svg>',
    web: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.93 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82A13.7 13.7 0 0 1 12 4.04zM4.26 14a7.99 7.99 0 0 1 0-4h3.38a16.5 16.5 0 0 0 0 4H4.26zm.81 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.99 7.99 0 0 1 5.07 16zm2.95-8H5.07a7.99 7.99 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.02 8zM12 19.96A13.7 13.7 0 0 1 10.09 16h3.82A13.7 13.7 0 0 1 12 19.96zM14.34 14H9.66a14.5 14.5 0 0 1 0-4h4.68a14.5 14.5 0 0 1 0 4zm.26 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14a16.5 16.5 0 0 0 0-4h3.38a7.99 7.99 0 0 1 0 4h-3.38z"/></svg>',
    permit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5zm0 2h14v14H5V5zm7 1.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm-4.5 11c0-2.21 2.015-4 4.5-4s4.5 1.79 4.5 4v.5h-9v-.5z"/></svg>'
};

function getInitialLang() {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (fromUrl && SUPPORTED_LANGS.includes(fromUrl)) return fromUrl;

    const fromStorage = localStorage.getItem(STORAGE_KEY);
    if (fromStorage && SUPPORTED_LANGS.includes(fromStorage)) return fromStorage;

    const fromBrowser = (navigator.language || "").slice(0, 2);
    if (SUPPORTED_LANGS.includes(fromBrowser)) return fromBrowser;

    return DEFAULT_LANG;
}

function getInitialTrack() {
    const fromUrl = new URLSearchParams(window.location.search).get("track");
    if (fromUrl && SUPPORTED_TRACKS.includes(fromUrl)) return fromUrl;

    const fromStorage = localStorage.getItem(TRACK_STORAGE_KEY);
    if (fromStorage && SUPPORTED_TRACKS.includes(fromStorage)) return fromStorage;

    return DEFAULT_TRACK;
}

async function loadData(lang, track) {
    const langData = window.CV_DATA && window.CV_DATA[lang];
    if (!langData) {
        throw new Error(`No CV data found for "${lang}". Make sure data/cv.${lang}.ic.js and data/cv.${lang}.em.js are loaded before app.js in index.html.`);
    }
    const data = langData[track];
    if (!data) {
        throw new Error(`No CV data found for track "${track}" in "${lang}".`);
    }
    return data;
}

function el(tag, options = {}, children = []) {
    const node = document.createElement(tag);
    if (options.className) node.className = options.className;
    if (options.text != null) node.textContent = options.text;
    if (options.html != null) node.innerHTML = options.html;
    if (options.attrs) {
        for (const [k, v] of Object.entries(options.attrs)) {
            if (v != null) node.setAttribute(k, v);
        }
    }
    for (const child of children) {
        if (child) node.appendChild(child);
    }
    return node;
}

function renderHeader(data) {
    const header = document.querySelector(".header");
    header.innerHTML = "";

    const main = el("div", { className: "header-main" });

    if (data.profile.photoUrl) {
        const shape = data.profile.photoShape === "circle" ? "photo--circle" : "photo--square";
        const photo = el("img", {
            className: `photo ${shape}`,
            attrs: { src: data.profile.photoUrl, alt: data.profile.name }
        });
        header.appendChild(photo);
    }

    main.appendChild(el("h1", { className: "name", text: data.profile.name }));
    main.appendChild(el("p", { className: "title", text: data.profile.title }));
    header.appendChild(main);

    const contacts = el("ul", { className: "contacts" });
    for (const c of data.contacts) {
        const iconSvg = ICONS[c.type] || "";
        const li = el("li");
        li.innerHTML = `<span class="icon-wrap">${iconSvg}</span>`;

        if (c.href) {
            const a = el("a", { text: c.value, attrs: { href: c.href, target: "_blank", rel: "noopener" } });
            li.appendChild(a);
        } else {
            li.appendChild(el("span", { text: c.value }));
        }
        contacts.appendChild(li);
    }
    header.appendChild(contacts);
}

function renderSummary(data) {
    const summary = document.querySelector(".summary");
    summary.innerHTML = "";
    summary.appendChild(el("p", { text: data.profile.summary }));
}

function formatDateRange(start, end) {
    if (!start && !end) return "";
    if (!end) return start;
    return `${start} – ${end}`;
}

function renderSidebar(data) {
    const sidebar = document.querySelector(".sidebar");
    sidebar.innerHTML = "";

    // Skills
    const skillsSection = el("section", { className: "section" });
    skillsSection.appendChild(el("h2", { className: "section-title", text: data.ui.sections.skills }));
    const skillsList = el("ul", { className: "skills" });
    for (const skill of data.skills) {
        skillsList.appendChild(el("li", { text: skill }));
    }
    skillsSection.appendChild(skillsList);
    sidebar.appendChild(skillsSection);

    // Languages
    if (data.languages && data.languages.length) {
        const section = el("section", { className: "section" });
        section.appendChild(el("h2", { className: "section-title", text: data.ui.sections.languages }));
        const list = el("ul", { className: "languages" });
        for (const lang of data.languages) {
            const li = el("li");
            li.appendChild(el("span", { className: "lang-name", text: lang.name }));
            li.appendChild(el("span", { className: "lang-level", text: lang.level }));
            list.appendChild(li);
        }
        section.appendChild(list);
        sidebar.appendChild(section);
    }

    // Teaching
    if (data.teaching && data.teaching.length) {
        const section = el("section", { className: "section" });
        section.appendChild(el("h2", { className: "section-title", text: data.ui.sections.teaching }));
        for (const item of data.teaching) {
            const entry = el("div", { className: "entry compact" });
            entry.appendChild(el("h3", { className: "entry-title", text: item.title }));
            if (item.organization) entry.appendChild(el("p", { className: "entry-org", text: item.organization }));
            entry.appendChild(el("p", { className: "entry-meta", text: formatDateRange(item.startDate, item.endDate) }));
            section.appendChild(entry);
        }
        sidebar.appendChild(section);
    }

    // Side projects
    if (data.sideProjects && data.sideProjects.length) {
        const section = el("section", { className: "section" });
        section.appendChild(el("h2", { className: "section-title", text: data.ui.sections.sideProjects }));
        for (const item of data.sideProjects) {
            const entry = el("div", { className: "entry compact" });
            const titleNode = item.url
                ? el("a", { text: item.title, attrs: { href: item.url, target: "_blank", rel: "noopener" } })
                : null;
            const titleEl = el("h3", { className: "entry-title" });
            if (titleNode) titleEl.appendChild(titleNode);
            else titleEl.textContent = item.title;
            entry.appendChild(titleEl);
            entry.appendChild(el("p", { className: "entry-meta", text: formatDateRange(item.startDate, item.endDate) }));
            if (item.description) entry.appendChild(el("p", { className: "entry-desc", text: item.description }));
            section.appendChild(entry);
        }
        sidebar.appendChild(section);
    }
}

function renderWorkExperience(data) {
    const main = document.querySelector(".main-col");
    main.innerHTML = "";
    main.appendChild(el("h2", { className: "section-title", text: data.ui.sections.workExperience }));

    for (const job of data.workExperience) {
        const article = el("article", { className: "entry" });
        article.appendChild(el("h3", { className: "entry-title", text: job.title }));
        if (job.company) article.appendChild(el("p", { className: "entry-org", text: job.company }));

        const metaParts = [];
        const range = formatDateRange(job.startDate, job.endDate);
        if (range) metaParts.push(range);
        if (job.location) metaParts.push(job.location);
        if (metaParts.length) {
            article.appendChild(el("p", { className: "entry-meta", text: metaParts.join(" · ") }));
        }

        if (Array.isArray(job.description)) {
            for (const para of job.description) {
                article.appendChild(el("p", { className: "entry-desc", text: para }));
            }
        } else if (job.description) {
            article.appendChild(el("p", { className: "entry-desc", text: job.description }));
        }

        if (job.achievements && job.achievements.length) {
            article.appendChild(el("p", { className: "achievements-label", text: data.ui.achievements }));
            const list = el("ul", { className: "achievements" });
            for (const a of job.achievements) {
                list.appendChild(el("li", { text: a }));
            }
            article.appendChild(list);
        }

        main.appendChild(article);
    }
}

function renderLanguageSwitcher(data, currentLang, onChange) {
    const switcher = document.querySelector(".lang-switcher");
    switcher.innerHTML = "";
    for (const lang of SUPPORTED_LANGS) {
        const label = (data.ui.languageSwitcher && data.ui.languageSwitcher[lang]) || lang.toUpperCase();
        const btn = el("button", {
            className: `lang-btn${lang === currentLang ? " is-active" : ""}`,
            text: label,
            attrs: { type: "button", "data-lang": lang, "aria-pressed": String(lang === currentLang) }
        });
        btn.addEventListener("click", () => onChange(lang));
        switcher.appendChild(btn);
    }
}

function renderTrackSwitcher(data, currentTrack, onChange) {
    const switcher = document.querySelector(".track-switcher");
    if (!switcher) return;
    switcher.innerHTML = "";
    const labels = (data.ui && data.ui.trackSwitcher) || {};
    for (const track of SUPPORTED_TRACKS) {
        const label = labels[track] || track.toUpperCase();
        const btn = el("button", {
            className: `track-btn${track === currentTrack ? " is-active" : ""}`,
            text: label,
            attrs: { type: "button", "data-track": track, "aria-pressed": String(track === currentTrack) }
        });
        btn.addEventListener("click", () => onChange(track));
        switcher.appendChild(btn);
    }
}

function renderDownloadButton(data) {
    const btn = document.querySelector(".download-btn");
    if (!btn) return;
    const label = (data.ui && data.ui.downloadPdf) || "Download PDF";
    const labelNode = btn.querySelector(".download-btn__label");
    if (labelNode) labelNode.textContent = label;
    btn.setAttribute("aria-label", label);

    if (!btn.dataset.bound) {
        btn.addEventListener("click", () => window.print());
        btn.dataset.bound = "true";
    }
}

function getCurrentTheme() {
    const attr = document.documentElement.getAttribute("data-theme");
    return SUPPORTED_THEMES.includes(attr) ? attr : "light";
}

function applyTheme(theme) {
    if (!SUPPORTED_THEMES.includes(theme)) theme = "light";
    document.documentElement.setAttribute("data-theme", theme);
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
        /* ignore storage errors (e.g. private mode) */
    }
}

function renderThemeToggle(data) {
    const btn = document.querySelector("[data-theme-toggle]");
    if (!btn) return;

    const theme = getCurrentTheme();
    const ui = data.ui || {};
    // Label describes the action the click will perform.
    const labelToDark = ui.darkMode || "Dark mode";
    const labelToLight = ui.lightMode || "Light mode";
    const nextLabel = theme === "dark" ? labelToLight : labelToDark;

    const iconHost = btn.querySelector(".theme-btn__icon");
    if (iconHost) {
        // Show the icon of the *current* mode (sun in dark, moon in light).
        iconHost.innerHTML = theme === "dark" ? THEME_ICONS.light : THEME_ICONS.dark;
    }
    btn.setAttribute("aria-label", nextLabel);
    btn.title = nextLabel;

    if (!btn.dataset.bound) {
        btn.addEventListener("click", () => {
            const next = getCurrentTheme() === "dark" ? "light" : "dark";
            applyTheme(next);
            renderThemeToggle(data);
        });
        btn.dataset.bound = "true";
    }
}

function applyMeta(data, lang) {
    document.documentElement.setAttribute("lang", lang);
    if (data.meta && data.meta.documentTitle) {
        document.title = data.meta.documentTitle;
    }
}

let currentLang = DEFAULT_LANG;
let currentTrack = DEFAULT_TRACK;

async function render(lang, track) {
    try {
        currentLang = lang;
        currentTrack = track;
        const data = await loadData(lang, track);
        applyMeta(data, lang);
        renderHeader(data);
        renderSummary(data);
        renderSidebar(data);
        renderWorkExperience(data);
        renderLanguageSwitcher(data, lang, switchLang);
        renderTrackSwitcher(data, track, switchTrack);
        renderDownloadButton(data);
        renderThemeToggle(data);
        localStorage.setItem(STORAGE_KEY, lang);
        localStorage.setItem(TRACK_STORAGE_KEY, track);
    } catch (err) {
        const main = document.querySelector(".page");
        main.innerHTML = `<div class="error"><h2>Could not load CV data</h2><p>${err.message}</p></div>`;
    }
}

function switchLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState({}, "", url);
    render(lang, currentTrack);
}

function switchTrack(track) {
    if (!SUPPORTED_TRACKS.includes(track)) return;
    const url = new URL(window.location.href);
    url.searchParams.set("track", track);
    window.history.replaceState({}, "", url);
    render(currentLang, track);
}

document.addEventListener("DOMContentLoaded", () => {
    render(getInitialLang(), getInitialTrack());

    // If the user hasn't picked a theme manually, follow OS preference live.
    if (window.matchMedia) {
        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        const onChange = (e) => {
            try {
                if (localStorage.getItem(THEME_STORAGE_KEY)) return;
            } catch (err) {
                /* fall through */
            }
            document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
            const langData = window.CV_DATA && window.CV_DATA[currentLang];
            const data = langData && langData[currentTrack];
            if (data) renderThemeToggle(data);
        };
        if (mql.addEventListener) mql.addEventListener("change", onChange);
        else if (mql.addListener) mql.addListener(onChange);
    }
});
