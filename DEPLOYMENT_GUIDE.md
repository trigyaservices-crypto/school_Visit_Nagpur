# NAGPUR SCHOOL VISIT — Step-by-Step Deployment Guide

Follow these instructions to deploy the platform to **GitHub**, **Cloudflare Pages**, or any static web host.

---

### Step 1: Upload to GitHub
1. Create a new repository on GitHub (e.g., `nagpur-school-visit`).
2. Initialize git and push:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of NAGPUR SCHOOL VISIT production platform"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/nagpur-school-visit.git
   git push -u origin main
   ```

---

### Step 2: Deploy to Cloudflare Pages
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** &rarr; **Create application** &rarr; **Pages** &rarr; **Connect to Git**.
3. Select your `nagpur-school-visit` repository.
4. Set the build configuration:
   - **Framework preset**: `None`
   - **Build command**: `node build.js`
   - **Build output directory**: `dist`
5. Click **Save and Deploy**. Cloudflare Pages will automatically compile and publish your website globally on Cloudflare's edge network with SSL enabled.

---

### Step 3: Direct Manual Upload (No Git)
If you prefer not using Git:
1. In Cloudflare Dashboard, go to **Workers & Pages** &rarr; **Create application** &rarr; **Pages** &rarr; **Upload assets**.
2. Give your project a name (e.g. `nagpur-school-visit`).
3. Run `node build.js` locally to generate the `dist` folder.
4. Drag and drop the `dist/` folder into Cloudflare Pages.
5. Click **Deploy Site**.

---

### Step 4: Updating School Data in the Future
1. Place updated records into `data/schools.json`.
2. Run `node build.js` to re-verify data integrity and synchronize `dist/`.
3. Push to GitHub (Cloudflare will automatically re-deploy) or re-upload the `dist/` folder.
