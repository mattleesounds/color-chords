# Color Chords

An interactive web application that generates musical chords from RGB color values, creating a unique synesthetic experience where colors become sound.

![Project Demo](https://img.shields.io/badge/status-active-success.svg)
![Made with Vite](https://img.shields.io/badge/built%20with-Vite-646CFF.svg)
![Tone.js](https://img.shields.io/badge/audio-Tone.js-blue.svg)

## Overview

Color Chords explores the relationship between visual and auditory perception by algorithmically mapping RGB color values to musical parameters. Each randomly generated color produces a unique three-note chord with corresponding audio effects, demonstrating principles of generative art and algorithmic composition.

## Technical Highlights

### Architecture & Design Decisions

**Algorithmic Mapping System**
- RGB values are deterministically mapped to musical parameters using custom algorithms
- Red channel (0-255) maps to one of 12 chromatic root notes
- Blue channel determines chord intervals (major/minor 3rds, 6ths, perfect 4ths/5ths)
- Green channel selects extended chord tones (7ths, 9ths, perfect 5ths)
- RGB sum determines octave range (3-5)
- Color characteristics (hue dominance, brightness) select audio effects

**Audio Synthesis Pipeline**
- Implemented using Tone.js polyphonic synthesizer
- Signal chain: PolySynth → Reverb → Dynamic FX → Compressor → Output
- Six audio effects mapped to color properties:
  - Phaser (dark colors)
  - Reverb (blue/purple tones)
  - Chorus (green tones)
  - Delay (bright colors)
  - Distortion (red tones)
  - Tremolo (purple tones)

**Music Theory Implementation**
- Interval relationships stored in key-based lookup tables (data.js:1-184)
- Supports all 12 chromatic keys with proper interval calculations
- Generates harmonically coherent three-note voicings
- Octave displacement for extended harmony (synth.js:89-93)

### Tech Stack

- **Build Tool**: Vite - Modern, fast development and build tooling
- **Audio Engine**: Tone.js - Web Audio API framework for synthesis and effects
- **Styling**: Tailwind CSS - Utility-first CSS framework
- **Language**: Vanilla JavaScript (ES6 modules)

## Project Structure

```
color-chords/
├── index.html          # Entry point with UI structure
├── main.js             # Core application logic and event handling
├── synth.js            # Color-to-music mapping algorithms
├── data.js             # Musical interval lookup tables for all keys
├── style.css           # Custom styles
├── package.json        # Dependencies and build scripts
└── dist/               # Production build output
```

## How It Works

1. **Color Generation**: Random RGB values are generated (0-255 per channel)
2. **Musical Mapping**:
   - Root note selected based on red channel value
   - Second note calculated from blue channel using interval relationships
   - Third note derived from green channel for chord extension
   - Octave determined by total RGB sum
3. **Effect Selection**: Color characteristics analyzed to select appropriate audio effect
4. **Synthesis**: Three-note chord played through Tone.js synthesis chain
5. **Visual Feedback**: Display shows color swatch and corresponding musical parameters

## Local Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/mattleesounds/color-chords.git
cd color-chords

# Install dependencies
npm install
```

### Running Locally

```bash
# Start development server with hot module replacement
npm run dev

# Server will start at http://localhost:5173 (or next available port)
```

The development server includes:
- Hot Module Replacement (HMR) for instant updates
- Fast dependency pre-bundling
- Source maps for debugging

### Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` directory, optimized and minified for deployment.

## Usage

1. Open the application in a web browser
2. Click "Generate Color Chord" button
3. Observe the color display and listen to the generated chord
4. View the musical parameters: RGB values, note names, and active effect

## Development Skills Demonstrated

- **Algorithm Design**: Custom mapping functions for color-to-music translation
- **Audio Programming**: Web Audio API implementation via Tone.js
- **Music Theory**: Interval relationships, chord construction, harmonic voicing
- **Modern JavaScript**: ES6 modules, event handling, DOM manipulation
- **Build Tools**: Vite configuration and optimization
- **UI/UX**: Responsive design with Tailwind CSS
- **Code Organization**: Modular architecture with separation of concerns

## Future Enhancements

Potential improvements include:
- User-controlled color picker instead of random generation
- Adjustable synthesis parameters (attack, release, envelope)
- Recording and playback of generated sequences
- Visual representation of waveforms/spectrogram
- MIDI export functionality

## License

MIT License - Feel free to use and modify for your own projects.

---

Built with curiosity and creativity by [Matt Lee](https://github.com/mattleesounds)
