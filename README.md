# UnQCreator - Autonomous AI Media House

This project allows for the autonomous creation and management of content for YouTube and Instagram channels.

## Cloud Deployment Workflow

Follow these simple steps to deploy the full application in the cloud.

### Step 1: Deploy Frontend to Vercel
1.  Fork this repository to your own GitHub account.
2.  Go to [Vercel](https://vercel.com/) and create a new project, importing your forked repository.
3.  Vercel will automatically deploy the frontend. Your live URL will be something like `https://unqcreator.vercel.app`.

### Step 2: Launch the Backend on Google Colab
1.  Click the button below to open the backend engine launcher in Google Colab.

    [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/Sandeepgaddam5432/unqcreator/blob/main/UnQCreator_Engine.ipynb)

2.  In the Colab notebook, simply click the "Run" button on the cell.
3.  Wait for the setup to complete (5-10 minutes). The notebook will display a public URL when ready.
4.  Copy this URL - you'll need it for the next step.

### Step 3: Connect Frontend to Backend
1.  Go back to your project on Vercel.
2.  Navigate to `Settings -> Environment Variables`.
3.  Create a new variable:
    -   **Name:** `NEXT_PUBLIC_ENGINE_API_ENDPOINT`
    -   **Value:** Paste the public URL from the Colab notebook.
4.  Save and **re-deploy** your Vercel project for the changes to take effect.

That's it! Your `unqcreator.vercel.app` site is now fully connected to the engine running on Colab.

## Restarting Your Engine

If your Colab session times out or you need to restart the engine:
1. Simply open the Colab notebook again
2. Click "Run" on the cell
3. Copy the new public URL that gets generated
4. Update your Vercel environment variable with this new URL
5. Re-deploy your Vercel project

No configuration, no accounts, no tokens - just click and go!
