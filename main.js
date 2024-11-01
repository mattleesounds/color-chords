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
  const rootNote = chord.root.slice(0, -1);
  const octaveNum = chord.root.slice(-1);
  const qualityName = CHORD_NAMES[chord.quality] || chord.quality;
  const centsLabel = chord.centsDeviation > 0 ? 
    `+${chord.centsDeviation}` : 
    chord.centsDeviation;
  return `${rootNote} ${qualityName} (${centsLabel}¢)`;
}

let randomColor = getRandomHexColor();
document.querySelector('#app').style.backgroundColor = randomColor;

document.getElementById("play-button").addEventListener("click", async function () {
  console.log('Button clicked');
  try {
    await Tone.start();
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

    const frequencies = chordNotes.map(note => note.frequency);
    const duration = '1.5n';
    
    synth.triggerAttackRelease(frequencies, duration, Tone.now());
    console.log('Chord played with frequencies:', frequencies);

    document.querySelector('#text').innerHTML = `
      <div>
        <h1 class="text-white">
          Color: ${randomColor}
          <br>
          <br>
          Chord: ${getFullChordName(complexChord)}
          <br>
          <br>
          Notes: ${chordNotes.map(n => n.note).join(', ')}
          <br>
          <br>
          Root Frequency: ${chordNotes[0].frequency.toFixed(2)} Hz
          <br>
          <span class="text-sm">Microtonal adjustment: ${complexChord.centsDeviation}¢</span>
        </h1>
      </div>
    `;

    console.log('Chord details:', {
      color: randomColor,
      rootNote: complexChord.root,
      quality: complexChord.quality,
      inversion: complexChord.inversion,
      voicing: complexChord.voicing,
      centsDeviation: complexChord.centsDeviation,
      rootFrequency: chordNotes[0].frequency.toFixed(2) + ' Hz',
      notes: chordNotes.map(n => n.note)
    });

  } catch (error) {
    console.error('Error generating chord:', error);
  }
});