# DNS, Domains & Web Fundamentals

Using `abc.xyz` as an example throughout.

---

## Part 1: What Is a Domain?

A domain is just a **human-readable name** for a location on the internet.

Computers don't understand "abc.xyz" - they only understand IP addresses like `35.173.209.146`. But humans can't remember IP addresses, so we invented domain names.

**abc.xyz** is your domain. You bought it from a registrar (e.g., Bluehost, Namecheap, GoDaddy).

---

## Part 2: URL vs URI

These terms are often used interchangeably but have distinct meanings:

| Term | Full Name | What It Is | Example |
|------|-----------|------------|---------|
| **URI** | Uniform Resource Identifier | Identifies a resource. The broader concept — just a path/identifier. | `/project/donor` |
| **URL** | Uniform Resource Locator | A URI that also tells you HOW to find the resource (includes protocol and domain). | `https://api.jefferson.edu/jeffscanservice/project/donor?oia=true` |

**Key distinction:** Every URL is a URI, but not every URI is a URL. A URI just names the resource; a URL names it AND locates it.

In practice: In Express routes you work with URIs (the path portion). In API docs or HTTP requests you reference the full URL.

If you can paste it into a browser and it goes somewhere → it's a URL (and also a URI).
If it's just a path fragment like /project/donor that only makes sense in context — like inside your Spring Boot @GetMapping("/project/donor") — it's a URI but not a URL.

### Anatomy of a URL

```
https://www.abc.xyz/some-page?query=value
```

| Part | Example | What It Is |
|------|---------|------------|
| Protocol | `https://` | Secure connection (HTTP or HTTPS) |
| Subdomain | `www` | Prefix before the root domain |
| Root domain | `abc.xyz` | The domain you bought |
| Path (URI) | `/some-page` | Resource identifier on the server |
| Query string | `?query=value` | Optional parameters passed to the server |

---

## Part 3: Parts of a Domain

### Root Domain vs Subdomain

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

---

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

**This is why you edit DNS in your DNS provider** - that's where you told the internet your records live.

---

## Part 6: DNS Records Explained

DNS records are entries in the "phone book." Different types do different things:

| Record Type | Purpose | Example |
|-------------|---------|---------|
| **A Record** | Maps name to IPv4 address | `abc.xyz → 35.173.209.146` |
| **AAAA Record** | Maps name to IPv6 address | `abc.xyz → 2001:db8::1` |
| **CNAME** | Alias — points one domain to another domain name | `www.abc.xyz → xyzzzz.cloudfront.net` |
| **TXT Record** | General-purpose text. Used for verification, SPF, DKIM | `abc.xyz → "v=spf1 include:_spf.google.com ~all"` |
| **CAA Record** | Specifies which CAs can issue SSL certs for your domain | `abc.xyz → 0 issue "sectigo.com"` |
| **MX Record** | Specifies mail servers for the domain | `abc.xyz → mail.abc.xyz (priority 10)` |

> **Note:** You cannot use a CNAME for the root domain (`abc.xyz`). Root domains must use A records.

---

## Part 7: What Happens When Someone Visits a Website

```
1. User types: abc.xyz
            ↓
2. Browser asks DNS: "What's the IP for abc.xyz?"
            ↓
3. DNS lookup goes to your nameservers (e.g., Bluehost)
            ↓
4. Nameservers check records, find:
   A record: abc.xyz → 35.173.209.146
            ↓
5. Browser connects to 35.173.209.146
            ↓
6. Server responds with your website
            ↓
7. Server presents SSL certificate
   "I'm abc.xyz, here's my cert from Sectigo"
            ↓
8. Browser verifies cert is valid
            ↓
9. Shows padlock 🔒 and loads the page
```

---

## Part 8: SSL Certificate Validation Process

When a Certificate Authority (like Sectigo) wants to issue an SSL certificate, they need proof you own the domain:

1. CA says: "Add this TXT record to your DNS"
2. You add it in your DNS provider (Bluehost, Cloudflare, Route 53, etc.)
3. CA checks: "Is the TXT record there?"
4. If yes → "Great, you control the domain, here's your certificate"

The CAA record is optional but recommended — it tells browsers which CA is allowed to issue certs for your domain.

---

## Part 9: The Three Separate Jobs

| Job | What It Does | Example Companies |
|-----|--------------|-------------------|
| **1. Domain Registrar** | You buy/own the domain name | Namecheap, GoDaddy, Google Domains, Bluehost |
| **2. DNS Provider** | Hosts your DNS records, translates names → IPs | Cloudflare, Route 53, Bluehost |
| **3. Certificate Authority (CA)** | Issues SSL certificates for HTTPS | Sectigo, DigiCert, Let's Encrypt |

These are **three separate jobs**. Sometimes one company does multiple (Bluehost does registrar + hosting + DNS), but they're still distinct functions.

---

## Part 10: Quick Glossary

| Term | Meaning |
|------|---------|
| **URI** | Uniform Resource Identifier — identifies a resource (e.g., `/project/donor`) |
| **URL** | Uniform Resource Locator — a URI that also includes protocol and domain to locate the resource |
| **Domain** | The name you bought (abc.xyz) |
| **Subdomain** | Prefix you add (www, app, api, etc.) |
| **Root/Apex domain** | The domain without any subdomain |
| **DNS** | System that translates names → IP addresses |
| **Nameservers** | The servers that host your DNS records |
| **A Record** | Name → IP address |
| **CNAME** | Name → another name (alias) |
| **TXT Record** | Name → text (used for verification, email security) |
| **CAA Record** | Specifies allowed certificate authorities |
| **MX Record** | Specifies mail servers for the domain |
| **SSL/TLS Certificate** | Proves identity, enables HTTPS |
| **Certificate Authority (CA)** | Company that issues SSL certs |
| **TTL (Time To Live)** | How long DNS records are cached before refresh |
| **Protocol** | The method of communication (e.g., `https://`, `http://`, `ftp://`) |
| **Query String** | Parameters appended to a URL after `?` (e.g., `?oia=true&id=123`) |

---

## Part 11: Common DNS Providers

| Provider | Notes |
|----------|-------|
| **Cloudflare** | Free tier, includes CDN and security features |
| **AWS Route 53** | Integrated with AWS ecosystem |
| **Bluehost** | Bundled with web hosting |
| **Google Cloud DNS** | Integrated with Google Cloud |
| **Namecheap** | Bundled with domain registration |

---

## Part 12: Useful Commands for Troubleshooting

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