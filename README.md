# Easy TTS Playground

[![Netlify Status](https://api.netlify.com/api/v1/badges/dad908be-96ea-48b6-aa53-aa83ae80051b/deploy-status)](https://app.netlify.com/sites/easytexttospeech/deploys)

**Live Demo:** [https://easytexttospeech.netlify.app/](https://easytexttospeech.netlify.app/)

Easy TTS Playground is a user-friendly text-to-speech (TTS) web app designed for easy deployment on Netlify. It allows you to experiment with Google Cloud's Text-to-Speech API directly from your browser using secure authentication.

## Features

* Securely access Google Cloud TTS API via Google Sign-In (OAuth 2.0).
* Live TTS synthesis using the Google Cloud API.
* Dynamically load available voices.
* Adjust voice pitch, speaking rate, and text chunking method.
* Playback synthesized audio with word highlighting (requires `voice-visualizer.js`).
* Download generated speech as an MP3 file.
* Includes Content Security Policy (CSP) for enhanced security.
* Responsive design.

## How to Use

1.  Visit the [Live Demo](https://easytexttospeech.netlify.app/).
2.  Click **"Sign in with Google"** and authenticate using a Google Account that has access to a Google Cloud project where the Text-to-Speech API is enabled. You may need to grant permission via the OAuth consent screen.
3.  Click **"Load Voices"** to fetch available voices for your account.
4.  Input text into the text area.
5.  Choose your preferred voice, pitch, rate, and chunking options.
6.  Click **"Generate & Play"** to synthesize and hear the speech.
7.  Click **"Download Audio"** to save the generated speech as an MP3 file if desired.

## Deployment on Netlify

1.  Fork or clone this repository to your GitHub account.
2.  Sign up or log in at [Netlify](https://netlify.com).
3.  Click "Add new site" -> "Import an existing project".
4.  Connect to your Git provider (GitHub) and select the repository.
5.  Configure deployment settings (usually default settings for static sites work - no build command needed, publish directory should be the root `/` unless you structured it differently).
6.  Deploy the site. Netlify will provide you with a URL (like `yoursitename.netlify.app`).
7.  **Important for OAuth:** You *must* add your Netlify site URL (e.g., `https://yoursitename.netlify.app`) to the "Authorized JavaScript origins" in your Google Cloud Console -> APIs & Services -> Credentials -> Your OAuth 2.0 Client ID settings.

## Security

* **Authentication:** Uses Google Sign-In (OAuth 2.0) standard flow. Temporary access tokens are used, and no secret API keys are stored in the browser or transmitted insecurely.
* **Authorization:** API calls are made securely using the access token obtained via OAuth and run under the context of the authenticated user's Google Account permissions.
* **Transport Security:** All communication with Google APIs uses HTTPS.
* **Content Security Policy:** A CSP is implemented via meta tags to restrict the sources from which resources (scripts, frames, etc.) can be loaded, mitigating certain types of cross-site scripting (XSS) attacks.

## Required Files

Ensure the following files are present for full functionality and OAuth consent screen requirements:

* `Index.html`: The main application page.
* `voice-visualizer.js`: Required for the audio visualization canvas. (Source/License depends on where you obtained this).
* `about.html`: Simple page describing the application (required for Google OAuth).
* `privacy.html`: Privacy Policy outlining data handling (required for Google OAuth).
* `terms.html`: Terms of Service (required for Google OAuth).
* `logo.png` (or similar): Uploaded directly to the Google Cloud Console OAuth screen.

## License

This project's code (excluding third-party libraries like `voice-visualizer.js` or Google API client scripts) is licensed under the MIT License. See the LICENSE file (if included) for details.
