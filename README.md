# Task Tracker Frontend

A modern, responsive web application for personal task management built with React and Vite.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Development](#development)
- [Docker Deployment](#docker-deployment)
- [Features in Detail](#features-in-detail)
- [Future Enhancements](#future-enhancements)

## ✨ Features

### Core Functionality
- ✅ **User Authentication**: Login and registration with JWT
- ✅ **Task Management**: Create, read, update, and delete tasks
- ✅ **Task Filtering**: Filter by status (TODO, IN_PROGRESS, DONE)
- ✅ **Task Search**: Search tasks by title or description with debouncing
- ✅ **Real-time Updates**: Optimistic UI updates with backend sync
- ✅ **Inline Editing**: Edit tasks directly in the list
- ✅ **Status Tracking**: Visual status indicators with emojis

### User Experience
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Error Handling**: User-friendly error messages with auto-dismiss
- ✅ **Loading States**: Visual feedback during async operations
- ✅ **Form Validation**: Client-side validation before API calls
- ✅ **Protected Routes**: Automatic redirect for unauthenticated users
- ✅ **Auto-complete Prevention**: Disabled on sensitive forms
- ✅ **Debounced Search**: Optimized API calls during search

## 🛠️ Technology Stack

- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.0.5
- **Routing**: React Router DOM 7.1.3
- **HTTP Client**: Fetch API
- **Styling**: Inline CSS (component-based)
- **Development**: ESLint for code quality

## 📦 Prerequisites

### For Local Development
- Node.js 18+ (LTS recommended)
- npm 9+ or yarn 1.22+

### For Docker Deployment
- Docker Engine 20.10+
- Docker Compose 1.29+

## 🚀 Quick Start

### Option 1: Docker (With Backend)

**Note**: The frontend Docker setup is integrated with the backend. Run from the backend directory:

```bash
cd ../task-tracker-backend
docker-compose up -d
```

Access the frontend at: http://localhost

### Option 2: Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-tracker-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API URL** (optional)

   Create `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   - Frontend: http://localhost:5173
   - Backend API must be running on http://localhost:8080

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# API Base URL (default: http://localhost:8080/api)
VITE_API_BASE_URL=http://localhost:8080/api
```

### API Configuration

The API base URL can be configured in `src/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
```

### Default Credentials

Use these credentials for testing (from backend):

| Username | Password | Role |
|----------|----------|------|
| `user` | `password` | USER |
| `admin` | `admin` | ADMIN |

Or register a new account via the registration page.

## 📁 Project Structure

```
src/
├── api.js                  # API service layer
├── App.css                 # App-level styles
├── App.jsx                 # Main app component with task list
├── AuthContext.jsx         # Authentication context provider
├── Login.jsx               # Login page component
├── Register.jsx            # Registration page component
├── main.jsx                # App entry point with routing
├── index.css               # Global styles
└── assets/                 # Static assets

public/                     # Public static files
├── vite.svg               # Favicon

Root configuration files:
├── .env                    # Environment variables
├── .env.example           # Environment variables template
├── Dockerfile             # Docker build configuration
├── nginx.conf             # Nginx configuration for production
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
└── eslint.config.js       # ESLint configuration
```

## 💻 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Development Workflow

1. **Start backend API** (required for full functionality)
   ```bash
   cd ../task-tracker-backend
   ./gradlew bootRun
   ```

2. **Start frontend dev server**
   ```bash
   npm run dev
   ```

3. **Access application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080/api

### Hot Module Replacement (HMR)

Vite provides fast HMR during development. Changes to React components will be reflected instantly without page refresh.

## 🐳 Docker Deployment

### Production Build

The frontend uses a multi-stage Docker build:

1. **Build Stage**: Compiles React app with Vite
2. **Production Stage**: Serves static files with Nginx

### Build Docker Image

```bash
# Build image
docker build -t task-tracker-frontend .

# Run container
docker run -p 80:80 task-tracker-frontend
```

### Docker Compose Integration

The frontend is designed to work with the full stack:

```bash
cd ../task-tracker-backend
docker-compose up -d
```

This starts:
- MySQL database (port 3306)
- Backend API (port 8080)
- Frontend app (port 80)

## 🎨 Features in Detail

### Authentication Flow

1. **Login Page** (`/login`)
   - Username and password fields
   - Client-side validation
   - Error display with auto-dismiss
   - Loading state during authentication
   - Link to registration page

2. **Registration Page** (`/register`)
   - Username (min 3 characters)
   - Password (min 6 characters)
   - Password confirmation
   - Validation before API call
   - Success message with auto-redirect
   - Link to login page

3. **Protected Routes**
   - Automatic redirect to login if not authenticated
   - Token stored in localStorage
   - Token included in all API requests
   - Auto-redirect on 401/403 responses

### Task Management

#### Create Task
- Title (required)
- Description (optional)
- Status defaults to TODO
- Optimistic UI update

#### View Tasks
- List view with task cards
- Visual status indicators
- Created/updated timestamps
- Task count display
- Empty state for no tasks

#### Update Task
- Inline editing mode
- Update title, description, or status
- Save/cancel buttons
- Real-time status change dropdown

#### Delete Task
- Confirmation dialog
- Optimistic UI update
- Error handling with rollback

### Filtering & Search

#### Status Filter
- ALL (default)
- TODO
- IN_PROGRESS
- DONE
- Instant filtering

#### Text Search
- Search in title and description
- Debounced (500ms delay)
- Case-insensitive
- Partial match support
- Live result updates

### Error Handling

- **Dismissible alerts**: Manual close button
- **Auto-dismiss**: Errors disappear after 5 seconds
- **Specific messages**: Shows actual error from backend
- **Non-blocking**: Errors display at top, UI remains accessible
- **Loading states**: Buttons disabled during API calls

## 🎯 Component Breakdown

### App.jsx
Main application component containing:
- Task list display
- Create task form
- Filter controls
- Task cards with actions

### Login.jsx
Authentication page with:
- Login form
- Error display
- Loading state
- Navigation to register

### Register.jsx
User registration with:
- Registration form
- Password confirmation
- Validation
- Success feedback

### AuthContext.jsx
Authentication state management:
- Login/logout functions
- Token management
- Authentication status
- Protected route wrapper

### api.js
API service layer:
- Authentication API
- Task CRUD operations
- Error handling
- Token management

## 🔧 Customization

### Changing Colors

Edit inline styles in components:

```jsx
// Primary button color
background: '#007bff'  // Change to your color

// Error color
color: '#721c24'  // Change to your color
```

### Updating API Endpoints

Edit `src/api.js`:

```javascript
export const taskService = {
    getTasks: async (status, search) => {
        // Modify endpoint or parameters
    }
}
```

### Adding New Pages

1. Create component in `src/`
2. Add route in `src/main.jsx`:

```jsx
<Route path="/new-page" element={<NewPage />} />
```

## 📈 Future Enhancements

### High Priority
- [ ] **TypeScript**: Migrate to TypeScript for type safety
- [ ] **Component Tests**: Add React Testing Library tests
- [ ] **Loading Skeletons**: Better loading states
- [ ] **Toast Notifications**: Replace error alerts with toast
- [ ] **Dark Mode**: Theme switcher

### Medium Priority
- [ ] **Task Categories**: Filter by categories/tags
- [ ] **Task Priority**: Visual priority indicators
- [ ] **Due Dates**: Date picker and calendar view
- [ ] **Task Details Page**: Dedicated page for task details
- [ ] **Bulk Actions**: Select multiple tasks for bulk operations
- [ ] **Export Tasks**: Export to CSV/JSON

### Low Priority
- [ ] **Drag and Drop**: Reorder tasks
- [ ] **Task Templates**: Create tasks from templates
- [ ] **Keyboard Shortcuts**: Power user features
- [ ] **Offline Support**: Service worker for offline use
- [ ] **Push Notifications**: Browser notifications for tasks
- [ ] **Accessibility**: ARIA labels and keyboard navigation

## 🧪 Testing

### Manual Testing Checklist

- [ ] User can register with valid credentials
- [ ] User can login with valid credentials
- [ ] User cannot login with invalid credentials
- [ ] User can create a task
- [ ] User can edit a task
- [ ] User can delete a task
- [ ] User can filter tasks by status
- [ ] User can search tasks by text
- [ ] User can logout
- [ ] Protected routes redirect to login
- [ ] Error messages display correctly
- [ ] Loading states appear during async operations

### Browser Compatibility

Tested on:
- ✅ Chrome 120+
- ✅ Firefox 121+
- ✅ Edge 120+
- ✅ Safari 17+

## 🔒 Security Considerations

- JWT tokens stored in localStorage (consider httpOnly cookies for production)
- Sensitive forms have autocomplete disabled
- CORS is configured in backend
- No sensitive data in URLs
- XSS protection via React's built-in escaping
- Input validation before API calls

## 📱 Responsive Design

The application is responsive and works on:
- **Desktop**: 1920px+
- **Laptop**: 1366px - 1920px
- **Tablet**: 768px - 1366px
- **Mobile**: 320px - 768px

Key responsive features:
- Flexible layouts with flexbox
- Percentage-based widths
- Mobile-friendly touch targets
- Readable font sizes on all devices

## 🤝 Contributing

This is a take-home assignment project. For actual contributions:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is created as a technical assessment.

## 📞 Support

For questions or issues, please create an issue in the repository.

---

**Built with ⚛️ React and ⚡ Vite**
