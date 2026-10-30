---
hide:
  - toc
---

<style>
  /* --- 1. GLOBAL LAYOUT & SCANLINE EFFECT --- */
  .md-content__inner > h1 { display: none; }
  
  /* Full width layout */
  .md-grid {
    max-width: 95% !important;
    margin: 0 auto;
  }
  
  /* Pure Black Background */
  .md-main { background: #050505; }
  .md-content { background: transparent; }

  /* CRT Scanline Overlay */
  body::before {
    content: " ";
    display: block;
    position: fixed;
    top: 0; left: 0; bottom: 0; right: 0;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
    z-index: 999;
    background-size: 100% 2px, 3px 100%;
    pointer-events: none; /* Allows clicking through the overlay */
  }

  /* --- 2. HERO SECTION --- */
  .port-hero {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 50px;
    padding: 100px 0 60px 0;
    margin-bottom: 40px;
    position: relative;
    /* Subtle glow behind avatar */
    background: radial-gradient(circle at 10% 30%, rgba(34, 211, 238, 0.08) 0%, transparent 40%);
  }
  
  /* --- 3. AVATAR --- */
  .cyber-avatar-ring {
    position: relative;
    width: 170px;
    height: 170px;
    border-radius: 50%;
    /* Cyan to Purple Gradient */
    background: linear-gradient(135deg, rgba(34, 211, 238, 0.5), rgba(168, 85, 247, 0.5));
    padding: 3px; 
    box-shadow: 0 0 60px rgba(34, 211, 238, 0.15);
    flex-shrink: 0;
  }

  .cyber-avatar-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    background: #000;
  }

  .cyber-avatar-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* --- 4. TYPOGRAPHY --- */
  .port-intro {
    max-width: 850px;
    text-align: left;
  }

  .port-intro h1 {
    font-size: 4rem;
    font-weight: 800;
    margin: 0 0 20px 0;
    color: #fff;
    line-height: 1;
    letter-spacing: -1.5px;
  }

  .port-intro p {
    font-size: 1.2rem;
    color: #9ca3af;
    line-height: 1.6;
    margin-bottom: 25px;
  }

  /* --- 5. COMMAND BAR (Social Buttons) --- */
  .command-bar {
    display: flex;
    gap: 15px;
    margin-bottom: 30px;
  }
  
  .cmd-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    background: rgba(34, 211, 238, 0.05);
    border: 1px solid rgba(34, 211, 238, 0.2);
    border-radius: 6px;
    color: #e5e7eb; /* Light Gray */
    text-decoration: none !important;
    font-size: 0.9rem;
    font-weight: 600;
    font-family: monospace;
    transition: all 0.2s;
  }
  
  .cmd-btn:hover {
    background: rgba(34, 211, 238, 0.15);
    border-color: #22d3ee;
    color: #fff;
    box-shadow: 0 0 15px rgba(34, 211, 238, 0.2);
    transform: translateY(-2px);
  }
  
  .cmd-btn svg { width: 18px; height: 18px; stroke-width: 2; }

  /* --- 6. TECH BADGES --- */
  .tech-stack {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  
  .tech-badge {
    padding: 6px 16px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 99px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #22d3ee;
    font-family: monospace;
    transition: all 0.2s;
  }
  .tech-badge:hover {
      background: rgba(34, 211, 238, 0.1);
      border-color: #22d3ee;
      color: #fff;
  }

  /* --- 7. SECTION HEADER --- */
  .section-header {
    margin-top: 60px;
    margin-bottom: 30px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 15px;
    text-align: left;
  }
  
  .section-title {
    font-size: 1.5rem;
    font-weight: 400;
    color: #e5e7eb;
    letter-spacing: 1px;
  }

  /* --- 8. CARDS GRID --- */
  .project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    gap: 30px;
  }

  .project-card {
    background: rgba(20, 20, 20, 0.6); /* Dark Glass */
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    text-decoration: none !important;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .project-card:hover {
    transform: translateY(-5px);
    border-color: rgba(34, 211, 238, 0.4);
    background: rgba(30, 30, 30, 0.8);
    box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5);
  }
  
  .project-body { 
    padding: 35px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  /* ICONS */
  .icon-box {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  .project-meta { font-size: 0.8rem; color: #22d3ee; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px; font-weight: 700; }
  .project-title { font-size: 1.6rem; font-weight: 700; color: #fff; margin-bottom: 10px; }
  .project-desc { font-size: 1rem; color: #9ca3af; line-height: 1.6; margin-bottom: 30px; }

  /* PILLS */
  .soc-pill-row { display: flex; gap: 8px; margin-top: auto; }
  .soc-pill { font-size: 0.75rem; padding: 5px 12px; border: 1px solid rgba(255,255,255,0.15); border-radius: 4px; color: #d1d5db; font-weight: 600; text-transform: uppercase; }
  .pill-cyan { border-color: rgba(34, 211, 238, 0.3); color: #22d3ee; background: rgba(34,211,238,0.05); }
  .pill-orange { border-color: rgba(249, 115, 22, 0.3); color: #f97316; background: rgba(249,115,22,0.05); }

  /* ANIMATIONS */
  .fade-up { opacity: 0; transform: translateY(20px); animation: fadeUpAnim 0.8s ease-out forwards; }
  .delay-1 { animation-delay: 0.1s; }
  .delay-2 { animation-delay: 0.2s; }
  @keyframes fadeUpAnim { to { opacity: 1; transform: translateY(0); } }

  /* MOBILE RESPONSIVE */
  @media (max-width: 900px) {
      .port-hero { flex-direction: column; align-items: flex-start; gap: 30px; }
      .port-intro h1 { font-size: 3rem; }
      .command-bar { flex-wrap: wrap; }
  }
</style>

<div class="port-hero fade-up">
  
  <div class="cyber-avatar-ring">
    <div class="cyber-avatar-img">
        <img src="assets/profile.png" alt="Profile">
    </div>
  </div>
  
  <div class="port-intro">
    <h1>Security Analyst<span style="color: #22d3ee;">.</span></h1>
    <p>
      Specializing in <strong>SOC Operations</strong>, <strong>Threat Hunting</strong>, and <strong>Digital Forensics</strong>. 
      Building defensive depth through evidence-based analysis and documenting the kill chain of simulated breaches.
    </p>

    <div class="command-bar">
      <a href="https://github.com/vishak-SOC" target="_blank" class="cmd-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
        GitHub
      </a>
      
      <a href="www.linkedin.com/in/vishaksp" target="_blank" class="cmd-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
        LinkedIn
      </a>
    </div>
    
    <div class="tech-stack">
      <span class="tech-badge">SIEM / Splunk</span>
      <span class="tech-badge">Network Forensics</span>
      <span class="tech-badge">EDR Analysis</span>
      <span class="tech-badge">Incident Response</span>
    </div>
  </div>
</div>

<div class="section-header fade-up delay-1">
    <h2 class="section-title">
        <span style="color: #22d3ee;">///</span> OPERATIONAL CASE FILES
    </h2>
</div>

<div class="project-grid fade-up delay-2">

  <a href="tryhackme/first-shift/" class="project-card">
    <div class="project-body">
      
      <div class="icon-box" style="background: rgba(34, 211, 238, 0.1); border: 1px solid rgba(34, 211, 238, 0.2);">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
      </div>

      <div class="project-meta">TryHackMe • SOC Level 1</div>
      <div class="project-title">Operation: First Shift</div>
      <div class="project-desc">
        A complete kill-chain investigation: analyzing Phishing vectors, Web Shells, tracking Lateral Movement, and performing Cloud Forensics on AWS.
      </div>
      <div class="soc-pill-row">
        <span class="soc-pill pill-cyan">Complete</span>
        <span class="soc-pill">8 Tasks Executed</span>
      </div>
    </div>
  </a>

  <a href="tryhackme/honeynet-collapse/" class="project-card">
    <div class="project-body">
      
      <div class="icon-box" style="background: rgba(249, 115, 22, 0.1); border: 1px solid rgba(249, 115, 22, 0.2);">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
      </div>

      <div class="project-meta" style="color: #f97316;">Incident Response • Forensics</div>
      <div class="project-title">Operation: Honeynet Collapse</div>
      <div class="project-desc">
        Multi-OS Ransomware Investigation. Analyzed Linux, Windows, and macOS endpoints to reconstruct the attack timeline and identify exfiltrated data.
      </div>
      <div class="soc-pill-row">
        <span class="soc-pill pill-orange">Complete</span>
        <span class="soc-pill">6 Phases Analyzed</span>
      </div>
    </div>
  </a>

</div>

<br><br><br>
<div style="text-align: left; opacity: 0.3; font-size: 0.75rem; font-family: monospace; color: #fff;">
  SYSTEM STATUS: ONLINE // SEC-PORTFOLIO-v2.1
</div>
