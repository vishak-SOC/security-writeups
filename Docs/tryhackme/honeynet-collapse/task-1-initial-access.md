---
hide:
  - toc
---

<div class="soc-hero">

# 🐧 Task 1: Initial Access Pot

<div class="soc-pill-row" style="margin-bottom: 1.2rem;">
  <span class="soc-pill">Event ID: HTTP-Brute</span>
  <span class="soc-pill">Tactic: Initial Access</span>
  <span class="soc-pill">Technique: Web Shell</span>
</div>

<span class="soc-muted">
Investigating the collapse of the DeceptiTech network. We trace the attack from a brute-force entry on a Linux web server to root privilege escalation and internal network pivoting.
</span>

</div>

!!! failure "🚨 Security Alert: Validated Breach"
    **Trigger:** Massive volume of HTTP POST requests targeting the web server, followed by suspicious root-level command execution.
    
    **Initial Assessment:** The attacker exploited weak credentials on the WordPress instance to establish a foothold before pivoting to the underlying operating system.
    
    **Investigation Goal:** Reconstruct the kill chain—from the initial login attempt to the final malware installation—and recover the compromised system.

---

## 🔎 Phase 1: Web Application Reconnaissance

We began by analyzing the web root directory to confirm the application type and identify the entry vector.

=== "Directory Analysis"
    **Action:** Listing the `/var/www/html/wordpress` directory confirmed a standard **WordPress** installation.
    
    ![WordPress Directory](./assets/task-1/task%201-1.png)

=== "Findings"
    !!! tip "Result: Brute Force Target"
        **Observation:** Access logs indicated a high frequency of POST requests targeting the login portal.
        
        **Question:** Which web page did the attacker attempt to brute force?
        
        **Answer:** `/wp-login.php`
        
        **Assessment:** The attacker successfully guessed the administrator password.

---

## 🛡️ Phase 2: Monitoring Verification

Before digging deeper, we needed to ensure the system was actually logging the attacker's actions.

=== "Audit Rules"
    **Action:** We inspected `/etc/audit/audit.rules` to verify that the Linux Audit Daemon (`auditd`) was active.
    
    ![Audit Verification](./assets/task-1/task%201-2.png)
    
    **Result:** Rules were properly configured to log system calls (`-k exec`), ensuring we could trace the attacker's commands.

---

## 🐚 Phase 3: Persistence & Backdoor

After gaining administrative access to the CMS, the attacker needed a way to execute system-level commands.

=== "File Artifacts"
    **Question:** What is the absolute path to the backdoored PHP file?
    
    **Evidence:** The command history reveals the attacker used `vim` to modify a specific theme file, injecting a web shell into the error page template.
    
    ![Backdoor Editing](./assets/task-1/task%201-3.png)
    
    **Answer:** `/var/www/html/wordpress/wp-content/themes/blocksy/404.php`

---

## 🔓 Phase 4: Privilege Escalation

The attacker entered as the `www-data` user but quickly escalated to `root`. We used the Linux Audit system (`ausearch`) to trace their steps.

=== "Step 1: Tracking User"
    **Action:** We searched for execution events linked to the suspicious user ID (`1002`) to identify the start of the escalation chain.
    
    ![ausearch Start](./assets/task-1/task%201-4.png)

=== "Step 2: Escalation Vector"
    **Question:** Which file path allowed the attacker to escalate to root?
    
    **Evidence:** The decoded audit logs reveal the attacker found a backup SSH key, copied it to `/tmp`, changed its permissions, and used it to SSH into localhost as root.
    
    ![PrivEsc Command Trace](./assets/task-1/task%201-5.png)
    
    **Answer:** `/etc/ssh/id_ed25519.bak`

---

## 📡 Phase 5: Internal Reconnaissance

With root access secured, the attacker used the compromised server as a pivot point to scan the internal network.

=== "Bash History"
    **Action:** Reviewing `/root/.bash_history` for manual commands executed by the attacker.
    
    **Question:** Which IP was port-scanned after the privilege escalation?
    
    **Evidence:** The history shows `netcat` (`nc`) scans against ports 22, 80, and 3389 on a specific internal host.
    
    ![Bash History](./assets/task-1/task%201-6.png)
    
    **Answer:** `172.16.8.216`

---

## 🦠 Phase 6: Malware Analysis

We identified a suspicious service disguised as a kernel process to maintain persistence.

=== "Binary Analysis"
    **Action:** Checking the `kworker.service`. While `kworker` is a valid kernel name, it should not run from `/usr/sbin/`.
    
    **Question:** What is the MD5 hash of the malware persisting on the host?
    
    **Evidence:** Calculated the hash of the suspicious binary.
    
    ![Malware Hash](./assets/task-1/task%201-7.png)
    
    **Answer:** `d6f2d80e78f264aff8c7aea21acb6ca6`

---

## 🚩 Phase 7: Recovery

Finally, we utilized the administrative tools to recover control of the honeypot.

=== "System Recovery"
    **Question:** Can you access the DeceptiPot in recovery mode?
    
    **Evidence:** We executed the `deceptipot` binary with the recovery key found in the configuration (`Em1lyR0ss_DeCePti!`).
    
    ![Flag Recovery](./assets/task-1/task%201-8.png)
    
    **Flag:** `THM{acc3ss_gr4nt3d!}`

---

## 🛡️ Case Verdict

<div class="soc-grid">
  <div class="soc-card soc-case soc-accent-red">
    <div class="soc-card-body">
      <div class="soc-card-title">Compromise Summary</div>
      <ul>
        <li><strong>Vector:</strong> WordPress Brute Force</li>
        <li><strong>Persistence:</strong> Web Shell (404.php)</li>
        <li><strong>Escalation:</strong> Stolen SSH Backup Key</li>
      </ul>
    </div>
  </div>

  <div class="soc-card soc-case soc-accent-green">
    <div class="soc-card-body">
      <div class="soc-card-title">Next Steps</div>
      <div class="soc-card-desc">
        The attacker has pivoted to the internal network (172.16.8.216). We must now investigate the Windows Domain Controller.
      </div>
    </div>
  </div>
</div>

<br>
<center>
  <a href="../" class="soc-btn">← Back to Operation Dashboard</a>
  <a href="../task-2-windows-movement/" class="soc-btn soc-btn-secondary">Next: Task 2 (Windows Triage) →</a>
</center>