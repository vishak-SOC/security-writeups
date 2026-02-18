---
hide:
  - toc
---

<div class="soc-hero">

# 🍎 Task 6: MacOS Forensics

<div class="soc-pill-row" style="margin-bottom: 1.2rem;">
  <span class="soc-pill">Tool: Plistutil / Sqlite3</span>
  <span class="soc-pill">Tactic: Collection</span>
  <span class="soc-pill">Technique: TCC Bypass</span>
</div>

<span class="soc-muted">
Investigating the MacBook of the CEO. We analyze Safari artifacts, Installation receipts, and the TCC database to track data exfiltration on macOS.
</span>

</div>

!!! failure "🚨 Security Alert: Suspicious macOS Activity"
    **Trigger:** Endpoint detection flagged an unsigned installer requesting broad file system permissions.
    
    **Initial Assessment:** The user downloaded a "fake" AI application which installed a persistent backdoor and exfiltrated documents to a remote server.
    
    **Investigation Goal:** Identify the source of the malware, the installation timestamp, and the persistence mechanism used.

---

## 📥 Phase 1: Delivery Vector

We began by analyzing Safari's download history (`Downloads.plist`) to identify where the malicious file came from.

=== "Safari Forensics"
    **Action:** Parsing `~/Library/Safari/Downloads.plist` to view file origin metadata.
    
    ![Safari Downloads](./assets/task-6/task%206-1.png)

=== "Findings"
    **Question 1:** What was the website from which the user downloaded the malicious application's installer?
    
    **Evidence:** The `DownloadEntryURL` field points to a suspicious internal domain simulating a software vendor.
    
    **Answer:** `developai.thm`
    
    **Question 2:** What is the name of the malicious application's installer?
    
    **Evidence:** The `DownloadEntryPath` shows the file saved to disk.
    
    **Answer:** `DevelopAIInstaller.pkg`

---

## ⏱️ Phase 2: Installation Timeline

To determine exactly when the compromise occurred, we checked the macOS package receipts.

=== "Package Receipts"
    **Action:** Parsing `/private/var/db/receipts/com.developai.app.plist` using `plistutil`.
    
    ![Install Receipt](./assets/task-6/task%206-2.png)

=== "Timestamp"
    **Question:** When was the malicious application installed in the system?
    
    **Evidence:** The `InstallDate` key provides the precise timestamp of execution.
    
    **Answer:** `2025-07-04 10:09:03`

---

## 🔓 Phase 3: Permissions (TCC)

MacOS uses TCC (Transparency, Consent, and Control) to manage permissions. We analyzed the TCC database to see what access the malware requested.

=== "TCC Database"
    **Action:** Querying `TCC.db` to view the `access` table for the malicious bundle identifier `org.aiArt.DevelopAI`.
    
    ![TCC Database](./assets/task-6/task%206-3.png)

=== "Access Requests"
    **Question:** Which TCC permission did the application request first?
    
    **Evidence:** The earliest timestamped request (at 10:10:33) corresponds to the **Desktop Folder** access.
    
    **Answer:** `kTCCServiceSystemPolicyDesktopFolder`

---

## 📡 Phase 4: Exfiltration & C2

We examined the application's internal scripts to find the exfiltration logic.

=== "Script Analysis"
    **Action:** Analyzing the bash script found within the application resources revealed the C2 server.
    
    ![Malicious Script](./assets/task-6/task%206-4.png)

=== "C2 Infrastructure"
    **Question:** What is the full C2 URL to which the application exfiltrated data?
    
    **Evidence:** The variable `LR` defines the remote server receiving the stolen data via `curl` POST requests.
    
    **Answer:** `http://c7.macos-updatesupport.info:8080`

---

## 🔄 Phase 5: Persistence

Finally, we identified how the malware ensured it would run every time the user logged in.

=== "Launch Agents"
    **Action:** Listing the contents of `~/Library/LaunchAgents/` revealed a suspicious property list and script.
    
    ![LaunchAgent](./assets/task-6/task%206-5.png)

=== "Mechanism"
    **Question:** Which persistence mechanism did the application use?
    
    **Evidence:** The presence of a `.plist` file in `Library/LaunchAgents` confirms the persistence method.
    
    **Answer:** `LaunchAgent`

---

## 🏁 Operation Complete

<div class="soc-grid">
  <div class="soc-card soc-case soc-accent-green">
    <div class="soc-card-body">
      <div class="soc-card-title">🎉 Mission Accomplished</div>
      <div class="soc-card-desc">
        Excellent work, Analyst. You have successfully reconstructed the entire attack chain:
      </div>
      <ul>
        <li><strong>Linux:</strong> SSH Brute Force & Web Shell</li>
        <li><strong>Windows:</strong> Lateral Movement & Ransomware</li>
        <li><strong>MacOS:</strong> Data Exfiltration & Spyware</li>
      </ul>
    </div>
  </div>
</div>

<br>
<center>
  <a href="../task-5-file-system/" class="soc-btn">← Previous: Task 5</a>
  <a href="../" class="soc-btn soc-btn-secondary">Return to Dashboard 🏠</a>
</center>