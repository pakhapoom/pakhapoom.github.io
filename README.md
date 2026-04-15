# Literature Vault

A static site for storing, searching, and exploring academic paper summaries.

![Landing Page](assets/landing-page.png)

Deployed at: https://pakhapoom.github.io/

## Setup after cloning

A git hook keeps `data/index.json` in sync automatically. Install it once after cloning:

```bash
cp scripts/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

After that, `data/index.json` is updated on every `git commit` — no manual edits needed.
