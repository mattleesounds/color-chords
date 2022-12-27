import './style.css'
import { rootNote, secondNote, thirdNote } from './synth.js'

function getRandomInt() {
  return Math.floor(Math.random() * 255);
}

let randomColor = 'rgb(' + getRandomInt() + ',' + getRandomInt() + ',' + getRandomInt() + ')'

document.querySelector('#app').style.backgroundColor = randomColor;

document.querySelector('#app').innerHTML = `
  <div >
    <h1>${randomColor}</h1>
  </div>
`
document.getElementById("play-button").addEventListener("click", function () {
  let randomColor = 'rgb(' + getRandomInt() + ',' + getRandomInt() + ',' + getRandomInt() + ')'
  let colors = randomColor.split('rgb(')[1].split(')')[0].split(',')
  let r = colors[0]
  let g = colors[1]
  let b = colors[2]


  document.querySelector('#app').style.backgroundColor = randomColor;

  document.querySelector('#app').innerHTML = `
    <div >
      <h1>${randomColor}</h1>
    </div>
  `
  const synth = new Tone.PolySynth().toMaster()
  let root = rootNote(r, g, b)
  let second = secondNote(r, g, b, rootNote(r, g, b))
  let third = thirdNote(r, g, b, rootNote(r, g, b))
  synth.triggerAttackRelease([root, second, third], '2n', Tone.now())
  console.log(root, second, third)
  //console.log(r, rootNote(r))
});

export default randomColor


