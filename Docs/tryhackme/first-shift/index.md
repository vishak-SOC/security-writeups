---
hide:
  - toc
---

<style>
  /* --- 1. BRIEFING SECTION --- */
  .briefing-container {
    background: rgba(34, 211, 238, 0.03);
    border-left: 4px solid #22d3ee;
    padding: 25px;
    border-radius: 0 12px 12px 0;
    margin-bottom: 40px;
    font-family: 'JetBrains Mono', monospace;
  }

  .briefing-header {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #22d3ee;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 15px;
    font-size: 0.9rem;
  }

  .briefing-text {
    color: #94a3b8;
    line-height: 1.6;
    font-size: 0.95rem;
    margin: 0;
  }

  .status-line {
    margin-top: 15px;
    display: flex;
    gap: 20px;
    font-size: 0.8rem;
    color: #475569;
  }

  /* --- 2. 3D CAROUSEL SCENE --- */
  .scene {
    margin: 60px auto;
    position: relative;
    width: 360px; 
    height: 300px;
    perspective: 1500px;
  }

  .carousel {
    width: 100%;
    height: 100%;
    position: absolute;
    transform: translateZ(-520px); 
    transform-style: preserve-3d;
    transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .carousel__cell {
    position: absolute;
    width: 340px; 
    height: 280px;
    left: 10px;
    top: 10px;
    background: linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(5, 5, 10, 1));
    border: 1px solid rgba(34, 211, 238, 0.2);
    box-shadow: 0 10px 60px rgba(0, 0, 0, 0.9);
    border-radius: 24px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center; 
    justify-content: center;
    text-align: center;
    backface-visibility: hidden; 
    cursor: pointer;
    transition: border 0.3s;
  }
  
  .carousel__cell:hover {
    border-color: rgba(34, 211, 238, 0.6);
  }

  .task-badge {
    background: rgba(34, 211, 238, 0.1);
    color: #22d3ee;
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 25px;
  }

  .icon-wrapper {
    width: 60px;
    height: 60px;
    margin-bottom: 20px;
  }

  .icon-wrapper svg {
    width: 50px;
    height: 50px;
    stroke: #22d3ee;
    stroke-width: 1.5;
    fill: none;
  }

  .task-title { 
    font-size: 1.8rem; 
    font-weight: 700; 
    color: #ffffff; 
    letter-spacing: -0.5px;
    line-height: 1.2;
    margin: 0;
  }

  .nav-controls {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-top: 40px;
  }

  .small-rotate-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .small-rotate-btn:hover {
    background: rgba(34, 211, 238, 0.1);
    border-color: #22d3ee;
  }

  .small-rotate-btn svg {
    width: 20px;
    height: 20px;
    stroke: #94a3b8;
    fill: none;
    stroke-width: 2;
  }

  .small-rotate-btn:hover svg {
    stroke: #22d3ee;
  }
</style>

# 📁 Case Study: First Shift

<div class="briefing-container">
  <div class="briefing-header">
    <span>// MISSION_BRIEFING: AUTH_TRIAGE_INITIATED</span>
  </div>
  <p class="briefing-text">
    Anomalous authentication events have been detected originating from unusual geolocations. 
    Simultaneously, users are reporting suspicious emails. As the <b>Junior Security Analyst</b>, 
    your objective is to correlate these events, analyze the phishing payloads, and determine if the network has been breached.
  </p>
  <div class="status-line">
    <span>● CLASSIFICATION: CONFIDENTIAL</span>
    <span>● STATUS: INVESTIGATION_ACTIVE</span>
  </div>
</div>

---

<div class="scene">
  <div class="carousel">

    <div class="carousel__cell" onclick="location.href='task-3-probably-just-fine/'">
        <div class="task-badge">Task 3</div>
        <div class="icon-wrapper">
            <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        </div>
        <div class="task-title">Auth Triage</div>
    </div>

    <div class="carousel__cell" onclick="location.href='task-4-phishing-books/'">
        <div class="task-badge">Task 4</div>
        <div class="icon-wrapper">
            <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        </div>
        <div class="task-title">Phishing Books</div>
    </div>

    <div class="carousel__cell" onclick="location.href='task-5-Portal-Drop/'">
        <div class="task-badge">Task 5</div>
        <div class="icon-wrapper">
            <svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
        </div>
        <div class="task-title">Portal Drop</div>
    </div>

    <div class="carousel__cell" onclick="location.href='task-6-Zero-Tolerance/'">
        <div class="task-badge">Task 6</div>
        <div class="icon-wrapper">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
        </div>
        <div class="task-title">Zero Tolerance</div>
    </div>

    <div class="carousel__cell" onclick="location.href='task-7-The-Crown-Jewel/'">
        <div class="task-badge">Task 7</div>
        <div class="icon-wrapper">
            <svg viewBox="0 0 24 24"><path d="M6 3h12l4 6-10 13L2 9z"></path></svg>
        </div>
        <div class="task-title">Crown Jewel</div>
    </div>

    <div class="carousel__cell" onclick="location.href='task-8-promotion-night/'">
        <div class="task-badge">Task 8</div>
        <div class="icon-wrapper">
            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        </div>
        <div class="task-title">Promotion</div>
    </div>

  </div>
</div>

<div class="nav-controls">
  <div class="small-rotate-btn" id="prevBtn">
    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
  </div>
  <div class="small-rotate-btn" id="nextBtn">
    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
  </div>
</div>

<script>
  var carousel = document.querySelector('.carousel');
  var cellCount = 6;
  var selectedIndex = 0;

  function rotateCarousel() {
    var angle = selectedIndex / cellCount * -360;
    carousel.style.transform = 'translateZ(-520px) rotateY(' + angle + 'deg)';
  }

  document.querySelector('#prevBtn').addEventListener('click', () => { selectedIndex--; rotateCarousel(); });
  document.querySelector('#nextBtn').addEventListener('click', () => { selectedIndex++; rotateCarousel(); });
  
  var cells = document.querySelectorAll('.carousel__cell');
  var radius = 520; 
  var theta = 360 / cellCount;
  
  for ( var i=0; i < cells.length; i++ ) {
    var cell = cells[i];
    var cellAngle = theta * i;
    cell.style.transform = 'rotateY(' + cellAngle + 'deg) translateZ(' + radius + 'px)';
  }
</script>