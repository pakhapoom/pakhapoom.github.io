---
name: project-review
description: Reviews project structure, code quality, and organization against best practices. Use when auditing a project or performing a health check.
allowed-tools: Read, Glob, Grep, Bash(find:*), Bash(git log:*), Bash(git status:*)
argument-hint: [scope] (e.g. "full", "structure-only", "dependencies")
---

## Review Instructions

Perform a thorough project review covering these areas in order:

### 1. Project Structure
- Verify folder organization matches the project type (MVC, feature-based, etc.)
- Flag misplaced files or inconsistent naming conventions
- Check for a clear separation of concerns

### 2. Code Quality
- Identify duplicated logic that should be abstracted
- Flag functions/classes that are too long or doing too much
- Note missing error handling or edge cases

### 3. Dependencies
- Check for unused or outdated packages
- Flag any security-sensitive dependencies
- Look for packages that could be replaced with native APIs

### 4. Documentation
- Verify README is present and up-to-date
- Check for inline comments on complex logic
- Confirm public APIs or functions are documented

### 5. Best Practices
- Confirm `.gitignore`, `.env.example`, and config files are present
- Check for hardcoded secrets or credentials
- Verify test coverage exists for critical paths

## Output Format

Present findings as a prioritized report:

**🔴 Critical** — Must fix before next release  
**🟡 Important** — Should address soon  
**🟢 Nice-to-have** — Improvements for later  

For each issue include:
- File path and line number (if applicable)
- Why it's a problem
- A concrete recommended fix

## Scope
{{#if $ARGUMENTS}}
Focus the review only on: $ARGUMENTS
{{else}}
Perform a full project review.
{{/if}}
