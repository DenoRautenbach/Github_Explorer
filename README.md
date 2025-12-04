# GitHub Explorer

A modern, responsive web application for exploring GitHub repositories and commits built with Vue 3, TypeScript, and Pinia.

## ✨ Features

- 🔍 **Search GitHub Users**: Find any public GitHub user
- 📚 **Browse Repositories**: View all repositories for a user
- 📝 **Explore Commits**: See commit history with pagination (10 per page)
- ⭐ **Favorites**: Save favorite commits with localStorage persistence
- 🔄 **Sorting**: Sort commits by newest or oldest
- 📊 **Commit Details**: View detailed commit information including:
  - File changes with additions/deletions
  - Commit statistics
  - Author information
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- 🔐 **GitHub Authentication**: Optional token support for higher rate limits

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd github-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up GitHub Token (Optional but Recommended)**
   
   Create a `.env.local` file in the project root:
   ```bash
   cp .env.example .env.local
   ```
   
   Add your GitHub Personal Access Token:
   ```env
   VITE_GITHUB_TOKEN=your_github_token_here
   ```
   
   **Why use a token?**
   - Without token: 60 requests/hour
   - With token: 5,000 requests/hour
   
   **How to get a token:**
   1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens)
   2. Generate new token (classic)
   3. Select `public_repo` scope
   4. Copy and paste into `.env.local`

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run test     # Run unit tests
```

## 🏗️ Tech Stack

- **Framework**: Vue 3 (Composition API)
- **Language**: TypeScript
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Build Tool**: Vite
- **Testing**: Vitest + jsdom
- **Styling**: CSS (Scoped)

## 📁 Project Structure

```
github-explorer/
├── src/
│   ├── components/          # Reusable components
│   │   └── CommitDetail.vue
│   ├── stores/              # Pinia stores
│   │   ├── github.ts
│   │   └── __tests__/
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── views/               # Page components
│   │   ├── HomeView.vue
│   │   └── RepoView.vue
│   ├── router/              # Vue Router configuration
│   │   └── index.ts
│   ├── App.vue              # Root component
│   ├── main.ts              # Application entry point
│   └── vite-env.d.ts        # Environment variable types
├── .env.example             # Environment variables template
├── .env.local               # Your local environment variables (gitignored)
└── package.json
```

## 🎯 Key Features Explained

### State Management (Pinia)

The app uses Pinia for centralized state management:
- **Repositories**: List of user's repos
- **Commits**: Paginated commit history
- **Favorites**: Persisted to localStorage
- **Loading/Error states**: For better UX

### Routing (Vue Router)

- `/` - Home page with user search
- `/repos/:username` - Repository and commit explorer

### API Integration

Uses GitHub REST API v3:
- `GET /users/:username/repos` - Fetch repositories
- `GET /repos/:username/:repo/commits` - Fetch commits
- `GET /repos/:username/:repo/commits/:sha` - Fetch commit details

### Error Handling

- User not found (404)
- Rate limit exceeded (403)
- Network errors
- Empty states

## 🧪 Testing

Run the test suite:
```bash
npm run test
```

Tests include:
- ✅ Favorite toggle functionality
- ✅ LocalStorage persistence
- ✅ Pagination logic

## 🔐 Security

- ✅ GitHub token stored in environment variables
- ✅ `.env.local` gitignored
- ✅ No hardcoded secrets
- ✅ Minimal token scopes required

## 📊 Rate Limits

| Authentication | Requests/Hour | Scope |
|----------------|---------------|-------|
| None | 60 | Per IP |
| Token | 5,000 | Per user |

## 🎨 UI/UX Highlights

- Gradient backgrounds
- Glassmorphism effects
- Smooth animations
- Loading spinners
- Error banners with helpful hints
- Responsive design
- Color-coded file status badges

## 🐛 Known Issues & Solutions

### Issue: Rate Limit Exceeded
**Solution**: Add a GitHub Personal Access Token to `.env.local`

### Issue: Stale commits when switching users
**Solution**: Fixed! The app now clears commits when changing users.

## 🔗 Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [GitHub REST API](https://docs.github.com/en/rest)
- [Vite Documentation](https://vitejs.dev/)