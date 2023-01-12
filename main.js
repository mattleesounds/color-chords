import { FMSynth } from 'tone';
import './style.css'
import { rootNote, secondNote, thirdNote, effect } from './synth.js'

function getRandomInt() {
  return Math.floor(Math.random() * 255);
}

let randomColor = 'rgb(' + getRandomInt() + ',' + getRandomInt() + ',' + getRandomInt() + ')'

document.querySelector('#app').style.backgroundColor = randomColor;

document.querySelector('#app').innerHTML = `
  <div >
    <h1 class="text-center text-slate-700">${randomColor}</h1>
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
  const phaser = new Tone.Phaser({
    frequency: 0.2,
    octaves: 5,
    //baseFrequency: 1000
  }).toDestination()

  //let effect = effect()

  const verb = new Tone.Reverb(4).toDestination()
  const chorus = new Tone.Chorus(1000, 10, 1).toDestination()
  const delay = new Tone.FeedbackDelay(0.5, 0.5).toDestination()
  const distortion = new Tone.Distortion(0.1).toDestination()
  const tremolo = new Tone.Tremolo(100, 1).toDestination()

  const fx = [phaser, verb, chorus, delay, distortion, tremolo]

  fx[effect(r, g, b)]

  const synth = new Tone.PolySynth().connect(tremolo)
  let root = rootNote(r, g, b)
  let second = secondNote(r, g, b, root)
  let third = thirdNote(r, g, b, root)
  synth.triggerAttackRelease([root, second, third], '2n', Tone.now())
  console.log(root, second, third, effect(r, g, b))
  //console.log(r, rootNote(r))
});

export default randomColor


