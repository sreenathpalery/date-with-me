/* Interactive JavaScript Application Logic */
document.addEventListener('DOMContentLoaded', () => {
  // ================= STATE MANAGEMENT =================
  let currentStep = 1;
  let audioEnabled = true;
  let noButtonDodgeCount = 0;
  
  const selectedData = {
    date: 'This Friday 🌟',
    time: 'Golden Hour 🌅 (5:30 PM)',
    location: 'Cozy Cafe ☕',
    vibes: ['Cozy Coffee & Pastries 🥐☕'],
    customVibe: ''
  };

  // Evasive 'No' button phrases
  const evasivePhrases = [
    "Nope! 😜",
    "Nice try! 🌸",
    "Hehe wrong button! 💖",
    "Stop trying! 😋",
    "Click YES instead! 🥰",
    "Are you sure? 🥺",
    "Not allowed! 🙈",
    "Try again! 🎀",
    "Nice try though! 🌸",
    "Nope nope! 💕"
  ];

  // ================= AUDIO SYNTHESIZER (Web Audio API) =================
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playPopSound() {
    if (!audioEnabled) return;
    try {
      initAudio();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
      // Audio fallback
    }
  }

  function playSparkleChime() {
    if (!audioEnabled) return;
    try {
      initAudio();
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.value = freq;
        
        const startTime = audioCtx.currentTime + i * 0.06;
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    } catch (e) {
      // Audio fallback
    }
  }

  // Audio Toggle UI
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const audioIcon = document.getElementById('audio-icon');
  const audioLabel = document.getElementById('audio-label');

  audioToggleBtn.addEventListener('click', () => {
    audioEnabled = !audioEnabled;
    if (audioEnabled) {
      audioIcon.textContent = '🎵';
      audioLabel.textContent = 'Sound On';
      playPopSound();
    } else {
      audioIcon.textContent = '🔇';
      audioLabel.textContent = 'Muted';
    }
  });

  // ================= BACKGROUND PARTICLES CANVAS =================
  const bgCanvas = document.getElementById('bg-canvas');
  const bgCtx = bgCanvas.getContext('2d');
  let bgParticles = [];

  function resizeBgCanvas() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeBgCanvas);
  resizeBgCanvas();

  const particleSymbols = ['💖', '🌸', '✨', '💕', '🌷', '⭐'];

  class BgParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * bgCanvas.width;
      this.y = bgCanvas.height + 20;
      this.speed = 0.5 + Math.random() * 1.5;
      this.size = 14 + Math.random() * 16;
      this.symbol = particleSymbols[Math.floor(Math.random() * particleSymbols.length)];
      this.opacity = 0.2 + Math.random() * 0.6;
      this.swing = Math.random() * 2;
      this.swingSpeed = 0.02 + Math.random() * 0.03;
      this.angle = Math.random() * Math.PI * 2;
    }
    update() {
      this.y -= this.speed;
      this.angle += this.swingSpeed;
      this.x += Math.sin(this.angle) * this.swing;
      if (this.y < -30) {
        this.reset();
      }
    }
    draw() {
      bgCtx.save();
      bgCtx.globalAlpha = this.opacity;
      bgCtx.font = `${this.size}px sans-serif`;
      bgCtx.fillText(this.symbol, this.x, this.y);
      bgCtx.restore();
    }
  }

  for (let i = 0; i < 30; i++) {
    const p = new BgParticle();
    p.y = Math.random() * bgCanvas.height;
    bgParticles.push(p);
  }

  function animateBg() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    bgParticles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateBg);
  }
  animateBg();

  // ================= CELEBRATORY CONFETTI ENGINE =================
  const confettiCanvas = document.getElementById('confetti-canvas');
  const confettiCtx = confettiCanvas.getContext('2d');
  let confettiParticles = [];

  function resizeConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeConfettiCanvas);
  resizeConfettiCanvas();

  function triggerConfettiBurst() {
    playSparkleChime();
    for (let i = 0; i < 120; i++) {
      confettiParticles.push({
        x: confettiCanvas.width / 2,
        y: confettiCanvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.8) * 16,
        size: 10 + Math.random() * 14,
        color: ['#ff477e', '#ff85a1', '#ffd1dc', '#fff3b0', '#e2afff', '#ffffff'][Math.floor(Math.random() * 6)],
        shape: Math.random() > 0.4 ? 'heart' : 'circle',
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 8,
        gravity: 0.35,
        opacity: 1,
        fade: 0.012 + Math.random() * 0.01
      });
    }
  }

  function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rSpeed;
      p.opacity -= p.fade;

      if (p.opacity <= 0) {
        confettiParticles.splice(i, 1);
        continue;
      }

      confettiCtx.save();
      confettiCtx.globalAlpha = p.opacity;
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rotation * Math.PI) / 180);
      confettiCtx.fillStyle = p.color;

      if (p.shape === 'heart') {
        confettiCtx.font = `${p.size}px sans-serif`;
        confettiCtx.fillText('💖', -p.size/2, p.size/2);
      } else {
        confettiCtx.beginPath();
        confettiCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        confettiCtx.fill();
      }

      confettiCtx.restore();
    }
    requestAnimationFrame(animateConfetti);
  }
  animateConfetti();

  // ================= EVASIVE 'NO' BUTTON PHYSICS =================
  const btnNo = document.getElementById('btn-no');
  const btnYes = document.getElementById('btn-yes');
  const btnGroup = document.getElementById('step-1-btn-group');

  function moveNoButton() {
    playPopSound();
    noButtonDodgeCount++;

    // Calculate boundary within the container
    const groupRect = btnGroup.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();

    const maxX = window.innerWidth - btnRect.width - 40;
    const maxY = window.innerHeight - btnRect.height - 40;

    const randomX = Math.max(20, Math.floor(Math.random() * maxX));
    const randomY = Math.max(20, Math.floor(Math.random() * maxY));

    // Teleport button anywhere on viewport smoothly
    btnNo.style.position = 'fixed';
    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;

    // Change text dynamically
    const phrase = evasivePhrases[noButtonDodgeCount % evasivePhrases.length];
    btnNo.textContent = phrase;

    // Scale up YES button to make it irresistible
    const newScale = Math.min(1.6, 1 + noButtonDodgeCount * 0.08);
    btnYes.style.transform = `scale(${newScale})`;
  }

  // Handle both hover and touch proximity
  btnNo.addEventListener('mouseenter', moveNoButton);
  btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
  });

  // Track cursor distance for evasive dodge on desktop
  document.addEventListener('mousemove', (e) => {
    if (currentStep !== 1) return;
    const rect = btnNo.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);
    if (dist < 80) {
      moveNoButton();
    }
  });

  // ================= STEP NAVIGATION =================
  function goToStep(stepNumber) {
    playPopSound();
    document.querySelectorAll('.step-screen').forEach(screen => {
      screen.classList.remove('active');
    });

    const targetScreen = document.getElementById(`step-${stepNumber}`);
    if (targetScreen) {
      targetScreen.classList.add('active');
      currentStep = stepNumber;
    }
  }

  // Step 1 -> Step 2
  btnYes.addEventListener('click', () => {
    triggerConfettiBurst();
    goToStep(2);
  });

  // Step 2 -> Step 3
  document.getElementById('btn-step-2-next').addEventListener('click', () => {
    goToStep(3);
  });

  // ================= STEP 3 OPTIONS SELECTION =================
  function setupChipGroup(containerId, inputId, key) {
    const container = document.getElementById(containerId);
    const customInput = document.getElementById(inputId);
    const chips = container.querySelectorAll('.chip');

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        playPopSound();
        chips.forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        selectedData[key] = chip.dataset.value;
        if (customInput) customInput.value = '';
      });
    });

    if (customInput) {
      customInput.addEventListener('input', () => {
        if (customInput.value.trim() !== '') {
          chips.forEach(c => c.classList.remove('selected'));
          selectedData[key] = customInput.value.trim();
        }
      });
    }
  }

  setupChipGroup('date-chips', 'custom-date-picker', 'date');
  setupChipGroup('time-chips', 'custom-time-picker', 'time');
  setupChipGroup('location-chips', 'custom-location-input', 'location');

  // Step 3 -> Step 4
  document.getElementById('btn-step-3-next').addEventListener('click', () => {
    // Sync custom date/time inputs if filled
    const customDate = document.getElementById('custom-date-picker').value;
    const customTime = document.getElementById('custom-time-picker').value;
    const customLoc = document.getElementById('custom-location-input').value;

    if (customDate) selectedData.date = customDate;
    if (customTime) selectedData.time = customTime;
    if (customLoc) selectedData.location = customLoc;

    goToStep(4);
  });

  // ================= STEP 4 VIBE SELECTION =================
  const vibeGrid = document.getElementById('vibe-grid');
  const vibeCards = vibeGrid.querySelectorAll('.vibe-card');

  vibeCards.forEach(card => {
    card.addEventListener('click', () => {
      playPopSound();
      card.classList.toggle('selected');
      updateVibesList();
    });
  });

  function updateVibesList() {
    const selected = [];
    vibeGrid.querySelectorAll('.vibe-card.selected').forEach(c => {
      selected.push(c.dataset.vibe);
    });
    selectedData.vibes = selected;
  }

  // Step 4 Finish -> Open Final Modal Popup
  document.getElementById('btn-step-4-lock').addEventListener('click', () => {
    const customVibe = document.getElementById('custom-vibe-input').value.trim();
    if (customVibe) {
      selectedData.customVibe = customVibe;
    }
    triggerConfettiBurst();
    openModal();
  });

  // ================= MODAL POPUP & SUMMARY TICKET =================
  const modalPopup = document.getElementById('modal-popup');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  function openModal() {
    // Populate Ticket Data
    document.getElementById('ticket-date').textContent = selectedData.date;
    document.getElementById('ticket-time').textContent = selectedData.time;
    document.getElementById('ticket-location').textContent = selectedData.location;

    let vibesText = selectedData.vibes.join(', ');
    if (selectedData.customVibe) {
      vibesText += vibesText ? `, ${selectedData.customVibe}` : selectedData.customVibe;
    }
    if (!vibesText) vibesText = 'Surprise Vibe! ✨';

    document.getElementById('ticket-vibe').textContent = vibesText;

    modalPopup.classList.add('active');
  }

  modalCloseBtn.addEventListener('click', () => {
    modalPopup.classList.remove('active');
  });

  // WhatsApp Share Handler
  document.getElementById('btn-whatsapp').addEventListener('click', () => {
    playPopSound();
    let vibesText = selectedData.vibes.join(', ');
    if (selectedData.customVibe) {
      vibesText += vibesText ? `, ${selectedData.customVibe}` : selectedData.customVibe;
    }

    const message = `YAY! I said YES to our date! 🥰💖\n\n🗓️ Date: ${selectedData.date}\n⏰ Time: ${selectedData.time}\n📍 Location: ${selectedData.location}\n🍴 Vibe: ${vibesText}\n\nI can't wait! ✨🌸`;
    
    const encodedMsg = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?text=${encodedMsg}`, '_blank');
  });

  // Copy Ticket Summary Handler
  document.getElementById('btn-copy').addEventListener('click', () => {
    playPopSound();
    let vibesText = selectedData.vibes.join(', ');
    if (selectedData.customVibe) {
      vibesText += vibesText ? `, ${selectedData.customVibe}` : selectedData.customVibe;
    }

    const summaryText = `💌 OFFICIAL DATE CONFIRMATION PASS 💌\nDate: ${selectedData.date}\nTime: ${selectedData.time}\nLocation: ${selectedData.location}\nVibe: ${vibesText}`;

    navigator.clipboard.writeText(summaryText).then(() => {
      const copyBtn = document.getElementById('btn-copy');
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '<span>✅ Copied to Clipboard!</span>';
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
      }, 2000);
    });
  });
});
