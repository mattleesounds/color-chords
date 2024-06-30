import { NOTES, OCTAVES, CHORD_QUALITIES, EFFECTS, INVERSIONS, VOICINGS, EFFECT_INTENSITIES } from './data.js';

function hexToComplexChord(hexColor) {
  const hex = hexColor.replace('#', '').toUpperCase();
  
  const [rootAndOctave, quality, inversion, voicing, effect, effectIntensity] = [
    parseInt(hex.substr(0, 2), 16),
    hex[2],
    parseInt(hex[3], 16),
    parseInt(hex[4], 16),
    parseInt(hex[5], 16),
    parseInt(hex[7], 16)
  ];

  return {
    root: NOTES[rootAndOctave % 12] + OCTAVES[Math.floor(rootAndOctave / 43)],
    quality: CHORD_QUALITIES[quality],
    inversion: inversion % INVERSIONS,
    voicing: voicing % VOICINGS,
    effect: EFFECTS[effect % EFFECTS.length],
    effectIntensity: effectIntensity / 15  // Normalized to 0-1 range
  };
}

function generateComplexChord(chord) {
  let chordNotes = [];
  const rootPitch = NOTES.indexOf(chord.root[0]) + (parseInt(chord.root[1]) * 12);
  
  // Generate base chord
  chordNotes.push(rootPitch);
  
  switch(chord.quality) {
    case 'm': case 'm7': case 'm6': case 'm9': case 'm11':
      chordNotes.push(rootPitch + 3);  // Minor third
      break;
    case 'sus4':
      chordNotes.push(rootPitch + 5);  // Perfect fourth
      break;
    case '5':
      break;  // No third for power chord
    default:
      chordNotes.push(rootPitch + 4);  // Major third
  }
  
  if (chord.quality !== '5') {
    chordNotes.push(rootPitch + 7);  // Perfect fifth
  }
  
  // Add extensions
  if (['7', 'maj7', 'm7', '9', 'maj9', 'm9', '11', '13', 'm11'].includes(chord.quality)) {
    chordNotes.push(chord.quality.includes('maj') ? rootPitch + 11 : rootPitch + 10);
  }
  if (['6', 'm6'].includes(chord.quality)) {
    chordNotes.push(rootPitch + 9);
  }
  if (['9', 'maj9', 'm9', '11', '13', 'add9'].includes(chord.quality)) {
    chordNotes.push(rootPitch + 14);
  }
  if (['11', '13', 'm11'].includes(chord.quality)) {
    chordNotes.push(rootPitch + 17);
  }
  if (chord.quality === '13') {
    chordNotes.push(rootPitch + 21);
  }

  // Apply inversion
  for (let i = 0; i < chord.inversion; i++) {
    chordNotes.push(chordNotes.shift() + 12);
  }
  
  // Apply voicing (spread notes across octaves)
  chordNotes = chordNotes.map((note, index) => note + (chord.voicing * index));
  
  // Convert to note names with octaves
  return chordNotes.map(pitch => NOTES[pitch % 12] + Math.floor(pitch / 12));
}

export { hexToComplexChord, generateComplexChord };