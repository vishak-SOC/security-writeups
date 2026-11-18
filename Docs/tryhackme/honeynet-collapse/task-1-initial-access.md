---
hide:
  - toc
---

<div class="soc-hero">

# 🐧 Task 1: Initial Access Pot

<div class="soc-pill-row" style="margin-bottom: 1.2rem;">
  <span class="soc-pill">Alert: WordPress Brute Force</span>
  <span class="soc-pill">Tactic: Initial Access</span>
  <span class="soc-pill">Technique: Web Shell</span>
</div>

<span class="soc-muted">
Investigating the collapse of the DeceptiTech network. I traced the attack from a brute-force entry on a Linux web server to root privilege escalation and internal network pivoting.
</span>

</div>

!!! abstract "Summary"
    **What happened:** The attacker brute-forced `/wp-login.php`, planted a web shell in the Blocksy theme's `404.php`, used an SSH key backup that low-privileged users could read (`/etc/ssh/id_ed25519.bak`) to log in as root, installed a fake `kworker` service for persistence and scanned `172.16.8.216` for SSH, HTTP and RDP.

    **Impact:** Full root compromise of the Linux web server, used as a pivot into the internal network.

    **Key IOCs:** `404.php` web shell · `/usr/sbin/kworker` (MD5 `d6f2d80e78f264aff8c7aea21acb6ca6`) · target `172.16.8.216`

!!! failure "🚨 Security Alert: Validated Breach"
    **Trigger:** Massive volume of HTTP POST requests targeting the web server, followed by suspicious root-level command execution.
    
    **Initial Assessment:** The attacker exploited weak credentials on the WordPress instance to establish a foothold before pivoting to the underlying operating system.
    
    **Investigation Goal:** Reconstruct the kill chain, from the first login attempt to the malware installation, and regain control of the compromised system.

---

## 🔎 Phase 1: Web Application Reconnaissance

I began with the web root directory to confirm the application type and identify the entry vector.

=== "Directory Analysis"
    **Action:** Listing the `/var/www/html/wordpress` directory confirmed a standard **WordPress** installation.
    
    ![WordPress Directory](./assets/task-1/task%201-1.png)

=== "Findings"
    !!! tip "Result: Brute Force Target"
        **Observation:** Access logs indicated a high frequency of POST requests targeting the login portal.
        
        **Finding:** `/wp-login.php`
        
        **Assessment:** The burst of login POSTs, followed by theme files being edited, shows the attacker got in with a guessed WordPress password.

---

## 🛡️ Phase 2: Monitoring Verification

Before digging deeper, I checked that the system was actually logging the attacker's actions.

=== "Audit Rules"
    **Action:** I inspected `/etc/audit/audit.rules` to verify that the Linux Audit Daemon (`auditd`) was active.
    
    ![Audit Verification](./assets/task-1/task%201-2.png)
    
    **Result:** Rules were properly configured to log system calls (`-k exec`), so I could trace the attacker's commands.

---

## 🐚 Phase 3: Persistence & Backdoor

After gaining administrative access to the CMS, the attacker needed a way to execute system-level commands.

=== "File Artifacts"
    **Evidence:** The command history reveals the attacker used `vim` to modify a specific theme file, injecting a web shell into the error page template.
    
    ![Backdoor Editing](./assets/task-1/task%201-3.png)
    
    **Finding:** `/var/www/html/wordpress/wp-content/themes/blocksy/404.php`

---

## 🔓 Phase 4: Privilege Escalation

The attacker entered as the `www-data` user but quickly escalated to `root`. I used the Linux audit logs (`ausearch`) to trace their steps.

=== "Step 1: Tracking User"
    **Action:** I searched for execution events linked to the suspicious user ID (`1002`) to identify the start of the escalation chain.
    
    ![ausearch Start](./assets/task-1/task%201-4.png)

=== "Step 2: Escalation Vector"
    **Evidence:** The decoded audit logs reveal the attacker found a backup SSH key, copied it to `/tmp`, changed its permissions, and used it to SSH into localhost as root.
    
    ![PrivEsc Command Trace](./assets/task-1/task%201-5.png)
    
    **Finding:** `/etc/ssh/id_ed25519.bak`

---

## 📡 Phase 5: Internal Reconnaissance

With root access secured, the attacker used the compromised server as a pivot point to scan the internal network.

=== "Bash History"
    **Action:** Reviewing `/root/.bash_history` for manual commands executed by the attacker.
    
    **Evidence:** The history shows `netcat` (`nc`) scans against ports 22, 80, and 3389 on a specific internal host.
    
    ![Bash History](./assets/task-1/task%201-6.png)
    
    **Finding:** `172.16.8.216`

---

## 🦠 Phase 6: Malware Analysis

I found a suspicious service disguised as a kernel process, used for persistence.

=== "Binary Analysis"
    **Action:** Checking `kworker.service`. Real `kworker` threads belong to the kernel and never run from a file on disk, so a `kworker` binary in `/usr/sbin/` is a clear masquerade (T1036.005).
    
    **Evidence:** Calculated the hash of the suspicious binary.
    
    ![Malware Hash](./assets/task-1/task%201-7.png)
    
    **Finding:** `d6f2d80e78f264aff8c7aea21acb6ca6`

---

## 🚩 Phase 7: Recovery

Finally, I regained control of the honeypot by running the `deceptipot` binary in recovery mode with the recovery key stored in its configuration.

!!! warning "Lesson"
    The recovery key sat in a readable config file on the same server the attacker controlled. Anyone with root could use it too; it belongs in a secrets vault.

---

## 🔔 Detection Opportunities

!!! example "Detections I would add"
    These are example queries; index and field names depend on your environment.

    === "WordPress brute force"
        ```spl
        index=web uri_path="/wp-login.php" method=POST
        | bin _time span=5m
        | stats count BY _time clientip
        | where count > 20
        ```

    === "Edits to theme PHP files"
        ```spl
        index=linux sourcetype=linux_audit type=PATH name="*/wp-content/themes/*.php"
            nametype IN ("CREATE", "NORMAL")
        | table _time auid uid exe name
        ```
        Theme files should only change during updates, never from `vim` on a live server.

    === "Binary pretending to be a kernel thread"
        ```yaml
        title: Process named kworker running from disk
        logsource: { product: linux, category: process_creation }
        detection:
          selection:
            Image|contains: 'kworker'
          condition: selection
        level: critical
        ```
        Kernel threads have no executable path, so any `kworker` process with an image path on disk is malicious.

---

## 🛡️ Case Verdict

<div class="soc-grid">
  <div class="soc-card soc-case soc-accent-red">
    <div class="soc-card-body">
      <div class="soc-card-title">Compromise Summary</div>
      <ul>
        <li><strong>Vector:</strong> WordPress Brute Force</li>
        <li><strong>Persistence:</strong> Web shell in <code>404.php</code> + fake <code>kworker.service</code></li>
        <li><strong>Escalation:</strong> Readable SSH backup key (<code>/etc/ssh/id_ed25519.bak</code>)</li>
        <li><strong>Next Hop:</strong> Port scan of <code>172.16.8.216</code></li>
      </ul>
    </div>
  </div>

  <div class="soc-card soc-case soc-accent-green">
    <div class="soc-card-body">
      <div class="soc-card-title">Remediation & Next Steps</div>
      <div class="soc-card-desc">
        Remove the web shell and fake service, delete the backup key and rotate root SSH keys, then rebuild the server. The attacker scanned <code>172.16.8.216</code> next, so the Windows server is the next host to investigate.
      </div>
    </div>
  </div>
</div>

<br>
<center>
  <a href="../" class="soc-btn">← Back to Operation Dashboard</a>
  <a href="../task-2-windows-movement/" class="soc-btn soc-btn-secondary">Next: Task 2 (Windows Triage) →</a>
</center>