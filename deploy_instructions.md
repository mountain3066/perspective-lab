# PerspectiveLab - Simple Deployment & Usage Instructions

This document explains how to run the PerspectiveLab application locally or publish it online for others to use. Because the application is a lightweight, static web app (pure HTML, CSS, and JavaScript), it requires **no installations**, **no databases**, and **no server setup** to run!

---

## Part 1: Running the Application Locally (On Your Computer)

You do not need an internet connection or any special software to run the application on your own machine.

1. Locate the packaged file: **`perspective-lab-deploy.zip`**.
2. **Right-click** the zip file and select **Extract All...** (or unzip it using your preferred zip utility).
3. Open the extracted folder and **double-click the `index.html` file**.
4. The application will instantly open in your default web browser (Chrome, Edge, Safari, Firefox, etc.) and is fully interactive!

---

## Part 2: Publishing the Application Online (For Free)

If you want to share a public link with others so they can access the app from their phone, tablet, or computer, you can host it online for free in under a minute using **Netlify Drop**.

### Step-by-Step Drop Upload:
1. Open your web browser and go to: **[https://app.netlify.com/drop](https://app.netlify.com/drop)**
2. Drag and drop the **`perspective-lab-deploy.zip`** file directly onto the designated upload box on the web page.
3. **That's it!** Netlify will instantly upload, extract, and deploy your site, displaying a live public URL (e.g., `https://wonderful-sculptor-12345.netlify.app`). You can send this link to anyone.
4. *(Optional)* You can sign up for a free Netlify account on that page to customize the domain name (e.g., `https://perspective-lab.netlify.app`) so it is easier to remember.

---

## Part 3: Updating the Package After Code Changes

If you make modifications to the application files (`index.html`, `app.js`, or `styles.css`) in the future, you can easily update the deployable zip file with a single click.

1. Open the project folder.
2. Double-click the file named **`package.bat`**.
3. A terminal window will open, automatically bundle the updated files, and recreate a fresh **`perspective-lab-deploy.zip`** file.
4. Press any key to close the window when it finishes.
5. Upload this new zip file to your hosting provider to publish the updates!
