---
hide:
  - toc
---

<div class="soc-hero">

# 🧠 Task 3: Lost in RAMslation

<div class="soc-pill-row" style="margin-bottom: 1.2rem;">
  <span class="soc-pill">Tool: Volatility 3</span>
  <span class="soc-pill">Tactic: Process Injection</span>
  <span class="soc-pill">Technique: Rundll32 Proxy Execution</span>
</div>

<span class="soc-muted">
Analysing the RAM image of the compromised Windows server. I tracked the malware execution chain from a malicious DLL load to shellcode injection in a legitimate process.
</span>

</div>

!!! abstract "Summary"
    **What happened:** `rundll32.exe` (PID 2928) ran `C:\Windows\Tasks\MicrosoftUpdate.dll` through its `RunMe` export. The DLL launched `security-update.exe`, which injected Meterpreter shellcode into `notepad.exe` (PID 836). PowerShell on the host then held an RDP connection to `172.16.2.9`.

    **Impact:** Hidden Meterpreter session in memory and a new lateral movement target.

    **Key IOCs:** `MicrosoftUpdate.dll` · `security-update.exe` · shellcode starting `fc4889ce48` · `172.16.2.9:3389`

!!! failure "🚨 Security Alert: In-Memory Threat Detected"
    **Trigger:** Suspicious process relationships and network connections identified in memory dump `SRV-DMZ-GW-evidence.mem`.
    
    **Initial Assessment:** The attacker used `rundll32.exe` to execute a malicious payload, which then injected shellcode into a legitimate process (`notepad.exe`) to hide its activity.
    
    **Investigation Goal:** Extract the malware configuration, identify the injected shellcode, and determine the next lateral movement target.

---

## 🔎 Phase 1: Initial Execution Vector

I began with the process tree (`windows.pstree`) to identify the parent process responsible for the infection.

=== "Process Tree"
    **Action:** filtering for suspicious parent-child relationships using `vol -f ... windows.pstree`.
    
    ![Volatility Pstree](./assets/task-3/task%203-1.png)

=== "Artifact Analysis"
    **Evidence:** The process `rundll32.exe` (PID 2928) was loading a DLL from `C:\Windows\Tasks`, a legacy scheduled-task folder that normal users can write to and that no real DLL lives in.
    
    **Finding:** `C:\Windows\Tasks\MicrosoftUpdate.dll`
    
    **Finding:** `2928`

---

## 💻 Phase 2: Command Line Forensics

To understand *how* the DLL was run, I extracted the full command line arguments using the `windows.cmdline` plugin.

=== "Command Extraction"
    **Action:** Analyzing the arguments passed to PID 2928.
    
    ![Volatility Cmdline](./assets/task-3/task%203-2.png)

=== "Findings"
    **Evidence:** The attacker used the specific entry point `RunMe` to trigger the malicious code within the DLL.
    
    **Finding:** `rundll32.exe C:\windows\tasks\MicrosoftUpdate.dll, RunMe`

---

## ⛓️ Phase 3: The Execution Chain

Following the malware further, I saw it spawn a chain of child processes, ending in a process that looks harmless.

=== "Process Chain"
    **Action:** Following the tree: `rundll32.exe` -> `security-update.exe` -> `notepad.exe`.
    
    ![Process Chain](./assets/task-3/task%203-3.png)

=== "Final Payload"
    **Evidence:** The malware ultimately injected itself into `notepad.exe` (PID 836) to blend in with normal user activity.
    
    **Finding:** `notepad.exe`

---

## 💉 Phase 4: Shellcode Analysis

I used `windows.malfind` to look for injected code: private memory that is both writable and executable (`PAGE_EXECUTE_READWRITE`) and not backed by a file on disk.

=== "Memory Dump"
    **Action:** Inspecting the memory space of `notepad.exe` revealed a suspicious executable segment.
    
    ![Malfind Shellcode](./assets/task-3/task%203-4.png)

=== "Hex Analysis"
    **Evidence:** The region starts with `fc 48 89 ce 48`. `fc` is the `CLD` instruction, the usual first byte of Metasploit x64 shellcode, and `48 89 ce` is `mov rsi, rcx`. Executable code at the start of a non-file-backed region in `notepad.exe` confirms the injection.
    
    **Finding:** `fc4889ce48`

---

## 🌐 Phase 5: Lateral Movement Tracking

Finally, I used `windows.netscan` to see if the malware established any active network connections.

=== "Network Connections"
    **Action:** Filtering for established connections, specifically on RDP ports (3389).
    
    ![Netscan RDP](./assets/task-3/task%203-5.png)

=== "Listening Ports"
    **Action:** I also checked for listening ports to see if the malware was waiting for incoming connections.
    
    ![Netscan Listening](./assets/task-3/task%203-6.png)

=== "Target Identification"
    **Evidence:** An `ESTABLISHED` connection to port 3389 on a new internal IP was owned by `powershell.exe`. RDP sessions normally come from `mstsc.exe`, so PowerShell holding this connection points to tunnelling or port forwarding by the attacker.
    
    **Finding:** `172.16.2.9`

---

## 🔔 Detection Opportunities

!!! example "Detections I would add"
    These are example queries; index and field names depend on your environment.

    === "rundll32 loading from odd folders"
        ```yaml
        title: Rundll32 loading DLL from user-writable folder
        logsource: { product: windows, category: process_creation }
        detection:
          selection:
            Image|endswith: '\rundll32.exe'
            CommandLine|contains:
              - '\Windows\Tasks\'
              - '\AppData\'
              - '\Temp\'
          condition: selection
        level: high
        ```

    === "notepad.exe making network connections"
        ```spl
        index=sysmon EventCode=3 Image="*\\notepad.exe"
        | table _time host Image DestinationIp DestinationPort
        ```
        Notepad has no reason to talk to the network; a connection is a strong injection signal.

    === "PowerShell on port 3389"
        ```spl
        index=sysmon EventCode=3 DestinationPort=3389 Image="*\\powershell.exe"
        | table _time host User DestinationIp
        ```

---

## 🛡️ Case Verdict

<div class="soc-grid">
  <div class="soc-card soc-case soc-accent-red">
    <div class="soc-card-body">
      <div class="soc-card-title">Memory Findings</div>
      <ul>
        <li><strong>Payload:</strong> <code>C:\Windows\Tasks\MicrosoftUpdate.dll</code> via <code>rundll32</code> (T1218.011)</li>
        <li><strong>Chain:</strong> rundll32.exe &rarr; security-update.exe &rarr; notepad.exe</li>
        <li><strong>Injection:</strong> Meterpreter shellcode in notepad.exe, PID 836 (T1055)</li>
        <li><strong>Next Hop:</strong> RDP to <code>172.16.2.9</code></li>
      </ul>
    </div>
  </div>

  <div class="soc-card soc-case soc-accent-green">
    <div class="soc-card-body">
      <div class="soc-card-title">Remediation & Next Steps</div>
      <div class="soc-card-desc">
        Isolate the server, remove the DLL and <code>security-update.exe</code>, and block outbound connections from it. The attacker moved on to <strong>172.16.2.9</strong>, so that host's disk is analysed next.
      </div>
    </div>
  </div>
</div>

<br>
<center>
  <a href="../task-2-windows-movement/" class="soc-btn">← Previous: Task 2</a>
  <a href="../task-4-disk-forensics/" class="soc-btn soc-btn-secondary">Next: Task 4 (Disk Analysis) →</a>
</center>