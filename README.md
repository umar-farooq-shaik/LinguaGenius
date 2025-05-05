# LinguaGenius Translator

LinguaGenius Translator is a modern, responsive, and multilingual text translator website built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and the Google Gemini API. It supports AI-powered translation, speech-to-text, text-to-speech, and translation history.
## Features

### Functional Features
- **AI-Powered Translation**: 
  - Language detection (if auto-detect is enabled).
  - Translation from selected input to selected output language using the Google Gemini API.
- **Speech Support**:
  - Speech-to-text input using the Web Speech API.
  - Text-to-speech playback for both input and output.
- **Download Support**:
  - Download translated output as a `.txt` file.
- **Local Translation History**:
  - Store and display recent translations (e.g., last 10) using local storage.
  - Include timestamps and source/target language info.
- **Optional Stats Dashboard**:
  - Total number of translations.
  - Most common language pairs.

### UI & Layout
- Two-panel layout:
  - **Left Panel**:
    - Textarea for input.
    - Dropdown to select the input language.
    - Toggle for auto-detect language.
    - Microphone icon for speech-to-text input.
  - **Right Panel**:
    - Read-only box for translated output.
    - Dropdown for selecting the target language.
    - Speaker icon for text-to-speech.
    - Download button for saving translations.
- Control buttons between panels:
  - Translate.
  - Swap Languages.
  - Dark/Light Mode Toggle (top-right).
- Mobile-friendly, clean, and polished design using Tailwind CSS.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS.
- **Backend**: Node.js, Express.js.
- **API Integration**: Google Gemini API for language detection and translation 
