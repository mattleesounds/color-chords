import { NOTES, OCTAVES, VOICINGS, CHORD_INTERVALS, NOTE_ENHARMONIC, NOTES_WITH_SHARPS, NOTES_WITH_FLATS } from './data.js';

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
  
  // New hue mapping - shift by 300 degrees to make yellow (60°) map to C (0)
  const shiftedHue = (hue + 300) % 360;
  
  // Adjust warm/cool boundary for new mapping
  // Now warm colors are centered around yellow (previously red)
  const isWarm = (hue >= 30 && hue <= 90) || (hue >= 330 && hue <= 360);
  
  const intensity = (saturation * lightness) / 10000;
  const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
  const isGray = maxDiff < 30;
  const vibrancy = saturation * Math.sin(Math.PI * lightness / 100);
  const complexity = Math.abs((r - g) * (g - b) * (b - r)) / Math.pow(255, 3);

  return {
    hue: shiftedHue,
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

function getProperNoteName(note, key) {
  // Strip octave number if present
  const noteWithoutOctave = note.replace(/\d/g, '');
  const octave = note.match(/\d/) ? note.match(/\d/)[0] : '';
  
  // Determine if we should use flats based on the key
  const useFlats = FLAT_KEYS.includes(key) || 
                  FLAT_KEYS.includes(key + 'm');
  
  const noteArray = useFlats ? NOTES_WITH_FLATS : NOTES_WITH_SHARPS;
  const chromaticIndex = NOTES_WITH_SHARPS.indexOf(noteWithoutOctave);
  
  if (chromaticIndex === -1) {
    // If note wasn't found in sharps, try to find it in flats
    const flatIndex = NOTES_WITH_FLATS.indexOf(noteWithoutOctave);
    if (flatIndex === -1) {
      return note; // Return original if not found
    }
    return noteArray[flatIndex] + octave;
  }
  
  return noteArray[chromaticIndex] + octave;
}

function getNoteFrequency(note, octave, cents) {
  // Convert any flat notes to their sharp equivalents for frequency calculation
  const noteWithoutOctave = note.replace(/\d/g, '');
  let searchNote = noteWithoutOctave;
  
  // Convert flat notes to their sharp equivalents using the enharmonic mapping
  if (NOTE_ENHARMONIC[noteWithoutOctave] && NOTE_ENHARMONIC[noteWithoutOctave].includes('#')) {
    searchNote = NOTE_ENHARMONIC[noteWithoutOctave];
  }
  
  const noteIndex = NOTES_WITH_SHARPS.indexOf(searchNote);
  if (noteIndex === -1) return null;
  
  const a4 = 440;
  const a4Index = NOTES_WITH_SHARPS.indexOf('A');
  const a4Octave = 4;
  
  const semitonesFromA4 = (octave - a4Octave) * 12 + (noteIndex - a4Index);
  const baseFreq = a4 * Math.pow(2, semitonesFromA4 / 12);
  
  return baseFreq * Math.pow(2, cents / 1200);
}

function generateComplexChord(chord) {
  const rootNote = chord.root.slice(0, -1);  // Get complete root note without octave
  const centsDeviation = parseInt(chord.centsDeviation);
  
  // Always use octave 3 as base
  const baseOctave = 3;
  
  // Get root note index
  const rootIndex = NOTES.indexOf(rootNote);
  if (rootIndex === -1) {
    console.error(`Invalid root: ${rootNote}`);
    return [];
  }

  // Get intervals for the chord quality
  const intervals = CHORD_INTERVALS[chord.quality] || CHORD_INTERVALS[''];  // default to major if quality not found

  // Generate notes using intervals
  let notes = intervals.map((interval, index) => {
    // Calculate the actual note index in the chromatic scale
    const noteIndex = ((rootIndex + interval) % 12 + 12) % 12;
    
    // Calculate octave shifts based on interval size, but limit to octave 4
    const octaveShift = Math.floor((interval) / 12);
    let finalOctave = baseOctave + octaveShift;
    
    // Keep within octaves 3-4 range
    finalOctave = Math.min(4, finalOctave);
    
    const noteName = `${NOTES[noteIndex]}${finalOctave}`;
    
    return {
      note: noteName,
      frequency: getNoteFrequency(NOTES[noteIndex], finalOctave, centsDeviation),
      cents: centsDeviation
    };
  });

  return notes;
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

  // Always use octave 3 for root note
  const octave = 3;

  const quality = determineChordQuality(colorCharacteristics);

  const uniqueValue = (r * 256 * 256 + g * 256 + b);
  const voicing = Math.min((uniqueValue * 2) % VOICINGS, 2);

  const centsDeviation = calculateUniqueCents(r, g, b);

  return {
    root: `${rootNote}${octave}`,
    quality: quality,
    voicing: voicing,
    centsDeviation: centsDeviation.toString()
  };
}

export { hexToComplexChord, generateComplexChord };