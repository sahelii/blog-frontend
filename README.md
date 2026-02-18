# StoryHub – Frontend

Modern React SPA for a blogging platform: discover stories, write posts, and discuss with comments.

### Features

- **Discover stories**: paginated feed with search, tags, reading-time, and relative dates.
- **Authentication**: Firebase email/password auth with protected routes.
- **Write & edit**: create, edit, delete posts with cover image upload and tags.
- **Comments**: authenticated users can comment on posts, with instant UI updates.
- **Polished UI**: responsive layout, skeleton loaders, toasts, error boundaries.

### Tech stack

- **React 18** with **React Router 6**
- **Firebase Auth**
- **Axios** API client with `x-auth-token` header
- **date-fns**, **react-icons**

### Getting started

```bash
git clone https://github.com/sahelii/blog-frontend.git
cd blog-frontend
npm install
```

Create a `.env` file:

```bash
REACT_APP_API_URL=https://blog-backend-2-5hun.onrender.com
REACT_APP_FIREBASE_API_KEY=your_firebase_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
REACT_APP_FIREBASE_MEASUREMENT_ID=...
```

Run locally:

```bash
npm start        # http://localhost:3000
```

Build for production:

```bash
npm run build
```

### Scripts

- **`npm start`** – run dev server
- **`npm test`** – run unit tests
- **`npm run build`** – production build
- **`npm run lint`** – lint source files

### Live demo

- **Frontend**: https://blog-frontend-sigma-ecru.vercel.app  
- **Backend API**: https://blog-backend-2-5hun.onrender.com

