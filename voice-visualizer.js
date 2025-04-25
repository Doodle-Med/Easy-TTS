/**
 * Voice Visualizer - Real-time audio visualization
 * Add this to your TTS Playground for beautiful audio visualization
 * 
 * How to use:
 * 1. Include this script after your main script
 * 2. Add <canvas id="visualizer" width="800" height="200"></canvas> to your HTML
 * 3. Initialize with: const visualizer = new VoiceVisualizer('visualizer', audioContext);
 * 4. Connect audio: visualizer.connect(sourceNode);
 */

class VoiceVisualizer {
  constructor(canvasId, audioContext, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error('Canvas element not found');
      return;
    }
    
    this.ctx = this.canvas.getContext('2d');
    this.audioCtx = audioContext;
    this.analyser = this.audioCtx.createAnalyser();
    
    // Configure analyser
    this.analyser.fftSize = options.fftSize || 2048;
    this.analyser.smoothingTimeConstant = options.smoothing || 0.8;
    
    // Set up data arrays
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
    this.timeDataArray = new Uint8Array(this.bufferLength);
    
    // Visualization options
    this.options = {
      mode: options.mode || 'waveform', // 'waveform', 'spectrum', 'bars', 'particles'
      barWidth: options.barWidth || 4,
      barSpacing: options.barSpacing || 1,
      barMinHeight: options.barMinHeight || 5,
      color: options.color || 'gradient', // 'gradient', 'rainbow', or any CSS color
      backgroundColor: options.backgroundColor || 'rgba(0,0,0,0.1)',
      responsive: options.responsive !== false,
      lineWidth: options.lineWidth || 2,
      ...options
    };
    
    // Make canvas responsive if needed
    if (this.options.responsive) {
      this.makeResponsive();
    }
    
    // Set colors
    this.setColorScheme(this.options.color);
    
    // Start animation
    this.animate();
  }
  
  makeResponsive() {
    const resizeCanvas = () => {
      const container = this.canvas.parentNode;
      if (container) {
        this.canvas.width = container.clientWidth;
        // Maintain a reasonable aspect ratio
        this.canvas.height = Math.min(200, container.clientWidth / 4);
      }
    };
    
    // Initial size
    resizeCanvas();
    
    // Update on resize
    window.addEventListener('resize', resizeCanvas);
  }
  
  setColorScheme(scheme) {
    if (scheme === 'gradient') {
      this.gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
      this.gradient.addColorStop(0, '#4285f4');
      this.gradient.addColorStop(0.33, '#34a853');
      this.gradient.addColorStop(0.66, '#fbbc04');
      this.gradient.addColorStop(1, '#ea4335');
      this.colorFunc = () => this.gradient;
    } else if (scheme === 'rainbow') {
      this.colorFunc = (i, total) => {
        const hue = i / total * 360;
        return `hsl(${hue}, 80%, 60%)`;
      };
    } else {
      // Use passed color
      this.colorFunc = () => scheme;
    }
  }
  
  connect(sourceNode) {
    sourceNode.connect(this.analyser);
    return this.analyser;
  }
  
  disconnect() {
    if (this.analyser) {
      this.analyser.disconnect();
    }
  }
  
  drawWaveform() {
    this.analyser.getByteTimeDomainData(this.timeDataArray);
    
    this.ctx.lineWidth = this.options.lineWidth;
    this.ctx.strokeStyle = this.colorFunc(0, 1);
    this.ctx.beginPath();
    
    const sliceWidth = this.canvas.width / (this.bufferLength - 1);
    let x = 0;
    
    for (let i = 0; i < this.bufferLength; i++) {
      const v = this.timeDataArray[i] / 128.0;
      const y = v * (this.canvas.height / 2);
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
      
      x += sliceWidth;
    }
    
    this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
    this.ctx.stroke();
  }
  
  drawSpectrum() {
    this.analyser.getByteFrequencyData(this.dataArray);
    
    const barWidth = this.options.barWidth;
    const barSpacing = this.options.barSpacing;
    const barTotal = barWidth + barSpacing;
    const barCount = Math.floor(this.canvas.width / barTotal);
    const barMinHeight = this.options.barMinHeight;
    
    // Adjust step to sample from full frequency range
    const step = Math.ceil(this.bufferLength / barCount);
    
    let x = 0;
    
    for (let i = 0; i < barCount; i++) {
      const dataIndex = Math.min(i * step, this.bufferLength - 1);
      const barHeight = Math.max(
        barMinHeight, 
        (this.dataArray[dataIndex] / 255.0) * this.canvas.height
      );
      
      this.ctx.fillStyle = this.colorFunc(i, barCount);
      this.ctx.fillRect(
        x, 
        this.canvas.height - barHeight, 
        barWidth, 
        barHeight
      );
      
      x += barTotal;
    }
  }
  
  drawParticles() {
    this.analyser.getByteFrequencyData(this.dataArray);
    
    const particles = 100;
    const radius = 2;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    // Get average frequency
    let sum = 0;
    for (let i = 0; i < this.bufferLength; i++) {
      sum += this.dataArray[i];
    }
    const avg = sum / this.bufferLength;
    const multiplier = avg / 128; // Normalize
    
    for (let i = 0; i < particles; i++) {
      const angle = (i / particles) * Math.PI * 2;
      const intensity = this.dataArray[i % this.bufferLength] / 255.0;
      const distance = (this.canvas.height / 3) * intensity * multiplier;
      
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2, false);
      this.ctx.fillStyle = this.colorFunc(i, particles);
      this.ctx.fill();
    }
  }
  
  draw() {
    // Clear canvas
    this.ctx.fillStyle = this.options.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw based on mode
    switch (this.options.mode) {
      case 'waveform':
        this.drawWaveform();
        break;
      case 'bars':
      case 'spectrum':
        this.drawSpectrum();
        break;
      case 'particles':
        this.drawParticles();
        break;
      default:
        this.drawWaveform();
    }
  }
  
  animate() {
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
  
  // Change visualization mode
  setMode(mode) {
    this.options.mode = mode;
  }
}
