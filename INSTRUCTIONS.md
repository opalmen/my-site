# Economist Site — Setup & Workflow Guide

## Prerequisites

You need Hugo installed. Check with:
```bash
hugo version
```
You need at least Hugo v0.110.0 (extended is fine). If not installed:
```bash
# Ubuntu/Debian
sudo apt install hugo

# Or via Snap (more up-to-date):
sudo snap install hugo

# Or download binary from https://github.com/gohugoio/hugo/releases
```

---

## Initial Setup (one time only)

### 1. Create the Hugo site scaffold

```bash
hugo new site mysite
cd mysite
```

### 2. Copy the theme files

Copy the `themes/economist/` folder from the delivered zip into your `mysite/themes/` directory:

```bash
cp -r /path/to/delivered/themes/economist themes/
```

### 3. Copy the config and content

```bash
cp /path/to/delivered/hugo.toml .
cp -r /path/to/delivered/content .
cp -r /path/to/delivered/archetypes .
```

### 4. Edit your personal info

Open `hugo.toml` and update:
- `title` — your name
- `[params]` block — your name, tagline, bio, email

Open `content/_index.md` and write your actual bio.

### 5. Preview locally

```bash
hugo server -D
```

Visit http://localhost:1313 in your browser. The site live-reloads on every save.

---

## Day-to-Day Workflow

### Adding a blog post

```bash
hugo new posts/your-post-title.md
```

This creates `content/posts/your-post-title.md` pre-filled from the archetype.

Edit the file. The key frontmatter fields:

```yaml
---
title: "Your Post Title"
date: 2024-06-01
tags: ["growth", "policy"]
sidenotes: true      # set false if you don't use sidenotes
---
```

Write your post in Markdown below the `---`.

#### Adding sidenotes

Inside your post body, use this shortcode:

```
{{</* sn id="sn1" note="Your sidenote text. Can include **markdown**." */>}}the anchor text{{</* /sn */>}}
```

- `id` must be unique per post: `sn1`, `sn2`, `sn3`, ...
- The anchor text appears in the body with a superscript number
- The note appears in the right margin on desktop
- On mobile / narrow screens it becomes a toggle (tap the number to reveal)
- Hovering over anchor highlights the note, and vice versa

### Adding a publication

```bash
hugo new publications/paper-short-name.md
```

Edit the frontmatter:

```yaml
---
title: "Full Paper Title"
type: "Journal Article"   # Working Paper | Journal Article | Book Chapter | Book
authors: "Your Name and Co-author"
journal: "American Economic Review"
year: 2024
volume: 114
pages: "1–45"
doi: "10.1257/aer.114.1.1"
pdf: "/papers/your-paper.pdf"   # put PDF in static/papers/
ssrn: ""
---
```

Papers are automatically grouped by `type` on the Research page, sorted by year.

To link a PDF: place the file in `static/papers/` and set `pdf: "/papers/filename.pdf"`.

---

## Building for Production

```bash
hugo --minify
```

This generates the site into the `public/` directory. Upload `public/` to your host.

---

## Hosting Options

### Option A: Netlify (Recommended — free tier is generous)

1. Push your site to a GitHub repository (include everything *except* `public/`)
2. Go to https://netlify.com → "Add new site" → "Import an existing project"
3. Connect your GitHub repo
4. Set build command: `hugo --minify`
5. Set publish directory: `public`
6. Netlify handles HTTPS, CDN, and redeploys automatically on every `git push`

To use a custom domain: go to Site settings → Domain management.

**`.env` tip**: set `HUGO_VERSION` in Netlify environment variables to match your local version to avoid surprises.

### Option B: GitHub Pages (free, slightly more setup)

1. Push to GitHub
2. In repo settings → Pages → Source: GitHub Actions
3. Create `.github/workflows/hugo.yml`:

```yaml
name: Deploy Hugo site to Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: 'latest'
          extended: false
      - run: hugo --minify
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

### Option C: Cloudflare Pages (free, fast CDN)

Similar to Netlify. Connect GitHub repo, set build command `hugo --minify`, publish dir `public`.

### Option D: Self-hosted VPS

Build locally with `hugo --minify`, then rsync:

```bash
rsync -avz --delete public/ user@yourserver.com:/var/www/yoursite/
```

---

## Updating the Site

The most efficient workflow:

```bash
# 1. Make your edits (new post, update bio, add publication)
# 2. Preview
hugo server

# 3. Commit and push
git add .
git commit -m "Add post: knowledge spillovers"
git push
```

If using Netlify or Cloudflare Pages, the site redeploys automatically after push. Done.

---

## Directory Structure Reference

```
mysite/
├── hugo.toml               ← site config, your name/bio/links
├── content/
│   ├── _index.md           ← homepage bio text
│   ├── posts/              ← blog posts
│   │   ├── _index.md       ← posts list page intro
│   │   └── your-post.md
│   └── publications/       ← research papers
│       ├── _index.md       ← publications page intro
│       └── paper.md
├── static/
│   └── papers/             ← put PDF files here
├── archetypes/
│   ├── posts.md            ← template for new posts
│   └── publications.md     ← template for new publications
└── themes/
    └── economist/
        ├── layouts/        ← HTML templates
        ├── static/
        │   ├── css/main.css
        │   └── js/sidenotes.js
        └── theme.toml
```

---

## Customisation Tips

### Change colors

Edit `themes/economist/static/css/main.css`, look for the `:root { }` block at the top.
Key variables:
- `--color-link` — link color
- `--color-accent` — rust red used for sidenote numbers
- `--color-bg` — page background

### Change fonts

The site uses Google Fonts (Lora for body, Source Sans 3 for UI). To change:
1. Pick fonts at https://fonts.google.com
2. Update the `<link>` tag in `themes/economist/layouts/_default/baseof.html`
3. Update `--font-body` and `--font-ui` in the CSS

### Add a profile photo to the homepage

In `content/_index.md`, add standard Markdown image syntax:
```markdown
![Your Name](/images/photo.jpg)
```
Place the image in `static/images/`. Then style it in CSS (e.g., `float: right; width: 180px; margin: 0 0 1rem 2rem; border-radius: 50%;`).

---

## Sidenote Authoring Quick Reference

```
{{</* sn id="sn1" note="Note text here." */>}}anchor text{{</* /sn */>}}
```

- Numbers are assigned automatically in document order
- `id` values must be unique within a post
- Set `sidenotes: true` in the post frontmatter to enable wider layout
- Markdown works inside the `note=""` attribute (links, emphasis, etc.)
