In the early web, data travelled between your browser and a server as plain, readable text. Anyone on the same network — a coffee shop, a corporate router, an internet service provider — could intercept and read every request. Passwords, credit card numbers, personal messages: all visible to anyone listening. The solution to this problem is the technology behind the padlock icon in your browser, and it is something every developer must understand before shipping any application to real users.

---

## HTTP vs HTTPS: What the S Means

**HTTP** (HyperText Transfer Protocol) is the foundation of data communication on the web. When your browser sends a request and receives a response, it uses HTTP. The problem is that HTTP is **unencrypted** — the data travels as plain text.

**HTTPS** (HTTP Secure) is HTTP with an encryption layer added on top. That layer is called **TLS** (Transport Layer Security). You may also hear the older name **SSL** (Secure Sockets Layer); SSL was the original protocol, later replaced by the more secure TLS, but "SSL" persists as informal shorthand for the same concept.

When you connect to a site over HTTPS:

1. The data is **encrypted** — unreadable to anyone intercepting the traffic
2. The server's **identity is verified** — you know you are talking to the real server, not an impersonator
3. The data has **integrity** — it cannot be tampered with in transit without detection

> **Modern browsers actively warn users when a site uses HTTP.** Chrome and Firefox display "Not Secure" warnings, and some browsers block form submissions over HTTP entirely. For any application handling user data, HTTPS is not optional.

---

## What Is an SSL/TLS Certificate?

A **certificate** is a digital document that proves a server's identity. It contains:

- The domain name(s) it is valid for
- The organisation or individual it was issued to
- The certificate's **expiry date**
- A **digital signature** from the Certificate Authority that issued it

When your browser connects to `https://myapp.com`, the server presents this certificate. Your browser checks:

1. Is the domain on the certificate a match for the site I'm visiting?
2. Is the certificate within its validity period?
3. Was it issued by a Certificate Authority I trust?

If all three checks pass, the padlock appears and the encrypted connection proceeds. If any check fails, the browser shows a security warning.

---

## Certificate Authorities

A **Certificate Authority (CA)** is a trusted organisation that verifies domain ownership and issues SSL/TLS certificates. Your browser ships with a built-in list of trusted CAs — companies like DigiCert, Sectigo, and GlobalSign, as well as the free CA **Let's Encrypt**.

The CA's role is to act as a trusted third party. When a CA signs your certificate, it is essentially vouching: *"We have verified this server controls the domain it claims to represent."*

**How a CA verifies you own a domain:**

Before issuing a certificate, the CA needs proof that you actually control the domain you are requesting a certificate for. The most common verification method is the **DNS challenge**:

1. The CA says: *"Add this specific TXT record to your domain's DNS."*
2. You add the record in your DNS provider.
3. The CA queries DNS and confirms the record is there.
4. Verification passed — certificate issued.

This works because only the true domain owner can add DNS records. If you can add the record, you own the domain.

---

## Let's Encrypt: Free Certificates for Everyone

Before 2016, SSL certificates cost money — sometimes hundreds of dollars per year. This created a barrier that left many sites unencrypted. **Let's Encrypt** changed this by offering certificates for free, with automated issuance and renewal.

Let's Encrypt certificates are valid for **90 days** and can be renewed automatically using tools like **Certbot**. Most Linux hosting environments support automatic renewal with a simple cron job.

> **In a typical DigitalOcean + Docker + nginx deployment** (like yours), Certbot handles certificate issuance and renewal. It adds the required TXT records or serves a temporary file to prove domain ownership, retrieves the certificate, and configures nginx to use it — often in a single command.

The 90-day validity period is intentional. Short lifetimes limit the damage from a compromised certificate, since it expires quickly. Automation makes the short lifetime practical.

---

## The CAA Record: Restricting Who Can Issue Certificates

A **CAA (Certification Authority Authorization)** record is an optional DNS record that specifies which Certificate Authorities are permitted to issue certificates for your domain.

```
myapp.com   CAA   0 issue "letsencrypt.org"
```

This tells CAs: *"Only Let's Encrypt is authorised to issue certificates for myapp.com."* Any other CA that receives a certificate request for your domain is required to reject it.

CAA records are a security measure. Without one, any trusted CA in the world could theoretically issue a certificate for your domain (if they were tricked or compromised). A CAA record narrows that attack surface.

**They are optional but recommended** — especially once you know which CA you are using.

---

## The TLS Handshake: What Happens at Connection Time

When your browser first connects to an HTTPS site, a **TLS handshake** occurs before any data is exchanged. This is the negotiation that establishes the encrypted channel:

```
1. Browser → Server: "I want to connect securely.
                      Here are the encryption methods I support."
              ↓
2. Server → Browser: "Here is my SSL certificate.
                      Let's use this encryption method."
              ↓
3. Browser verifies the certificate:
   - Domain matches?      ✓
   - Not expired?         ✓
   - Trusted CA signed it? ✓
              ↓
4. Browser and server exchange encryption keys
              ↓
5. Encrypted channel established.
   All subsequent data is encrypted.
```

The entire handshake typically takes **one additional round-trip** beyond the TCP connection — on the order of 50–100 milliseconds. This is why the first request to an HTTPS site is slightly slower, and why HTTP/2 and connection reuse matter for performance.

---

## Certificate Types

Not all certificates are the same. They vary in how thoroughly the CA validates the applicant:

| Type | Validation Level | Issued To | Browser Indicator |
|------|-----------------|-----------|-------------------|
| **DV (Domain Validated)** | Proves domain ownership only | Individuals, developers | Padlock |
| **OV (Organisation Validated)** | Proves domain + organisation exists | Businesses | Padlock |
| **EV (Extended Validation)** | Deep background check on organisation | Large enterprises, banks | Padlock (sometimes org name) |

For most web applications and APIs, a **DV certificate** (like those issued by Let's Encrypt) is sufficient. The padlock looks the same to users regardless of validation level.

**Wildcard certificates** are a special type that cover a domain and all its subdomains:

```
*.myapp.com
```

This single certificate is valid for `www.myapp.com`, `api.myapp.com`, `staging.myapp.com`, and any other subdomain. Let's Encrypt issues wildcard certificates, though they require DNS challenge validation (a file-based challenge is not sufficient for wildcards).

---

## Common Certificate Errors and What They Mean

When a certificate check fails, browsers show specific error messages. As a developer, you will encounter these when working with your own servers:

| Error | Meaning | Common Cause |
|-------|---------|-------------|
| `NET::ERR_CERT_DATE_INVALID` | Certificate has expired | Auto-renewal failed; Certbot not running |
| `NET::ERR_CERT_COMMON_NAME_INVALID` | Domain doesn't match the cert | Visiting via IP address or wrong subdomain |
| `NET::ERR_CERT_AUTHORITY_INVALID` | CA is not trusted | Self-signed certificate on a production server |
| `SSL_ERROR_RX_RECORD_TOO_LONG` | Receiving HTTP on an HTTPS port | nginx misconfiguration |

> **A note on network environments:** Some corporate networks, hospital WiFi, and gym networks perform **SSL inspection** — their firewall intercepts HTTPS traffic and presents its own certificate. This is why users on certain networks may see certificate warnings even when your certificate is valid. This is a network-side behaviour, not a problem with your site.

---

## Self-Signed Certificates

A **self-signed certificate** is one you generate yourself, without a CA signing it. Your browser does not trust it (because it has no trusted third party vouching for it), so it shows a warning.

Self-signed certificates are useful for:
- Local development environments
- Internal tools accessed only within a trusted network
- Testing TLS configuration before obtaining a real certificate

They are **not appropriate for production** sites that real users will visit. Always use a CA-signed certificate in production.

---

## HTTPS in Your Development Workflow

Understanding where HTTPS fits in a typical deployment stack:

**In production (nginx + Docker + DigitalOcean):**
- Certbot obtains a Let's Encrypt certificate for your domain
- nginx is configured to listen on port 443 (HTTPS) and present the certificate
- nginx proxies decrypted traffic to your Spring Boot backend on an internal port
- Your backend never needs to handle TLS directly — nginx does it

**In local development:**
- Most developers work over plain HTTP locally (`http://localhost:8080`)
- This is acceptable because local traffic never leaves your machine
- If you need HTTPS locally (e.g. testing OAuth flows that require it), tools like [mkcert](https://github.com/FiloSottile/mkcert) generate locally-trusted certificates

**The important principle:** TLS termination (the point where encrypted traffic becomes unencrypted) happens at the entry point of your infrastructure — typically a reverse proxy like nginx or a load balancer. Everything behind that point communicates unencrypted within your private network.

---

## When You Will Actually Touch All of This

**Deploying your first application:**
After pointing your domain's A record to your server, you run Certbot. It validates domain ownership via DNS or a temporary file, issues a Let's Encrypt certificate, and configures nginx. Users can now reach your app over HTTPS.

**Certificate renewal failures:**
Certbot sets up a cron job to renew certificates automatically before they expire. If this job fails (the server is misconfigured, the domain has changed, the DNS record was deleted), your certificate expires and users see security warnings. You check Certbot logs and renew manually.

**Adding a new subdomain:**
You add a DNS A record for `api.myapp.com`, then run Certbot again to obtain a certificate that covers the new subdomain, or use a wildcard certificate to cover all subdomains at once.

**Mixed content warnings:**
Your HTTPS page loads a resource (image, script, stylesheet) over HTTP. Browsers block or warn about this "mixed content." You update all resource references to use HTTPS or protocol-relative URLs.

---

## Summary

| Concept | What to Remember |
|---------|-----------------|
| **HTTP** | Unencrypted web protocol — data is readable in transit |
| **HTTPS** | HTTP with TLS encryption — data is private and verified |
| **TLS / SSL** | The encryption protocol behind HTTPS (SSL is the old name) |
| **Certificate** | A digital document proving a server's identity |
| **Certificate Authority (CA)** | A trusted organisation that issues and signs certificates |
| **Let's Encrypt** | Free, automated CA — the standard for most web apps |
| **DV Certificate** | Domain-validated; sufficient for most applications |
| **Wildcard Certificate** | One cert covering a domain and all its subdomains (`*.myapp.com`) |
| **CAA Record** | DNS record restricting which CAs can issue certs for your domain |
| **TLS Handshake** | The negotiation that establishes an encrypted connection |
| **TLS Termination** | Where encrypted traffic becomes unencrypted — usually nginx |
| **Self-Signed Certificate** | Untrusted by browsers; fine for local dev, not for production |
| **Certificate Expiry** | Let's Encrypt certs last 90 days; automate renewal with Certbot |