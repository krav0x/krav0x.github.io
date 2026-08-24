# Portfolio site

Plain HTML, CSS, and a small JS file. No build step, no framework.

## Files

- `index.html` — content and structure
- `styles.css` — all styling
- `main.js` — mobile menu, active nav highlight, year update

## Local preview

Just open `index.html` in a browser. Or serve it:

```bash
python -m http.server 8000
# then http://localhost:8000
```

## Deploy to GitHub Pages

There are two options. Both are free.

### Option A: user site at `krav81nite.github.io`

1. On GitHub, create a new public repo named exactly `krav81nite.github.io`
2. Push these three files (and the README) to the `main` branch:

    ```bash
    git init
    git add .
    git commit -m "Initial portfolio"
    git branch -M main
    git remote add origin https://github.com/krav81nite/krav81nite.github.io.git
    git push -u origin main
    ```

3. Repo settings → Pages → source: `main` branch, root folder. Save.
4. Live at `https://krav81nite.github.io` within a minute or two.

### Option B: project site at `krav81nite.github.io/portfolio`

1. Create any repo, e.g. `portfolio`
2. Push these files to `main`
3. Repo settings → Pages → source: `main` branch
4. Live at `https://krav81nite.github.io/portfolio`

Option A is cleaner as a personal URL. Recommended.

## Things to fill in before publishing

Search `index.html` for these and replace:

- `your-email@example.com` — your real email address (2 places, in `#contact` and the mailto link)
- `linkedin.com/in/your-handle` — your LinkedIn URL
- Confirm surname spelling (currently "Kravice") in `<title>`, the hero eyebrow, and the footer

Also review:

- The About section copy
- The Master's dates (currently "2024 to 2026")
- The DXspark Padawan dates (currently "2024 to 2025")
- Whether you want the pig farming business mentioned by name (currently mentioned generically)

## Customising the look

Everything visual lives in `:root` at the top of `styles.css`. Change the accent colour, fonts, or spacing there and it cascades. The palette variables:

```css
--paper: #FBFAF7;   /* background */
--ink: #1A1A1A;     /* text */
--ledger: #B7302B;  /* accent (accountant's red ink) */
--muted: #7A7268;   /* secondary text */
--hairline: #E4DED4;/* borders */
```

If you want a darker theme instead, flip `--paper` and `--ink` and tune the rest.

## Adding a new project

Copy an existing `<article class="project">` block in `index.html` and edit the fields. The structure is:

```html
<article class="project">
    <header class="project__head">
        <h3>Project name</h3>
        <p class="project__kind">Status label</p>
    </header>
    <p>What you did and why it mattered.</p>
    <p class="project__note">// short technical annotation</p>
    <ul class="tags tags--sm">
        <li>Tag one</li>
        <li>Tag two</li>
    </ul>
</article>
```

## Custom domain (optional, later)

If you buy a domain later:

1. Add a file named `CNAME` at the repo root containing just the domain (e.g. `diogokravice.com`)
2. Point the domain's DNS at GitHub Pages (see GitHub's docs for the current IPs)
3. Enable "Enforce HTTPS" in Pages settings
