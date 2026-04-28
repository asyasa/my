/* ============================================================
   SYASA — Cinematic Editorial Landing Page
   Main JavaScript — GSAP Ecosystem
   ============================================================ */

(function () {
  'use strict';

  /* --- Register GSAP Plugins --- */
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Observer, Flip, MotionPathPlugin);

  /* --- Global State --- */
  const state = {
    isLoaded: false,
    isMobile: window.innerWidth < 768,
    mouseX: 0,
    mouseY: 0,
  };

  /* ============================================================
     CUSTOM CURSOR
     ============================================================ */
  function initCursor() {
    if (state.isMobile) return;

    const cursor = document.getElementById('cursor');
    const dot = cursor.querySelector('.cursor-dot');
    const ring = cursor.querySelector('.cursor-ring');

    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', function (e) {
      state.mouseX = e.clientX;
      state.mouseY = e.clientY;
    });

    function animateCursor() {
      dotX += (state.mouseX - dotX) * 0.2;
      dotY += (state.mouseY - dotY) * 0.2;
      ringX += (state.mouseX - ringX) * 0.08;
      ringY += (state.mouseY - ringY) * 0.08;

      dot.style.transform = 'translate3d(' + dotX + 'px,' + dotY + 'px,0)';
      ring.style.transform = 'translate3d(' + ringX + 'px,' + ringY + 'px,0)';

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    var hoverables = document.querySelectorAll('a, button, .skill-node, .social-card, .contact-item, .magnetic-btn');
    hoverables.forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('cursor--hover'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('cursor--hover'); });
    });

    document.addEventListener('mousedown', function () { cursor.classList.add('cursor--click'); });
    document.addEventListener('mouseup', function () { cursor.classList.remove('cursor--click'); });
  }

  /* ============================================================
     MAGNETIC BUTTONS
     ============================================================ */
  function initMagneticButtons() {
    if (state.isMobile) return;

    document.querySelectorAll('.magnetic-btn').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
      });

      btn.addEventListener('mouseleave', function () {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
      });
    });
  }

  /* ============================================================
     RIPPLE EFFECT
     ============================================================ */
  function initRipple() {
    document.querySelectorAll('.social-card, .contact-item').forEach(function (el) {
      el.style.position = 'relative';
      el.addEventListener('click', function (e) {
        var rect = el.getBoundingClientRect();
        var ripple = document.createElement('div');
        ripple.className = 'ripple';
        var size = Math.max(rect.width, rect.height);
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        el.appendChild(ripple);
        setTimeout(function () { ripple.remove(); }, 700);
      });
    });
  }

  /* ============================================================
     PRELOADER
     ============================================================ */
  function initPreloader() {
    var preloader = document.getElementById('preloader');
    var tl = gsap.timeline({
      onComplete: function () {
        state.isLoaded = true;
        initHeroAnimations();
      }
    });

    tl.to('.preloader-line', {
      scaleX: 1,
      duration: 0.8,
      ease: 'power2.inOut'
    })
    .to('.preloader-text', {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.3')
    .to('.preloader-sub', {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    }, '-=0.2')
    .to('.preloader-text', {
      letterSpacing: '0.5em',
      duration: 0.6,
      ease: 'power2.inOut'
    }, '+=0.4')
    .to(preloader, {
      yPercent: -100,
      duration: 1,
      ease: 'power3.inOut'
    }, '+=0.2')
    .set(preloader, { display: 'none' });
  }

  /* ============================================================
     HERO ANIMATIONS
     ============================================================ */
  function initHeroAnimations() {
    var heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl.from('.hero-image-wrap', {
      scale: 1.3,
      duration: 2,
      ease: 'power2.out'
    })
    .to('.hero-eyebrow', {
      opacity: 1,
      duration: 0.6
    }, '-=1.5')
    .from('.hero-title .hero-word', {
      yPercent: 120,
      duration: 1.2,
      stagger: 0.1,
      ease: 'power4.out'
    }, '-=1.2')
    .from('.hero-subtitle .hero-word', {
      yPercent: 120,
      duration: 1,
      stagger: 0.1,
      ease: 'power4.out'
    }, '-=0.8')
    .from('.hero-tagline .hero-word', {
      yPercent: 120,
      duration: 0.8,
      stagger: 0.05,
      ease: 'power4.out'
    }, '-=0.6')
    .to('.hero-cta', {
      opacity: 1,
      duration: 0.6
    }, '-=0.3')
    .from('.hero-scroll-indicator', {
      opacity: 0,
      y: 20,
      duration: 0.6
    }, '-=0.2');

    /* Scroll line pulse */
    gsap.to('.scroll-line', {
      scaleY: 0,
      transformOrigin: 'bottom',
      duration: 1.2,
      ease: 'power2.inOut',
      repeat: -1,
      yoyo: true
    });

    /* Hero parallax on scroll */
    gsap.to('.hero-image-wrap', {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    gsap.to('.hero-content', {
      yPercent: -30,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '60% top',
        scrub: true
      }
    });
  }

  /* ============================================================
     NAVIGATION
     ============================================================ */
  function initNav() {
    var nav = document.getElementById('nav');
    var toggle = document.getElementById('navToggle');
    var mobileMenu = document.getElementById('mobileMenu');

    ScrollTrigger.create({
      start: 100,
      onUpdate: function (self) {
        if (self.direction === 1 && self.scroll() > 100) {
          nav.classList.add('nav--scrolled');
        } else if (self.scroll() < 100) {
          nav.classList.remove('nav--scrolled');
        }
      }
    });

    if (toggle) {
      toggle.addEventListener('click', function () {
        toggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
      });
    }

    document.querySelectorAll('.mobile-link').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });

    /* Smooth scroll for nav links */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          gsap.to(window, {
            scrollTo: { y: target, offsetY: 0 },
            duration: 1.2,
            ease: 'power3.inOut'
          });
        }
      });
    });
  }

  /* ============================================================
     ABOUT SECTION ANIMATIONS
     ============================================================ */
  function initAbout() {
    /* Image reveal */
    gsap.from('.about-image', {
      scale: 1.3,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.about-image-wrap',
        start: 'top 80%',
        end: 'top 30%',
        scrub: 1
      }
    });

    /* Heading word-by-word */
    gsap.from('.about-heading .word-reveal', {
      yPercent: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-heading',
        start: 'top 80%'
      }
    });

    /* Body paragraphs */
    gsap.utils.toArray('.about-body .reveal-text').forEach(function (el, i) {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%'
        }
      });
      gsap.set(el, { y: 30 });
    });

    /* Micro labels */
    gsap.utils.toArray('.micro-label').forEach(function (label, i) {
      gsap.to(label, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: i * 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about-micro-labels',
          start: 'top 85%'
        }
      });
      gsap.set(label, { y: 20 });
    });

    /* Floating micro labels */
    if (!state.isMobile) {
      gsap.utils.toArray('.micro-label').forEach(function (label, i) {
        gsap.to(label, {
          y: '+=8',
          duration: 2 + i * 0.3,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.2
        });
      });
    }
  }

  /* ============================================================
     EXPERIENCE TIMELINE (HORIZONTAL SCROLL + PINNING)
     ============================================================ */
  function initTimeline() {
    var track = document.getElementById('timelineTrack');
    var cards = gsap.utils.toArray('.timeline-card');
    var progressBar = document.getElementById('timelineProgress');

    if (!cards.length) return;

    /* Reveal cards initially */
    gsap.set(cards, { opacity: 0, y: 40 });

    var totalWidth = 0;
    cards.forEach(function (card) {
      totalWidth += card.offsetWidth + 40;
    });
    totalWidth -= 40;

    var scrollDistance = totalWidth - window.innerWidth + 96;
    if (scrollDistance < 0) scrollDistance = 0;

    /* Pin and horizontal scroll */
    var timelineTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.experience',
        start: 'top top',
        end: '+=' + (scrollDistance + window.innerHeight),
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: function (self) {
          if (progressBar) {
            progressBar.style.width = (self.progress * 100) + '%';
          }
        }
      }
    });

    timelineTl.to(track, {
      x: -scrollDistance,
      ease: 'none'
    });

    /* Card entrance stagger */
    cards.forEach(function (card, i) {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.experience',
          start: 'top 60%'
        }
      });
    });
  }

  /* ============================================================
     SKILLS ANIMATIONS
     ============================================================ */
  function initSkills() {
    /* Title */
    gsap.from('.skills-title .word-reveal', {
      yPercent: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.skills-title',
        start: 'top 80%'
      }
    });

    /* Skill nodes stagger */
    var nodes = gsap.utils.toArray('.skill-node');
    nodes.forEach(function (node, i) {
      gsap.to(node, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.skills-playground',
          start: 'top 80%'
        }
      });
      gsap.set(node, { y: 40 });
    });

    /* Magnetic hover effect on skill nodes */
    if (!state.isMobile) {
      nodes.forEach(function (node) {
        node.addEventListener('mousemove', function (e) {
          var rect = node.getBoundingClientRect();
          var x = e.clientX - rect.left - rect.width / 2;
          var y = e.clientY - rect.top - rect.height / 2;
          gsap.to(node, {
            x: x * 0.1,
            y: y * 0.1,
            rotation: x * 0.02,
            duration: 0.4,
            ease: 'power2.out'
          });
        });

        node.addEventListener('mouseleave', function () {
          gsap.to(node, {
            x: 0,
            y: 0,
            rotation: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.4)'
          });
        });
      });
    }
  }

  /* ============================================================
     METRICS (COUNTER + BAR ANIMATIONS)
     ============================================================ */
  function initMetrics() {
    /* Title */
    gsap.from('.metrics-title .word-reveal', {
      yPercent: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.metrics-title',
        start: 'top 80%'
      }
    });

    /* Metric cards */
    var metricCards = gsap.utils.toArray('.metric-card');
    metricCards.forEach(function (card, i) {
      var numEl = card.querySelector('.metric-number');
      var barFill = card.querySelector('.metric-bar-fill');
      var target = parseInt(numEl.dataset.target, 10);
      var suffix = numEl.dataset.suffix || '';

      gsap.set(card, { y: 50 });

      ScrollTrigger.create({
        trigger: card,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          /* Card entrance */
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out'
          });

          /* Counter animation */
          var counter = { val: 0 };
          gsap.to(counter, {
            val: target,
            duration: 2,
            delay: i * 0.1 + 0.3,
            ease: 'power2.out',
            onUpdate: function () {
              numEl.textContent = Math.floor(counter.val) + suffix;
            }
          });

          /* Bar fill */
          if (barFill) {
            var barWidth = barFill.dataset.width || 50;
            gsap.to(barFill, {
              width: barWidth + '%',
              duration: 1.5,
              delay: i * 0.1 + 0.5,
              ease: 'power2.out'
            });
          }
        }
      });
    });
  }

  /* ============================================================
     SOCIAL SECTION
     ============================================================ */
  function initSocial() {
    /* Title */
    gsap.from('.social-title .word-reveal', {
      yPercent: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.social-title',
        start: 'top 80%'
      }
    });

    /* Cards stagger */
    var socialCards = gsap.utils.toArray('.social-card');
    socialCards.forEach(function (card, i) {
      gsap.set(card, { y: 40 });
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.social-grid',
          start: 'top 80%'
        }
      });
    });

    /* Hover zoom + blur */
    if (!state.isMobile) {
      socialCards.forEach(function (card) {
        card.addEventListener('mouseenter', function () {
          socialCards.forEach(function (other) {
            if (other !== card) {
              gsap.to(other, { opacity: 0.4, filter: 'blur(2px)', duration: 0.4 });
            }
          });
          gsap.to(card, { scale: 1.02, duration: 0.4, ease: 'power2.out' });
        });

        card.addEventListener('mouseleave', function () {
          socialCards.forEach(function (other) {
            gsap.to(other, { opacity: 1, filter: 'blur(0px)', duration: 0.4 });
          });
          gsap.to(card, { scale: 1, duration: 0.4, ease: 'power2.out' });
        });
      });
    }
  }

  /* ============================================================
     TRANSFORMATION SECTION
     ============================================================ */
  function initTransformation() {
    var transformTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.transformation-visual',
        start: 'top 70%',
        end: 'bottom 30%',
        scrub: false
      }
    });

    transformTl.from('.transform-before', {
      x: -80,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })
    .from('.transform-divider', {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)'
    }, '-=0.5')
    .from('.transform-after', {
      x: 80,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.5');

    /* Clip-path scroll animation on images */
    gsap.from('.transform-before .transform-image-wrap', {
      clipPath: 'inset(100% 0 0 0)',
      duration: 1.2,
      ease: 'power3.inOut',
      scrollTrigger: {
        trigger: '.transform-before',
        start: 'top 75%'
      }
    });

    gsap.from('.transform-after .transform-image-wrap', {
      clipPath: 'inset(0 0 100% 0)',
      duration: 1.2,
      ease: 'power3.inOut',
      scrollTrigger: {
        trigger: '.transform-after',
        start: 'top 75%'
      }
    });
  }

  /* ============================================================
     DASHBOARD SECTION
     ============================================================ */
  function initDashboard() {
    /* Title */
    gsap.from('.dashboard-title .word-reveal', {
      yPercent: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.dashboard-title',
        start: 'top 80%'
      }
    });

    /* Dash cards stagger */
    var dashCards = gsap.utils.toArray('.dash-card');
    dashCards.forEach(function (card, i) {
      gsap.set(card, { y: 40 });
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.dashboard-grid',
          start: 'top 80%'
        }
      });
    });

    /* Pipeline bars animation */
    var pipelineBars = document.querySelectorAll('.pipeline-bar');
    pipelineBars.forEach(function (bar) {
      var value = bar.dataset.value;
      ScrollTrigger.create({
        trigger: bar,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          gsap.to(bar, {
            '--pipeline-width': value + '%',
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: function () {
              var afterEl = bar.querySelector('::after');
            }
          });
          /* Animate the pseudo-element width via a different approach */
          bar.style.setProperty('--pw', '0%');
          gsap.to({ val: 0 }, {
            val: parseFloat(value) / 45 * 100,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: function () {
              bar.querySelector(':scope')
              bar.style.setProperty('overflow', 'hidden');
              var fill = bar.querySelector('.pipeline-fill');
              if (!fill) {
                fill = document.createElement('div');
                fill.className = 'pipeline-fill';
                fill.style.cssText = 'height:100%;background:#087e8b;width:0%;transition:none;';
                bar.appendChild(fill);
              }
              fill.style.width = (this.targets()[0].val) + '%';
            }
          });
        }
      });
    });

    /* Dashboard stat counters */
    document.querySelectorAll('.dash-stat-value').forEach(function (el) {
      var target = parseInt(el.dataset.target, 10);
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          var counter = { val: 0 };
          gsap.to(counter, {
            val: target,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: function () {
              el.textContent = Math.floor(counter.val);
            }
          });
        }
      });
    });

    /* Draw performance chart */
    initPerformanceChart();
  }

  /* ============================================================
     PERFORMANCE CHART (Custom Canvas — No Libraries)
     ============================================================ */
  function initPerformanceChart() {
    var canvas = document.getElementById('perfCanvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;

    function resizeCanvas() {
      var rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = 200 * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = '200px';
      ctx.scale(dpr, dpr);
    }
    resizeCanvas();

    var engagementData = [20, 35, 45, 40, 60, 55, 70, 85, 75, 90, 88, 95];
    var revenueData = [10, 20, 25, 35, 30, 45, 50, 55, 65, 60, 75, 80];
    var animProgress = { val: 0 };
    var w, h;

    function drawChart(progress) {
      w = canvas.width / dpr;
      h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      /* Grid lines */
      ctx.strokeStyle = 'rgba(8, 126, 139, 0.1)';
      ctx.lineWidth = 1;
      for (var i = 0; i < 5; i++) {
        var gy = h * (i / 4) * 0.8 + h * 0.1;
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      function drawLine(data, color, prog) {
        var pointCount = Math.floor(data.length * prog);
        if (pointCount < 2) return;

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        for (var j = 0; j < pointCount; j++) {
          var px = (j / (data.length - 1)) * w;
          var py = h - (data[j] / 100) * h * 0.8 - h * 0.1;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        /* Dots */
        for (var k = 0; k < pointCount; k++) {
          var dx = (k / (data.length - 1)) * w;
          var dy = h - (data[k] / 100) * h * 0.8 - h * 0.1;
          ctx.beginPath();
          ctx.arc(dx, dy, 3, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      }

      drawLine(engagementData, '#ff5a5f', progress);
      drawLine(revenueData, '#087e8b', progress);
    }

    ScrollTrigger.create({
      trigger: '#perfChart',
      start: 'top 85%',
      once: true,
      onEnter: function () {
        gsap.to(animProgress, {
          val: 1,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function () {
            drawChart(animProgress.val);
          }
        });
      }
    });

    window.addEventListener('resize', function () {
      resizeCanvas();
      drawChart(animProgress.val);
    });
  }

  /* ============================================================
     FUTURE VISION SECTION
     ============================================================ */
  function initFuture() {
    /* Title line-by-line reveal */
    gsap.from('.future-word', {
      yPercent: 120,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: '.future-title',
        start: 'top 75%'
      }
    });

    /* Text fade */
    gsap.to('.future-text', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.future-text',
        start: 'top 85%'
      }
    });
    gsap.set('.future-text', { y: 30 });

    /* Canvas particles */
    initFutureParticles();
  }

  /* ============================================================
     FUTURE PARTICLES (Canvas)
     ============================================================ */
  function initFutureParticles() {
    var container = document.getElementById('futureParticles');
    if (!container) return;

    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
    container.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var particles = [];
    var particleCount = state.isMobile ? 30 : 60;

    function resize() {
      canvas.width = container.offsetWidth * dpr;
      canvas.height = container.offsetHeight * dpr;
      canvas.style.width = container.offsetWidth + 'px';
      canvas.style.height = container.offsetHeight + 'px';
      ctx.scale(dpr, dpr);
    }
    resize();

    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * container.offsetWidth,
        y: Math.random() * container.offsetHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? '#ff5a5f' : '#087e8b'
      });
    }

    function animate() {
      var w = container.offsetWidth;
      var h = container.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      /* Draw connections */
      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var dx = particles[a].x - particles[b].x;
          var dy = particles[a].y - particles[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = 'rgba(8, 126, 139, ' + (1 - dist / 100) * 0.15 + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', resize);
  }

  /* ============================================================
     CONTACT SECTION
     ============================================================ */
  function initContact() {
    /* Title */
    gsap.from('.contact-title .word-reveal', {
      yPercent: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.contact-title',
        start: 'top 80%'
      }
    });

    /* Contact items */
    gsap.from('.contact-item', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.contact-grid',
        start: 'top 80%'
      }
    });

    /* CTA */
    gsap.from('.contact-cta', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.contact-cta',
        start: 'top 90%'
      }
    });
  }

  /* ============================================================
     GLOBAL SCROLL ANIMATIONS
     ============================================================ */
  function initScrollAnimations() {
    /* Section labels */
    gsap.utils.toArray('.section-label').forEach(function (label) {
      gsap.from(label, {
        x: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: label,
          start: 'top 85%'
        }
      });
    });

    /* Velocity-based scroll effect on images */
    gsap.utils.toArray('.about-image, .transform-image').forEach(function (img) {
      gsap.to(img, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });
  }

  /* ============================================================
     INITIALIZATION
     ============================================================ */
  function init() {
    initPreloader();
    initCursor();
    initNav();
    initMagneticButtons();
    initRipple();
    initAbout();
    initTimeline();
    initSkills();
    initMetrics();
    initSocial();
    initTransformation();
    initDashboard();
    initFuture();
    initContact();
    initScrollAnimations();
  }

  /* Wait for DOM */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Resize handler */
  window.addEventListener('resize', function () {
    state.isMobile = window.innerWidth < 768;
  });

})();
