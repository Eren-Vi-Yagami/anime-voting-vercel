# Anime World Voting App

A highly responsive, anime-themed voting application with duplicate vote prevention.

## Setup & Run

1. Open a terminal in this directory.
2. Run `npm install` to install dependencies.
3. Run `npm start` to launch the server.
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Security Measures & Limitations

This application uses a multi-layered approach to prevent duplicate voting without requiring user authentication.

### Strong Measures (Backend Enforced)
- **IP Rate Limiting:** The server tracks IP addresses in memory. If an IP attempts to vote again within 24 hours (configurable), the request is rejected with a 429 status. 
    - *Limitation:* Users on shared networks (e.g., public WiFi, dorms) share an IP. NAT users might be blocked if someone else voted.
- **Vote Validation:** The server validates that the selected option actually exists before counting the vote.

### Best-Effort Measures (Client-Side & Cookie)
- **Cookies:** A persistent HTTP cookie (`has_voted`) is set for 1 year. The server checks this cookie before accepting a vote.
    - *Limitation:* Users can clear cookies or use Incognito mode to bypass this.
- **Fingerprinting:** A lightweight digital fingerprint is generated from variables like User Agent, Screen Resolution, and Timezone. (Note: In this demo, it's used as a unique ID but not strictly enforced to block collision-heavy fingerprints, as that requires complex analysis to avoid false positives).
- **LocalStorage:** Used for immediate UI feedback ("You've already voted") to improve UX, but not relied upon for security.

### Casual Attacker Model
These measures successfully deter casual users from spamming votes by refreshing the page or restarting the browser. Dedicated attackers with proxies or script automation could bypass these protections, which is an inherent trade-off of anonymous voting systems.
