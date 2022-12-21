import './style.css'

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


