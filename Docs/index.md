---
hide:
  - toc
---

<style>
  .md-content__inner > h1 { display: none; }
  
  /* --- FUTURISTIC HERO SECTION --- */
  .port-hero {
    display: flex;
    align-items: center;
    gap: 50px;
    padding: 80px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    margin-bottom: 40px;
    position: relative;
    /* Subtle Tech Background overlay */
    background-image: 
      radial-gradient(circle at 10% 20%, rgba(0, 210, 255, 0.08) 0%, transparent 40%),
      linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 100% 100%, 30px 100%; /* Vertical faint scanlines */
  }
  
  /* --- CYBER AVATAR CONTAINER (STATIC) --- */
  .cyber-avatar-ring {
    position: relative;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    /* The neon gradient ring */
    background: conic-gradient(from 0deg, transparent 0%, #00d2ff 20%, transparent 40%, #00d2ff 60%, transparent 80%);
    /* animation: spin-glow 6s linear infinite; <--- DISABLED FOR STATIC LOOK */
    padding: 4px; /* Thickness of the glowing ring */
    box-shadow: 0 0 60px rgba(0, 210, 255, 0.3); /* Outer bloom */
    flex-shrink: 0;
  }

  /* The actual image wrapper */
  .cyber-avatar-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    background: #0b0f15; /* Dark backing */
    border: 2px solid rgba(0, 210, 255, 0.6); /* Inner sharp rim */
    position: relative;
    z-index: 2; /* Sits on top of the glow */
  }

  .cyber-avatar-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: contrast(110%); /* Pop the colors slightly */
    transition: transform 0.4s ease;
  }
  
  /* Slight zoom effect on hover */
  .cyber-avatar-ring:hover .cyber-avatar-img img {
     transform: scale(1.08);
  }

  /* --- TYPOGRAPHY & BADGES --- */
  .port-intro h1 {
    font-size: 3.2rem;
    font-weight: 800;
    margin: 0 0 15px 0;
    /* Cyber gradient text */
    background: linear-gradient(to right, #ffffff 20%, #00d2ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -1px;
    text-shadow: 0 0 30px rgba(0, 210, 255, 0.2);
  }

  .port-intro p {
    font-size: 1.15rem;
    opacity: 0.85;
    max-width: 600px;
    line-height: 1.7;
    color: #cdd6f4;
  }

  .tech-stack {
    display: flex;
    gap: 12px;
    margin-top: 25px;
    flex-wrap: wrap;
  }
  
  .tech-badge {
    padding: 8px 18px;
    background: rgba(0, 210, 255, 0.05);
    border: 1px solid rgba(0, 210, 255, 0.2);
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #00d2ff;
    font-family: var(--mono-font);
    letter-spacing: 0.5px;
    transition: all 0.2s;
  }
  .tech-badge:hover {
      background: rgba(0, 210, 255, 0.15);
      box-shadow: 0 0 15px rgba(0, 210, 255, 0.2);
  }

  /* --- PROJECTS GRID --- */
  .project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
    gap: 30px;
    margin-top: 35px;
  }

  .project-card {
    background: rgba(22, 27, 36, 0.8); /* Slightly transparent */
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
    text-decoration: none !important;
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
  }

  .project-card:hover {
    transform: translateY(-7px);
    border-color: #00d2ff;
    box-shadow: 0 10px 30px -10px rgba(0, 210, 255, 0.3);
  }
  
  /* Glowing line on hover */
  .project-card::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 2px;
      background: #00d2ff;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s ease;
  }
  .project-card:hover::after { transform: scaleX(1); }


  .project-header {
    height: 150px;
    background: linear-gradient(135deg, rgba(0, 210, 255, 0.1), transparent 60%);
    padding: 25px;
    display: flex;
    align-items: flex-end;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  
  .project-body { padding: 25px; }

  .project-title { font-size: 1.5rem; font-weight: 700; color: #fff; margin-bottom: 8px; }
  .project-meta { font-size: 0.85rem; color: #00d2ff; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 12px; font-weight: 600; }
  .project-desc { font-size: 0.95rem; opacity: 0.75; line-height: 1.6; margin-bottom: 25px; color: #cdd6f4; }

  /* --- ENTRANCE ANIMATIONS --- */
  .fade-up { opacity: 0; transform: translateY(30px); animation: fadeUpAnim 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
  .delay-1 { animation-delay: 0.2s; }
  .delay-2 { animation-delay: 0.4s; }
  @keyframes fadeUpAnim { to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 768px) {
      .port-hero { flex-direction: column; text-align: center; padding: 50px 0; gap: 30px; }
      .tech-stack { justify-content: center; }
      .port-intro h1 { font-size: 2.5rem; }
      .cyber-avatar-ring { width: 150px; height: 150px; }
  }

</style>

<div class="port-hero fade-up">
  
  <div class="cyber-avatar-ring">
    <div class="cyber-avatar-img">
        <img src="assets/profile.png" alt="Security Analyst Profile">
    </div>
  </div>
  
  <div class="port-intro">
    <h1>Security Analyst.</h1>
    <p>
      Specializing in <strong>SOC Operations</strong>, <strong>Threat Hunting</strong>, and <strong>Digital Forensics</strong>. 
      Building defensive depth through evidence-based analysis and documenting the kill chain of simulated breaches.
    </p>
    <div class="tech-stack">
      <span class="tech-badge">SEIM / Splunk</span>
      <span class="tech-badge">Network Forensics</span>
      <span class="tech-badge">EDR Analysis</span>
      <span class="tech-badge">Incident Response</span>
    </div>
  </div>
</div>

<div class="fade-up delay-1">
    <h2 style="border-bottom: none; font-size: 1.6rem; margin-bottom: 25px; letter-spacing: 1px;">
        <span style="color: #00d2ff;">///</span> OPERATIONAL CASE FILES
    </h2>
</div>

<div class="project-grid fade-up delay-2">

  <a href="tryhackme/first-shift/" class="project-card">
    <div class="project-header">
      <div style="font-size: 2.5rem; opacity: 0.8;">🛡️</div>
    </div>
    <div class="project-body">
      <div class="project-meta">TryHackMe • SOC Level 1</div>
      <div class="project-title">Operation: First Shift</div>
      <div class="project-desc">
        A complete kill-chain investigation: investigating Phishing vectors, analyzing Web Shells, tracking Lateral Movement, and performing Cloud Forensics on AWS.
      </div>
      <div class="soc-pill-row">
        <span class="soc-pill" style="border-color: #00d2ff; background: rgba(0,210,255,0.1);">Complete</span>
        <span class="soc-pill">8 Tasks Executed</span>
      </div>
    </div>
  </a>

  <a href="#" class="project-card" style="opacity: 0.5; filter: grayscale(50%); cursor: default;">
    <div class="project-header" style="background: linear-gradient(135deg, rgba(255, 80, 80, 0.1), transparent);">
        <div style="font-size: 2.5rem; opacity: 0.5;">🔒</div>
    </div>
    <div class="project-body">
      <div class="project-meta">Upcoming Operation</div>
      <div class="project-title">Red Team Scenario</div>
      <div class="project-desc">
        Currently engaged in advanced adversary simulation. Detailed mission report pending declassification and analysis.
      </div>
      <div class="soc-pill-row">
        <span class="soc-pill">Status: Classified</span>
      </div>
    </div>
  </a>

</div>

<br><br><br>
<center style="opacity: 0.4; font-size: 0.8rem; font-family: var(--mono-font);">
  SYSTEM ID: SEC-PORTFOLIO-v2.1 // EST. 2025
</center>