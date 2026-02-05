---
hide:
  - toc
---

<div class="soc-hero">

# 🎣 Task 4: Phishing Books

<div class="soc-pill-row" style="margin-bottom: 1.2rem;">
  <span class="soc-pill">Event ID: MFA Fatigue</span>
  <span class="soc-pill">Vector: Email Attachment</span>
  <span class="soc-pill">Actor: Cobalt Dickens</span>
</div>

<span class="soc-muted">
A user reported MFA spam, leading to the discovery of a targeted phishing campaign against university staff. This task involves analyzing email headers, deobfuscating HTML payloads, and mapping the attack to a known threat group.
</span>

</div>

!!! failure "🚨 Security Alert: MFA Fatigue"
    **Trigger:** A university staff member reported receiving multiple MFA approval prompts without initiating a login.
    
    **Initial Hypothesis:** The user's credentials have likely been compromised, and the attacker is attempting to bypass 2FA by annoying the user into clicking "Approve."
    
    **Investigation Goal:** Analyze the source email to identify the phishing infrastructure and confirm how the credentials were stolen.

---

## 📧 Phase 1: Delivery & Infrastructure

We started by analyzing the email headers and sender infrastructure to understand how the message bypassed security filters.

=== "Authentication Checks"
    **Objective:** Determine why the spoofed email was delivered to the inbox.
    
    * **SPF:** `none`
    * **DKIM:** `none`
    * **DMARC:** `none`

    **Evidence:**
    ![Email Headers](./assets/task-4/task%204%20-%201.png)

    !!! warning "Security Gap"
        The absence of a strict **DMARC** policy allowed the email to bypass anti-spoofing controls.

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

The HTML file contained obfuscated JavaScript (T1027) using Unicode escaping and string reversal. We used CyberChef to reveal the logic.

=== "Hidden Message"
    **Discovery:** Hidden developer comment revealed inside the code.
    
    > *"I love to phish books from libraries ^^"*
    
    **Assessment:** Confirms intentional malicious authorship and a "playful" campaign tone.
    
    ![Hidden Message](./assets/task-4/task%204%20-8.png)

=== "Redirect Logic"
    **Logic Identification:** We isolated the specific JavaScript responsible for decoding the URL at runtime.
    
    ```javascript
    var src = reversed.split("").reverse().join("");
    ```
    
    **Redirect Chain:**
    1. **Initial:** `http://xn--librarytlu-13cwe32432-kwr.com:8082` (Punycode)
    2. **Final:** `http://lib-service.com:8083`
    
    ![Redirect Logic](./assets/task-4/task%204%20-%209.png)

---

## 🏴‍☠️ Phase 4: Threat Attribution

Based on the targeting (Universities), the infrastructure (Typosquatting), and the technique (Library impersonation), we attributed this activity.

<div class="soc-grid">
  <div class="soc-card soc-case soc-accent-purple">
    <div class="soc-card-body">
      <div class="soc-card-title">Actor: Cobalt Dickens</div>
      <div class="soc-card-desc">
        Also known as <strong>Silent Librarian</strong>. A threat group known for targeting research institutions and universities to steal academic credentials and proprietary data.
      </div>
    </div>
  </div>
</div>

---

## 🛡️ Case Verdict

<div class="soc-grid">
  <div class="soc-card soc-case soc-accent-red">
    <div class="soc-card-body">
      <div class="soc-card-title">Confirmed Phishing</div>
      <ul>
        <li><strong>Technique:</strong> Typosquatting & HTML Smuggling</li>
        <li><strong>Vector:</strong> Credential Harvesting via Fake Login</li>
        <li><strong>Gap:</strong> Lack of DMARC enforcement</li>
      </ul>
    </div>
  </div>

  <div class="soc-card soc-case soc-accent-green">
    <div class="soc-card-body">
      <div class="soc-card-title">Remediation Steps</div>
      <ul>
        <li>Reset credentials for the targeted user.</li>
        <li>Block the domains <code>lib-service.com</code> and the Punycode variant.</li>
        <li>Implement DMARC rejection policy for the university domain.</li>
      </ul>
    </div>
  </div>
</div>

<br>
<center>
  <a href="../task-3-probably-just-fine/" class="soc-btn">← Previous: Task 3</a>
  <a href="../" class="soc-btn soc-btn-secondary">Back to Case File</a>
</center>