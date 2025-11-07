# Git Commands Used to Push Code to GitHub

## Complete List of Commands with Explanations

### 1. Check Git Status
```bash
git status
```
**Explanation:** Shows the current state of your working directory and staging area.

### 2. Stage Files for Commit
```bash
git add index.html styles.css
```
**Explanation:** Adds specific files to the staging area, preparing them for commit.

### 3. Stage All Files
```bash
git add .
```
**Explanation:** Stages all modified and new files in the current directory for commit.

### 4. Commit Changes
```bash
git commit -m "Enhanced navbar, added contact info, improved background grid, and polished text/images"
```
**Explanation:** Creates a commit with your staged changes and a descriptive message.

### 5. Check Commit History
```bash
git log --oneline -3
```
**Explanation:** Displays the last 3 commits in a compact one-line format.

### 6. Add Remote Repository
```bash
git remote add origin https://github.com/chaitanyatech77q/my-journey-website.git
```
**Explanation:** Adds a remote repository URL named "origin" pointing to your GitHub repository.

### 7. View Remote Repositories
```bash
git remote -v
```
**Explanation:** Lists all configured remote repositories with their URLs (fetch and push).

### 8. Rename Branch to Main
```bash
git branch -M main
```
**Explanation:** Renames the current branch to "main" (GitHub's default branch name).

### 9. Pull Remote Changes (First Time)
```bash
git pull origin main --allow-unrelated-histories --no-edit
```
**Explanation:** Fetches and merges remote changes, allowing unrelated histories to be merged.

### 10. Resolve Merge Conflicts
```bash
# Edit the conflicted file (README.md) to resolve conflicts
# Then stage the resolved file:
git add README.md
```
**Explanation:** Stages the resolved file after fixing merge conflicts.

### 11. Commit Merge Resolution
```bash
git commit -m "Merge remote README with local detailed version"
```
**Explanation:** Commits the merge resolution after fixing conflicts.

### 12. Push to Remote Repository
```bash
git push -u origin main
```
**Explanation:** Pushes your local commits to the remote repository and sets up tracking.

### 13. Verify Push Success
```bash
git status
```
**Explanation:** Confirms that your branch is up to date with the remote repository.

---

## Quick Reference: Complete Workflow

```bash
# 1. Check status
git status

# 2. Stage your changes
git add .

# 3. Commit changes
git commit -m "Your commit message"

# 4. Add remote (first time only)
git remote add origin https://github.com/username/repository.git

# 5. Rename branch to main (if needed)
git branch -M main

# 6. Push to remote
git push -u origin main
```

---

## Additional Useful Commands

### View All Branches
```bash
git branch -a
```
**Explanation:** Lists all local and remote branches.

### View Detailed Commit History
```bash
git log --oneline --all --graph
```
**Explanation:** Shows a visual graph of all commits across all branches.

### Check Remote Connection
```bash
git remote show origin
```
**Explanation:** Displays detailed information about the remote repository.

### Pull Latest Changes
```bash
git pull origin main
```
**Explanation:** Fetches and merges the latest changes from the remote repository.

### Push Without Setting Upstream
```bash
git push origin main
```
**Explanation:** Pushes to remote without setting up branch tracking.

### Clone a Repository
```bash
git clone https://github.com/username/repository.git
```
**Explanation:** Creates a local copy of a remote repository.

### Initialize New Repository
```bash
git init
```
**Explanation:** Initializes a new Git repository in the current directory.

---

## Commands Used in This Project

Here's the exact sequence we used:

```bash
# 1. Check what files changed
git status

# 2. Stage the modified files
git add index.html styles.css

# 3. Commit the changes
git commit -m "Enhanced navbar, added contact info, improved background grid, and polished text/images"

# 4. Add GitHub remote repository
git remote add origin https://github.com/chaitanyatech77q/my-journey-website.git

# 5. Verify remote was added
git remote -v

# 6. Rename branch to main
git branch -M main

# 7. Pull remote changes (first time - had conflicts)
git pull origin main --allow-unrelated-histories --no-edit

# 8. Resolve conflicts in README.md, then stage it
git add README.md

# 9. Commit the merge
git commit -m "Merge remote README with local detailed version"

# 10. Push to GitHub
git push -u origin main

# 11. Verify everything is synced
git status
```

---

## Notes

- `-u` flag in `git push -u origin main` sets up tracking so future pushes can use just `git push`
- `--allow-unrelated-histories` is needed when merging two repositories with different histories
- Always check `git status` before and after important operations
- Use descriptive commit messages to track your changes

