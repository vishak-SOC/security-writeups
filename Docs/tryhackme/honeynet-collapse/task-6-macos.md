---
hide:
  - toc
---

<div class="soc-hero">

# 🍎 Task 6: MacOS Forensics

<div class="soc-pill-row" style="margin-bottom: 1.2rem;">
  <span class="soc-pill">Tool: Plistutil / Sqlite3</span>
  <span class="soc-pill">Tactic: Collection</span>
  <span class="soc-pill">Persistence: LaunchAgent</span>
</div>

<span class="soc-muted">
Investigating the CEO's MacBook. I analysed Safari artefacts, installer receipts and the TCC database to track data theft on macOS.
</span>

</div>

!!! abstract "Summary"
    **What happened:** On 2025-07-04 the CEO installed `DevelopAIInstaller.pkg` from `developai.thm`. The fake app asked for TCC access to the Desktop folder first, used a bash script to POST files to `c7.macos-updatesupport.info:8080` with curl, and added a LaunchAgent so it runs at every login.

    **Impact:** Ongoing theft of the CEO's files.

    **Key IOCs:** `developai.thm` · `DevelopAIInstaller.pkg` · bundle ID `org.aiArt.DevelopAI` · `c7.macos-updatesupport.info:8080`

!!! failure "🚨 Security Alert: Suspicious macOS Activity"
    **Trigger:** Endpoint detection flagged an unsigned installer requesting broad file system permissions.
    
    **Initial Assessment:** The user downloaded a "fake" AI application which installed a persistent backdoor and exfiltrated documents to a remote server.
    
    **Investigation Goal:** Identify the source of the malware, the installation timestamp, and the persistence mechanism used.

---

## 📥 Phase 1: Delivery Vector

I began with Safari's download history (`Downloads.plist`) to identify where the malicious file came from.

=== "Safari Forensics"
    **Action:** Parsing `~/Library/Safari/Downloads.plist` to view file origin metadata.
    
    ![Safari Downloads](./assets/task-6/task%206-1.png)

=== "Findings"
    **Evidence:** The `DownloadEntryURL` field points to a suspicious internal domain simulating a software vendor.
    
    **Finding:** `developai.thm`
    
    **Evidence:** The `DownloadEntryPath` shows the file saved to disk.
    
    **Finding:** `DevelopAIInstaller.pkg`

---

## ⏱️ Phase 2: Installation Timeline

To find exactly when the compromise happened, I checked the macOS package receipts.

=== "Package Receipts"
    **Action:** Parsing `/private/var/db/receipts/com.developai.app.plist` using `plistutil`.
    
    ![Install Receipt](./assets/task-6/task%206-2.png)

=== "Timestamp"
    **Evidence:** The `InstallDate` key records exactly when the package was installed.
    
    **Finding:** `2025-07-04 10:09:03`

---

## 🔓 Phase 3: Permissions (TCC)

macOS uses TCC (Transparency, Consent and Control) to control which apps can reach private folders. I queried the TCC database to see what access the malware asked for. No bypass was needed: the app simply asked, and the user clicked Allow.

=== "TCC Database"
    **Action:** Querying `TCC.db` to view the `access` table for the malicious bundle identifier `org.aiArt.DevelopAI`.
    
    ![TCC Database](./assets/task-6/task%206-3.png)

=== "Access Requests"
    **Evidence:** The earliest timestamped request (at 10:10:33) corresponds to the **Desktop Folder** access.
    
    **Finding:** `kTCCServiceSystemPolicyDesktopFolder`

---

## 📡 Phase 4: Exfiltration & C2

I examined the application's internal scripts to find the exfiltration logic.

=== "Script Analysis"
    **Action:** Analyzing the bash script found within the application resources revealed the C2 server.
    
    ![Malicious Script](./assets/task-6/task%206-4.png)

=== "C2 Infrastructure"
    **Evidence:** The variable `LR` defines the remote server receiving the stolen data via `curl` POST requests.
    
    **Finding:** `http://c7.macos-updatesupport.info:8080`

---

## 🔄 Phase 5: Persistence

Finally, I identified how the malware ensured it would run every time the user logged in.

=== "Launch Agents"
    **Action:** Listing the contents of `~/Library/LaunchAgents/` revealed a suspicious property list and script.
    
    ![LaunchAgent](./assets/task-6/task%206-5.png)

=== "Mechanism"
    **Evidence:** The presence of a `.plist` file in `Library/LaunchAgents` confirms the persistence method.
    
    **Finding:** `LaunchAgent`

---

## 🔔 Detection Opportunities

!!! example "Detections I would add"
    These are example queries; index and field names depend on your environment.

    === "New LaunchAgent"
        ```yaml
        title: LaunchAgent plist created by non-Apple process
        logsource: { product: macos, category: file_event }
        detection:
          selection:
            TargetFilename|contains: '/Library/LaunchAgents/'
            TargetFilename|endswith: '.plist'
          condition: selection
        level: medium
        ```

    === "Script uploading files with curl"
        ```yaml
        title: curl uploading files from a macOS shell script
        logsource: { product: macos, category: process_creation }
        detection:
          selection:
            Image|endswith: '/curl'
            CommandLine|contains: ['-F ', '--data-binary', '-T ']
            ParentImage|endswith: ['/bash', '/sh', '/zsh']
          condition: selection
        level: high
        ```

    === "Unexpected TCC grants"
        ```bash
        sqlite3 ~/Library/Application\ Support/com.apple.TCC/TCC.db \
          "SELECT service, client, auth_value, datetime(last_modified,'unixepoch')
           FROM access ORDER BY last_modified DESC LIMIT 20;"
        ```
        A quick hunt query: list the newest permission grants and check each app is expected.

---

## 🛡️ Case Verdict

<div class="soc-grid">
  <div class="soc-card soc-case soc-accent-red">
    <div class="soc-card-body">
      <div class="soc-card-title">macOS Findings</div>
      <ul>
        <li><strong>Delivery:</strong> Fake AI installer <code>DevelopAIInstaller.pkg</code> from <code>developai.thm</code></li>
        <li><strong>Access:</strong> User-approved TCC access to Desktop and other folders</li>
        <li><strong>Exfiltration:</strong> curl POSTs to <code>c7.macos-updatesupport.info:8080</code></li>
        <li><strong>Persistence:</strong> LaunchAgent in <code>~/Library/LaunchAgents</code></li>
      </ul>
    </div>
  </div>

  <div class="soc-card soc-case soc-accent-green">
    <div class="soc-card-body">
      <div class="soc-card-title">Remediation</div>
      <ul>
        <li>Remove the app and LaunchAgent, and reset its TCC grants with <code>tccutil reset All org.aiArt.DevelopAI</code>.</li>
        <li>Block the C2 domain and the download site.</li>
        <li>Allow only signed, notarised apps through MDM.</li>
      </ul>
    </div>
  </div>
</div>

---

## 🏁 Full Attack Chain

<div class="soc-grid">
  <div class="soc-card soc-case soc-accent-cyan">
    <div class="soc-card-body">
      <div class="soc-card-title">Operation Honeynet Collapse: Summary</div>
      <ul>
        <li><strong>Linux:</strong> WordPress brute force &rarr; web shell &rarr; root via leaked SSH key</li>
        <li><strong>Windows:</strong> RDP with stolen credentials &rarr; Meterpreter &rarr; LSASS dump &rarr; PsExec</li>
        <li><strong>Data theft:</strong> CRM export sent to Mega with Rclone</li>
        <li><strong>Impact:</strong> BlackLock ransomware (<code>.EeUfy</code>)</li>
        <li><strong>macOS:</strong> Fake AI app stealing files from the CEO's laptop</li>
      </ul>
    </div>
  </div>
</div>

<br>
<center>
  <a href="../task-5-file-system/" class="soc-btn">← Previous: Task 5</a>
  <a href="../" class="soc-btn soc-btn-secondary">Return to Dashboard 🏠</a>
</center>