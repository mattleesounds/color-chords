import { A, B, C, Csharp, D, Dsharp, E, F, Fsharp, G, Gsharp, rootToKey } from './data.js'

const octave = (r, g, b) => {
  const sum = parseInt(r) + parseInt(g) + parseInt(b)
  let num
  if (sum < 256) {
    num = '3'
  } else if (sum >= 256 && sum < 511) {
    num = '4'
  } else {
    num = '5'
  }

  return num
}

const rootNote = (r, g, b) => {
  let note
  if (r < 21) {
    note = 'G'
  } else if (r >= 21 && r < 41) {
    note = 'C'
  } else if (r >= 42 && r < 65) {
    note = 'A'
  } else if (r >= 65 && r < 86) {
    note = 'C#'
  } else if (r >= 86 && r < 107) {
    note = 'F'
  } else if (r >= 107 && r < 129) {
    note = 'A#'
  } else if (r >= 129 && r < 150) {
    note = 'D'
  } else if (r >= 150 && r < 171) {
    note = 'B'
  } else if (r >= 171 && r < 193) {
    note = 'G#'
  } else if (r >= 193 && r < 214) {
    note = 'D#'
  } else if (r >= 214 && r < 235) {
    note = 'F#'
  } else if (r >= 235 && r < 255) {
    note = 'E'
  }


  return note + octave(r, g, b)
}

const secondNote = (r, g, b, root) => {
  let blue = parseInt(b)
  let key = rootToKey(root.substring(0, root.length - 1))
  let note
  if (blue < 43) {
    note = key.M3
  } else if (blue >= 43 && blue < 86) {
    note = key.M6
  } else if (blue >= 86 && blue < 128) {
    note = key.P4
  } else if (blue >= 128 && blue < 170) {
    note = key.P5
  } else if (blue >= 170 && blue < 213) {
    note = key.m3
  } else if (blue >= 213) {
    note = key.m6
  }

  return note + octave(r, g, b)
}

const thirdNote = (r, g, b, root) => {
  let green = parseInt(g)
  let key = rootToKey(root.substring(0, root.length - 1))
  let note
  let oct
  if (green < 43) {
    note = key.m9
  } else if (green >= 43 && green < 86) {
    note = key.m7
  } else if (green >= 86 && green < 128) {
    note = key.P5
  } else if (green >= 128 && green < 170) {
    note = key.P5
  } else if (green >= 170 && green < 213) {
    note = key.M9
  } else if (green >= 213) {
    note = key.M7
  }

  console.log(octave(r, g, b))
  if (note != key.m7 && note != key.M7) {
    oct = parseInt(octave(r, g, b)) + 1
  } else {
    oct = parseInt(octave(r, g, b))
  }

  return note + oct.toString()
}

export { rootNote, secondNote, thirdNote }