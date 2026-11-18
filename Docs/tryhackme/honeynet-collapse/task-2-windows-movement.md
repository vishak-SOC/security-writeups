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
Tracing the attacker's pivot from the Linux server to the internal Windows server. I investigated RDP access, a replaced binary used for persistence, and credential dumping.
</span>

</div>

!!! abstract "Summary"
    **What happened:** The attacker logged in over RDP as `emily.ross` at 2025-06-30 16:33:18, replaced `Coreinfo64.exe` with a Meterpreter stager to gain higher privileges, dumped LSASS with a renamed ProcDump (`pcd.exe`), and used the stolen credentials to move on with PsExec at 19:47:14.

    **Impact:** Privileged code execution on the Windows server and theft of cached credentials, including `matthew.collins`.

    **Key IOCs:** `C:\Users\emily.ross\Documents\Coreinfo64.exe` · `pcd.exe` · `PSEXESVC` service

!!! failure "🚨 Security Alert: Domain Compromise"
    **Trigger:** Valid Account abuse via RDP followed by suspicious service installation.
    
    **Initial Assessment:** The attacker used credentials stolen from the Linux server to move laterally to the Windows environment (`172.16.8.216`).
    
    **Investigation Goal:** Identify the malware used for privilege escalation and the method used to dump domain credentials.

---

## 🚪 Phase 1: Ingress (RDP Access)

The attacker found this Windows host during their scan from the Linux server. I checked the Windows Event Logs for incoming Remote Desktop connections.

=== "Event Viewer"
    **Action:** filtering for **Event ID 1149** (Remote Desktop Services - User Authentication Succeeded) in the `TerminalServices-RemoteConnectionManager` log.
    
    ![RDP Login Log](./assets/task-2/task%202-1.png)

=== "Findings"
    !!! tip "Result: Valid Account Abuse"
        **Observation:** A successful RDP authentication occurred for the user `emily.ross` originating from the Linux server subnet.
        
        **Finding:** `2025-06-30 16:33:18`

---

## 🛠️ Phase 2: Persistence & Privilege Escalation

Once inside, the attacker replaced a legitimate binary to keep access and escalate privileges. I analysed PowerShell transcripts to find the modified file.

=== "PowerShell Transcript"
    **Action:** Reviewing transcript logs revealed the execution of a suspicious executable located in a user's Documents folder.
    
    ![PowerShell Transcript](./assets/task-2/task%202-2.png)

=== "Artifact Analysis"
    **Evidence:** The transcript shows the "Host Application" pointing to a tool masquerading as Sysinternals Coreinfo.
    
    **Finding:** `C:\Users\emily.ross\Documents\Coreinfo64.exe`

---

## 🦠 Phase 3: Malware Identification

I needed to know whether `Coreinfo64.exe` was legitimate, so I hashed it and checked the hash against threat intelligence.

=== "Hash Calculation"
    **Action:** Using `Get-FileHash` to generate the MD5 fingerprint of the binary.
    
    ![File Hash](./assets/task-2/task%202-3.png)

=== "Threat Intel"
    **Evidence:** Community detection rules identify the sample as a **Meterpreter Stager**, a payload often used with the Metasploit Framework.
    
    ![VirusTotal Scan](./assets/task-2/task%202-4.png)
    
    **Finding:** `Meterpreter`

---

## 🔓 Phase 4: Credential Dumping

With high privileges secured via Meterpreter, the attacker dumped credentials. I found obfuscated commands in the PowerShell logs.

=== "Encoded Command"
    **Action:** I identified a Base64-encoded string executed via `IEX` (Invoke-Expression).
    
    ![Encoded Command](./assets/task-2/task%202-5.png)

=== "Decoding"
    **Evidence:** Decoding the string reveals the use of `pcd.exe` (likely a renamed ProcDump tool) to dump the LSASS memory process.
    
    ![CyberChef Decoding](./assets/task-2/task%202-6.png)
    
    **Finding:** `pcd.exe /accepteula -ma lsass.exe text.txt`

---

## 🔄 Phase 5: Lateral Movement

Finally, I tracked the attacker's movement deeper into the network with the stolen credentials.

=== "Registry Forensics"
    **Action:** I searched the SYSTEM hive for the **PsExec** service (`PSEXESVC`), a common lateral movement tool.
    
    ![Registry Explorer](./assets/task-2/task%202-7.png)

=== "Timeline Analysis"
    **Evidence:** PsExec installs the `PSEXESVC` service on the machine it connects *to*, so this key marks the attacker arriving on this host. The key's last write time is the best available timestamp for that moment (a last write time shows the latest change to the key, not every run).
    
    **Finding:** `2025-06-30 19:47:14`

---

## 🔔 Detection Opportunities

!!! example "Detections I would add"
    These are example queries; index and field names depend on your environment.

    === "LSASS dump"
        ```yaml
        title: ProcDump-style LSASS memory dump
        logsource: { product: windows, category: process_creation }
        detection:
          selection:
            CommandLine|contains|all: ['-ma', 'lsass']
          condition: selection
        level: critical
        ```
        Matches on the arguments, so renaming `procdump.exe` to `pcd.exe` does not help the attacker.

    === "Encoded PowerShell"
        ```spl
        index=wineventlog EventCode=4104
            (ScriptBlockText="*FromBase64String*" AND ScriptBlockText="*IEX*")
        | table _time host user ScriptBlockText
        ```

    === "PsExec service installed"
        ```spl
        index=wineventlog EventCode=7045 Service_Name="PSEXESVC"
        | table _time host Service_Name Service_File_Name
        ```
        Event 7045 logs every new service; PsExec creates `PSEXESVC` on each target.

---

## 🛡️ Case Verdict

<div class="soc-grid">
  <div class="soc-card soc-case soc-accent-red">
    <div class="soc-card-body">
      <div class="soc-card-title">Compromise Summary</div>
      <ul>
        <li><strong>Method:</strong> RDP via Stolen Creds</li>
        <li><strong>Malware:</strong> Meterpreter (Coreinfo64.exe)</li>
        <li><strong>Credential Dump:</strong> LSASS via renamed ProcDump (<code>pcd.exe</code>)</li>
        <li><strong>Exposed Hash:</strong> <code>eb3d2de2f21b31933fb4a4fd7a7d314d</code> (matthew.collins)</li>
        <li><strong>Lateral Movement:</strong> PsExec, 2025-06-30 19:47:14</li>
      </ul>
    </div>
  </div>

  <div class="soc-card soc-case soc-accent-green">
    <div class="soc-card-body">
      <div class="soc-card-title">Remediation & Next Steps</div>
      <div class="soc-card-desc">
        Reset <strong>emily.ross</strong> and <strong>matthew.collins</strong> (and every account whose credentials were in LSASS), restore the original Coreinfo binary, and enable LSA protection (RunAsPPL) to block LSASS dumping. Memory forensics comes next, to find what else was injected.
      </div>
    </div>
  </div>
</div>

<br>
<center>
  <a href="../task-1-initial-access/" class="soc-btn">← Previous: Task 1</a>
  <a href="../task-3-memory-forensics/" class="soc-btn soc-btn-secondary">Next: Task 3 (Memory Forensics) →</a>
</center>