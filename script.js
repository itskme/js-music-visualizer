const audioContext = new AudioContext();
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById('fileInput');
const playButton = document.getElementById('playButton');

let audioSource;
let analyser;
let frequencyData;

playButton.addEventListener('click', playAudio);

fileInput.addEventListener('change', (e) => {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        const audioData = event.target.result;
        audioContext.decodeAudioData(audioData, (buffer) => {
            audioSource = audioContext.createBufferSource();
            audioSource.buffer = buffer;
            analyser = audioContext.createAnalyser();
            audioSource.connect(analyser);
            analyser.connect(audioContext.destination);
            frequencyData = new Uint8Array(analyser.frequencyBinCount);
            draw();
        });
    };
    reader.readAsArrayBuffer(file);
});

function playAudio() {
    audioSource.start();
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