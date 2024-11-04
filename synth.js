import { NOTES, OCTAVES, VOICINGS, CHORD_INTERVALS } from './data.js';

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
  const voicing = Math.min((uniqueValue * 2) % VOICINGS, 2);

  const centsDeviation = calculateUniqueCents(r, g, b);

  return {
    root: `${rootNote}${octave}`,
    quality: quality,
    voicing: voicing,
    centsDeviation: centsDeviation.toString()
  };
}

function generateComplexChord(chord) {
  const rootNote = chord.root.slice(0, -1);  // Get complete root note without octave
  const baseOctave = parseInt(chord.root.slice(-1));
  const centsDeviation = parseInt(chord.centsDeviation);
  
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
    
    // Calculate octave shifts based on interval size
    const octaveShift = Math.floor((interval) / 12);
    let finalOctave = baseOctave + octaveShift;
    
    // Keep within reasonable range (1-5)
    finalOctave = Math.max(1, Math.min(5, finalOctave));
    
    const noteName = `${NOTES[noteIndex]}${finalOctave}`;
    
    return {
      note: noteName,
      frequency: getNoteFrequency(NOTES[noteIndex], finalOctave, centsDeviation),
      cents: centsDeviation
    };
  });

  return notes;
}

export { hexToComplexChord, generateComplexChord };