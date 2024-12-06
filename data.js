const NOTES_WITH_FLATS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const NOTES_WITH_SHARPS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTES = NOTES_WITH_SHARPS; // Keep this for backwards compatibility
const OCTAVES = [0, 1, 2, 3, 4, 5];
const VOICINGS = 5;

// Keys that traditionally use flats
const FLAT_KEYS = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 
                   'Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm', 'Abm'];

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
  // Basic triads
  '': [0, 4, 7],                    // major triad (C E G)
  'm': [0, 3, 7],                   // minor triad (C Eb G)
  
  // Basic seventh chords
  '7': [0, 4, 7, 10],              // dominant seventh (C E G Bb)
  'maj7': [0, 4, 7, 11],           // major seventh (C E G B)
  'm7': [0, 3, 7, 10],             // minor seventh (C Eb G Bb)
  'm7b5': [0, 3, 6, 10],           // minor seven flat five (C Eb Gb Bb)
  'm(maj7)': [0, 3, 7, 11],        // minor major seventh (C Eb G B)
  
  // Sixth chords
  '6': [0, 4, 7, 9],               // major sixth (C E G A)
  'm6': [0, 3, 7, 9],              // minor sixth (C Eb G A)
  
  // Ninth chords
  '9': [0, 4, 7, 10, 14],          // dominant ninth (C E G Bb D)
  'maj9': [0, 4, 7, 11, 14],       // major ninth (C E G B D)
  'm9': [0, 3, 7, 10, 14],         // minor ninth (C Eb G Bb D)
  '7b9': [0, 4, 7, 10, 13],        // dominant seven flat nine (C E G Bb Db)
  
  // Eleventh chords
  '11': [0, 4, 7, 10, 14, 17],     // dominant eleventh (C E G Bb D F)
  'maj11': [0, 4, 7, 11, 14, 17],  // major eleventh (C E G B D F)
  'm11': [0, 3, 7, 10, 14, 17],    // minor eleventh (C Eb G Bb D F)
  
  // Thirteenth chords
  '13': [0, 4, 7, 10, 14, 17, 21], // dominant thirteenth (C E G Bb D F A)
  'maj13': [0, 4, 7, 11, 14, 17, 21], // major thirteenth (C E G B D F A)
  'm13': [0, 3, 7, 10, 14, 17, 21],   // minor thirteenth (C Eb G Bb D F A)
  
  // Suspended chords
  'sus2': [0, 2, 7],               // suspended second (C D G)
  'sus4': [0, 5, 7],               // suspended fourth (C F G)
  '7sus4': [0, 5, 7, 10],          // dominant seven sus four (C F G Bb)
  '9sus4': [0, 5, 7, 10, 14],      // dominant nine sus four (C F G Bb D)
  'maj9sus4': [0, 5, 7, 11, 14],   // major nine sus four (C F G B D) 
  
  // Added tone chords
  'add9': [0, 4, 7, 14],           // major add nine (C E G D)
  'madd9': [0, 3, 7, 14],          // minor add nine (C Eb G D)
  '6add9': [0, 4, 7, 9, 14],       // six add nine (C E G A D)
  'm6add9': [0, 3, 7, 9, 14],      // minor six add nine (C Eb G A D)
  
  // Altered dominant chords (keeping only b5 variants)
  '7b5': [0, 4, 6, 10],            // dominant seven flat five (C E Gb Bb)
  '7b9b5': [0, 4, 6, 10, 13],      // dominant seven flat nine flat five (C E Gb Bb Db)
  
  // Extended alterations
  'maj9#11': [0, 4, 7, 11, 14, 18],    // major nine sharp eleven (C E G B D F#)
  'maj13#11': [0, 4, 7, 11, 14, 18, 21], // major thirteen sharp eleven (C E G B D F# A)
  'm9b5': [0, 3, 6, 10, 14],            // minor nine flat five (C Eb Gb Bb D)
  'm11b5': [0, 3, 6, 10, 14, 17],       // minor eleven flat five (C Eb Gb Bb D F)
  
  // Power chord
  '5': [0, 7],                     // power chord (C G)
};
// Mapping for converting between flats and sharps
const NOTE_ENHARMONIC = {
  'C#': 'Db',
  'D#': 'Eb',
  'F#': 'Gb',
  'G#': 'Ab',
  'A#': 'Bb',
  'Db': 'C#',
  'Eb': 'D#',
  'Gb': 'F#',
  'Ab': 'G#',
  'Bb': 'A#'
};

export { 
  NOTES_WITH_FLATS,
  NOTES_WITH_SHARPS,
  NOTES, 
  OCTAVES, 
  VOICINGS, 
  CHORD_NAMES,
  CHORD_INTERVALS,
  FLAT_KEYS,
  NOTE_ENHARMONIC
};