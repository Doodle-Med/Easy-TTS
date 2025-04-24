# Easy TTS

Easy TTS is a fully functional, user-friendly text-to-speech (TTS) web app designed for easy deployment on Netlify. Input text, choose your voice and options, and generate speech using Google Cloud's Text-to-Speech API.

## Features

- Live TTS synthesis with Google Cloud API
- Voice, speed, pitch, and chunking options
- API key securely stored in local browser storage
- Download generated MP3
- Responsive and accessible design

## How to Use

1. Enter your Google Cloud Text-to-Speech API key in the settings.
2. Input text and choose your preferred options.
3. Click "Generate & Play" to hear the speech.
4. Download the generated audio as MP3 if desired.

## How to Deploy on Netlify

1. Push this repository to GitHub.
2. Sign up/in at [Netlify](https://www.netlify.com/).
3. Connect your GitHub repo and deploy!
   - No build step needed—just deploy as a static site.

## Security

Your API key is only stored in your browser and is never transmitted to any server except Google Cloud.

## License

This project is licensed under the MIT License.