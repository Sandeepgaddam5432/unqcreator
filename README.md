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

### Step 3: Connect Your Frontend to the Engine
1.  Navigate to your deployed Vercel app (e.g., `https://unqcreator.vercel.app`).
2.  Log in using the "Sign in with Google" button.
3.  You'll be presented with an onboarding screen asking for your Engine URL.
4.  Paste the URL from your Colab notebook and click "Connect".
5.  The system will automatically validate the connection and take you to the dashboard when successful.

That's it! Your UnQCreator application is now fully set up and ready to use.

## Restarting Your Engine

If your Colab session times out or you need to restart the engine:
1. Simply open the Colab notebook again
2. Click "Run" on the cell
3. Copy the new public URL that gets generated
4. If you're already logged in to your frontend, go to Settings → Integrations and click "Reset Connection"
5. Enter the new URL when prompted

## Advanced Configuration

You can manage your engine connection at any time from the Settings page:
- Check the connection status of your engine
- Manually test the connection with the "Check Connection" button
- Reset your connection if needed
- View the last successful connection time

The application securely stores your configuration in your browser's local storage, ensuring your settings persist between sessions.
