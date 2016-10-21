# Contributing

## General Workflow

1. Ask the Product Owner permission to become a collaborator on the repo.
2. After becoming a collaborator, clone the repo down to your local machine:

```
git remote add upstream https://github.com/giddygoats/giddygoats.git
```


```
git pull upstream master
```
3. Cut a namespaced feature branch from master. For example, if you were on your master branch, write:

  ```
  git checkout -b feature-name
  ```
4. Make commits to your feature branch. Prefix each commit like so:
  - (feat) Added a new feature
  - (fix) Fixed inconsistent tests [Fixes #0]
  - (refactor) ...
  - (cleanup) ...
  - (test) ...
  - (doc) ...
5. When you've finished with your fix or feature, push from your local machine the upstream remote but to a feature branch (not master). For instance, if you were working on a branch named 'destination-form-modal', then your git command would be

```
git push upstream destination-form-modal
```

6. Your pull request will be reviewed by another team member. If approved, your pull request will be merged into the remote repo's master branch. The aim is to keep the remote repo's master branch pristine.