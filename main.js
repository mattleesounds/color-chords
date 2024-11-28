import * as Tone from 'tone';
import './style.css';
import { 
    hexToComplexChord, 
    generateComplexChord,
    generateExtendedQualities,
    calculateUniqueValues,
    getNoteFrequency
} from './synth.js';
import { 
    CHORD_NAMES, 
    CHORD_INTERVALS,
    NOTES,
    OCTAVES,
    VOICINGS 
} from './data.js';

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
    try {
        await Tone.start();
        console.log('Tone started');
        let randomColor = getRandomHexColor();
        document.querySelector('#app').style.backgroundColor = randomColor;

        const complexChord = hexToComplexChord(randomColor);
        console.log('Complex chord:', complexChord);
        
        const chordNotes = generateComplexChord(complexChord);
        console.log('Generated notes:', chordNotes);
        console.log('Number of notes:', chordNotes.length);
        console.log('Intervals used:', CHORD_INTERVALS[complexChord.quality]);
        console.log('Quality generated:', complexChord.quality);

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
        console.log('Playing frequencies:', frequencies);

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
                    <br>
                    <span class="text-sm">Total notes: ${chordNotes.length}</span>
                </h1>
            </div>
        `;

    } catch (error) {
        console.error('Error generating chord:', error);
    }
});