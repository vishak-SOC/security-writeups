---
hide:
  - toc
---

<style>
  .md-content__inner > h1 { display: none; }
</style>

<div class="soc-hero">

# 📁 Case Study: First Shift

<div class="soc-pill-row" style="margin-bottom: 1.2rem;">
  <span class="soc-pill">🕵️ SOC Level 1</span>
  <span class="soc-pill">🔥 Phishing Analysis</span>
  <span class="soc-pill">📝 Splunk</span>
</div>

<span class="soc-muted">
A structured investigation into suspicious authentication events and phishing activity. This case focuses on validating alerts, decoding malicious payloads, and reconstructing the attack timeline.
</span>

<div class="soc-hero-metrics">
  <div class="soc-metric">
    <div class="soc-metric-num">Event ID</div>
    <div class="soc-metric-label">Suspicious<br/>Auth</div>
  </div>
  <div class="soc-metric">
    <div class="soc-metric-num">Vector</div>
    <div class="soc-metric-label">Email<br/>Phishing</div>
  </div>
  <div class="soc-metric">
    <div class="soc-metric-num">Tools</div>
    <div class="soc-metric-label">Splunk, EDR<br/>& Wireshark</div>
  </div>
</div>

</div>

!!! quote "⚠️ Incident Briefing"
    **Role:** Junior Security Analyst
    
    You have received alerts regarding multiple failed login attempts followed by a successful login from an unusual location. Simultaneously, users are reporting suspicious emails. Your goal is to **correlate these events**, determine if an account was compromised, and identify the attacker's infrastructure.

---

### 📂 Task Command Center

<div class="scene">
  <div class="carousel-3d">

    <div class="carousel-cell">
      <a href="task-3-probably-just-fine/" class="soc-card-link">
        <div class="soc-card soc-case soc-accent-blue">
          <div class="soc-card-body">
            <div class="soc-card-title">Task 3: Auth Triage</div>
            <div class="soc-card-desc">Investigate brute-force attempts.</div>
          </div>
          <div class="soc-pill-row">
            <span class="soc-pill">VPN Logs</span>
          </div>
        </div>
      </a>
    </div>

    <div class="carousel-cell">
      <a href="task-4-phishing-books/" class="soc-card-link">
        <div class="soc-card soc-case soc-accent-green">
          <div class="soc-card-body">
            <div class="soc-card-title">Task 4: Phishing Books</div>
            <div class="soc-card-desc">Analyze malicious payloads.</div>
          </div>
          <div class="soc-pill-row">
            <span class="soc-pill">CyberChef</span>
          </div>
        </div>
      </a>
    </div>

    <div class="carousel-cell">
      <a href="task-5-Portal-Drop/" class="soc-card-link">
        <div class="soc-card soc-case soc-accent-purple">
          <div class="soc-card-body">
            <div class="soc-card-title">Task 5: Portal Drop</div>
            <div class="soc-card-desc">Web shell analysis & DB exfiltration.</div>
          </div>
          <div class="soc-pill-row">
            <span class="soc-pill">EDR Analysis</span>
            <span class="soc-pill">Web Logs</span>
          </div>
        </div>
      </a>
    </div>

    <div class="carousel-cell">
      <a href="task-6-Zero-Tolerance/" class="soc-card-link">
        <div class="soc-card soc-case soc-accent-orange">
          <div class="soc-card-body">
            <div class="soc-card-title">Task 6: Zero Tolerance</div>
            <div class="soc-card-desc">Lateral movement & C2 analysis.</div>
          </div>
          <div class="soc-pill-row">
            <span class="soc-pill">Mimikatz</span>
            <span class="soc-pill">Splunk</span>
          </div>
        </div>
      </a>
    </div>

    <div class="carousel-cell">
      <a href="task-7-The-Crown-Jewel/" class="soc-card-link">
        <div class="soc-card soc-case soc-accent-red">
          <div class="soc-card-body">
            <div class="soc-card-title">Task 7: Crown Jewel</div>
            <div class="soc-card-desc">ARP Spoofing & DNS Exfil.</div>
          </div>
          <div class="soc-pill-row">
            <span class="soc-pill">Wireshark</span>
            <span class="soc-pill">Network Ops</span>
          </div>
        </div>
      </a>
    </div>

    <div class="carousel-cell">
      <a href="task-8-promotion-night/" class="soc-card-link">
        <div class="soc-card soc-case soc-accent-cyan">
          <div class="soc-card-body">
            <div class="soc-card-title">Task 8: Promotion</div>
            <div class="soc-card-desc">Final incident report & remediation.</div>
          </div>
          <div class="soc-pill-row">
            <span class="soc-pill">Incident Response</span>
            <span class="soc-pill">Reporting</span>
          </div>
        </div>
      </a>
    </div>

  </div>
</div>

<div class="carousel-controls">
  <button class="soc-btn" id="prevBtn">← Rotate Left</button>
  <button class="soc-btn" id="nextBtn">Rotate Right →</button>
</div>

<br>
<center><small style="opacity: 0.5;">Select a task above to view the detailed evidence log.</small></center>