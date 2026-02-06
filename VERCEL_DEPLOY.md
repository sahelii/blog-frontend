# Vercel deployment checklist

## If deployment fails after adding env vars

1. **Redeploy**  
   Env vars are used at **build time**. Adding or changing them does not affect already-built deployments.  
   → Vercel: **Deployments** → open the latest → **⋯** → **Redeploy** (or push a new commit).

2. **Use “All Environments”**  
   In **Settings → Environment Variables**, each variable should apply to **Production**, **Preview**, and **Development** (or at least Production and Preview). Otherwise some builds may run without the vars.

3. **Firebase App ID must be full**  
   `REACT_APP_FIREBASE_APP_ID` must be the **full** value from Firebase Console, e.g.:  
   `1:71070261683:web:88a4b6a95da4801e20abc6`  
   Not only the suffix like `88a4b6a95da4801e20abc6`.

4. **Required variables in Vercel**
   - `REACT_APP_API_URL` = your backend URL (e.g. `https://blog-backend-2-5hun.onrender.com`)
   - `REACT_APP_FIREBASE_API_KEY`
   - `REACT_APP_FIREBASE_AUTH_DOMAIN`
   - `REACT_APP_FIREBASE_PROJECT_ID`
   - `REACT_APP_FIREBASE_STORAGE_BUCKET`
   - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
   - `REACT_APP_FIREBASE_APP_ID` (full value)
   - `REACT_APP_FIREBASE_MEASUREMENT_ID`

5. **Check build logs**  
   In the failed deployment, open **Building** / logs. The exact error (e.g. “Missing Firebase config” or a Firebase init error) will tell you which variable is missing or wrong.
