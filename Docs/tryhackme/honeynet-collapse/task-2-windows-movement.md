---
hide:
  - toc
---

<div class="soc-hero">

# 🪟 Task 2: Elevating Movement

<div class="soc-pill-row" style="margin-bottom: 1.2rem;">
  <span class="soc-pill">Event ID: 1149</span>
  <span class="soc-pill">Tactic: Lateral Movement</span>
  <span class="soc-pill">Malware: Meterpreter</span>
</div>

<span class="soc-muted">
Tracing the attacker's pivot from the Linux server to the internal Windows Domain Controller. We investigate RDP access, binary replacement for persistence, and credential dumping.
</span>

</div>

!!! failure "🚨 Security Alert: Domain Compromise"
    **Trigger:** Valid Account abuse via RDP followed by suspicious service installation.
    
    **Initial Assessment:** The attacker used credentials stolen from the Linux server to move laterally to the Windows environment (`172.16.8.216`).
    
    **Investigation Goal:** Identify the malware used for privilege escalation and the method used to dump domain credentials.

---

## 🚪 Phase 1: Ingress (RDP Access)

The attacker verified the Windows target IP during their Linux reconnaissance. We checked the Windows Event Logs for incoming Remote Desktop connections.

=== "Event Viewer"
    **Action:** filtering for **Event ID 1149** (Remote Desktop Services - User Authentication Succeeded) in the `TerminalServices-RemoteConnectionManager` log.
    
    ![RDP Login Log](./assets/task-2/task%202-1.png)

=== "Findings"
    !!! tip "Result: Valid Account Abuse"
        **Observation:** A successful RDP authentication occurred for the user `emily.ross` originating from the Linux server subnet.
        
        **Question:** When did the attacker perform RDP login on the server?
        
        **Answer:** `2025-06-30 16:33:18`

---

## 🛠️ Phase 2: Persistence & Privilege Escalation

Once inside, the attacker replaced a legitimate binary to maintain access and escalate privileges. We analyzed PowerShell transcripts to find the modified file.

=== "PowerShell Transcript"
    **Action:** Reviewing transcript logs revealed the execution of a suspicious executable located in a user's Documents folder.
    
    ![PowerShell Transcript](./assets/task-2/task%202-2.png)

=== "Artifact Analysis"
    **Question:** What is the full path to the binary that was replaced for persistence and privesc?
    
    **Evidence:** The transcript shows the "Host Application" pointing to a tool masquerading as Sysinternals Coreinfo.
    
    **Answer:** `C:\Users\emily.ross\Documents\Coreinfo64.exe`

---

## 🦠 Phase 3: Malware Identification

We needed to determine if `Coreinfo64.exe` was legitimate or malicious. We generated its hash and checked it against threat intelligence databases.

=== "Hash Calculation"
    **Action:** Using `Get-FileHash` to generate the MD5 fingerprint of the binary.
    
    ![File Hash](./assets/task-2/task%202-3.png)

=== "Threat Intel"
    **Question:** What is the type or malware family of the replaced binary?
    
    **Evidence:** Community detection rules identify the sample as a **Meterpreter Stager**, a payload often used with the Metasploit Framework.
    
    ![VirusTotal Scan](./assets/task-2/task%202-4.png)
    
    **Answer:** `Meterpreter`

---

## 🔓 Phase 4: Credential Dumping

With high privileges secured via Meterpreter, the attacker attempted to dump system credentials. We found obfuscated commands in the PowerShell logs.

=== "Encoded Command"
    **Action:** We identified a `base64` encoded string executed via `IEX` (Invoke-Expression).
    
    ![Encoded Command](./assets/task-2/task%202-5.png)

=== "Decoding"
    **Question:** Which full command line was used to dump the OS credentials?
    
    **Evidence:** Decoding the string reveals the use of `pcd.exe` (likely a renamed ProcDump tool) to dump the LSASS memory process.
    
    ![CyberChef Decoding](./assets/task-2/task%202-6.png)
    
    **Answer:** `pcd.exe /accepteula -ma lsass.exe text.txt`

---

## 🔄 Phase 5: Lateral Movement

Finally, we tracked the attacker's movement deeper into the network using the stolen credentials.

=== "Registry Forensics"
    **Action:** We analyzed the Registry for evidence of **PsExec** execution (`PSEXESVC`), a common tool for lateral movement.
    
    ![Registry Explorer](./assets/task-2/task%202-7.png)

=== "Timeline Analysis"
    **Question:** Using the stolen credentials, when did the attacker perform lateral movement?
    
    **Evidence:** The `Last Write Timestamp` of the `PSEXESVC` service key indicates exactly when the tool was executed.
    
    **Answer:** `2025-06-30 19:47:14`

---

## 🛡️ Case Verdict

<div class="soc-grid">
  <div class="soc-card soc-case soc-accent-red">
    <div class="soc-card-body">
      <div class="soc-card-title">Compromise Summary</div>
      <ul>
        <li><strong>Method:</strong> RDP via Stolen Creds</li>
        <li><strong>Malware:</strong> Meterpreter (Coreinfo64.exe)</li>
        <li><strong>Dumped Hash:</strong> <code>eb3d2de2f21b31933fb4a4fd7a7d314d</code></li>
      </ul>
    </div>
  </div>

  <div class="soc-card soc-case soc-accent-green">
    <div class="soc-card-body">
      <div class="soc-card-title">Investigation Status</div>
      <div class="soc-card-desc">
        The attacker has dumped the password for <strong>matthew.collins</strong>. We must now investigate the memory forensics to see what else they injected.
      </div>
    </div>
  </div>
</div>

<br>
<center>
  <a href="../task-1-initial-access/" class="soc-btn">← Previous: Task 1</a>
  <a href="../task-3-memory-forensics/" class="soc-btn soc-btn-secondary">Next: Task 3 (Memory Forensics) →</a>
</center>