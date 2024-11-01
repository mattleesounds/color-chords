import { NOTES, OCTAVES, CHORD_QUALITIES, INVERSIONS, VOICINGS, rootToKey } from './data.js';

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { hue: h * 360, saturation: s * 100, lightness: l * 100 };
}

function getColorCharacteristics(r, g, b) {
  const { hue, saturation, lightness } = rgbToHsl(r, g, b);
  
  const isWarm = (hue >= 0 && hue <= 60) || (hue >= 300 && hue <= 360);
  const intensity = (saturation * lightness) / 10000;
  const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
  const isGray = maxDiff < 30;
  const vibrancy = saturation * Math.sin(Math.PI * lightness / 100);
  const complexity = Math.abs((r - g) * (g - b) * (b - r)) / Math.pow(255, 3);

  return {
    hue,
    saturation,
    lightness,
    isWarm,
    intensity,
    isGray,
    vibrancy,
    complexity
  };
}

function determineChordQuality(colorCharacteristics) {
  const { hue, saturation, lightness, isWarm, intensity, isGray, vibrancy, complexity } = colorCharacteristics;
  
  if (isGray) {
    if (lightness < 20) return 'dim7';
    if (lightness > 80) return 'maj7';
    if (lightness > 50) return 'sus4';
    return 'sus2';
  }

  if (saturation > 80) {
    if (isWarm) {
      if (lightness > 60) return 'maj9';
      return '13';
    } else {
      if (lightness > 60) return 'maj7#11';
      return 'm9';
    }
  }

  if (complexity > 0.5) {
    if (isWarm) return '9';
    return 'm11';
  }

  if (saturation >= 40 && saturation <= 80) {
    if (isWarm) {
      if (lightness > 60) return 'maj7';
      return '7';
    } else {
      if (lightness > 60) return 'm6';
      return 'm7';
    }
  }

  return isWarm ? '' : 'm';
}

function calculateUniqueCents(r, g, b) {
  // Create a unique number between 0 and 16,777,215 (256^3 - 1)
  const uniqueColorValue = (r * 256 * 256) + (g * 256) + b;
  
  // Map this unique value to the range -50 to +50 cents
  // Subtract 8388607.5 (half of 16,777,215) to center around 0
  const cents = Math.round((uniqueColorValue - 8388607.5) / 8388607.5 * 50);
  
  return cents;
}

function getNoteFrequency(note, octave, cents) {
  const noteIndex = NOTES.indexOf(note);
  if (noteIndex === -1) return null;
  
  const a4 = 440;
  const a4Index = NOTES.indexOf('A');
  const a4Octave = 4;
  
  const semitonesFromA4 = (octave - a4Octave) * 12 + (noteIndex - a4Index);
  const baseFreq = a4 * Math.pow(2, semitonesFromA4 / 12);
  
  // Apply the quarter-tone adjustment
  return baseFreq * Math.pow(2, cents / 1200);
}

function hexToComplexChord(hexColor) {
  const hex = hexColor.replace('#', '').toUpperCase();
  
  if (hex.length !== 6) {
    console.error(`Invalid hex color code: ${hexColor}`);
    return {};
  }

  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const colorCharacteristics = getColorCharacteristics(r, g, b);
  const { hue, saturation, lightness, complexity } = colorCharacteristics;

  const hueAdjusted = (hue + (complexity * 15)) % 360;
  const rootIndex = Math.round(hueAdjusted / 30) % 12;
  const rootNote = NOTES[rootIndex];

  const octaveFloat = (lightness / 100 * 3) + (saturation / 100);
  const octave = Math.max(1, Math.min(5, Math.floor(octaveFloat) + 1));

  const quality = determineChordQuality(colorCharacteristics);

  const uniqueValue = (r * 256 * 256 + g * 256 + b);
  const inversion = uniqueValue % INVERSIONS;
  const voicing = Math.min((uniqueValue * 2) % VOICINGS, 2);

  const centsDeviation = calculateUniqueCents(r, g, b);

  return {
    root: `${rootNote}${octave}`,
    quality: quality,
    inversion: inversion,
    voicing: voicing,
    centsDeviation: centsDeviation.toString()
  };
}

function generateComplexChord(chord) {
  const rootNote = chord.root[0];
  const baseOctave = parseInt(chord.root.slice(-1));
  const rootKey = rootToKey(rootNote);
  const centsDeviation = parseInt(chord.centsDeviation);
  
  if (!rootKey) {
    console.error(`Invalid root: ${rootNote}`);
    return [];
  }

  const rootPitch = NOTES.indexOf(rootNote);
  let chordNotes = [rootPitch];

  switch (chord.quality) {
    case 'm':
    case 'm7':
    case 'm6':
    case 'm9':
    case 'm11':
      chordNotes.push(NOTES.indexOf(rootKey.m3));
      break;
    case 'sus4':
      chordNotes.push(NOTES.indexOf(rootKey.P4));
      break;
    case 'sus2':
      chordNotes.push(NOTES.indexOf(rootKey.M2));
      break;
    case 'dim7':
      chordNotes.push(NOTES.indexOf(rootKey.m3));
      chordNotes.push(NOTES.indexOf(rootKey.dim5));
      chordNotes.push(NOTES.indexOf(rootKey.dim7));
      break;
    case '5':
      break;
    default:
      chordNotes.push(NOTES.indexOf(rootKey.M3));
  }

  if (!chord.quality.includes('dim')) {
    chordNotes.push(NOTES.indexOf(rootKey.P5));
  }

  if (chord.quality.includes('maj7')) {
    chordNotes.push(NOTES.indexOf(rootKey.M7));
  } else if (chord.quality.includes('7')) {
    chordNotes.push(NOTES.indexOf(rootKey.m7));
  } else if (chord.quality.includes('6')) {
    chordNotes.push(NOTES.indexOf(rootKey.M6));
  }

  if (chord.quality.includes('9')) {
    chordNotes.push(NOTES.indexOf(rootKey.M9));
  }

  if (chord.quality.includes('11')) {
    chordNotes.push(NOTES.indexOf(rootKey.P11));
  }

  if (chord.quality.includes('13')) {
    chordNotes.push(NOTES.indexOf(rootKey.M13));
  }

  if (chord.quality.includes('#11')) {
    chordNotes.push(NOTES.indexOf(rootKey.aug11));
  }

  for (let i = 0; i < chord.inversion; i++) {
    chordNotes.push(chordNotes.shift() + 12);
  }

  chordNotes = chordNotes.map((note, index) => {
    const newNote = note + (chord.voicing * index);
    const resultingOctave = Math.floor(newNote / 12) + baseOctave;
    
    if (resultingOctave > 5) {
      return note + (baseOctave * 12) - 12;
    } else if (resultingOctave < 1) {
      return note + (baseOctave * 12) + 12;
    }
    return note + (baseOctave * 12);
  });

  return chordNotes.map(pitch => {
    const noteIndex = ((pitch % 12) + 12) % 12;
    let octave = Math.floor(pitch / 12) + 1;
    octave = Math.max(1, Math.min(5, octave));
    const noteName = `${NOTES[noteIndex]}${octave}`;
    
    return {
      note: noteName,
      frequency: getNoteFrequency(NOTES[noteIndex], octave, centsDeviation),
      cents: centsDeviation
    };
  });
}

export { hexToComplexChord, generateComplexChord };