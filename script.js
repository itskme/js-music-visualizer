const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set up the audio context
const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(document.getElementById('audio'));

// Set up the audio element
const audio = document.createElement('audio');
audio.src = 'your-audio-file.mp3'; // replace with your audio file
audio.loop = true;
audio.play();

// Connect the audio element to the analyser
source.connect(analyser);
analyser.connect(audioContext.destination);

// Set up the visualization
let frequencyData = new Uint8Array(analyser.frequencyBinCount);
let barWidth = canvas.width / frequencyData.length;
let barHeight;
let x;

function draw() {
  requestAnimationFrame(draw);
  analyser.getByteFrequencyData(frequencyData);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < frequencyData.length; i++) {
    barHeight = frequencyData[i] * 2;
    ctx.fillStyle = `hsl(${i * 360 / frequencyData.length}, 100%, 50%)`;
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth;
  }

  x = 0;
}

draw();