# Studio – React Text-to-Speech App

A React-powered Text-to-Speech web app that transforms user-entered text into spoken audio using the built-in Web Speech API.

## 🔧 Features

- 🎯 Converts typed text into speech directly in the browser
- ▶️ Basic playback controls: Play, Pause/Resume, and Stop
- 🗣️ Supports selection of available voices using the Web Speech API
- ⚙️ Adjustable speech rate, pitch, and volume
- ⚡️ Highlighting text in sync with speech (optional, if implemented)
- ♻️ React-based and responsive

## ⚙️ Setup & Installation

1. Clone the repo:

    ```bash
    git clone https://github.com/sumcray-star/studio.git
    cd studio
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Run the development server:

    ```bash
    npm start
    ```

## 🧩 How It Works

The app uses the browser's integrated `SpeechSynthesis` and `SpeechSynthesisUtterance` APIs via a custom React hook or component. Here's the general flow:

1. On user input, the text is stored in component state.
2. User selects desired **voice**, **rate**, **pitch**, and **volume** from UI controls.
3. Clicking **Play** triggers a `SpeechSynthesisUtterance`.
4. **Pause**, **Resume**, and **Stop** buttons control the speech playback.
5. Optionally, the spoken text is highlighted as it's being read aloud.

🎨 Usage Instructions
Enter text in the input or textarea.

Choose a voice, adjust rate/pitch/volume sliders.

Tap Play, Pause/Resume, or Stop for playback control.

Optional: Highlight text as it's spoken (if implemented).

🛠️ Future Enhancements
🔉 Live text highlighting synchronized with speech

🌍 Multi-language support

🎭 Voice selection presets (e.g., male, female)

💾 Export audio output to downloadable blob file

👥 Contributing
Contributions welcome! Please:

Open an issue with bug reports or feature requests

Submit a clean, focused PR for enhancements

Run npm test and lint before submitting

📄 License
Licensed under the MIT License. See the LICENSE file for details.

Built with ❤️ using React and the Web Speech API.

