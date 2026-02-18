# StoryHub Frontend

React SPA for the blog platform: posts, comments, auth (Firebase), React Query, React Router.

## Tech stack

- React 18, React Router, React Query
- Firebase Auth
- Axios (API client with `x-auth-token`)

## Security (never commit)

- **Do not commit:** `.env`, `.env.local`, `.env.vault`, `.env.keys`, or any file with real API keys or secrets. They are in `.gitignore`.
- Use `.env.example` as a template only; never commit it with real values.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `REACT_APP_API_URL` (backend URL) and all `REACT_APP_FIREBASE_*` from [Firebase Console](https://console.firebase.google.com).
3. `npm install && npm start` → [http://localhost:3000](http://localhost:3000).

## Scripts

- **`npm start`** – Dev server
- **`npm test`** – Jest + React Testing Library (use `--watchAll=false` in CI)
- **`npm run build`** – Production build
- **`npm run lint`** – ESLint

## Tests

- **BlogList:** loading state and posts list (mocked `usePosts`)
- **BlogDetail:** content and comments (mocked `usePost`, `useComments`)
- **Login:** happy path and error state (mocked `authService`)

Run: `npm test -- --watchAll=false`

## CI

- **Workflow:** `.github/workflows/ci.yml` runs on push/PR to `main` and `develop`.
- **Steps:** `npm ci`, `npm run lint`, `npm test -- --watchAll=false`, `npm run build`.

So: *Every push runs tests and lint; no manual-only testing.*

## Deployed links

- **Frontend:** https://blog-frontend-sigma-ecru.vercel.app/
- **Backend:** https://blog-backend-2-5hun.onrender.com

**Deployment checklist (Vercel):** In Vercel → Settings → Environment Variables, set `REACT_APP_API_URL` to your backend URL and all `REACT_APP_FIREBASE_*` from Firebase Console. Redeploy after changing env vars. Backend must have your Vercel URL in `CORS_ALLOWED_ORIGINS` (or `FRONTEND_URL`) so API calls succeed.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
