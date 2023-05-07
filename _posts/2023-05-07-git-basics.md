---
title: Git basics
date: 2023-05-07 11:00:00 +0700
categories: [git, basics]
tags: [version control system, git]
math: true
mermaid: true
img_path: /git/basics/
---

This is my note from the course: [Introduction to Git and GitHub](https://www.coursera.org/learn/introduction-git-github).

## Git components
* Git directory: history of all changes to the files.
* Git working tree: current workspace.
* Staging area (index): changes from Git working tree to be committed to Git directory. 

## Basic commands to access `git` in a working directory
* `ls -l .git/`: list git objects in the current directory.
* `ls -la`: list all files in the current directory.
* `git config -l`: see all configurations of `git`.

## Status of a file in `git`
* `untracked`: a newly added file in Git working tree.
* tracked
    * `modified`: add or remove some parts of an existing file, but the changes are still in Git working tree.
    * `staged`: the changes of the file are in Staging area.
    * `committed`: the changes are committed to Git directory.
It is noted that one may list some files in `.gitignore` to ask `git` not to keep track on the changes made to those files.

## Basic commands to see changes
* `git commit -a -m '<commit message>'`: stage the changes and commit them at the same time.
* `git log -p -N`: see log of changes of the previous $N$ commits.
* `git show <commit id>`: see changes of a specific commit.
* `git log --stat`: see changes in terms of `+` and `-` to represent added and removed parts, respectively.
* `git diff`: see unstaged changes.
* `git add -p`: see unstaged changes and stage the changes.
* `git diff --staged`: see the staged changes (use `git diff` after staging the changes does not work).

## Undo changes
* in Git working tree (before staging).
    * `git checkout <file>`: revert changes modified to a file.
    * `git checkout -p`: revert changes to a specific checkpoint.
* in Staging area.
    * `git reset HEAD <file>`: reset the currently checked-out snapshot (`HEAD`).
* in Git directory (after committing).
    * `git commit --amend`: overwrite previous commit (assuming some corrections made before using this command).
    * `git revert HEAD`: create a new commit by canceling previous changes.
    * `git revert <commit id>`: rollback changes to a specific commit.

## Branch
* It may be treated as a pointer to a particular commit.
* A default branch that `git` creates when a new repository is initiated is called `master`.
* `git branch <branch>`: create a branch.
* `git checkout <branch>`: swith to a specific branch (update the working tree to match the selected branch by checking out the latest snapshot for both files and branches).
* `git checkout -b <branch>`: a shortcut to create a branch and checkout to that branch.
* `git branch -d <branch>`: delete a branch (can be done if all changes are merged).
* `git branch -D <branch>`: delete a branch even regardless of the changes are merged.

## Merge
* combine changes from a branch to another.
* `git merge <branch>`: merge the specified branch to the current one.
* After merge, both two branches point at the same commit.
* there are two methods for merging in `git`.
    * `fast-forward`: default merge if the changes are made in different files or even different parts of the same file.
    * `three-way merge`: merge the snapshots at the two branch tips with the most recent common commit before the divergence (ancestor). However, it may raise to merge conflicts and we have to resolve them first.

## Basic commands to facilitate merge
* `git log --graph --oneline`: show short description of each commit in Git directory.
* `git log --graph --oneline --all`: show short description of each commit from all branches in Git directory.
* `git merge --abort`: revert the merge to the previous commit.
* `git rebase <branch>`: change `HEAD` to points at the tip of a specific branch (please see [this link](https://git-scm.com/book/en/v2/Git-Branching-Rebasing) for visualizations).

## Remote repository on GitHub
* the default name of a remote repository is `origin`.
* `git config --global credential.helper cache`: we may need to provide `username` and `github token` every time when interacting with a remote repository. This command will login to GitHub automatically.
* `git remote add upstream https://github.com/<git username>/<repo>.git`: we may need to add extra url for upstream interaction.
* `git remote show origin`: show detail of a remote repository.
* `git remote -v`: show urls for fetching and pushing changes.
* `git log origin/master`: see commti of `origin/master`.
* `git log -p origin/master`: see difference between a remote repository and a local one.
* `git remote`: list all remote repositories.

## Download a remote repository to local working tree
* `git clone <url>`: create a local copy of a remote repository.
* `git pull`: pull all changes from a remote repository to a local one and merge the changes to a local repository.
* `git fetch`: fetch all changes from a remote repository to a local one (different from `git pull` in a sense that `git fetch` does not perform merge).
* `git remote update`: fetch all chages.

## Upload a local working tree to a remote repository
* `git push`: send snapshots to a remote repository.
* `git push -f`: force `git` to push the current snapshot to a remote repository.
* `git push -U origin <branch>`: push a local snapshot to a remote branch.
* `git push --delete origin <branch>`: delete a remote branch.

## Pull request
* a request containing a commit or series of commits sent to the owner and collaborators of the repository to pull recent changes.
* `git rebase -i <branch>`: before creating a pull request, we may need to `squash` all commits in the latest snapshot by changing `pick` to `squash`. We may need to use `git commit --amed` to the last commit as well.

## Best practices
* always synchronize the branches before staging any updates.
* avoid having very large changes that modify a lot of different things.
* when working on a big change, it make sense to have a separate feature branch.
* regularly merge changes made on the master branch back onto the feature branch.
* have the lateset version of the project in the master branch, and  the stable version of the project on a separate branch.
* should not rebase changes that have been pushed to remote repositories.
* have a good commit message.