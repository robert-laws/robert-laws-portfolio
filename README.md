# Robert Laws Portfolio

Single-page professional portfolio for Robert Laws, built for fast GitHub Pages deployment with:

- HTML5
- Tailwind CSS via CDN
- Vanilla JavaScript
- Lucide icons via CDN

## Project Structure

- `index.html` - layout, content, Tailwind config, and custom CSS
- `script.js` - navigation, dark mode, reveal animations, and mailto form behavior
- `resume.pdf` - downloadable resume
- `.gitignore` - basic local exclusions

## Local Preview

From the project directory:

```bash
python3 -m http.server 4173
```

Then visit:

`http://127.0.0.1:4173`

## Deploy To GitHub Pages

If your GitHub account is `robert-laws`, the final URL will be:

`https://robert-laws.github.io/robert-laws-portfolio/`

Recommended CLI flow:

```bash
git init -b main
git add .
git commit -m "Initial portfolio site"
gh repo create robert-laws-portfolio --public --source=. --remote=origin --push
gh api -X POST "repos/$(gh repo view --json nameWithOwner -q .nameWithOwner)/pages" \
  -f build_type=legacy \
  -f source[branch]=main \
  -f source[path]=/
```

Manual fallback:

1. Create a public GitHub repository named `robert-laws-portfolio`.
2. Push the local `main` branch.
3. In GitHub, open `Settings -> Pages`.
4. Set source to `Deploy from a branch`.
5. Select `main` and folder `/(root)`.

## Customize

- Replace the `RL` monogram in the hero panel with a real headshot if you want a portrait.
- Update the footer GitHub link if the repository is created under a different username.
- Add an Open Graph image later if you want richer social sharing previews.
