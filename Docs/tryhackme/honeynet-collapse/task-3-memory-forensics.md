---
hide:
  - toc
---

<div class="soc-hero">

# 🧠 Task 3: Lost in RAMslation

<div class="soc-pill-row" style="margin-bottom: 1.2rem;">
  <span class="soc-pill">Tool: Volatility 3</span>
  <span class="soc-pill">Tactic: Process Injection</span>
  <span class="soc-pill">Technique: DLL Proxying</span>
</div>

<span class="soc-muted">
Analyzing the captured RAM image of the compromised Windows server. We track the malware execution chain from a malicious DLL load to shellcode injection in a legitimate process.
</span>

</div>

!!! failure "🚨 Security Alert: In-Memory Threat Detected"
    **Trigger:** Suspicious process relationships and network connections identified in memory dump `SRV-DMZ-GW-evidence.mem`.
    
    **Initial Assessment:** The attacker used `rundll32.exe` to execute a malicious payload, which then hollowed out a legitimate system process (`notepad.exe`) to hide its activity.
    
    **Investigation Goal:** Extract the malware configuration, identify the injected shellcode, and determine the next lateral movement target.

---

## 🔎 Phase 1: Initial Execution Vector

We began by inspecting the process tree (`windows.pstree`) to identify the parent process responsible for the infection.

=== "Process Tree"
    **Action:** filtering for suspicious parent-child relationships using `vol -f ... windows.pstree`.
    
    ![Volatility Pstree](./assets/task-3/task%203-1.png)

=== "Artifact Analysis"
    **Question 1:** What is the absolute path to the initial malicious file executed on this host?
    
    **Evidence:** The process `rundll32.exe` (PID 2928) was observed loading a suspicious DLL from a scheduled task folder.
    
    **Answer:** `C:\Windows\Tasks\MicrosoftUpdate.dll`
    
    **Question 2:** Which process ID (PID) was assigned to the process used to execute the initial payload?
    
    **Answer:** `2928`

---

## 💻 Phase 2: Command Line Forensics

To understand *how* the DLL was executed, we extracted the full command line arguments using the `windows.cmdline` plugin.

=== "Command Extraction"
    **Action:** Analyzing the arguments passed to PID 2928.
    
    ![Volatility Cmdline](./assets/task-3/task%203-2.png)

=== "Findings"
    **Question:** What was the full command line used by the attacker to launch initial execution on this host?
    
    **Evidence:** The attacker used the specific entry point `RunMe` to trigger the malicious code within the DLL.
    
    **Answer:** `rundll32.exe C:\windows\tasks\MicrosoftUpdate.dll, RunMe`

---

## ⛓️ Phase 3: The Execution Chain

Tracing the malware further, we observed it spawning new child processes to evade detection.

=== "Process Chain"
    **Action:** Following the tree: `rundll32.exe` -> `security-update.exe` -> `notepad.exe`.
    
    ![Process Chain](./assets/task-3/task%203-3.png)

=== "Final Payload"
    **Question:** The attack launched various processes. What is the name of the final process in the chain?
    
    **Evidence:** The malware ultimately injected itself into `notepad.exe` (PID 836) to blend in with normal user activity.
    
    **Answer:** `notepad.exe`

---

## 💉 Phase 4: Shellcode Analysis

We used `windows.malfind` to scan for injected code segments (memory pages with `PAGE_EXECUTE_READWRITE` permissions).

=== "Memory Dump"
    **Action:** Inspecting the memory space of `notepad.exe` revealed a suspicious executable segment.
    
    ![Malfind Shellcode](./assets/task-3/task%203-4.png)

=== "Hex Analysis"
    **Question:** What are the first five bytes (in hex, e.g., 4d5a9000) of the Meterpreter shellcode injected into it?
    
    **Evidence:** The hex dump starts with `fc 48 89 ce 48`. This is a classic signature for x64 shellcode prologues.
    
    **Answer:** `fc4889ce48`

---

## 🌐 Phase 5: Lateral Movement Tracking

Finally, we used `windows.netscan` to see if the malware established any active network connections.

=== "Network Connections"
    **Action:** Filtering for established connections, specifically on RDP ports (3389).
    
    ![Netscan RDP](./assets/task-3/task%203-5.png)

=== "Listening Ports"
    **Action:** We also checked for listening ports to see if the malware was waiting for incoming connections.
    
    ![Netscan Listening](./assets/task-3/task%203-6.png)

=== "Target Identification"
    **Question:** Which is the IP address that the hosts perform a lateral movement using port 3389?
    
    **Evidence:** An active `ESTABLISHED` RDP connection was found initiated by `powershell.exe` to a new internal IP.
    
    **Answer:** `172.16.2.9`

---

## 🛡️ Case Verdict

<div class="soc-grid">
  <div class="soc-card soc-case soc-accent-red">
    <div class="soc-card-body">
      <div class="soc-card-title">Memory Findings</div>
      <ul>
        <li><strong>Payload:</strong> MicrosoftUpdate.dll (Malicious)</li>
        <li><strong>Technique:</strong> Process Injection (Notepad)</li>
        <li><strong>Injection Type:</strong> Meterpreter Shellcode</li>
      </ul>
    </div>
  </div>

  <div class="soc-card soc-case soc-accent-green">
    <div class="soc-card-body">
      <div class="soc-card-title">Investigation Status</div>
      <div class="soc-card-desc">
        The attacker has moved laterally to <strong>172.16.2.9</strong>. We must now switch to Disk Forensics to recover deleted data.
      </div>
    </div>
  </div>
</div>

<br>
<center>
  <a href="../task-2-windows-movement/" class="soc-btn">← Previous: Task 2</a>
  <a href="../task-4-disk-forensics/" class="soc-btn soc-btn-secondary">Next: Task 4 (Disk Analysis) →</a>
</center>