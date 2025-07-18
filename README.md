# UnQCreator - Autonomous AI Media House

This project allows for the autonomous creation and management of content for YouTube and Instagram channels.

## Cloud Deployment Workflow

Follow these steps to deploy the full application in the cloud.

### Step 1: Deploy Frontend to Vercel
1.  Fork this repository to your own GitHub account.
2.  Go to [Vercel](https://vercel.com/) and create a new project, importing your forked repository.
3.  Vercel will automatically deploy the frontend. Your live URL will be something like `https://unqcreator.vercel.app`.

### Step 2: Set Up a Permanent Cloudflare Tunnel
1.  Go to the [Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com/).
2.  Navigate to **Access > Tunnels** and click **Create a tunnel**.
3.  Give your tunnel a name (e.g., "UnQCreator Engine") and click **Save tunnel**.
4.  On the next screen, you'll see a token. **Copy this token** and save it for later use.
5.  Under the **Public Hostname** tab, click **Add a public hostname**.
6.  Configure your public hostname:
    - **Domain**: Select your domain or subdomain (e.g., `unq-engine.yourdomain.com`)
    - **Path**: Leave blank or use `/` 
    - **Service**: Select `HTTP` and set the URL to `localhost:8188`
    - Click **Save hostname**
7.  Your permanent, static URL is now the hostname you just created (e.g., `https://unq-engine.yourdomain.com`).
8.  **Important**: Save both your **tunnel token** and your **static URL** for the next step.

### Step 3: Launch the Backend on Google Colab
1.  Click the button below to open the backend engine launcher in Google Colab.

    [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/Sandeepgaddam5432/unqcreator/blob/main/UnQCreator_Engine.ipynb)

2.  In the Colab notebook, enter:
    - Your Vercel URL (from Step 1)
    - Your Cloudflare Tunnel Token (from Step 2)
    - Your Static URL (the public hostname you created in Step 2)
3.  Run all cells (`Runtime -> Run all`). The notebook will output logs. **Do not close the Colab tab.**

### Step 4: Connect Frontend to Backend
1.  Go back to your project on Vercel.
2.  Navigate to `Settings -> Environment Variables`.
3.  Create a new variable:
    -   **Name:** `NEXT_PUBLIC_ENGINE_API_ENDPOINT`
    -   **Value:** Your static URL from Step 2 (e.g., `https://unq-engine.yourdomain.com`)
4.  Save and **re-deploy** your Vercel project for the changes to take effect.

Your `unqcreator.vercel.app` site is now fully connected to the engine running on Colab through a permanent, static URL.

## Restarting Your Engine

When you need to restart your engine (e.g., after Colab session timeout):
1. Simply open the Colab notebook again
2. Enter the same configuration values (Vercel URL, Cloudflare Token, and Static URL)
3. Run all cells
4. Your engine will be available at the same static URL as before - no need to update your frontend settings!
