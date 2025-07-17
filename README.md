# UnQCreator - Autonomous AI Media House

This project allows for the autonomous creation and management of content for YouTube and Instagram channels.

## Cloud Deployment Workflow

Follow these steps to deploy the full application in the cloud.

### Step 1: Deploy Frontend to Vercel
1.  Fork this repository to your own GitHub account.
2.  Go to [Vercel](https://vercel.com/) and create a new project, importing your forked repository.
3.  Vercel will automatically deploy the frontend. Your live URL will be something like `https://unqcreator.vercel.app`.

### Step 2: Launch the Backend on Google Colab
1.  Click the button below to open the backend engine launcher in Google Colab.

    [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/Sandeepgaddam5432/unqcreator/blob/main/UnQCreator_Engine.ipynb)

2.  In the Colab notebook, enter your Vercel URL (from Step 1) and your [Cloudflare Zero Trust Token](https://one.dash.cloudflare.com/) into the configuration cell.
3.  Run all cells (`Runtime -> Run all`). The notebook will output logs. **Do not close the Colab tab.**

### Step 3: Connect Frontend to Backend
1.  Look at the logs of the Cloudflare cell in your Colab notebook. Find a line that looks like `https://something-random.trycloudflare.com`. **This is your public API endpoint.**
2.  Go back to your project on Vercel.
3.  Navigate to `Settings -> Environment Variables`.
4.  Create a new variable:
    -   **Name:** `NEXT_PUBLIC_ENGINE_API_ENDPOINT`
    -   **Value:** Paste the Cloudflare URL from the previous step.
5.  Save and **re-deploy** your Vercel project for the changes to take effect.

Your `unqcreator.vercel.app` site is now fully connected to the engine running on Colab.
