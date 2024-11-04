const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const OCTAVES = [0, 1, 2, 3, 4, 5];
const VOICINGS = 5;

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

const CHORD_INTERVALS = {
  '': [0, 4, 7],          // major: root, major third, perfect fifth
  'm': [0, 3, 7],         // minor: root, minor third, perfect fifth
  'm7': [0, 3, 7, 10],    // minor 7: root, minor third, perfect fifth, minor seventh
  'm6': [0, 3, 7, 9],     // minor 6: root, minor third, perfect fifth, major sixth
  'm9': [0, 3, 7, 10, 14], // minor 9: root, minor third, perfect fifth, minor seventh, major ninth
  'm11': [0, 3, 7, 10, 14, 17], // minor 11: root, minor third, perfect fifth, minor seventh, major ninth, perfect eleventh
  'sus4': [0, 5, 7],      // sus4: root, perfect fourth, perfect fifth
  'sus2': [0, 2, 7],      // sus2: root, major second, perfect fifth
  'dim7': [0, 3, 6, 9],   // diminished 7: root, minor third, diminished fifth, diminished seventh
  '5': [0, 7],            // power chord: root, perfect fifth
  '7': [0, 4, 7, 10],     // dominant 7: root, major third, perfect fifth, minor seventh
  'maj7': [0, 4, 7, 11],  // major 7: root, major third, perfect fifth, major seventh
  '9': [0, 4, 7, 10, 14], // dominant 9: root, major third, perfect fifth, minor seventh, major ninth
  'maj9': [0, 4, 7, 11, 14], // major 9: root, major third, perfect fifth, major seventh, major ninth
  '13': [0, 4, 7, 10, 14, 21], // dominant 13: root, major third, perfect fifth, minor seventh, major ninth, major thirteenth
  'maj7#11': [0, 4, 7, 11, 18], // major 7#11: root, major third, perfect fifth, major seventh, sharp eleventh
};

export { 
  NOTES, 
  OCTAVES, 
  VOICINGS, 
  CHORD_NAMES,
  CHORD_INTERVALS
};