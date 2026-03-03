# Lab 5 — Deployment Guide

## 1. Prerequisites

- Node.js installed locally
- Firebase project from lab4 (same `.env` used)
- `serviceAccountKey.json` downloaded from Firebase Console → Project Settings → Service Accounts → Generate new private key
- Git repository (your `3cgbdg.github.io` repo)
- Account on [Render.com](https://render.com) (free tier) — for the server
- Account on [Netlify.com](https://netlify.com) (free tier) — for the client

---

## 2. Place Service Account Key

Place the downloaded JSON file at:

```
lab5/server/serviceAccountKey.json
```

> ⚠️ This file is in `.gitignore` — **never commit it** to GitHub.

---

## 3. Test Locally

### Start the server:

```powershell
cd lab5\server
npm start
```

Open: http://localhost:5000/api/message — should return `{ "message": "Hello from the backend!" }`

### Start the client (in a second terminal):

```powershell
cd lab5\client
npm install
npm start
```

Open: http://localhost:3000 — full app running, progress saved via server.

---

## 4. Deploy Server on Render

### Step 1 — Push your code to GitHub

Make sure `lab5/` folder is committed and pushed:

```powershell
cd c:\Users\User\Desktop\ВЕБ\3cgbdg.github.io
git add lab5/
git commit -m "feat: add lab5 Node.js/Express backend"
git push
```

### Step 2 — Create a Web Service on Render

1. Go to [render.com](https://render.com) → sign in / sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo (`3cgbdg.github.io`)
4. Configure the service:

| Setting            | Value                     |
| ------------------ | ------------------------- |
| **Name**           | `lab5-server`             |
| **Region**         | Frankfurt (EU) or closest |
| **Branch**         | `main` (or `master`)      |
| **Root Directory** | `lab5/server`             |
| **Build Command**  | `npm install`             |
| **Start Command**  | `node server.js`          |
| **Instance Type**  | Free                      |

5. Click **"Create Web Service"**

### Step 3 — Add Environment Variables on Render

In the Render dashboard for your service, go to **Environment** and add:

| Key           | Value                                                   |
| ------------- | ------------------------------------------------------- |
| `PORT`        | `5000`                                                  |
| `CORS_ORIGIN` | `https://YOUR-SITE.netlify.app` _(update after step 6)_ |

### Step 4 — Add Service Account Key as Secret File on Render

1. In Render dashboard → your service → **"Secret Files"**
2. Click **"Add Secret File"**
3. Filename: `serviceAccountKey.json`
4. Contents: paste the entire JSON content of your service account key
5. Save

> Render will place this file at the path your code expects.

### Step 5 — Deploy

Click **"Deploy latest commit"** or push a new commit. Render builds and deploys automatically.

After deployment, your server will be at:

```
https://lab5-server.onrender.com
```

Test:

```
https://lab5-server.onrender.com/api/message
```

---

## 5. Deploy Client on Netlify

> [!IMPORTANT]
> `.env` files are NOT pushed to GitHub. Netlify solves this by letting you set `REACT_APP_*` vars in its dashboard — it bakes them into the build automatically.

### Step 1 — Push the client folder to GitHub

```powershell
git add lab5/
git commit -m "feat: lab5 client with Netlify deploy"
git push
```

### Step 2 — Create site on Netlify

1. Go to [app.netlify.com](https://app.netlify.com) → **"Add new site"** → **"Import an existing project"**
2. Connect GitHub → select your `3cgbdg.github.io` repo
3. Configure build settings:

| Setting               | Value               |
| --------------------- | ------------------- |
| **Base directory**    | `lab5/client`       |
| **Build command**     | `npm run build`     |
| **Publish directory** | `lab5/client/build` |

4. Click **"Deploy site"**

### Step 3 — Set Environment Variable in Netlify

1. Go to your site → **Site configuration** → **Environment variables**
2. Click **"Add a variable"**:

| Key                 | Value                              |
| ------------------- | ---------------------------------- |
| `REACT_APP_API_URL` | `https://lab5-server.onrender.com` |

3. Click **"Save"** then **"Trigger deploy"** → **"Clear cache and deploy site"**

> Netlify bakes `REACT_APP_API_URL` into the bundle at build time — no need to push `.env`.

### Step 4 — Note your Netlify URL

Your site will be live at something like:

```
https://your-site-name.netlify.app
```

---

## 6. Update CORS on Render

Now that you know your Netlify URL, update the `CORS_ORIGIN` env var in the Render dashboard:

1. Render → your `lab5-server` service → **Environment**
2. Update `CORS_ORIGIN` from the placeholder to your real Netlify URL:

| Key           | Value                                |
| ------------- | ------------------------------------ |
| `CORS_ORIGIN` | `https://your-site-name.netlify.app` |

3. Render will automatically redeploy.

---

## 7. Verify End-to-End

1. Open your Netlify URL: `https://your-site-name.netlify.app`
2. Register or log in
3. Go to **Lessons** → mark a lesson as completed
4. Go to **My Progress** → lesson shows ✓ Done with the completion date
5. Refresh the page → progress persists (loaded from Render server API)
6. Test a direct URL like `https://your-site-name.netlify.app/progress` → should NOT 404 (thanks to `_redirects`)
