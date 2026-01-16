# Case Study: The "SNI Priming" SSL Error
**Date**: January 16, 2026
**Issue**: Persistent `ERR_SSL_PROTOCOL_ERROR` on subdomain `dura.disruptiveiot.org`, with erratic behavior.

## 1. The Symptoms
- accessing `https://dura.disruptiveiot.org` directly in a fresh browser/incognito session **failed** immediately (`ERR_SSL_PROTOCOL_ERROR`).
- **However**, if the user first visited the parent domain `https://disruptiveiot.org` and *then* visited `dura`, it worked perfectly.
- This behavior suggested the browser was "learning" or "caching" something from the parent site that allowed the subdomain to work (often called "priming").

## 2. The Diagnostics
We investigated several layers:
1.  **DNS**: Correct. Pointed to the same IP (`143.110.131.196`) as the parent.
2.  **Certificates**: Checks confirmed multiple certificates existed (one combined, one specific).
3.  **Nginx Config**:
    -   The `dura` block pointed to the correct "Combined" certificate.
    -   Protocol mismatch found (`http2 on;` vs `listen ... http2;`), but fixing this did not resolve the issue.
    -   "Nuclear" option (overwriting config) also failed to resolve the cold-start error.

## 3. The Root Cause: "Default Server" SNI Fallback
Nginx determines which server block to use based on the **SNI (Server Name Indication)** header sent by the client (browser) at the very start of the handshake.

-   If valid SNI is provided, it routes to the correct block.
-   **CRITICAL**: If the handshake setup (ciphers/protocols) for the *initial* connection negotiation doesn't match what the specific block expects, or if Nginx defaults to a block that **doesn't have SSL configured**, the connection can be dropped before Nginx even looks at the specific `server_name`.

In this case, the `/etc/nginx/sites-available/default` block was listening on port 80/443 but **lacked the SSL directives**. When a new connection came in (cold start), Nginx might have defaulted to this block for the initial handshake parameters, failed to find SSL certs, and killed the connection (`ERR_SSL_PROTOCOL_ERROR`).

Visiting the parent site "primed" the connection (Reuse/Keep-Alive) or cached specific SSL parameters, allowing the subsequent request to `dura` to succeed.

## 4. The Solution
The fix was to explicitly configure SSL on the **Default Server** block, ensuring Nginx always has a valid certificate to present for *any* handshake on port 443, even if it eventually drops the connection.

### The Fix Code
In `/etc/nginx/sites-available/default`:

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    # ENABLE SSL ON DEFAULT BLOCK
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;
    
    # Use the valid combined certificate
    ssl_certificate /etc/letsencrypt/live/disruptiveiot.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/disruptiveiot.org/privkey.pem;

    server_name _;
    
    # Reject unknown hosts (security best practice), but handshake succeeds first!
    return 444; 
}
```

## 5. Key Takeaways
-   **Always configure SSL on your default_server** block if you are serving HTTPS traffic on that IP.
-   **SNI Priming** (works only after visiting a sibling site) is a hallmark sign of default server misconfiguration or missing intermediate certificates.
