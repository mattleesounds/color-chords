import * as Tone from 'tone';
import './style.css';
import { hexToComplexChord, generateComplexChord } from './synth.js';

function getRandomInt() {
  return Math.floor(Math.random() * 255);
}

function getRandomHexColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

let randomColor = getRandomHexColor();
document.querySelector('#app').style.backgroundColor = randomColor;

document.getElementById("play-button").addEventListener("click", async function () {
  try {
    await Tone.start(); // Ensure Tone.js is started
    let randomColor = getRandomHexColor();
    document.querySelector('#app').style.backgroundColor = randomColor;

    const complexChord = hexToComplexChord(randomColor);
    const chordNotes = generateComplexChord(complexChord);

    const synth = new Tone.PolySynth().toDestination();
    synth.set({
      envelope: {
        attack: 0.5,
        release: 0.8
      }
    });

    Tone.Master.volume.value = -10;

    synth.triggerAttackRelease(chordNotes, '1.5n', Tone.now());
    console.log(complexChord, chordNotes);

    document.querySelector('#text').innerHTML = `
      <div>
        <h1 class="text-white">
          Color: ${randomColor}
          <br>
          <br>
          Chord: ${complexChord.root}${complexChord.quality}
          <br>
          <br>
          Notes: ${chordNotes.join(', ')}
          <br>
          <br>
          Effect: ${complexChord.effect} (Intensity: ${complexChord.effectIntensity})
        </h1>
      </div>
    `;
  } catch (error) {
    console.error('Error generating chord:', error);
  }
});