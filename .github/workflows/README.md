# GitHub Actions Workflows

This directory contains CI/CD workflows for the Task Tracker Frontend.

## 📁 Workflow Files

### `ci.yml` - Continuous Integration
**Purpose:** Build, test, and validate code on every push/PR

**Triggers:**
- Push to `main`, `master`, `develop`
- Pull requests to these branches

**What it does:**
- ✅ Builds with Node.js 18 & 20
- ✅ Runs ESLint checks
- ✅ Builds production bundle
- ✅ Builds Docker image
- ✅ Runs security scans
- ✅ Analyzes bundle size
- ✅ Runs Lighthouse performance tests

**Duration:** ~5-8 minutes

---

### `cd.yml` - Continuous Deployment
**Purpose:** Deploy application to hosting platforms

**Triggers:**
- Push to `main` or `master`
- Version tags (v*)
- Manual workflow dispatch

**What it does:**
- ✅ Builds production bundle
- ✅ Creates release artifacts
- ✅ Builds and publishes Docker image
- ✅ Deploys to static hosting (Netlify/Vercel/GitHub Pages)
- ✅ Creates GitHub releases
- ✅ Sends notifications

**Environments:**
- Staging (auto-deploy)
- Production (manual approval)

**Duration:** ~5-10 minutes

---

### `pr-check.yml` - Pull Request Quality
**Purpose:** Validate PR quality before merge

**Triggers:**
- Pull request opened/updated

**What it does:**
- ✅ Validates PR title format
- ✅ Checks commit messages
- ✅ Runs build and lint
- ✅ Performs code review checks
- ✅ Checks for debug statements
- ✅ Auto-labels PR
- ✅ Comments when ready

**Duration:** ~4-6 minutes

---

### `labeler.yml` - Auto Labeling
**Purpose:** Configuration for auto-labeling PRs

**Labels PRs based on:**
- Component files
- Styling files
- API files
- Documentation
- Configuration

---

## 🚀 Quick Actions

### Run CI Manually
```
Actions → Frontend CI → Run workflow
```

### Deploy to Staging
```
Actions → Frontend CD → Run workflow → Select "staging"
```

### Deploy to Production
```
Actions → Frontend CD → Run workflow → Select "production"
```

### Create Release
```
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0
```

## 📊 Status Badges

Add to README.md:

```markdown
![CI](https://github.com/<owner>/<repo>/workflows/Frontend%20CI/badge.svg)
![CD](https://github.com/<owner>/<repo>/workflows/Frontend%20CD/badge.svg)
```

## 🔧 Configuration

See [CI_CD.md](../../CI_CD.md) for detailed configuration instructions.

### Quick Setup for Deployment

**Netlify:**
1. Get auth token and site ID
2. Add secrets: `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`
3. Uncomment Netlify deploy step in `cd.yml`

**Vercel:**
1. Get project tokens
2. Add secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
3. Uncomment Vercel deploy step in `cd.yml`

**GitHub Pages:**
1. Enable Pages in Settings
2. Uncomment GitHub Pages deploy step in `cd.yml`
3. Update `vite.config.js` base path

## 📈 Monitoring

View workflow runs:
- Actions tab in repository
- Filter by workflow, branch, status
- Download artifacts (dist, reports)
- Check bundle size trends

## 🎯 Performance Metrics

CI tracks:
- Bundle size (target: < 500KB gzipped)
- Lighthouse score (target: > 90)
- Build time (target: < 5 min)

## ❓ Help

For issues or questions:
- Review [CI_CD.md](../../CI_CD.md)
- Check workflow logs
- Create issue with `ci-cd` label
