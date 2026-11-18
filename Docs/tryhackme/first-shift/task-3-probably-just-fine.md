---
hide:
  - toc
---

<div class="soc-hero">

# 🕵️ Task 3: Probably Just Fine?

<div class="soc-pill-row" style="margin-bottom: 1.2rem;">
  <span class="soc-pill">Alert: Unusual VPN Login</span>
  <span class="soc-pill">Tactic: Initial Access</span>
  <span class="soc-pill">Malware: LummaStealer</span>
</div>

<span class="soc-muted">
Investigating a "travelling user" alert that turned into the discovery of an infostealer infection. I went from checking one IP address to linking the malware to a wider Lumma campaign.
</span>

</div>

!!! abstract "Summary"
    **What happened:** A VPN login came from a VPN/hosting provider (ASN 212238), not a hotel or mobile network. The user's machine held `zY9sqWs.exe`, a LummaStealer sample (57/71 AV detections), which most likely stole the credentials used for the login.

    **Impact:** Likely credential theft from the endpoint and unauthorised VPN access with a valid account.

    **Key IOCs:** ASN `212238` · `zY9sqWs.exe` · `Trojan:Win32/LummaStealer.PM!MTB`

!!! failure "🚨 Security Alert: Unusual VPN Activity"
    **Trigger:** An internal SOC alert flagged an **unusual VPN login** for a corporate user.
    
    **Initial Assessment:** Context suggested the user might be traveling. However, standard procedure requires validating the source IP before dismissing it as benign.
    
    **Investigation Goal:** Determine if the IP belongs to a legitimate ISP (hotel/airport) or a hosting provider (VPS/Proxy) often used by attackers.

---

## 🔎 Phase 1: Infrastructure Analysis

I started by checking the source IP address to determine its ownership and reputation.

=== "Intel Query"
    **Action:** Enriched the IP address using internal threat intelligence tools to identify the Autonomous System Number (ASN) and service type.

=== "Findings"
    !!! tip "Result: Suspicious Infrastructure"
        * **ASN:** `212238`
        * **Service Type:** **VPN / Hosting Service**
        
        **Assessment:** While VPNs can be legitimate, adversaries frequently rent VPS infrastructure to anonymize their location. This **contradicts** the "hotel wifi" theory and warrants deeper investigation.

---

## 🦠 Phase 2: Malware Analysis

I pivoted to a suspicious binary found on the user's machine to see if it correlated with the VPN activity.

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

To understand the scope, I looked for links to wider campaigns.

### 1. YARA & Infrastructure Clustering
Searching the file hash showed that a Lumma YARA rule by **kevoreilly** (CAPE sandbox) matches the binary.

* **Rule logic:** the rule matches Lumma-specific byte patterns. Its `uint16(0) == 0x5a4d` condition only checks that the file starts with `MZ`, so the rule runs on Windows executables alone.
* **Infrastructure:** Analysis of TLS certificates linked to the command-and-control (C2) domain revealed **151 other domains** sharing the same certificate. This indicates a large-scale, organized campaign.

### 2. Affiliate Network
Public reporting ("*Behind the Curtain: How Lumma Affiliates Operate*") describes the affiliate ecosystem around this malware family.

* **Collaborators:** The Lumma developer began working with the **GhostSocks** proxy-malware team in early 2024.
* **Cross-Platform Threat:** A Mexican-based affiliate in this network was also observed using **CraxsRAT** to target Android devices, showing the group's capability to pivot between mobile and desktop targets.

---

## 🗺️ MITRE ATT&CK Mapping

I mapped the activity to MITRE ATT&CK to guide detection.

<div class="soc-grid">
  <div class="soc-card soc-case">
    <div class="soc-card-body">
      <div class="soc-card-title soc-accent-orange">T1583.003: Acquire Infrastructure</div>
      <div class="soc-card-desc">
        The attacker used rented VPS/VPN infrastructure to hide their location and host C2.
      </div>
      <div class="soc-pill-row">
        <span class="soc-pill">Resource Development</span>
      </div>
    </div>
  </div>
  <div class="soc-card soc-case">
    <div class="soc-card-body">
      <div class="soc-card-title soc-accent-orange">T1555.003: Credentials from Web Browsers</div>
      <div class="soc-card-desc">
        LummaStealer harvests saved browser passwords, cookies and session tokens.
      </div>
      <div class="soc-pill-row">
        <span class="soc-pill">Credential Access</span>
      </div>
    </div>
  </div>
  <div class="soc-card soc-case">
    <div class="soc-card-body">
      <div class="soc-card-title soc-accent-orange">T1078: Valid Accounts</div>
      <div class="soc-card-desc">
        The stolen credentials were then used to log in to the corporate VPN.
      </div>
      <div class="soc-pill-row">
        <span class="soc-pill">Initial Access</span>
      </div>
    </div>
  </div>
</div>

![MITRE ATT&CK Mapping](./assets/task-3/Task%201-%209.png)

---

## 🔔 Detection Opportunities

!!! example "Detections I would add"
    These are example queries; index and field names depend on your environment.

    === "VPN login from hosting ASN"
        ```spl
        index=vpn action=success
        | iplocation src_ip
        | lookup asn_lookup ip AS src_ip OUTPUT asn asn_type
        | where asn_type IN ("hosting", "vpn")
        | stats count min(_time) AS first_seen BY user src_ip asn
        ```
        Flags successful VPN logins from data-centre or commercial VPN ranges, which real travellers rarely use.

    === "Impossible travel"
        ```spl
        index=vpn action=success
        | iplocation src_ip
        | sort 0 user _time
        | streamstats current=f last(lat) AS prev_lat last(lon) AS prev_lon last(_time) AS prev_time BY user
        | eval hours=(_time-prev_time)/3600
        | eval km=6371*2*asin(sqrt(pow(sin((lat-prev_lat)*pi()/360),2)+cos(prev_lat*pi()/180)*cos(lat*pi()/180)*pow(sin((lon-prev_lon)*pi()/360),2)))
        | where hours>0 AND km/hours>900
        ```
        Catches logins from two places too far apart to travel between in the time.

    === "Infostealer on the endpoint"
        ```yaml
        title: Unsigned executable reading browser credential stores
        logsource: { product: windows, category: file_access }
        detection:
          selection:
            TargetFilename|endswith:
              - '\Login Data'
              - '\Cookies'
              - '\logins.json'
          filter_browsers:
            Image|endswith: ['\chrome.exe', '\msedge.exe', '\firefox.exe']
          condition: selection and not filter_browsers
        level: high
        ```

---

## 🛡️ Case Verdict

<div class="soc-grid">
  <div class="soc-card soc-case soc-accent-red">
    <div class="soc-card-body">
      <div class="soc-card-title">Confirmed Compromise</div>
      <ul>
        <li><strong>Malware:</strong> LummaStealer (Infostealer)</li>
        <li><strong>Vector:</strong> VPN credentials most likely stolen by the infostealer</li>
        <li><strong>Attribution:</strong> Lumma malware-as-a-service ecosystem (affiliate not confirmed)</li>
      </ul>
    </div>
  </div>

  <div class="soc-card soc-case soc-accent-green">
    <div class="soc-card-body">
      <div class="soc-card-title">Remediation Steps</div>
      <ul>
        <li>Isolate the host and reimage it.</li>
        <li>Revoke active VPN sessions and reset every password saved on the machine.</li>
        <li>Require MFA for VPN, and alert on logins from hosting/VPN ASNs such as 212238.</li>
        <li>Block the C2 domains and the TLS certificate fingerprint they share.</li>
      </ul>
    </div>
  </div>
</div>

<br>
<center>
  <a href="../" class="soc-btn">← Back to Case File</a>
  <a href="../task-4-phishing-books/" class="soc-btn soc-btn-secondary">Next: Task 4 (Phishing) →</a>
</center>