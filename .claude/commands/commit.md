Stage all changes and create a git commit following the Conventional Commits format.
1. Run `git status` to see what's changed
2. Run `git diff --staged` and `git diff` to understand the changes
3. Infer the appropriate commit type: feat, fix, docs, chore, refactor, test, style
4. Write a concise commit message: `<type>(<scope>): <description>`
5. Run `git add <file1> <file2> <...>` — include both modified and untracked files from `git status` — then `git commit -m "<your message>"`

Note:
- Do not ask for confirmation — just commit.
- If there are several changes, do not commit all changes at once. Try to combine relevant changes to the same commit.
- The description must fit on a single line — no body text unless truly necessary.
