# Security Writeups

SOC-style investigation reports covering the full kill chain: alert triage, phishing analysis, network forensics, and memory and disk forensics.

**Live site:** https://vishak-SOC.github.io/security-writeups/

## Investigations

| Case | Scenario | Focus | Tools |
| --- | --- | --- | --- |
| [Operation Honeynet Collapse](https://vishak-SOC.github.io/security-writeups/tryhackme/honeynet-collapse/) | A ransomware campaign against a corporate network: SSH access to Linux, lateral movement to a Windows domain controller, and data exfiltration from macOS | Multi-OS digital forensics | Volatility 3, Autopsy, Registry Explorer, MITRE ATT&CK |
| [Operation First Shift](https://vishak-SOC.github.io/security-writeups/tryhackme/first-shift/) | Logins from unusual locations plus user reports of suspicious emails. Correlate the events, analyse the phishing payloads and decide whether the network was breached | SIEM triage and phishing analysis | Splunk, Wireshark, CyberChef |

Each case is broken into tasks, with the evidence, queries and screenshots behind every finding.

### Honeynet Collapse

1. [Initial Access](Docs/tryhackme/honeynet-collapse/task-1-initial-access.md)
2. [Windows Triage](Docs/tryhackme/honeynet-collapse/task-2-windows-movement.md)
3. [Memory Forensics](Docs/tryhackme/honeynet-collapse/task-3-memory-forensics.md)
4. [Disk Analysis](Docs/tryhackme/honeynet-collapse/task-4-disk-forensics.md)
5. [File System](Docs/tryhackme/honeynet-collapse/task-5-file-system.md)
6. [macOS Forensics](Docs/tryhackme/honeynet-collapse/task-6-macos.md)

### First Shift

1. [Auth Triage](Docs/tryhackme/first-shift/task-3-probably-just-fine.md)
2. [Phishing](Docs/tryhackme/first-shift/task-4-phishing-books.md)
3. [Portal Drop](Docs/tryhackme/first-shift/task-5-Portal-Drop.md)
4. [Zero Tolerance](Docs/tryhackme/first-shift/task-6-Zero-Tolerance.md)
5. [The Crown Jewel](Docs/tryhackme/first-shift/task-7-The-Crown-Jewel.md)
6. [Promotion Night](Docs/tryhackme/first-shift/task-8-Promotion-Night.md)

## Build locally

The site is built with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/).

```bash
pip install mkdocs-material
mkdocs serve        # preview at http://127.0.0.1:8000
mkdocs gh-deploy    # publish to the gh-pages branch
```

## About

Written by Vishak, MSc Cyber Security student and aspiring SOC analyst. The scenarios come from TryHackMe rooms; the analysis and write-ups are my own.

[Portfolio](https://vishak-portfolio-two.vercel.app/) · [LinkedIn](https://www.linkedin.com/in/vishaksp) · [TryHackMe](https://tryhackme.com/p/vishak32)
