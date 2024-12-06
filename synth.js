import { NOTES, OCTAVES, VOICINGS, CHORD_INTERVALS, NOTE_ENHARMONIC, NOTES_WITH_SHARPS } from './data.js';

// Constants for the mapping system
const PARAMETERS = {
    ROOT_NOTES: 12,
    OCTAVE: 3,
    CHORD_TYPES: Object.keys(CHORD_INTERVALS).length, // 35 chord types
    CENTS_PRECISION: 3,
    // Calculate needed cents variations:
    // 16,777,216 (total colors) / (12 notes * 35 chord types) ≈ 39,946
    // So we need ~40,000 cents variations
    CENTS_VARIATIONS: Math.ceil(256 * 256 * 256 / (12 * Object.keys(CHORD_INTERVALS).length)),
    numberToCents: (num) => {
        return -50 + (num / 39946) * 100;
    }
};

function calculateUniqueValues(r, g, b) {
    const colorValue = (r << 16) + (g << 8) + b;
    
    // Use first 4 bits for root note (0-11)
    const rootIndex = colorValue & 0xF;
    
    // Use next 6 bits for chord type (0-34)
    const chordTypeIndex = (colorValue >> 4) & 0x3F;
    
    // Use remaining 14 bits for cents value
    const centsIndex = colorValue >> 10;
    const cents = PARAMETERS.numberToCents(centsIndex);
    
    return {
        rootIndex: rootIndex % PARAMETERS.ROOT_NOTES,
        chordTypeIndex: chordTypeIndex % PARAMETERS.CHORD_TYPES,
        cents: Number(cents.toFixed(PARAMETERS.CENTS_PRECISION))
    };
}

function generateExtendedQualities(chordTypeIndex) {
    const chordTypes = Object.keys(CHORD_INTERVALS);
    return {
        quality: chordTypes[chordTypeIndex % chordTypes.length],
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

    const { rootIndex, chordTypeIndex, cents } = calculateUniqueValues(r, g, b);
    const { quality } = generateExtendedQualities(chordTypeIndex);
    const rootNote = NOTES[rootIndex];

    return {
        root: `${rootNote}${PARAMETERS.OCTAVE}`,
        quality: quality,
        voicing: 0,
        centsDeviation: cents.toString()
    };
}

function generateComplexChord(chord) {
    console.log('Generating complex chord with input:', chord);
    
    const rootNote = chord.root.slice(0, -1);
    const centsDeviation = parseFloat(chord.centsDeviation);
    
    const rootIndex = NOTES.indexOf(rootNote);
    if (rootIndex === -1) {
        console.error(`Invalid root: ${rootNote}`);
        return [];
    }

    let intervals = CHORD_INTERVALS[chord.quality];
    if (!intervals) {
        console.warn(`No intervals found for quality: ${chord.quality}, using default major triad`);
        intervals = CHORD_INTERVALS[''];
    }
    
    console.log(`Using intervals for ${chord.quality}:`, intervals);
    
    let notes = intervals.map(interval => {
        const rawNoteIndex = rootIndex + interval;
        const noteIndex = rawNoteIndex % 12;
        const noteName = NOTES[noteIndex];
        const fullNoteName = `${noteName}${PARAMETERS.OCTAVE}`;
        
        const frequency = getNoteFrequency(noteName, PARAMETERS.OCTAVE, centsDeviation);
        
        return {
            note: fullNoteName,
            frequency: Number(frequency.toFixed(PARAMETERS.CENTS_PRECISION)),
            cents: centsDeviation,
            interval: interval
        };
    });
    
    console.log('Generated chord notes:', notes);
    return notes;
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
    
    return frequencyWithCents;
}

export { 
    hexToComplexChord, 
    generateComplexChord,
    calculateUniqueValues,
    generateExtendedQualities,
    getNoteFrequency
};