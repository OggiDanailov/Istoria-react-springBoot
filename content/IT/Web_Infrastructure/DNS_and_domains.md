# Domains, DNS, and How the Internet Finds Your Site

Every time you type a web address into a browser, a remarkable chain of events unfolds in milliseconds. Servers around the world are consulted, addresses are translated, and your request finds its way to exactly the right machine among hundreds of millions. Understanding this process is not just academic — as a developer, you will interact with it directly every time you deploy an application, set up a custom domain, or debug a site that "isn't loading yet."

---

## What Is a Domain?

A **domain** is a human-readable name that represents a location on the internet. Computers communicate using **IP addresses** — numerical identifiers like `95.216.40.108` — but humans cannot meaningfully remember or work with raw numbers at scale. Domain names solve this problem.

When you buy a domain like `myapp.com` from a **domain registrar** (companies like Namecheap, GoDaddy, or Google Domains), you are purchasing the exclusive right to use that name and point it wherever you choose. The registrar records your ownership in a global database maintained by ICANN, the non-profit organisation that coordinates internet naming.

> **As a developer, you will typically buy a domain once and then never touch the registrar again.** The real work happens at the DNS level, described below.

---

## Root Domains and Subdomains

The domain you purchase is called the **root domain** (also called the apex domain or naked domain):

```
myapp.com
```

A **subdomain** is any prefix you attach to it with a dot:

```
www.myapp.com
api.myapp.com
staging.myapp.com
admin.myapp.com
```

You can create unlimited subdomains for free — they cost nothing beyond the root domain itself. The `www` subdomain is simply a convention from the early web; there is nothing technically special about it. In modern deployments, developers commonly use subdomains to separate environments:

| Subdomain | Typical Purpose |
|-----------|----------------|
| `www.myapp.com` | Public-facing production site |
| `api.myapp.com` | Backend API |
| `staging.myapp.com` | Pre-production testing environment |
| `admin.myapp.com` | Internal admin panel |

---

## The Problem DNS Solves

Your browser understands IP addresses, not domain names. When you type `myapp.com`, something must translate that name into an IP address. That something is the **Domain Name System**, or **DNS**.

DNS is often described as the "phone book of the internet." Just as a phone book maps names to phone numbers, DNS maps domain names to IP addresses:

```
myapp.com       →  95.216.40.108
api.myapp.com   →  95.216.40.109
```

DNS is a **distributed global system** — not a single database, but a hierarchy of servers spread across the world that cooperate to answer these translation requests.

---

## Nameservers: Where Your DNS Records Live

When you register a domain, the registrar asks you: *"Which servers should the world consult when they want to find your domain?"* You answer by setting **nameservers**.

Nameservers are the authoritative servers that host your actual DNS records. A nameserver entry looks like:

```
ns1.digitalocean.com
ns2.digitalocean.com
ns3.digitalocean.com
```

This tells the internet: *"If you want to know where myapp.com points, ask DigitalOcean's nameservers."*

Your **DNS provider** (the company hosting your nameservers) is where you will actually manage records day-to-day. This is often different from your domain registrar. For example:

- Buy the domain at **Namecheap** (registrar)
- Point nameservers to **Cloudflare** (DNS provider)
- Manage all records inside Cloudflare's dashboard

The three roles — registrar, DNS provider, and hosting provider — are distinct, even when the same company offers all three.

---

## DNS Records Explained

DNS records are the individual entries inside your DNS provider. Each record maps a name to something — an IP address, another domain name, or a piece of text.

| Record Type | Purpose | Example |
|-------------|---------|---------|
| **A Record** | Maps a name to an IPv4 address | `myapp.com → 95.216.40.108` |
| **AAAA Record** | Maps a name to an IPv6 address | `myapp.com → 2001:db8::1` |
| **CNAME** | Alias — maps a name to another domain name | `www.myapp.com → myapp.com` |
| **MX Record** | Specifies mail servers for the domain | `myapp.com → mail.myapp.com` |
| **TXT Record** | General-purpose text, used for verification and email security | `myapp.com → "v=spf1 ..."` |

> **Important:** You cannot use a CNAME record for a root domain (`myapp.com`). Root domains must use an A record pointing to an IP address. Subdomains can use either A records or CNAMEs.

---

## TTL: Why DNS Changes Take Time

Every DNS record has a **TTL (Time To Live)** value, measured in seconds. This tells other servers how long they may cache your record before asking again.

```
myapp.com   A   95.216.40.108   TTL: 3600
```

A TTL of 3600 means servers around the world can cache this record for up to one hour. If you update the A record to point to a new IP, some users may still be directed to the old server for up to an hour — because their local DNS cache still holds the previous answer.

**This is one of the most common sources of confusion when deploying or migrating a site.** The fix is to lower your TTL to 300 (5 minutes) *before* making a major change, wait for the old high-TTL caches to expire, then make the change. Afterwards, you can raise the TTL again.

---

## DNS Propagation

Related to TTL is the concept of **DNS propagation** — the time it takes for a DNS change to be visible across all servers worldwide.

When you update a record, the change is immediate at your DNS provider. But DNS is a distributed global system. Other servers (your ISP's resolver, corporate network resolvers, public resolvers like Google's `8.8.8.8`) all have their own caches with varying TTL lifetimes.

**Propagation typically takes anywhere from a few minutes to 48 hours**, depending on:
- The TTL of the record being changed
- How long ago it was last cached by a given resolver
- Your DNS provider's update speed

> **Practical tip:** Use [dnschecker.org](https://dnschecker.org) to see how your domain resolves from different locations around the world. This helps confirm whether a change has propagated.

---

## What Happens When You Visit a Website

Here is the complete journey from typing a URL to seeing a web page:

```
1. You type: myapp.com
              ↓
2. Your browser checks its own cache
   "Have I looked this up recently?"
              ↓
3. If not cached, asks your OS resolver
   (usually your router or ISP's DNS server)
              ↓
4. The resolver works up the DNS hierarchy:
   - Asks a root nameserver: "Who handles .com?"
   - Asks a .com nameserver: "Who handles myapp.com?"
   - Asks myapp.com's nameservers: "What's the IP?"
              ↓
5. Returns: myapp.com → 95.216.40.108
              ↓
6. Your browser connects to 95.216.40.108
              ↓
7. The server responds with the web page
```

The entire DNS lookup typically takes **20–120 milliseconds**. Once cached, subsequent visits skip steps 2–5 entirely.

---

## URIs and URLs: A Quick Distinction

Two terms you will see constantly in web development:

| Term | Stands For | What It Is | Example |
|------|-----------|------------|---------|
| **URI** | Uniform Resource Identifier | Identifies a resource — a path or name | `/api/users/42` |
| **URL** | Uniform Resource Locator | A URI that also tells you *how* to find it | `https://myapp.com/api/users/42` |

Every URL is a URI, but not every URI is a URL. In Spring Boot, your `@GetMapping("/api/users")` annotation works with the URI (just the path). When you make a request from a browser or API client, you use the full URL.

**Anatomy of a URL:**

```
https://api.myapp.com/users?active=true
  │        │              │       │
  │        │              │       └── Query string (optional parameters)
  │        │              └────────── Path (URI)
  │        └───────────────────────── Subdomain + root domain
  └────────────────────────────────── Protocol (HTTPS)
```

---

## When You Will Actually Touch All of This

As a developer deploying real applications, here is when each concept becomes relevant:

**Buying and configuring a domain:**
You purchase a root domain, set nameservers to point to your DNS provider, and create an A record pointing to your server's IP address.

**Adding environments:**
You create subdomains like `staging.myapp.com` pointing to a different server or IP — giving you separate, independently accessible environments.

**Changing hosting providers:**
You update your A record to point to a new IP. You lower TTL beforehand so the transition happens quickly.

**Debugging "why isn't my site loading?":**
You check whether DNS has propagated, whether you're pointing at the right IP, and whether your TTL is causing you to see a stale cached result.

**Setting up email:**
You add MX records so email sent to `you@myapp.com` is routed to the correct mail server.

---

## Useful Troubleshooting Commands

Check what IP a domain resolves to:
```bash
nslookup myapp.com
```

Check a specific record type:
```bash
nslookup -type=A myapp.com
nslookup -type=MX myapp.com
nslookup -type=TXT myapp.com
```

Check nameservers for a domain:
```bash
nslookup -type=NS myapp.com
```

Check DNS from a specific resolver (e.g. Google's):
```bash
nslookup myapp.com 8.8.8.8
```

---

## Summary

| Concept | What to Remember |
|---------|-----------------|
| **Domain** | A human-readable name you buy from a registrar |
| **Subdomain** | A free prefix you control (www, api, staging…) |
| **DNS** | The global system that translates names to IP addresses |
| **Nameservers** | Servers that host your DNS records |
| **A Record** | Maps a name to an IP address |
| **CNAME** | Maps a name to another domain name (not for root domains) |
| **TTL** | How long DNS records are cached; lower it before big changes |
| **Propagation** | The delay before DNS changes are visible globally |
| **URI** | A resource path, like `/api/users` |
| **URL** | A full address including protocol and domain |