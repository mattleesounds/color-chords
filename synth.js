import { NOTES, OCTAVES, CHORD_QUALITIES, EFFECTS, INVERSIONS, VOICINGS, rootToKey } from './data.js';

// Helper functions for color analysis
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
  
  // Calculate color temperature (warm vs cool)
  const isWarm = (hue >= 0 && hue <= 60) || (hue >= 300 && hue <= 360);
  
  // Calculate color intensity
  const intensity = Math.sqrt(r*r + g*g + b*b) / Math.sqrt(3 * 255 * 255);
  
  // Calculate grayness
  const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
  const isGray = maxDiff < 30;
  
  // Calculate vibrancy
  const vibrancy = saturation * (1 - Math.abs(lightness - 50) / 50);

  return {
    hue,
    saturation,
    lightness,
    isWarm,
    intensity,
    isGray,
    vibrancy
  };
}

function determineChordQuality(colorCharacteristics) {
  const { hue, saturation, lightness, isWarm, intensity, isGray, vibrancy } = colorCharacteristics;
  
  // Handle grayscale colors specially
  if (isGray) {
    if (lightness < 20) return 'dim7';      // Very dark gray - diminished 7th
    if (lightness > 80) return 'sus4';      // Very light gray - suspended 4th
    return 'sus2';                          // Mid gray - suspended 2nd
  }

  // For vibrant, saturated colors
  if (vibrancy > 70) {
    if (isWarm) {
      if (lightness > 60) return 'maj9';    // Bright warm colors - major 9th
      return '13';                          // Dark warm colors - dominant 13th
    } else {
      if (lightness > 60) return 'maj7';    // Bright cool colors - major 7th
      return 'm9';                          // Dark cool colors - minor 9th
    }
  }

  // For muted colors
  if (saturation < 40) {
    if (isWarm) {
      return 'm7';                          // Muted warm - minor 7th
    } else {
      return 'm6';                          // Muted cool - minor 6th
    }
  }

  // For medium saturation
  if (isWarm) {
    return '';                              // Warm medium - major triad
  } else {
    return 'm';                             // Cool medium - minor triad
  }
}

function hexToComplexChord(hexColor) {
  const hex = hexColor.replace('#', '').toUpperCase();
  console.log(`Hex color: ${hex}`);

  if (hex.length !== 6) {
    console.error(`Invalid hex color code: ${hexColor}`);
    return {};
  }

  // Convert hex to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const colorCharacteristics = getColorCharacteristics(r, g, b);
  const { hue, saturation, lightness } = colorCharacteristics;

  // Map hue to root note
  const rootIndex = Math.round(hue / 30) % 12;
  const rootNote = NOTES[rootIndex];

  // Map lightness to octave (1-5 range)
  const octave = Math.floor(lightness / 100 * 4) + 1;

  // Determine chord quality based on color characteristics
  const quality = determineChordQuality(colorCharacteristics);

  // Use RGB values for additional parameters to ensure uniqueness
  const colorSum = r + g + b;
  const inversion = colorSum % INVERSIONS;
  const voicing = Math.min((colorSum * 2) % VOICINGS, 2);

  // Map color intensity to effect
  const effectIndex = Math.floor(colorCharacteristics.intensity * (EFFECTS.length - 1));

  return {
    root: `${rootNote}${octave}`,
    quality: quality,
    inversion: inversion,
    voicing: voicing,
    effect: EFFECTS[effectIndex],
    effectIntensity: saturation / 100
  };
}

function generateComplexChord(chord) {
  const rootNote = chord.root[0];
  const baseOctave = parseInt(chord.root.slice(-1));
  const rootKey = rootToKey(rootNote);
  
  if (!rootKey) {
    console.error(`Invalid root: ${rootNote}`);
    return [];
  }

  const rootPitch = NOTES.indexOf(rootNote);
  let chordNotes = [rootPitch];

  // Add chord tones based on quality
  switch (chord.quality) {
    case 'm':
    case 'm7':
    case 'm6':
    case 'm9':
    case 'm11':
      chordNotes.push(NOTES.indexOf(rootKey.m3)); // Minor third
      break;
    case 'sus4':
      chordNotes.push(NOTES.indexOf(rootKey.P4)); // Perfect fourth
      break;
    case 'sus2':
      chordNotes.push(NOTES.indexOf(rootKey.M2)); // Major second
      break;
    case '5':
      break; // No third for power chord
    default:
      chordNotes.push(NOTES.indexOf(rootKey.M3)); // Major third
  }

  // Add fifth unless it's a special chord type
  if (chord.quality !== '5') {
    chordNotes.push(NOTES.indexOf(rootKey.P5));
  }

  // Add extensions (sixths, sevenths, ninths, etc.)
  if (chord.quality.includes('maj7')) {
    chordNotes.push(NOTES.indexOf(rootKey.M7));
  } else if (chord.quality.includes('7')) {
    chordNotes.push(NOTES.indexOf(rootKey.m7));
  } else if (chord.quality.includes('6')) {
    chordNotes.push(NOTES.indexOf(rootKey.M6));
  }

  if (chord.quality.includes('9') || chord.quality.includes('add9')) {
    chordNotes.push(NOTES.indexOf(rootKey.M9));
  }

  if (chord.quality.includes('11')) {
    chordNotes.push(NOTES.indexOf(rootKey.P11));
  }

  // Apply inversion
  for (let i = 0; i < chord.inversion; i++) {
    chordNotes.push(chordNotes.shift() + 12);
  }

  // Apply voicing with controlled octave spread
  chordNotes = chordNotes.map((note, index) => {
    // Calculate new note with voicing
    const newNote = note + (chord.voicing * index);
    // Calculate resulting octave
    const resultingOctave = Math.floor(newNote / 12) + baseOctave;
    
    // If resulting octave is too high or too low, adjust it
    if (resultingOctave > 5) {
      return note + (baseOctave * 12) - 12; // Move down an octave
    } else if (resultingOctave < 1) {
      return note + (baseOctave * 12) + 12; // Move up an octave
    }
    return note + (baseOctave * 12);
  });

  // Convert to note names with octaves, ensuring octaves 1-5
  return chordNotes.map(pitch => {
    const noteIndex = ((pitch % 12) + 12) % 12;
    let octave = Math.floor(pitch / 12) + 1;
    // Clamp octave between 1 and 5
    octave = Math.max(1, Math.min(5, octave));
    return `${NOTES[noteIndex]}${octave}`;
  });
}

export { hexToComplexChord, generateComplexChord };