import * as Tone from 'tone';
import './style.css';
import { hexToComplexChord, generateComplexChord } from './synth.js';
import { CHORD_NAMES } from './data.js';

function getRandomInt() {
  return Math.floor(Math.random() * 255);
}

function getRandomHexColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

function getFullChordName(chord) {
  const rootNote = chord.root.slice(0, -1);  // Keep original root note (C#, etc.)
  const octaveNum = chord.root.slice(-1);
  const qualityName = CHORD_NAMES[chord.quality] || chord.quality;
  return `${rootNote} ${qualityName}`;
}

let randomColor = getRandomHexColor();
document.querySelector('#app').style.backgroundColor = randomColor;

document.getElementById("play-button").addEventListener("click", async function () {
  console.log('Button clicked');
  try {
    await Tone.start(); // Ensure Tone.js is started
    console.log('Tone started');
    let randomColor = getRandomHexColor();
    console.log('Random color generated:', randomColor);
    document.querySelector('#app').style.backgroundColor = randomColor;

    const complexChord = hexToComplexChord(randomColor);
    console.log('Complex chord generated:', complexChord);
    const chordNotes = generateComplexChord(complexChord);
    console.log('Chord notes generated:', chordNotes);

    const synth = new Tone.PolySynth().toDestination();
    synth.set({
      envelope: {
        attack: 0.5,
        release: 0.8
      }
    });

    Tone.Master.volume.value = -10;

    // Use a valid duration for the chord
    const duration = '1.5n';
    synth.triggerAttackRelease(chordNotes, duration, Tone.now());
    console.log('Chord played');

    document.querySelector('#text').innerHTML = `
      <div>
        <h1 class="text-white">
          Color: ${randomColor}
          <br>
          <br>
          Chord: ${getFullChordName(complexChord)}
          <br>
          <br>
          Notes: ${chordNotes.join(', ')}
          <br>
        </h1>
      </div>
    `;
  } catch (error) {
    console.error('Error generating chord:', error);
  }
});