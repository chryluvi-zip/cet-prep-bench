# CET Prep Bench

A Philippine college entrance test review site with 131 lessons and 920 practice items. The site runs in the browser with plain HTML, CSS, and JavaScript. It needs no dependencies, build command, server account, or API key.

## Open and edit

Open `index.html` in a browser, or run `python3 -m http.server 8000` from this directory and visit [localhost:8000](http://localhost:8000/). Use the local server to test saved answers consistently.

| File | Purpose |
| --- | --- |
| `index.html` | Page shell and navigation landmarks |
| `modules.js` | Lessons, reading passages, questions, and answer keys |
| `app.js` | Topic search, navigation, grading, local storage, printing, and study references |
| `bloom.css` and `site.css` | Lunar Bloom design tokens, components, layout, and print styles |
| `assets/` and `fonts/` | Supplied design assets and bundled font notices |
| `.nojekyll` | Direct static publishing on GitHub Pages |

Answers are stored locally by browser and site address. The GitHub copy starts with its own browser storage. Answer keys are included in the site's source so the worksheets can grade responses in the browser.

## Push to GitHub

Create an empty repository on GitHub. Leave the README, .gitignore, and license options unchecked. In a terminal opened in this extracted folder, run the following commands after replacing `YOUR-USERNAME` and, if needed, the repository name.

```sh
git init -b main
git add .
git commit -m "Add CET Prep Bench"
git remote add origin https://github.com/YOUR-USERNAME/cet-prep-bench.git
git push -u origin main
```

If Git prompts for HTTPS authentication, use GitHub CLI or Git Credential Manager, or authenticate with a personal access token. [GitHub authentication documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github)

## Optional GitHub Pages hosting

In the GitHub repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select **main** and **/ (root)**, then click **Save**. Use the URL GitHub shows after deployment. [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

GitHub Pages can make a site publicly accessible even when the source repository is private. Use a private repository for source-only storage if you want to keep access restricted. A GitHub push is separate from the existing private Sites deployment.

## Design assets

This export includes the supplied Lunar Bloom artwork and font files used by the Sites build. Font notices are in `fonts/`. Check permission to redistribute the supplied artwork and fonts before making the repository or site public. Choose a repository license only after deciding which rights to grant for your own work.
# cet-prep-bench
# cet-prep-bench
