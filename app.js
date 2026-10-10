document.addEventListener('DOMContentLoaded', () => {
  // --- NEURAL PARTICLES CANVAS --
  const canvas = document.getElementById('neural-canvas');
  const ctx = canvas.getContext('2d');
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  const particles = [];
  const particleCount = Math.min(window.innerWidth / 15, 80);
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2 + 1,
    });
  }
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 240, 255, 0.5)';
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
  // --- MOBILE NAV TOGGLE --
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
  // --- CONTACT FORM SUBMISSION TO SECURE BACKEND --
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim(),
      };
      formStatus.style.color = '#00f0ff';
      formStatus.textContent = 'Transmitting data payload to server...';
      submitBtn.disabled = true;
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (response.ok && result.success) {
          formStatus.style.color = '#00ff88';
          formStatus.textContent = result.message;
          contactForm.reset();
        } else {
          formStatus.style.color = '#ff0055';
          formStatus.textContent = result.errors ? result.errors[0].msg : result.message;
        }
      } catch (err) {
        console.error('Submission error:', err);
        formStatus.style.color = '#ff0055';
        formStatus.textContent = 'Transmission failure. Please verify server connection.';
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
});
