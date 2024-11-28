import { NOTES, OCTAVES, VOICINGS, CHORD_INTERVALS, NOTE_ENHARMONIC, NOTES_WITH_SHARPS } from './data.js';

function generateComplexChord(chord) {
    console.log('Generating complex chord with input:', chord);
    
    const rootNote = chord.root.slice(0, -1);
    const centsDeviation = parseInt(chord.centsDeviation);
    const octave = parseInt(chord.root.slice(-1));
    
    const rootIndex = NOTES.indexOf(rootNote);
    if (rootIndex === -1) {
        console.error(`Invalid root: ${rootNote}`);
        return [];
    }

    // Get intervals for the chord quality, fall back to major triad if undefined
    let intervals = CHORD_INTERVALS[chord.quality];
    if (!intervals) {
        console.warn(`No intervals found for quality: ${chord.quality}, using default major triad`);
        intervals = CHORD_INTERVALS[''];  // default to major triad
    }
    
    console.log(`Using intervals for ${chord.quality}:`, intervals);
    
    let notes = intervals.map(interval => {
        // Calculate the actual note index including octave shifts
        const rawNoteIndex = rootIndex + interval;
        const noteIndex = rawNoteIndex % 12;
        const octaveShift = Math.floor(interval / 12);
        const finalOctave = octave + octaveShift;
        
        // Get the correct note name
        const noteName = NOTES[noteIndex];
        const fullNoteName = `${noteName}${finalOctave}`;
        
        const frequency = getNoteFrequency(noteName, finalOctave, centsDeviation);
        
        return {
            note: fullNoteName,
            frequency: frequency,
            cents: centsDeviation,
            interval: interval  // Include interval for debugging
        };
    });
    
    console.log('Generated chord notes:', notes);
    return notes;
}

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

function calculateUniqueValues(r, g, b) {
  // Create a single number from RGB values (0-16777215)
  const uniqueColorValue = (r * 256 * 256) + (g * 256) + b;
  
  // Calculate root note (0-11)
  const rootIndex = uniqueColorValue % 12;
  
  // Calculate cents deviation (-50 to +50)
  const cents = (uniqueColorValue % 101) - 50;
  
  // Calculate quality group (ensure we get a good distribution)
  // Use a smaller modulo to get a more focused range of qualities
  const qualityGroup = Math.floor(uniqueColorValue / 1000) % 50;
  
  console.log('Calculated values:', { uniqueColorValue, rootIndex, cents, qualityGroup });
  
  return { rootIndex, cents, qualityGroup };
}

function generateExtendedQualities(qualityGroup) {
  // Define all possible chord qualities we want to generate
  const allQualities = [
      '', 'm', 'maj7', 'm7', '7', 
      'maj9', 'm9', '9',
      'maj11', 'm11', '11',
      'maj13', 'm13', '13',
      'sus2', 'sus4', '7sus4',
      'add9', 'madd9',
      '6', 'm6', '6add9', 'm6add9',
      '7b5', 'm7b5', 'm9b5', 'm11b5',
      'maj9#11', 'maj13#11'
  ];
  
  // Use qualityGroup to select a quality
  const selectedQuality = allQualities[qualityGroup % allQualities.length];
  
  console.log('Generated quality:', selectedQuality);
  
  return {
      quality: selectedQuality,
      octaveOffset: 0
  };
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

  const { rootIndex, cents, qualityGroup } = calculateUniqueValues(r, g, b);
  const { quality, octaveOffset } = generateExtendedQualities(qualityGroup);
  
  const rootNote = NOTES[rootIndex];
  const baseOctave = 3;
  const finalOctave = baseOctave + octaveOffset;

  const result = {
      root: `${rootNote}${finalOctave}`,
      quality: quality,
      voicing: 0,
      centsDeviation: cents.toString()
  };

  console.log('Generated chord:', result);
  return result;
}

function getNoteFrequency(note, octave, cents) {
    const noteWithoutOctave = note.replace(/\d/g, '');
    let searchNote = noteWithoutOctave;
    
    if (NOTE_ENHARMONIC[noteWithoutOctave]) {
        searchNote = NOTE_ENHARMONIC[noteWithoutOctave].includes('#') ? 
            NOTE_ENHARMONIC[noteWithoutOctave] : noteWithoutOctave;
    }
    
    const noteIndex = NOTES_WITH_SHARPS.indexOf(searchNote);
    if (noteIndex === -1) return null;
    
    const a4 = 440;
    const a4Index = NOTES_WITH_SHARPS.indexOf('A');
    const a4Octave = 4;
    
    const semitonesFromA4 = (octave - a4Octave) * 12 + (noteIndex - a4Index);
    const baseFreq = a4 * Math.pow(2, semitonesFromA4 / 12);
    const frequencyWithCents = baseFreq * Math.pow(2, cents / 1200);
    
    return Math.round(frequencyWithCents * 100) / 100;
}

export { 
    hexToComplexChord, 
    generateComplexChord,
    calculateUniqueValues,
    generateExtendedQualities,
    getNoteFrequency
};