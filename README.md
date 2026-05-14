# Mishilingo

CG Queen's Kannada Kingdom for Mishi.

## Deploy

This is a static site. Deploy the folder directly on Vercel:

1. Push `index.html`, `style.css`, `script.js`, and `vercel.json` to GitHub.
2. Import the GitHub repository in Vercel.
3. Use the default static deployment settings. No build command is needed.

## Local Preview

Open through a local server instead of `file://`:

```bash
python -m http.server 8765
```

Then visit:

```text
http://127.0.0.1:8765
```

Browser speech works more reliably from `localhost` or an HTTPS Vercel URL than from a direct file open.
