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

# 📂 Operation: Honeynet Collapse

<div class="briefing-container">
  <div class="briefing-header">
    <span>// MISSION_BRIEFING: DECEPTITECH_INCIDENT</span>
  </div>
  <p class="briefing-text">
    A sophisticated ransomware campaign has successfully targeted the DeceptiTech corporate network. 
    As the lead <b>Senior Forensic Analyst</b>, your objective is to reconstruct the multi-stage 
    attack chain involving unauthorized <b>Linux SSH access</b>, lateral movement into <b>Windows DC</b>, 
    and final <b>macOS exfiltration</b>.
  </p>
  <div class="status-line">
    <span></span>
    <span></span>
  </div>
</div>

---

<div class="scene">
  <div class="carousel">
    <div class="carousel__cell" onclick="location.href='task-1-initial-access/'">
        <div class="task-badge">Task 01</div>
        <div class="icon-wrapper">
            <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
        </div>
        <div class="task-title">Initial Access</div>
    </div>

    <div class="carousel__cell" onclick="location.href='task-2-windows-movement/'">
        <div class="task-badge">Task 02</div>
        <div class="icon-wrapper">
            <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
        </div>
        <div class="task-title">Windows Triage</div>
    </div>

    <div class="carousel__cell" onclick="location.href='task-3-memory-forensics/'">
        <div class="task-badge">Task 03</div>
        <div class="icon-wrapper">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        </div>
        <div class="task-title">Memory Forensics</div>
    </div>

    <div class="carousel__cell" onclick="location.href='task-4-disk-forensics/'">
        <div class="task-badge">Task 04</div>
        <div class="icon-wrapper">
            <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        </div>
        <div class="task-title">Disk Analysis</div>
    </div>

    <div class="carousel__cell" onclick="location.href='task-5-file-system/'">
        <div class="task-badge">Task 05</div>
        <div class="icon-wrapper">
            <svg viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
        </div>
        <div class="task-title">File System</div>
    </div>

    <div class="carousel__cell" onclick="location.href='task-6-macos/'">
        <div class="task-badge">Task 06</div>
        <div class="icon-wrapper">
            <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
        </div>
        <div class="task-title">MacOS Forensics</div>
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