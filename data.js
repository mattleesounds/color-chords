const A = {
  M3: 'C#',
  M6: 'F#',
  P4: 'D',
  P5: 'E',
  m3: 'C',
  m6: 'F',
  m9: 'A#',
  M9: 'B',
  m7: 'G',
  M7: 'G#',
}

const Asharp = {
  M3: 'D',
  M6: 'G',
  P4: 'D#',
  P5: 'F',
  m3: 'C#',
  m6: 'F#',
  m9: 'B',
  M9: 'C',
  m7: 'G#',
  M7: 'A',
}

const B = {
  M3: 'D#',
  M6: 'G#',
  P4: 'E',
  P5: 'F#',
  m3: 'D',
  m6: 'G',
  m9: 'C',
  M9: 'C#',
  m7: 'A',
  M7: 'A#',
}

const C = {
  M3: 'E',
  M6: 'A',
  P4: 'F',
  P5: 'G',
  m3: 'D#',
  m6: 'G#',
  m9: 'C#',
  M9: 'D',
  m7: 'A#',
  M7: 'B',
}

const Csharp = {
  M3: 'F',
  M6: 'A#',
  P4: 'F#',
  P5: 'G#',
  m3: 'E',
  m6: 'A',
  m9: 'D',
  M9: 'D#',
  m7: 'B',
  M7: 'C',
}

const D = {
  M3: 'F#',
  M6: 'B',
  P4: 'G',
  P5: 'A',
  m3: 'F',
  m6: 'A#',
  m9: 'D#',
  M9: 'E',
  m7: 'C',
  M7: 'C#',
}

const Dsharp = {
  M3: 'G',
  M6: 'C',
  P4: 'G#',
  P5: 'A#',
  m3: 'F#',
  m6: 'B',
  m9: 'E',
  M9: 'F',
  m7: 'C#',
  M7: 'D',
}

const E = {
  M3: 'G#',
  M6: 'C#',
  P4: 'A',
  P5: 'B',
  m3: 'G',
  m6: 'C',
  m9: 'F',
  M9: 'F#',
  m7: 'D',
  M7: 'D#',
}

const F = {
  M3: 'A',
  M6: 'D',
  P4: 'A#',
  P5: 'C',
  m3: 'G#',
  m6: 'C#',
  m9: 'F#',
  M9: 'G',
  m7: 'D#',
  M7: 'E',
}

const Fsharp = {
  M3: 'A#',
  M6: 'D#',
  P4: 'B',
  P5: 'C#',
  m3: 'A',
  m6: 'D',
  m9: 'G',
  M9: 'G#',
  m7: 'E',
  M7: 'F',
}

const G = {
  M3: 'B',
  M6: 'E',
  P4: 'C',
  P5: 'D',
  m3: 'A#',
  m6: 'D#',
  m9: 'G#',
  M9: 'A',
  m7: 'F',
  M7: 'F#',
}

const Gsharp = {
  M3: 'C',
  M6: 'F',
  P4: 'C#',
  P5: 'D#',
  m3: 'B',
  m6: 'E',
  m9: 'A',
  M9: 'A#',
  m7: 'F#',
  M7: 'G',
}

const rootToKey = (root) => {
  switch (root) {
    case 'A':
      return A
    case 'A#':
      return Asharp
    case 'B':
      return B
    case 'C':
      return C
    case 'C#':
      return Csharp
    case 'D':
      return D
    case 'D#':
      return Dsharp
    case 'E':
      return E
    case 'F':
      return F
    case 'F#':
      return Fsharp
    case 'G':
      return G
    case 'G#':
      return Gsharp
  }
}

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const OCTAVES = [0, 1, 2, 3, 4, 5];
const CHORD_QUALITIES = {
  '0': '',       // Major
  '1': 'm',      // Minor
  '2': '7',      // Dominant 7th
  '3': 'maj7',   // Major 7th
  '4': 'm7',     // Minor 7th
  '5': 'sus4',   // Suspended 4th
  '6': '6',      // Major 6th
  '7': 'm6',     // Minor 6th
  '8': '9',      // Dominant 9th
  '9': 'maj9',   // Major 9th
  'A': 'm9',     // Minor 9th
  'B': '11',     // Dominant 11th
  'C': '13',     // Dominant 13th
  'D': 'add9',   // Add9
  'E': 'm11',    // Minor 11th
  'F': '5'       // Power Chord (no third)
};

const INVERSIONS = 4; // 0 = root position, 1 = first inversion, 2 = second inversion, 3 = third inversion
const VOICINGS = 5; // Different ways to spread the notes across octaves
const EFFECTS = ['none', 'reverb', 'delay', 'chorus', 'phaser', 'tremolo', 'distortion', 'compression'];
const EFFECT_INTENSITIES = 16; // 0-15 intensity levels for each effect

const CHORD_NAMES = {
  '': 'Major',
  'm': 'Minor',
  '7': 'Dominant 7',
  'maj7': 'Major 7',
  'm7': 'Minor 7',
  'sus4': 'Sus 4',
  '6': 'Major 6',
  'm6': 'Minor 6',
  '9': 'Dominant 9',
  'maj9': 'Major 9',
  'm9': 'Minor 9',
  '11': 'Dominant 11',
  'm11': 'Minor 11',
  '13': 'Dominant 13',
  'add9': 'Add 9',
  'dim7': 'Diminished 7',
  'sus2': 'Sus 2',
  '5': 'Power',
  'maj7#11': 'Major 7 Sharp 11'
};

export { 
  NOTES, 
  OCTAVES, 
  CHORD_QUALITIES, 
  INVERSIONS, 
  VOICINGS, 
  EFFECTS, 
  EFFECT_INTENSITIES, 
  rootToKey,
  CHORD_NAMES
};