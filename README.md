# Calico Sunbeam

Source for [calicosunbeam.org](https://calicosunbeam.org) — my personal site. Plain HTML and CSS, no build step, no framework, served as static files.

## Structure

```
index.html            homepage
about.html            degree, thesis, ORCID, the academic stuff
construction.html     the original single-page "under construction" placeholder, kept for posterity
template.html         well-commented starting point for making a new page
404.html              plain-text 404 page
style.css             shared stylesheet for every real page
components/
  nav.html              the nav bar markup, fetched and mounted at runtime
  nav.js                fetches nav.html into #nav-mount, marks the active link, and drives dropdown menus
garden/
  index.html            a field note explaining the bot trap below
creative/
  index.html            "Creative Works" hub page
  cassette-tape-assets/
    index.html            printable j-cards and labels, ported from the old Neocities page
    images/               the full-resolution album art
    images/thumbs/        small JPEG previews used on the page itself
globalmedia/
  favicon.png
  calicocrest.png
configfilebackups/
  Caddyfile.copy              a copy of the Caddyfile the live site is served with
  dockercompose.redactedcopy  a copy of the compose file behind it, secrets stripped
```

The bot-trap layer lives at the edge, not in this repo: a Cloudflare WAF/redirect rule catches common attack-surface paths (`/.git/`, `/.env`, `/wp-admin`, etc.) and sends them straight to `/teapot/` instead of blocking them. See [`/garden/`](https://calicosunbeam.org/garden/) for the writeup.

## Design system

Every design token lives in `style.css` as a CSS custom property: colours, fonts, spacing. Nothing is hardcoded inline. Key tokens:

| Token | Value |
|---|---|
| `--bg` | `#0d0d0d` |
| `--orange` | `#FF6600` |
| `--cream` | `#f4ecdd` |
| `--moss` | `#6b8f47` |
| `--muted` | `#948c80` |
| `--font-display` | Fraunces |
| `--font-mono` | IBM Plex Mono |
| `--font-body` | Atkinson Hyperlegible |

Shared visual elements (grain overlay, sunbeam glow, vine/leaf footer) are defined once in `style.css` and reused across every page.

## The nav

The nav isn't duplicated in every file. Each page includes an empty mount point and a script:

```html
<div id="nav-mount"></div>
<script src="/components/nav.js"></script>
```

`nav.js` fetches `/components/nav.html`, drops it into the mount point, then compares `location.pathname` against each link's `href` to mark the current page with `aria-current="page"`. To change the nav (add a link, rename something), edit `components/nav.html` once — every page picks it up automatically.

The nav also supports click-to-toggle dropdowns, used for the "Creative Works" menu. Wrap a `.nav-dropdown-toggle` button and a `.nav-dropdown-menu` of links in a `.nav-dropdown` container inside `nav.html`; `nav.js` wires up the open/close behaviour (click, outside-click, and Escape to close) automatically, and the matching styles live in `style.css` under `nav: "Creative Works" style dropdown menus`.

## Running locally

No build step, no dependencies. Any static file server works:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000/`.

## Deployment

The live site is a Caddy container serving this repo as static files (`file_server`, no reverse proxy logic beyond gzip). A separate container does a `git pull` to sync the checkout on disk; it isn't scheduled, so a new push doesn't go live until that container is re-run. See `configfilebackups/` for copies of the actual Caddyfile and compose setup.
