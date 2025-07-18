# UnQCreator - Autonomous AI Media House

A production-ready platform for autonomous creation and management of content for YouTube and Instagram channels.

## 🚀 Key Features

- **One-Click Deployment**: Launch your AI engine with a single click in Google Colab
- **High-Speed Video Generation**: Optimized workflows for ultra-fast video creation
- **State-of-the-Art Text-to-Speech**: Premium quality voice narration for your videos
- **Secure API Architecture**: Robust error handling, retries, and security features
- **Seamless Onboarding**: Intelligent connection workflow with automatic validation
- **Responsive UI**: Clean, modern interface with real-time feedback

## 🖥️ Cloud Deployment Workflow

Follow these simple steps to deploy the full application in the cloud.

### Step 1: Deploy Frontend to Vercel

1. Fork this repository to your own GitHub account
2. Go to [Vercel](https://vercel.com/) and create a new project, importing your forked repository
3. Vercel will automatically deploy the frontend. Your live URL will be something like `https://unqcreator.vercel.app`

### Step 2: Launch the Backend on Google Colab

1. Click the button below to open the backend engine launcher in Google Colab

   [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/Sandeepgaddam5432/unqcreator/blob/main/UnQCreator_Engine.ipynb)

2. **Select a High-Performance GPU**: For best results, select T4 or A100 GPU runtime (Runtime → Change runtime type → Hardware accelerator → GPU)
3. Simply click the "Run" button on the cell
4. Wait for the setup to complete (5-10 minutes)
5. Your public URL will appear automatically with a convenient copy button

### Step 3: Connect Your Frontend to the Engine

1. Navigate to your deployed Vercel app (e.g., `https://unqcreator.vercel.app`)
2. Log in using the "Sign in with Google" button
3. You'll be presented with an onboarding screen asking for your Engine URL
4. Paste the URL from your Colab notebook and click "Connect"
5. The system will automatically validate the connection and take you to the dashboard when successful

That's it! Your UnQCreator application is now fully set up and ready to use.

## ⚡ Optimized Video Generation

UnQCreator uses state-of-the-art techniques to generate high-quality videos at maximum speed:

### Performance Optimizations

- **SDXL Turbo Integration**: Ultra-fast generation with minimal quality loss
- **Optimized Sampling**: Efficient schedulers and sampling methods for faster results
- **Batch Processing**: Generate multiple frames simultaneously for better throughput
- **Hardware-Aware Settings**: Automatically adjusts settings based on available GPU

### Quality Presets

- **Draft**: Lightning-fast generation for quick previews (1-2 steps)
- **Standard**: Balanced speed and quality for most use cases (20 steps)
- **High**: Premium quality for final productions (30 steps)
- **Ultra**: Maximum quality for professional content (50 steps)

## 🔊 Text-to-Speech Integration

UnQCreator includes a premium text-to-speech system:

- **Google Cloud TTS Integration**: High-quality, natural-sounding voices
- **Multiple Languages and Accents**: Support for various languages and regional accents
- **Voice Customization**: Adjust speed, pitch, and other parameters
- **Long-Text Support**: Automatically handles long scripts with proper chunking
- **Real-time Preview**: Test your TTS settings directly in the interface

## 🛡️ Security and Reliability

The platform includes enterprise-grade security and reliability features:

- **Robust API Layer**: Automatic retries, timeout handling, and error management
- **CORS Protection**: Secure cross-origin resource sharing configuration
- **Connection Heartbeats**: Periodic checks to ensure system availability
- **Detailed Error Handling**: Specific error messages for better troubleshooting
- **Data Validation**: Input validation to prevent injection attacks

## 🔄 Restarting Your Engine

If your Colab session times out or you need to restart the engine:

1. Simply open the Colab notebook again
2. Click "Run" on the cell
3. Copy the new public URL using the copy button
4. If you're already logged in to your frontend, go to Settings → Integrations and click "Reset Connection"
5. Enter the new URL when prompted

## 🔧 Advanced Configuration

### Text-to-Speech Configuration

1. Go to Settings → Integrations in your frontend
2. Enter your Google Cloud TTS API key
3. Select your preferred voice, speed, and pitch
4. Test your configuration with the built-in preview feature

### Video Generation Options

Customize your video generation settings:

- **Quality Preset**: Select from Draft, Standard, High, or Ultra
- **Resolution**: Choose from various resolutions (512x512 up to 1024x1024)
- **FPS**: Set frames per second (15-60)
- **Duration**: Set video length in seconds
- **Advanced Options**: Enable/disable upscaling, motion guidance, and other features

## 🖥️ Hardware Recommendations

For optimal performance, we recommend the following Google Colab configurations:

- **T4 GPU**: Good for standard video generation (free tier)
- **A100 GPU**: Excellent for high-quality, longer videos (Colab Pro)
- **V100 GPU**: Great balance of speed and quality (Colab Pro)

## 📚 API Documentation

UnQCreator provides a comprehensive API for advanced integrations:

- **Authentication**: Secure your API endpoints with proper authentication
- **Error Handling**: Robust error handling with detailed error codes
- **Rate Limiting**: Prevent abuse with intelligent rate limiting
- **Documentation**: Full OpenAPI/Swagger documentation

## 🤝 Contributing

We welcome contributions to UnQCreator! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more information.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
