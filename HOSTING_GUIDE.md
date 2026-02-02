# ARES Hosting Guide

To make your site run **"smooth as butter"** (low latency, fast animations), you have two main options. Since this is a **Next.js** application, Option 1 is superior for performance.

---

## Option 1: Vercel (Recommended for Speed)
Vercel created Next.js. Their hosting is built specifically to make these sites instant.
*   **Why:** They use an "Edge Network" (servers all over the world). If someone in London opens your site, it loads from London, not New York.
*   **Cost:** Free (Hobby tier) or $20/mo (Pro).
*   **Smoothness:** 10/10.

### How to do it:
1.  Push your code to **GitHub**.
2.  Go to [Vercel.com](https://vercel.com) and sign up.
3.  Click **"Add New Project"** -> Import from GitHub.
4.  Click **Deploy**.
5.  *Done.* It will automatically configure the fastest settings.

---

## Option 2: VPS (Virtual Private Server)
If you specifically want a VPS (for data control, or running heavy AI scripts in the background later), follow this setup.

### 1. What to Buy (The Server)
You don't need a supercomputer for the web interface.
*   **Provider:** [DigitalOcean](https://www.digitalocean.com/), [Hetzner](https://www.hetzner.com/), or [AWS Lightsail](https://aws.amazon.com/lightsail/).
*   **Recommended Specs:**
    *   **RAM:** 2GB (Minimum for building Next.js apps comfortably).
    *   **CPU:** 2 vCPUs.
    *   **OS:** Ubuntu 22.04 or 24.04 (LTS).
    *   **Cost:** ~$10 - $15 / month.

### 2. The Secret Sauce for "Smoothness": Cloudflare
A VPS is just one computer in one city (e.g., New York). If someone accesses it from Tokyo, it will be slow (laggy).
**You MUST put Cloudflare in front of it.**

*   **What to buy:** Go to [Namecheap](https://www.namecheap.com/) or [Godaddy], buy your domain (e.g., `ares-security.ai`).
*   **Setup:**
    1.  Create a free account on [Cloudflare.com](https://www.cloudflare.com/).
    2.  Add your domain to Cloudflare.
    3.  Change your domain's nameservers to the ones Cloudflare gives you.
    4.  In Cloudflare DNS settings, point an **A Record** to your VPS IP address.
    5.  Make sure the "Orange Cloud" (Proxy) icon is turned **ON**.

### 3. Setting up the VPS (Technical)
Connect to your VPS via SSH and run these commands:

```bash
# 1. Update System
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install PM2 (Keeps your site running 24/7)
sudo npm install -g pm2

# 4. Upload your code (via Git)
git clone https://github.com/your-username/ares.git
cd ares
npm install
npm run build

# 5. Start the App
pm2 start npm --name "ares" -- start

# 6. Install Nginx (Web Server)
sudo apt install nginx
```

You will then need to configure Nginx to forward traffic from port 80 to port 3000 (where Next.js runs).

---

## Summary Recommendation
*   **For the "Smoothest" UI Experience:** Use **Vercel**. It caches your images, fonts, and JS files globally.
*   **For the "Backend/AI" Logic:** You might eventually need a VPS with a GPU if you plan to run local LLMs (Large Language Models) instead of using APIs (OpenAI/Anthropic).

**Start with Vercel for the frontend.** It's free and fastest.
