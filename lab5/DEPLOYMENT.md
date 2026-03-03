# Lab 5 — Deployment Guide

## 1. Prerequisites

- Node.js installed locally
- Firebase project from lab4 (same `.env` used)
- `serviceAccountKey.json` downloaded from Firebase Console → Project Settings → Service Accounts → Generate new private key
- Git repository (your `3cgbdg.github.io` repo)
- Account on [Render.com](https://render.com) (free tier)

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

| Key           | Value                      |
| ------------- | -------------------------- |
| `PORT`        | `5000`                     |
| `CORS_ORIGIN` | `https://3cgbdg.github.io` |

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

## 5. Update Client for Production

In `lab5/client/.env`, update the API URL to your deployed Render URL:

```env
REACT_APP_API_URL=https://lab5-server.onrender.com
```

Also update `lab5/server/.env`:

```env
CORS_ORIGIN=https://3cgbdg.github.io
```

---

## 6. Deploy Client on GitHub Pages

The site is already hosted on `3cgbdg.github.io`. The client can be deployed as a subfolder build:

```powershell
cd lab5\client
npm install
npm run build
```

Copy the contents of `lab5/client/build/` to a `lab5/` folder in the root of your repo, or configure GitHub Pages to serve from the `lab5/client/build` folder.

> **Simpler alternative**: Since we have the Express server, the built React app can also be served by the server itself. Copy `build/` contents into `lab5/server/public/` and the server's catch-all route will serve `index.html`.

```powershell
# After npm run build in lab5/client:
robocopy lab5\client\build lab5\server\public /E
```

Then your Render deployment will serve both the API and the React app from the same URL.

---

## 7. Verify End-to-End

1. Open `https://lab5-server.onrender.com` (or `https://3cgbdg.github.io/lab5/...`)
2. Register or log in
3. Go to **Lessons** → mark a lesson as completed
4. Go to **My Progress** → lesson shows ✓ Done with the completion date
5. Refresh → progress persists (loaded from server API)
