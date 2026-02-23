# CI/CD Documentation

This document describes the Continuous Integration and Continuous Deployment pipelines for the Task Tracker Frontend.

## 📋 Table of Contents

- [Overview](#overview)
- [Workflows](#workflows)
- [Setup](#setup)
- [Usage](#usage)
- [Secrets Configuration](#secrets-configuration)
- [Deployment Options](#deployment-options)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The project uses **GitHub Actions** for CI/CD automation. The pipelines handle:

- ✅ Building and testing React application
- ✅ Code quality and linting
- ✅ Security scanning
- ✅ Docker image building
- ✅ Pull request validation
- ✅ Automated deployments
- ✅ Bundle size analysis
- ✅ Performance monitoring

## 🔄 Workflows

### 1. CI Pipeline (`ci.yml`)

**Trigger:** Push or Pull Request to `main`, `master`, or `develop` branches

**Jobs:**

#### a. Build and Test
- Tests on Node.js 18.x and 20.x
- Installs npm dependencies
- Runs ESLint for code quality
- Builds production bundle with Vite
- Uploads build artifacts

**Environment:**
- Node.js 18.x and 20.x
- npm cache enabled

#### b. Code Quality Check
- Runs ESLint with zero warnings
- Checks for console.log statements
- Validates code formatting
- Ensures code standards compliance

#### c. Docker Build
- Builds Docker image with Nginx
- Uses multi-stage build
- Tests container serves app correctly
- Validates health check endpoint

#### d. Security Scan
- npm audit for vulnerabilities
- Generates security report
- Identifies outdated dependencies

####e. Bundle Analysis
- Analyzes production bundle size
- Identifies largest files
- Warns if bundle exceeds 10MB
- Provides optimization suggestions

#### f. Lighthouse Performance
- Runs Lighthouse CI
- Measures performance metrics
- Generates performance report
- Tracks performance over time

#### g. Status Check
- Aggregates results from all jobs
- Provides final pass/fail status

**Status Badge:**
```markdown
![Frontend CI](https://github.com/<username>/<repo>/workflows/Frontend%20CI/badge.svg)
```

### 2. CD Pipeline (`cd.yml`)

**Trigger:**
- Push to `main` or `master` branch
- Git tags matching `v*` pattern
- Manual dispatch

**Jobs:**

#### a. Deploy Application
- Builds production bundle
- Configures API URL per environment
- Extracts version from package.json
- Creates release artifact
- Uploads dist folder

**Environments:**
- Staging (default)
- Production (manual trigger)

#### b. Docker Publish
- Builds and tags Docker image
- Semantic versioning support
- Pushes to Docker Hub (when configured)
- Layer caching for efficiency

#### c. Deploy Static
- Supports multiple platforms:
  - Netlify
  - Vercel
  - GitHub Pages
  - AWS S3
  - Cloudflare Pages

#### d. Create Release
- Creates GitHub release for version tags
- Attaches build artifacts
- Auto-generates release notes

#### e. Notification
- Reports deployment status
- Slack/Discord integration support

**Manual Deployment:**
Go to Actions → Frontend CD → Run workflow → Select environment

### 3. PR Quality Check (`pr-check.yml`)

**Trigger:** Pull request events (opened, synchronized, reopened)

**Jobs:**

#### a. PR Information
- Displays PR metadata
- Shows author and branches

#### b. Validate PR
- Checks PR title format
- Verifies no large files
- Validates commit messages
- Enforces standards

**Conventional Commit Format:**
```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore, perf
```

Examples:
- `feat(ui): add task filtering dropdown`
- `fix(auth): resolve token refresh issue`
- `style: improve button spacing`

#### c. Build Check
- Installs dependencies
- Runs linter
- Builds application
- Validates output

#### d. Code Review
- ESLint checks
- Detects TODO comments
- Finds console statements
- Checks for debugger statements

#### e. Dependency Check
- Security vulnerability scan
- Outdated dependency check

#### f. Changes Summary
- Lists changed files
- Shows statistics
- Identifies component changes

#### g. PR Labeler
- Auto-labels based on files
- Labels: components, styling, api, docs, etc.

#### h. Final Check
- Validates all checks passed
- Comments when ready for review

## ⚙️ Setup

### 1. Enable GitHub Actions

Actions are enabled by default for public repositories.

For private repositories:
1. Settings → Actions → General
2. Enable "Allow all actions and reusable workflows"

### 2. Branch Protection

Configure for `main`/`master`:

1. Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require PR reviews
   - ✅ Require status checks
   - ✅ Require conversation resolution

4. Required status checks:
   - Build and Test
   - Code Quality Check
   - Docker Build

### 3. Secrets Configuration

Required for deployment:

#### Repository Secrets

| Secret Name | Description | Required For |
|------------|-------------|--------------|
| `DOCKER_USERNAME` | Docker Hub username | Docker push |
| `DOCKER_PASSWORD` | Docker Hub token | Docker push |
| `NETLIFY_AUTH_TOKEN` | Netlify token | Netlify deploy |
| `NETLIFY_SITE_ID` | Site ID | Netlify deploy |
| `VERCEL_TOKEN` | Vercel token | Vercel deploy |
| `VERCEL_ORG_ID` | Organization ID | Vercel deploy |
| `VERCEL_PROJECT_ID` | Project ID | Vercel deploy |
| `SLACK_WEBHOOK` | Slack webhook | Notifications |

#### Environment Variables

**Staging:**
- `VITE_API_BASE_URL`: https://api.staging.com/api

**Production:**
- `VITE_API_BASE_URL`: https://api.production.com/api

### 4. Configure Environments

Settings → Environments → New environment

**Staging:**
- No protection rules
- Auto-deploy on push

**Production:**
- Required reviewers
- Manual approval
- Deployment delay (optional)

## 🚀 Usage

### Running CI Manually

1. Actions tab
2. Select "Frontend CI"
3. Run workflow
4. Select branch
5. Run

### Creating a Deployment

**Option 1: Automatic (Push to main)**
```bash
git checkout main
git merge develop
git push origin main
```

**Option 2: Manual Dispatch**
1. Actions → Frontend CD
2. Run workflow
3. Select environment
4. Run

**Option 3: Version Tag**
```bash
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0
```

### Creating a Pull Request

1. **Create branch:**
   ```bash
   git checkout -b feat/new-ui
   ```

2. **Make changes:**
   ```bash
   npm run dev
   # Make changes
   git add .
   git commit -m "feat(ui): add new component"
   ```

3. **Push and create PR:**
   ```bash
   git push origin feat/new-ui
   ```

4. **PR checks run automatically**

5. **Merge when green**

### Viewing Artifacts

1. Actions → Workflow run
2. Scroll to Artifacts
3. Download:
   - `dist-artifact` - Production build
   - `npm-audit-report` - Security scan
   - `lighthouse-report` - Performance

## 🔐 Secrets Configuration

### Docker Hub

1. Create account at hub.docker.com
2. Generate access token
3. Add secrets:
   ```
   DOCKER_USERNAME: username
   DOCKER_PASSWORD: token
   ```
4. Update cd.yml:
   ```yaml
   push: true  # Change from false
   ```

### Netlify Deployment

1. **Create Netlify site**

2. **Get tokens:**
   - User Settings → Applications → Personal access tokens
   - Site settings → Site details → API ID

3. **Add secrets:**
   ```
   NETLIFY_AUTH_TOKEN: your-token
   NETLIFY_SITE_ID: your-site-id
   ```

4. **Uncomment in cd.yml:**
   ```yaml
   - name: Deploy to Netlify
     uses: nwtgck/actions-netlify@v2
     with:
       publish-dir: './dist'
       production-deploy: true
     env:
       NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
       NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
   ```

### Vercel Deployment

1. **Create Vercel project**

2. **Get tokens:**
   - Settings → Tokens
   - Project Settings → General

3. **Add secrets:**
   ```
   VERCEL_TOKEN: your-token
   VERCEL_ORG_ID: your-org-id
   VERCEL_PROJECT_ID: your-project-id
   ```

4. **Uncomment in cd.yml**

### GitHub Pages

1. **Enable GitHub Pages:**
   - Settings → Pages
   - Source: GitHub Actions

2. **Uncomment in cd.yml:**
   ```yaml
   - name: Deploy to GitHub Pages
     uses: peaceiris/actions-gh-pages@v3
     with:
       github_token: ${{ secrets.GITHUB_TOKEN }}
       publish_dir: ./dist
   ```

3. **Update vite.config.js:**
   ```js
   export default {
     base: '/<repo-name>/',
   }
   ```

## 🌐 Deployment Options

### 1. Netlify

**Pros:**
- Easy setup
- Automatic HTTPS
- Form handling
- Split testing

**Setup:**
1. Connect GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist`

### 2. Vercel

**Pros:**
- Zero config
- Edge network
- Preview deployments
- Analytics

**Setup:**
1. Import project
2. Framework preset: Vite
3. Auto-detects settings

### 3. GitHub Pages

**Pros:**
- Free for public repos
- Simple setup
- GitHub integration

**Setup:**
1. Enable in Settings
2. Use actions workflow
3. Access at `username.github.io/repo`

### 4. AWS S3 + CloudFront

**Pros:**
- Full control
- Scalable
- CDN included

**Setup:**
1. Create S3 bucket
2. Enable static hosting
3. Create CloudFront distribution
4. Configure in workflow

### 5. Docker + Cloud Provider

**Pros:**
- Consistent environment
- Easy rollback
- Portable

**Platforms:**
- AWS ECS
- Google Cloud Run
- Azure Container Instances
- DigitalOcean Apps

## 🐛 Troubleshooting

### Build Failures

**Problem:** npm install fails

**Solutions:**
```bash
# Clear cache
npm cache clean --force

# Delete lock file
rm package-lock.json
npm install

# Use clean install
npm ci
```

**Problem:** Build fails with memory error

**Solutions:**
```bash
# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 npm run build

# Or add to workflow:
env:
  NODE_OPTIONS: --max-old-space-size=4096
```

### Lint Failures

**Problem:** ESLint errors

**Solutions:**
```bash
# Fix auto-fixable issues
npm run lint -- --fix

# Check specific file
npx eslint src/App.jsx

# Disable rule (last resort)
// eslint-disable-next-line rule-name
```

### Docker Issues

**Problem:** Docker build fails

**Solutions:**
1. Test locally:
   ```bash
   docker build -t test .
   docker run -p 80:80 test
   ```

2. Check Dockerfile
3. Verify nginx.conf
4. Check build args

### Deployment Failures

**Problem:** Netlify deploy fails

**Solutions:**
1. Check build command
2. Verify publish directory
3. Check environment variables
4. Review build logs

**Problem:** Vercel deploy fails

**Solutions:**
1. Verify project settings
2. Check build configuration
3. Review environment variables
4. Test build locally

### Performance Issues

**Problem:** Large bundle size

**Solutions:**
1. Analyze bundle:
   ```bash
   npm run build
   npx vite-bundle-analyzer
   ```

2. Code splitting:
   ```js
   const Component = lazy(() => import('./Component'));
   ```

3. Remove unused dependencies:
   ```bash
   npm uninstall unused-package
   ```

## 📊 Monitoring

### Key Metrics

- **Build Success Rate**: > 95%
- **Build Time**: < 5 minutes
- **Bundle Size**: < 500KB gzipped
- **Lighthouse Score**: > 90

### Performance Tracking

Monitor these metrics:
- Time to Interactive (TTI)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)

### Cost Monitoring

Track Actions minutes:
- Settings → Billing
- Monitor usage
- Set spending limits

## 🔄 Maintenance

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update package
npm update package-name

# Update all
npm update

# Check for security issues
npm audit fix
```

### Workflow Updates

Keep actions updated:
```yaml
# Update from v3 to v4
- uses: actions/checkout@v3
+ uses: actions/checkout@v4
```

### Performance Optimization

1. **Caching:**
   - npm dependencies
   - Build output
   - Docker layers

2. **Parallel jobs:**
   - Independent jobs run concurrently
   - Matrix builds for multiple Node versions

3. **Conditional execution:**
   - Skip jobs for specific changes
   - Run security scans periodically

## 📚 References

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vite Documentation](https://vitejs.dev/)
- [Netlify Deploy Action](https://github.com/nwtgck/actions-netlify)
- [Vercel Action](https://github.com/amondnet/vercel-action)

## 🤝 Contributing

To improve CI/CD:

1. Test in fork
2. Document changes
3. Update this file
4. Create PR
5. Get review

---

**Questions?** Create an issue with the `ci-cd` label.
