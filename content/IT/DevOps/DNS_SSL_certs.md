# DNS and Domains: A Complete Beginner's Guide

Using abc.xyz as an example throughout.

## Part 1: What Is a Domain?

A domain is just a **human-readable name** for a location on the internet.

Computers don't understand "abc.xyz" - they only understand IP addresses like `35.173.209.146`. But humans can't remember IP addresses, so we invented domain names.

**abc.xyz** is your domain. You bought it from a registrar (e.g., Bluehost, Namecheap, GoDaddy).

## Part 2: Parts of a Domain

Breaking down a full URL:

```
https://www.abc.xyz/some-page
```

| Part | What It Is |
|------|------------|
| `https://` | The protocol (secure connection) |
| `www` | Subdomain |
| `abc.xyz` | Your domain (also called "root domain" or "apex domain") |
| `/some-page` | Path on the server |


## Part 3: Root Domain vs Subdomain

**Root domain** (also called apex or naked domain):
```
abc.xyz
```
This is what you bought. It's yours.

**Subdomain** - anything you put in front of it:
```
www.abc.xyz
app.abc.xyz
api.abc.xyz
test.abc.xyz
literally-anything.abc.xyz
```

You can create unlimited subdomains for free - they're just prefixes you control. `www` is just the most common subdomain, but there's nothing special about it.


## Part 4: The Problem DNS Solves

When you type `abc.xyz` into a browser:

1. Your browser asks: "What's the IP address for abc.xyz?"
2. **Something** needs to answer that question
3. That something is **DNS** (Domain Name System)

Think of DNS as a phone book:
```
abc.xyz → 35.173.209.146
www.abc.xyz → 66.81.203.198
```

---

## Part 5: Where Does DNS Live?

When you buy a domain, you tell the registrar: "Here's where my DNS records are hosted."

You do this by setting **nameservers**. For example:
```
NS1.BLUEHOST.COM
NS2.BLUEHOST.COM
```

This means: "If anyone wants to know where abc.xyz points, ask Bluehost."

**This is why you edit DNS in Bluehost** - that's where you told the internet your records live.

---

## Part 6: DNS Records Explained

DNS records are entries in the "phone book." Different types do different things:

### A Record
**"This name = this IP address"**

```
abc.xyz → 35.173.209.146
```

When someone types `abc.xyz`, send them to IP `35.173.209.146`.

This is the most basic record type.

---

### CNAME Record
**"This name = that other name"** (an alias)

```
www.abc.xyz → xyzzzz.cloudfront.net
```

When someone asks for `www.abc.xyz`:
1. DNS says "go look up xyzzzz.cloudfront.net instead"
2. That domain resolves to an IP
3. Browser goes to that IP

**Why use this?** If CloudFront changes their IP addresses, you don't have to update anything - your CNAME just follows along automatically.

**Limitation:** You cannot use a CNAME for the root domain (`abc.xyz`). Root domains must use A records.

---

### TXT Record
**"Here's some text information about this domain"**

```
abc.xyz → "v=spf1 include:_spf.google.com ~all"
```

Used for:
- **Verification** - proving you own the domain (Google, Sectigo, etc. ask you to add a specific string)
- **Email security** - SPF, DKIM records
- **Other services** - various tools ask you to add TXT records to prove ownership

---

### CAA Record
**"Only these certificate authorities can issue SSL certs for my domain"**

```
abc.xyz → 0 issue "sectigo.com"
```

This is a security feature. It tells the world: "If anyone other than Sectigo tries to issue a certificate for abc.xyz, don't trust it."

---

### MX Record
**"Send email for this domain to this mail server"**

```
abc.xyz → mail.abc.xyz (priority 10)
```

Only matters if you're receiving email at @abc.xyz addresses.

---

## Part 7: What Happens When Someone Visits a Website

```
1. User types: abc.xyz
            ↓
2. Browser asks DNS: "What's the IP for abc.xyz?"
            ↓
3. DNS lookup goes to Bluehost (your nameservers)
            ↓
4. Bluehost checks records, finds:
   A record: abc.xyz → 35.173.209.146
            ↓
5. Browser connects to 35.173.209.146
            ↓
6. Server at that IP responds with your website
            ↓
7. Server also presents SSL certificate
   "I'm abc.xyz, here's my cert from Sectigo"
            ↓
8. Browser verifies cert is valid
            ↓
9. Shows padlock 🔒 and loads the page
```

---

## Part 8: Example Setup Visualized

```
abc.xyz (root)
    └── A record → 35.173.209.146 (AWS server)

www.abc.xyz
    └── CNAME → cloudfront.net (CDN)

*.abc.xyz (wildcard - any subdomain)
    └── A record → 66.81.203.198 (default/fallback)
```

---

## Part 9: SSL Certificate Validation Process

When a Certificate Authority (like Sectigo) wants to issue an SSL certificate, they need proof you own the domain.

Their process:
1. "Add this TXT record to your DNS"
2. You add it in your DNS provider (Bluehost, Cloudflare, Route 53, etc.)
3. CA checks: "Is the TXT record there?"
4. If yes → "Great, you control the domain, here's your certificate"

The CAA record is optional but recommended - it tells browsers "only trust certs from [specific CA] for this domain."

---

## Part 10: The Three Separate Jobs

| Job | What It Does | Example Companies |
|-----|--------------|-------------------|
| **1. Domain Registrar** | You buy/own the domain name | Namecheap, GoDaddy, Google Domains, Bluehost |
| **2. DNS Provider** | Hosts your DNS records, translates names → IPs | Cloudflare, Route 53, Bluehost |
| **3. Certificate Authority (CA)** | Issues SSL certificates for HTTPS | Sectigo, DigiCert, Let's Encrypt |

These are **three separate jobs**. Sometimes one company does multiple (Bluehost does registrar + hosting + DNS), but they're still distinct functions.

---

## Quick Glossary

| Term | Meaning |
|------|---------|
| **Domain** | The name you bought (abc.xyz) |
| **Subdomain** | Prefix you add (www, app, api, etc.) |
| **Root/Apex domain** | The domain without any subdomain |
| **DNS** | System that translates names → IP addresses |
| **Nameservers** | The servers that host your DNS records |
| **A Record** | Name → IP address |
| **CNAME** | Name → another name (alias) |
| **TXT Record** | Name → text (used for verification) |
| **CAA Record** | Specifies allowed certificate authorities |
| **MX Record** | Specifies mail servers for the domain |
| **SSL Certificate** | Proves identity, enables HTTPS |
| **Certificate Authority (CA)** | Company that issues SSL certs |
| **TTL (Time To Live)** | How long DNS records are cached before refresh |

---

## Common DNS Providers

| Provider | Notes |
|----------|-------|
| **Cloudflare** | Free tier, includes CDN and security features |
| **AWS Route 53** | Integrated with AWS ecosystem |
| **Bluehost** | Bundled with web hosting |
| **Google Cloud DNS** | Integrated with Google Cloud |
| **Namecheap** | Bundled with domain registration |

---

## Useful Commands for Troubleshooting

Check what IP a domain resolves to:
```bash
nslookup abc.xyz
```

Check specific DNS record types:
```bash
nslookup -type=TXT abc.xyz
nslookup -type=CAA abc.xyz
nslookup -type=MX abc.xyz
```

Check nameservers:
```bash
nslookup -type=NS abc.xyz
```

# DNS, SSL, and Domain Management Overview

## The Big Picture: 3 Separate Jobs

| Job | What It Does | Example Companies |
|-----|--------------|-------------------|
| **1. Domain Registrar** | You buy/own the domain name (e.g., abc.xyz) | Namecheap, GoDaddy, Google Domains, AWS Route 53 |
| **2. DNS Provider** | Translates domain name → IP address, hosts your DNS records | Cloudflare, Route 53, BlueHost, your registrar's built-in DNS |
| **3. Certificate Authority (CA)** | Issues SSL certificates so your site can use HTTPS | Sectigo, DigiCert, Let's Encrypt |

These are **three separate jobs**. Sometimes one company does multiple (e.g., AWS does registrar + DNS), but they're still distinct functions.

---

## How They Connect

```
User types abc.xyz
        ↓
   DNS Provider (e.g., Cloudflare)
   "abc.xyz → 123.45.67.89"
        ↓
   Browser connects to your server
        ↓
   Server shows SSL certificate
   "I'm really abc.xyz, here's proof from Sectigo"
        ↓
   Browser: "Certificate checks out, show the padlock 🔒"
```

---

## Common DNS Record Types

| Record | Purpose |
|--------|---------|
| **A** | Maps domain to an IPv4 address (e.g., abc.xyz → 123.45.67.89) |
| **AAAA** | Maps domain to an IPv6 address |
| **CNAME** | Alias - points one domain to another domain |
| **TXT** | General-purpose text record. Often used for domain verification |
| **CAA** | Certificate Authority Authorization - specifies which CAs can issue certs for your domain |
| **MX** | Mail exchange - where to deliver email for the domain |

---

## SSL Certificate Validation Process

1. You request a certificate from a CA (e.g., Sectigo)
2. CA needs proof you control the domain
3. CA gives you a TXT record value to add to your DNS
4. You add the TXT record in your DNS provider (e.g., Cloudflare)
5. CA looks up the record, confirms it matches
6. CA issues the certificate

---

## Key Terminology

- **SSL/TLS Certificate**: Cryptographic certificate that enables HTTPS (the padlock in your browser)
- **DNS (Domain Name System)**: The "phone book" of the internet - translates human-readable names to IP addresses
- **Hosted Zone**: A container for DNS records for a specific domain (Route 53 terminology)
- **Nameservers**: The servers that host your DNS records - your domain registrar needs to point to these