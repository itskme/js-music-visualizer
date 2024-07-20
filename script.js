const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set up the audio context
const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();

// Request access to the user's audio input
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    // Create a media stream source
    const source = audioContext.createMediaStreamSource(stream);

    // Connect the source to the analyser
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
  })
  .catch(error => console.error('Error accessing user media:', error));