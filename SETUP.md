# Frontend Setup Guide

Complete setup instructions for the Task Tracker Frontend.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running the Application](#running-the-application)
5. [Building for Production](#building-for-production)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Node.js 18+ (LTS recommended)**
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify: `node --version`

- **npm 9+ or yarn 1.22+**
  - npm comes with Node.js
  - Verify: `npm --version`

- **Task Tracker Backend**
  - The backend API must be running for the frontend to function
  - See [backend setup guide](../task-tracker-backend/SETUP.md)

### Optional Software

- **VS Code** - Recommended editor
- **Chrome/Firefox** - For development and debugging
- **Docker Desktop** - For containerized deployment

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-tracker-frontend
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

This will install all dependencies listed in `package.json`.

### 3. Verify Installation

```bash
# Check installed packages
npm list --depth=0

# Expected output should include:
# - react@18.3.1
# - react-router-dom@7.1.3
# - vite@6.0.5
```

## Configuration

### 1. Create Environment File

```bash
# Copy example file
cp .env.example .env

# Edit with your configuration
nano .env  # or use your preferred editor
```

### 2. Configure API URL

Edit `.env` file:

```env
# Development (backend running locally)
VITE_API_BASE_URL=http://localhost:8080/api

# Production (backend on different host)
# VITE_API_BASE_URL=https://api.yourdomain.com/api

# Docker (backend service name)
# VITE_API_BASE_URL=http://backend:8080/api
```

### 3. Verify Backend Connection

Ensure the backend is running:

```bash
# Test backend health endpoint
curl http://localhost:8080/actuator/health
# Expected: {"status":"UP"}

# Test backend API is accessible
curl http://localhost:8080/api/auth/token -I
# Expected: HTTP/1.1 401 (authentication required)
```

## Running the Application

### Method 1: Development Server (Hot Reload)

```bash
# Start development server
npm run dev

# Or with yarn
yarn dev
```

The application will start on http://localhost:5173

Features:
- ✅ Hot Module Replacement (HMR)
- ✅ Fast refresh on file changes
- ✅ Source maps for debugging
- ✅ Development error overlay

### Method 2: Preview Production Build

```bash
# Build for production
npm run build

# Preview the build
npm run preview
```

This serves the production build locally for testing.

### Method 3: Docker

```bash
# Build Docker image
docker build -t task-tracker-frontend .

# Run container
docker run -p 80:80 task-tracker-frontend
```

Access at http://localhost

### Method 4: Docker Compose (Full Stack)

From the backend directory:

```bash
cd ../task-tracker-backend
docker-compose up -d
```

This starts:
- MySQL database
- Backend API (port 8080)
- Frontend app (port 80)

## Building for Production

### 1. Create Production Build

```bash
npm run build
```

This creates optimized files in the `dist/` directory:

```
dist/
├── assets/
│   ├── index-[hash].js    # Bundled JavaScript
│   └── index-[hash].css   # Bundled CSS
├── index.html             # Entry HTML file
└── vite.svg              # Favicon
```

### 2. Test Production Build Locally

```bash
npm run preview
```

Access at http://localhost:4173

### 3. Deploy to Production

#### Static Hosting (Netlify, Vercel, etc.)

```bash
# Build
npm run build

# Deploy dist/ folder to your hosting provider
```

#### Nginx Server

```bash
# Build
npm run build

# Copy to nginx web root
cp -r dist/* /var/www/html/

# Or use included nginx.conf with Docker
docker build -t frontend .
docker run -p 80:80 frontend
```

## Verification

### 1. Check Development Server

After running `npm run dev`:

```bash
# Server should start on port 5173
✓ Server running at http://localhost:5173
```

Open browser to http://localhost:5173

### 2. Verify Pages Load

1. **Login Page** (http://localhost:5173/login)
   - Should display login form
   - Username and password fields
   - Link to registration

2. **Register Page** (http://localhost:5173/register)
   - Should display registration form
   - Username, password, confirm password fields
   - Link to login

3. **Main App** (http://localhost:5173/)
   - Should redirect to login if not authenticated
   - After login, should show task list

### 3. Test Functionality

1. **User Registration**
   ```
   Username: testuser
   Password: testpass123
   Confirm: testpass123
   ```
   - Should show success message
   - Should redirect to login

2. **User Login**
   ```
   Username: user
   Password: password
   ```
   - Should receive JWT token
   - Should redirect to task list

3. **Task Operations**
   - Create new task
   - Edit existing task
   - Change task status
   - Delete task
   - Filter by status
   - Search tasks

### 4. Check Browser Console

Open browser DevTools (F12):

- No error messages
- API calls logging (in development)
- JWT token in localStorage

## Troubleshooting

### Issue: npm install fails

**Error:** `npm ERR! code ERESOLVE`

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Or use legacy peer deps
npm install --legacy-peer-deps
```

### Issue: Port 5173 already in use

**Error:** `Port 5173 is in use`

**Solutions:**

1. **Kill process using port**
   ```bash
   # Find process
   # Linux/Mac
   lsof -i :5173
   kill -9 <PID>

   # Windows
   netstat -ano | findstr :5173
   taskkill /PID <PID> /F
   ```

2. **Use different port**
   ```bash
   # Vite will auto-select next available port
   # Or specify in vite.config.js:
   server: { port: 3000 }
   ```

### Issue: Cannot connect to backend API

**Error:** `Network Error` or `Failed to fetch`

**Solutions:**

1. **Check backend is running**
   ```bash
   curl http://localhost:8080/actuator/health
   ```

2. **Verify API URL in .env**
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

3. **Check CORS configuration**
   - Backend should allow `http://localhost:5173`
   - Check backend WebConfig.kt

4. **Restart development server**
   ```bash
   # Stop server (Ctrl+C)
   # Start again
   npm run dev
   ```

### Issue: Login fails with 401

**Error:** `Authentication failed or token expired`

**Solutions:**

1. **Check default credentials**
   - Username: `user`
   - Password: `password`

2. **Verify backend has created default users**
   ```sql
   USE tasktracker_db;
   SELECT username FROM users;
   ```

3. **Register new user** via registration page

4. **Check backend logs** for authentication errors

### Issue: Page shows blank screen

**Solutions:**

1. **Check browser console** for JavaScript errors

2. **Verify build output**
   ```bash
   npm run build
   # Check for errors
   ```

3. **Clear browser cache**
   - Ctrl+Shift+Delete (Chrome/Firefox)
   - Clear cached images and files

4. **Check React DevTools**
   - Install React DevTools extension
   - Check component tree

### Issue: Changes not reflecting

**Solutions:**

1. **Hard refresh browser**
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)

2. **Clear Vite cache**
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

3. **Restart development server**

### Issue: Build fails

**Error:** `Build failed with X errors`

**Solutions:**

1. **Check for linting errors**
   ```bash
   npm run lint
   ```

2. **Fix import statements**
   - Verify all imports are correct
   - Check file paths are case-sensitive

3. **Clear and rebuild**
   ```bash
   rm -rf dist node_modules/.vite
   npm install
   npm run build
   ```

### Issue: CORS errors in production

**Error:** `Access to fetch blocked by CORS policy`

**Solutions:**

1. **Update backend CORS configuration**
   - Add production frontend URL to allowed origins

2. **Use environment-specific API URL**
   ```env
   # Production .env
   VITE_API_BASE_URL=https://api.yourdomain.com/api
   ```

3. **Configure reverse proxy**
   - Use nginx to proxy API requests
   - Avoid CORS entirely

### Issue: JWT token not persisting

**Solutions:**

1. **Check localStorage**
   ```javascript
   // In browser console
   localStorage.getItem('jwt_token')
   ```

2. **Verify token is being saved**
   - Check Network tab in DevTools
   - Look for `/api/auth/token` request
   - Should see `access_token` in response

3. **Check for localStorage errors**
   - Private browsing mode blocks localStorage
   - Check browser storage settings

## Development Tips

### Hot Reload

Vite provides instant hot module replacement:

1. Save file
2. Browser updates automatically
3. Component state is preserved

### Debugging

1. **React DevTools**
   - Install browser extension
   - Inspect component props and state

2. **Console Logging**
   ```javascript
   console.log('API Response:', data);
   ```

3. **Network Tab**
   - Monitor API calls
   - Check request/response headers
   - View response bodies

4. **Breakpoints**
   - Use browser debugger
   - Add `debugger;` statement in code

### Code Quality

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### Environment Variables

Access in code:

```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

All environment variables must start with `VITE_` prefix.

## Performance Optimization

### Production Build Optimizations

Vite automatically applies:
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minification
- ✅ Asset optimization
- ✅ Gzip compression (via nginx)

### Lazy Loading

Add code splitting for routes:

```javascript
const LazyComponent = lazy(() => import('./Component'));
```

### Bundle Analysis

```bash
# Install plugin
npm install --save-dev rollup-plugin-visualizer

# Build and analyze
npm run build
```

## Next Steps

After successful setup:

1. ✅ Test all features in the UI
2. ✅ Create sample tasks
3. ✅ Test filtering and search
4. ✅ Review [README.md](README.md) for features
5. ✅ Check [backend documentation](../task-tracker-backend/README.md)

## Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

## Support

If you encounter issues not covered here:

1. Check browser console for errors
2. Check network tab for failed requests
3. Review [README.md](README.md)
4. Create an issue with:
   - Error message
   - Steps to reproduce
   - Browser and OS version
   - Screenshots if applicable
