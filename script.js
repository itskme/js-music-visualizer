const audioContext = new AudioContext();
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById('fileInput');
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const stopButton = document.getElementById('stopButton');

let analyser;
let frequencyData;
let audioBuffer;
let audioSource;
let isPlaying = false;

playButton.addEventListener('click', playAudio);
pauseButton.addEventListener('click', pauseAudio);
stopButton.addEventListener('click', stopAudio);

fileInput.addEventListener('change', (e) => {
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    const audioData = event.target.result;
    audioContext.decodeAudioData(audioData, (buffer) => {
      audioBuffer = buffer;
      analyser = audioContext.createAnalyser();
      analyser.connect(audioContext.destination);
      frequencyData = new Uint8Array(analyser.frequencyBinCount);
      draw();
    });
  };
  reader.readAsArrayBuffer(file);
});

function playAudio() {
  if (!isPlaying) {
    audioSource = audioContext.createBufferSource();
    audioSource.buffer = audioBuffer;
    audioSource.connect(analyser);
    audioSource.start();
    audioContext.resume(); // resume the context
    isPlaying = true;
  }
}

function pauseAudio() {
  if (isPlaying) {
    audioContext.suspend(); // suspend the context
    isPlaying = false;
  }
}

function stopAudio() {
  if (isPlaying) {
    audioContext.close(); // close the context
    isPlaying = false;
  }
}

function draw() {
  requestAnimationFrame(draw);
  analyser.getByteFrequencyData(frequencyData);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(255, 0, 0, 1)';
  for (let i = 0; i < frequencyData.length; i++) {
    const barWidth = canvas.width / frequencyData.length;
    const barHeight = frequencyData[i] / 256 * canvas.height;
    ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth, barHeight);
  }
}