---
hide:
  - toc
---

<div class="soc-hero">

# 🕵️ Task 3: Probably Just Fine?

<div class="soc-pill-row" style="margin-bottom: 1.2rem;">
  <span class="soc-pill">Event ID: VPN-Login</span>
  <span class="soc-pill">Tactic: Defense Evasion</span>
  <span class="soc-pill">Malware: LummaStealer</span>
</div>

<span class="soc-muted">
Investigating a "traveling user" alert that turned into a full malware infrastructure discovery. We move from verifying an IP address to identifying a global infostealer campaign.
</span>

</div>

!!! failure "🚨 Security Alert: Unusual VPN Activity"
    **Trigger:** An internal SOC alert flagged an **unusual VPN login** for a corporate user.
    
    **Initial Assessment:** Context suggested the user might be traveling. However, standard procedure requires validating the source IP before dismissing it as benign.
    
    **Investigation Goal:** Determine if the IP belongs to a legitimate ISP (hotel/airport) or a hosting provider (VPS/Proxy) often used by attackers.

---

## 🔎 Phase 1: Infrastructure Analysis

We began by analyzing the source IP address to determine its ownership and reputation.

=== "Intel Query"
    **Action:** Enriched the IP address using internal threat intelligence tools to identify the Autonomous System Number (ASN) and service type.

=== "Findings"
    !!! tip "Result: Suspicious Infrastructure"
        * **ASN:** `212238`
        * **Service Type:** **VPN / Hosting Service**
        
        **Assessment:** While VPNs can be legitimate, adversaries frequently rent VPS infrastructure to anonymize their location. This **contradicts** the "hotel wifi" theory and warrants deeper investigation.

---

## 🦠 Phase 2: Malware Analysis

We pivoted to a suspicious binary found on the user's machine to see if it correlated with the VPN activity.

=== "File Artifacts"
    * **Filename:** `zY9sqWs.exe`
    * **File Type:** Windows PE Executable (GUI)
    * **Verdict:** **Malicious (57/71 Vendors)**

=== "Evidence Snapshot"
    ![File Hash Analysis](./assets/task-3/Task%201%20-%201.png)

=== "Classification"
    **Microsoft Detection:** `Trojan:Win32/LummaStealer.PM!MTB`
    
    **Assessment:** **LummaStealer** is a known infostealer malware family designed to harvest credentials, crypto wallets, and browser cookies. This confirms the machine is compromised.

---

## 🌐 Phase 3: Threat Intelligence & Attribution

To understand the scope of the attack, we looked for connections to broader campaigns.

### 1. YARA & Infrastructure Clustering
Using the file hash, we identified a YARA rule by author **kevoreilly** that flagged the binary.

* **Rule Logic:** `uint16(0) == 0x5a4d` (Confirms valid PE header)
* **Infrastructure:** Analysis of TLS certificates linked to the command-and-control (C2) domain revealed **151 other domains** sharing the same certificate. This indicates a large-scale, organized campaign.

### 2. Affiliate Network
External reporting ("*Behind the Curtain: How Lumma Affiliates Operate*") linked this specific sample to a known affiliate group.

* **Collaborators:** The malware author began working with the **GhostSocks** team in early 2024.
* **Cross-Platform Threat:** A Mexican-based affiliate in this network was also observed using **CraxsRAT** to target Android devices, showing the group's capability to pivot between mobile and desktop targets.

---

## 🗺️ MITRE ATT&CK Mapping

We mapped the adversary's use of rented infrastructure to the MITRE framework to improve future detection.

<div class="soc-grid">
  <div class="soc-card soc-case">
    <div class="soc-card-body">
      <div class="soc-card-title soc-accent-orange">T1583.003: Acquire Infrastructure</div>
      <div class="soc-card-desc">
        Adversaries buy Virtual Private Servers (VPS) to host C2 protocols.
      </div>
      <div class="soc-pill-row">
        <span class="soc-pill">Resource Development</span>
        <span class="soc-pill">PRE-ATT&CK</span>
      </div>
    </div>
  </div>
</div>

![MITRE ATT&CK Mapping](./assets/task-3/Task%201-%209.png)

---

## 🛡️ Case Verdict

<div class="soc-grid">
  <div class="soc-card soc-case soc-accent-red">
    <div class="soc-card-body">
      <div class="soc-card-title">Confirmed Compromise</div>
      <ul>
        <li><strong>Malware:</strong> LummaStealer (Infostealer)</li>
        <li><strong>Vector:</strong> Compromised VPN Credentials via Malware</li>
        <li><strong>Actor:</strong> Lumma Affiliate Network (GhostSocks link)</li>
      </ul>
    </div>
  </div>

  <div class="soc-card soc-case soc-accent-green">
    <div class="soc-card-body">
      <div class="soc-card-title">Remediation Steps</div>
      <ul>
        <li>Isolate the host machine immediately.</li>
        <li>Reset all corporate credentials (assume theft).</li>
        <li>Block ASN 212238 and related TLS fingerprints.</li>
      </ul>
    </div>
  </div>
</div>

<br>
<center>
  <a href="../" class="soc-btn">← Back to Case File</a>
  <a href="../task-4-phishing-books/" class="soc-btn soc-btn-secondary">Next: Task 4 (Phishing) →</a>
</center>