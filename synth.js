import { NOTES, OCTAVES, CHORD_QUALITIES, INVERSIONS, VOICINGS, rootToKey } from './data.js';

// Enhanced color analysis functions
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
  
  // Enhanced color temperature calculation
  const isWarm = (hue >= 0 && hue <= 60) || (hue >= 300 && hue <= 360);
  
  // Enhanced intensity calculation incorporating both brightness and saturation
  const intensity = (saturation * lightness) / 10000;
  
  // Enhanced grayness calculation
  const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
  const isGray = maxDiff < 30;
  
  // Enhanced vibrancy calculation
  const vibrancy = saturation * Math.sin(Math.PI * lightness / 100);

  // Calculate color complexity (how "pure" vs "mixed" the color is)
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
  
  // Handle grayscale colors with more nuance
  if (isGray) {
    if (lightness < 20) return 'dim7';      // Dark gray - mysterious, tense
    if (lightness > 80) return 'maj7';      // Light gray - peaceful, floating
    if (lightness > 50) return 'sus4';      // Medium-light gray - unresolved but bright
    return 'sus2';                          // Medium-dark gray - unresolved but grounded
  }

  // For highly saturated colors
  if (saturation > 80) {
    if (isWarm) {
      if (lightness > 60) return 'maj9';    // Bright warm - expansive, joyful
      return '13';                          // Deep warm - rich, complex
    } else {
      if (lightness > 60) return 'maj7#11'; // Bright cool - dreamy, ethereal
      return 'm9';                          // Deep cool - sophisticated, moody
    }
  }

  // For complex mixed colors
  if (complexity > 0.5) {
    if (isWarm) {
      return '9';                           // Warm complex - rich, layered
    } else {
      return 'm11';                         // Cool complex - intricate, atmospheric
    }
  }

  // For medium saturation
  if (saturation >= 40 && saturation <= 80) {
    if (isWarm) {
      if (lightness > 60) return 'maj7';    // Medium warm bright - gentle happiness
      return '7';                           // Medium warm dark - balanced tension
    } else {
      if (lightness > 60) return 'm6';      // Medium cool bright - wistful
      return 'm7';                          // Medium cool dark - melancholic
    }
  }

  // For muted colors
  if (isWarm) {
    return '';                              // Muted warm - simple, clear
  } else {
    return 'm';                             // Muted cool - simple, introspective
  }
}

function hexToComplexChord(hexColor) {
  const hex = hexColor.replace('#', '').toUpperCase();
  
  if (hex.length !== 6) {
    console.error(`Invalid hex color code: ${hexColor}`);
    return {};
  }

  // Convert hex to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const colorCharacteristics = getColorCharacteristics(r, g, b);
  const { hue, saturation, lightness, complexity } = colorCharacteristics;

  // Enhanced root note mapping using micro-tuning based on exact hue
  const hueAdjusted = (hue + (complexity * 15)) % 360; // Slight adjustment based on complexity
  const rootIndex = Math.round(hueAdjusted / 30) % 12;
  const rootNote = NOTES[rootIndex];

  // Enhanced octave mapping using both lightness and saturation
  const octaveFloat = (lightness / 100 * 3) + (saturation / 100);
  const octave = Math.max(1, Math.min(5, Math.floor(octaveFloat) + 1));

  // Determine chord quality
  const quality = determineChordQuality(colorCharacteristics);

  // Use RGB values to determine unique inversions and voicings
  const uniqueValue = (r * 256 * 256 + g * 256 + b);
  const inversion = uniqueValue % INVERSIONS;
  const voicing = Math.min((uniqueValue * 2) % VOICINGS, 2);

  return {
    root: `${rootNote}${octave}`,
    quality: quality,
    inversion: inversion,
    voicing: voicing
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
      return; // Early return for diminished 7th
    case '5':
      break;
    default:
      chordNotes.push(NOTES.indexOf(rootKey.M3));
  }

  // Add fifth
  if (!chord.quality.includes('dim')) {
    chordNotes.push(NOTES.indexOf(rootKey.P5));
  }

  // Add extensions with improved voicing logic
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

  // Apply inversion with improved spacing
  for (let i = 0; i < chord.inversion; i++) {
    chordNotes.push(chordNotes.shift() + 12);
  }

  // Apply enhanced voicing with better octave distribution
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

  // Convert to note names with octaves
  return chordNotes.map(pitch => {
    const noteIndex = ((pitch % 12) + 12) % 12;
    let octave = Math.floor(pitch / 12) + 1;
    octave = Math.max(1, Math.min(5, octave));
    return `${NOTES[noteIndex]}${octave}`;
  });
}

export { hexToComplexChord, generateComplexChord };