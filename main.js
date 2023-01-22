import { FMSynth } from 'tone';
import './style.css'
import { rootNote, secondNote, thirdNote, effect } from './synth.js'


function getRandomInt() {
  return Math.floor(Math.random() * 255);
}

let randomColor = 'rgb(' + getRandomInt() + ',' + getRandomInt() + ',' + getRandomInt() + ')'

document.querySelector('#app').style.backgroundColor = randomColor;

document.getElementById("play-button").addEventListener("click", function () {
  let randomColor = 'rgb(' + getRandomInt() + ',' + getRandomInt() + ',' + getRandomInt() + ')'
  let colors = randomColor.split('rgb(')[1].split(')')[0].split(',')
  let r = colors[0]
  let g = colors[1]
  let b = colors[2]


  document.querySelector('#app').style.backgroundColor = randomColor;

  const phaser = new Tone.Phaser({
    frequency: 0.2,
    octaves: 5,
    //baseFrequency: 1000
  }).toDestination()

  //let effect = effect()

  const verb = new Tone.Reverb(2,0.5).toDestination()

  const verb2 = new Tone.Reverb(5).toDestination()
  const chorus = new Tone.Chorus({
    frequency: 1.2,
    delayTime: 4,
    depth: 0.9,
    type: "triangle",
    spread: 220
}).toDestination()
  const delay = new Tone.FeedbackDelay(0.5, 0.5).toDestination()
  const distortion = new Tone.Distortion(0.1).toDestination()
  const tremolo = new Tone.Tremolo(100, 1).toDestination()

  const compressor = new Tone.Compressor(-30, 3);

  const fx = [phaser, verb2, chorus, delay, distortion, tremolo]

  //fx[effect(r, g, b)]

  const synth = new Tone.PolySynth().connect(verb).connect(fx[effect(r, g, b)]).connect(compressor)
  synth.set({
    envelope: {
        attack: 0.5,
        release: 0.8
    }
});

  Tone.Master.volume.value = -10;

  


  let root = rootNote(r, g, b)
  let second = secondNote(r, g, b, root)
  let third = thirdNote(r, g, b, root)
  synth.triggerAttackRelease([root, second, third], '1.5n', Tone.now())
  console.log(root, second, third, effect(r, g, b))
  //console.log(r, rootNote(r))



  document.querySelector('#text').innerHTML = `
    <div >
      <h1 class="text-white">
        Color: ${randomColor}
        <br>
        <br>
        Notes: ${root}, ${second}, ${third}
        <br>
        <br>
        Effect: ${fx[effect(r, g, b)]}
      </h1>
    </div>
  `

});




