---
hide:
  - toc
---

<div class="soc-hero">

# 🎣 Task 4: Phishing Books

<div class="soc-pill-row" style="margin-bottom: 1.2rem;">
  <span class="soc-pill">Alert: MFA Fatigue</span>
  <span class="soc-pill">Vector: Email Attachment</span>
  <span class="soc-pill">Suspected Actor: Silent Librarian</span>
</div>

<span class="soc-muted">
A user reported MFA spam, leading to the discovery of a targeted phishing campaign against university staff. I analysed the email headers, deobfuscated the HTML attachment and compared the activity with a known threat group.
</span>

</div>

!!! abstract "Summary"
    **What happened:** The user received an email from a look-alike library domain with the attachment `library-invoice.pdf.html`. Obfuscated JavaScript in the file redirected to a fake library login page that harvested the user's password. The attacker then spammed MFA prompts hoping the user would approve one.

    **Impact:** The user's password is compromised. MFA was the only thing stopping account takeover.

    **Key IOCs:** `lib-service.com:8083` · `xn--librarytlu-13cwe32432-kwr.com:8082` · MD5 `442f2965cb6e9147da7908bb4eb73a72`

!!! failure "🚨 Security Alert: MFA Fatigue"
    **Trigger:** A university staff member reported receiving multiple MFA approval prompts without initiating a login.
    
    **Initial Hypothesis:** The user's credentials have likely been compromised, and the attacker is attempting to bypass 2FA by annoying the user into clicking "Approve."
    
    **Investigation Goal:** Analyze the source email to identify the phishing infrastructure and confirm how the credentials were stolen.

---

## 📧 Phase 1: Delivery & Infrastructure

I started with the email headers and sender infrastructure to understand how the message reached the inbox.

=== "Authentication Checks"
    **Objective:** Check whether the sending domain authenticates its mail.
    
    * **SPF:** `none`
    * **DKIM:** `none`
    * **DMARC:** `none`

    **Evidence:**
    ![Email Headers](./assets/task-4/task%204%20-%201.png)

    !!! warning "Security Gap"
        The sending domain is a look-alike the attacker owns, and it publishes no SPF, DKIM or DMARC records. The university's own DMARC policy could not have stopped this, because the email did not claim to come from the university's domain. The gap is on the receiving side: the mail filter delivered a message that passed **no** authentication checks, from a newly seen domain, with an HTML attachment.

=== "Sender Legitimacy"
    **Technique: Typosquatting**
    The sender domain closely resembled a legitimate university library service. Minor character substitutions were used to mimic trusted infrastructure.
    
    ![Typosquatting](./assets/task-4/task%204%20-%202.png)

=== "MITRE Mapping"
    **T1583.001 – Acquire Infrastructure: Domains**
    
    The attacker registered and operated look-alike domains specifically to support phishing delivery.
    
    ![MITRE ATT&CK](./assets/task-4/task%204%20-%203.png)

---

## 📦 Phase 2: Payload Forensics

The email contained a suspicious attachment named `library-invoice.pdf.html`.

=== "Attachment Analysis"
    **Objective:** Determine the nature of the attached file.
    
    * **Filename:** `library-invoice.pdf.html`
    * **Technique:** Double extension (`.pdf.html`) to trick users.
    * **MD5:** `442f2965cb6e9147da7908bb4eb73a72`
    
    ![Attachment Analysis](./assets/task-4/task%204%20-%204.png)

=== "Landing Page"
    **Objective:** Identify where the phishing attachment redirected the victim.
    
    * **URL:** `http://lib-service.com:8083`
    * **Context:** Impersonated a university library login portal to harvest credentials.
    
    ![Landing Page](./assets/task-4/task%204%20-5.png)

---

## 🧬 Phase 3: Code Deobfuscation

The HTML file contained obfuscated JavaScript (T1027) using Unicode escaping and string reversal. I used CyberChef to reveal the logic.

=== "Hidden Message"
    **Discovery:** Hidden developer comment revealed inside the code.
    
    > *"I love to phish books from libraries ^^"*
    
    **Assessment:** Confirms intentional malicious authorship and a "playful" campaign tone.
    
    ![Hidden Message](./assets/task-4/task%204%20-8.png)

=== "Redirect Logic"
    **Logic Identification:** I isolated the JavaScript responsible for decoding the URL at runtime.
    
    ```javascript
    var src = reversed.split("").reverse().join("");
    ```
    
    **Redirect Chain:**
    1. **Initial:** `http://xn--librarytlu-13cwe32432-kwr.com:8082` (Punycode)
    2. **Final:** `http://lib-service.com:8083`
    
    ![Redirect Logic](./assets/task-4/task%204%20-%209.png)

---

## 🏴‍☠️ Phase 4: Threat Attribution

The targeting (university staff), the look-alike domains and the library-portal lure all match the known tradecraft of one group. This is a **low-confidence** attribution based on TTPs only; no infrastructure overlap was confirmed.

<div class="soc-grid">
  <div class="soc-card soc-case soc-accent-purple">
    <div class="soc-card-body">
      <div class="soc-card-title">Suspected Actor: Silent Librarian (Cobalt Dickens)</div>
      <div class="soc-card-desc">
        An Iran-linked group (also tracked as TA407) that known for targeting research institutions and universities to steal academic credentials and proprietary data.
      </div>
    </div>
  </div>
</div>

---

## 🔔 Detection Opportunities

!!! example "Detections I would add"
    These are example queries; index and field names depend on your environment.

    === "MFA prompt spam"
        ```spl
        index=auth signature="MFA request" result IN ("denied", "timeout")
        | bin _time span=10m
        | stats count BY _time user src_ip
        | where count >= 5
        ```
        Five or more denied or ignored MFA prompts in ten minutes is a strong sign of MFA fatigue (T1621).

    === "HTML attachments with double extensions"
        ```spl
        index=email attachment_name=*
        | regex attachment_name="(?i)\.(pdf|docx?|xlsx?)\.html?$"
        | table _time sender recipient subject attachment_name
        ```
        Catches lures like `library-invoice.pdf.html`.

    === "Mail failing all authentication"
        ```spl
        index=email spf=none dkim=none dmarc=none
        | stats count values(subject) AS subjects BY sender_domain
        ```
        Look-alike domains rarely bother setting up email authentication.

---

## 🛡️ Case Verdict

<div class="soc-grid">
  <div class="soc-card soc-case soc-accent-red">
    <div class="soc-card-body">
      <div class="soc-card-title">Confirmed Phishing</div>
      <ul>
        <li><strong>Technique:</strong> Typosquatted domain + HTML attachment with obfuscated JavaScript redirect</li>
        <li><strong>Vector:</strong> Credential harvesting via fake login (T1566.001)</li>
        <li><strong>Follow-on:</strong> MFA fatigue (T1621)</li>
        <li><strong>Gap:</strong> Unauthenticated mail from a new domain was delivered</li>
      </ul>
    </div>
  </div>

  <div class="soc-card soc-case soc-accent-green">
    <div class="soc-card-body">
      <div class="soc-card-title">Remediation Steps</div>
      <ul>
        <li>Reset the user's password and revoke active sessions.</li>
        <li>Block <code>lib-service.com</code> and the Punycode domain at the mail gateway and web proxy.</li>
        <li>Quarantine or block <code>.html</code> attachments from external senders.</li>
        <li>Switch MFA to number matching so a single tap cannot approve a login.</li>
        <li>Search other mailboxes for the same sender and attachment hash.</li>
      </ul>
    </div>
  </div>
</div>

<br>
<center>
  <a href="../task-3-probably-just-fine/" class="soc-btn">← Previous: Task 3</a>
  <a href="../" class="soc-btn soc-btn-secondary">Back to Case File</a>
</center>