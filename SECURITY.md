# Security – API keys and environment variables

## Do not commit credentials

- **Never** commit `.env` or any file containing real API keys, secrets, or passwords.
- Firebase/Google API keys and other config belong in **environment variables only**.

## If a key was exposed (e.g. in a public repo)

1. **Regenerate the key** in [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → select the key → Regenerate key.
2. **Remove the old key** from any public code (it’s already invalid once regenerated).
3. **Store the new key only in**:
   - Local: `.env` (and ensure `.env` is in `.gitignore`).
   - Production: your hosting provider’s environment variables (e.g. Vercel, Netlify).
4. **Restrict the key** in Google Cloud Console (e.g. HTTP referrer for web, or API restrictions) to limit abuse.

## Local development

- Copy `.env.example` to `.env`.
- Fill in the placeholders with your own values.
- `.env` is gitignored and must not be committed.

## Production (e.g. Vercel)

- Set all `REACT_APP_*` variables in the project’s Environment Variables in the Vercel dashboard.
- Do not put secrets in the repo or in the build output.
