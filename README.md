# Ivan Afanasyev — CV

A data-driven, bilingual (EN/RU) HTML/CSS CV. **No build step, no server** —
just open `index.html` in a browser.

Live version: <https://ivan-afanasiev.github.io/resume/>

## Run it locally

Double-click `index.html`, or:

```bash
open index.html
```

That's it. The data is loaded as plain `<script>` tags, so it works straight
from `file://`.

## Deployment

The site is published to GitHub Pages automatically via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Every push to
`main` triggers a deployment — usually live within ~1 minute.

To enable Pages on a fresh fork:

1. **Settings → Pages → Build and deployment → Source**: select **GitHub Actions**.
2. Push to `main` (or run the workflow manually via the Actions tab).

## File structure

```
.
├── index.html          # Thin shell, hydrated by app.js
├── app.js              # Renders the CV, handles language switching
├── styles.css          # Screen styles (two-column classic CV look)
├── print.css           # Print-only styles (clean A4 PDF export)
└── data/
    ├── cv.en.js        # English content
    └── cv.ru.js        # Russian content
```

## Editing content

All content lives in `data/cv.<lang>.js`. Each file is just a JSON-shaped object
assigned to `window.CV_DATA.<lang>`:

```js
window.CV_DATA = window.CV_DATA || {};
window.CV_DATA.en = {
    "profile": { ... },
    "skills":  [ ... ],
    "workExperience": [ ... ],
    ...
};
```

Edit the object literally like JSON — keys in quotes, commas between fields,
no trailing commas. The two language files share the same shape: if you add a
job in the EN file, mirror it in the RU file (and vice versa).

### Adding / removing a job

Add an item to `workExperience`:

```js
{
    "title": "Staff Software Engineer",
    "company": "Onfido (an Entrust Company)",
    "startDate": "12/2021",
    "endDate": "Present",
    "location": "Berlin, Germany",
    "description": [
        "Paragraph 1...",
        "Paragraph 2..."
    ],
    "achievements": [
        "Bullet 1",
        "Bullet 2"
    ]
}
```

`description` can be a single string or an array of paragraphs.
`achievements` is optional. Remove an entry by deleting it from the array.

### Profile / summary / skills

```js
"profile": {
    "name": "Ivan Afanasyev",
    "title": "Staff Software Engineer",
    "photoUrl": "https://example.com/me.jpg",
    "photoShape": "square",
    "summary": "Long paragraph..."
},
"skills": ["Leadership", "iOS", "Swift", "..."]
```

`photoShape` can be `"square"` (rounded square, matches the PDF) or `"circle"`.
Leave `photoUrl` empty (`""`) to hide the photo.

### Languages spoken / Teaching / Side projects

Each is a top-level array — same idea: add or remove entries to update the CV.

### Contacts

```js
"contacts": [
    { "type": "email", "value": "you@example.com", "href": "mailto:you@example.com" },
    { "type": "phone", "value": "+49 …", "href": "tel:+49…" },
    { "type": "location", "value": "Berlin, Germany" },
    { "type": "linkedin", "value": "linkedin.com/in/you", "href": "https://linkedin.com/in/you" }
]
```

Supported `type` values (control which icon is shown): `email`, `phone`,
`location`, `permit`, `linkedin`, `github`, `web`. Anything else still renders
without an icon.

## Language switching

Top-right buttons toggle between EN and RU. The choice is remembered in
`localStorage` and reflected as `?lang=en` / `?lang=ru` in the URL — handy for
sharing a direct link to the Russian version.

Initial language detection order:

1. `?lang=…` query parameter
2. Last saved choice (`localStorage`)
3. Browser `navigator.language`
4. Fallback: `en`

## Exporting to PDF

`Cmd+P` → **Save as PDF**. The print stylesheet:

- hides the language switcher
- removes link colors / underlines for cleaner print
- tightens spacing for A4
- preserves accent colors (make sure *Background graphics* is enabled in the
  print dialog)
