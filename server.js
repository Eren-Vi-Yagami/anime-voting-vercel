const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'votes.json');

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));

// In-memory store for IP rate limiting (resets on restart)
// In a real app, use Redis or a database
const ipCache = new Map();
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours

// Initial Data
const INITIAL_DATA = {
    question: "Which Anime World Would You Rather Live In?",
    options: {
        "Cyberpunk Edge": 0,
        "Spirit Realm": 0,
        "Titan Walled City": 0,
        "Ninja Village": 0
    }
};

// Helper to load data
function getVotes() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DATA, null, 2));
        return INITIAL_DATA;
    }
    return JSON.parse(fs.readFileSync(DATA_FILE));
}

// Helper to save data
function saveVotes(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET Votes (Publicly available)
app.get('/api/votes', (req, res) => {
    const data = getVotes();
    res.json(data);
});

// POST Vote
app.post('/api/vote', (req, res) => {
    const { option, fingerprint } = req.body;
    const clientIp = req.ip;
    const userFingerprint = fingerprint || 'unknown';

    // 1. Check Cookie
    if (req.cookies.has_voted) {
        return res.status(403).json({ error: "You have already voted (Cookie detected)." });
    }

    // 2. Check IP Rate Limit
    const lastVoteTime = ipCache.get(clientIp);
    const now = Date.now();
    if (lastVoteTime && (now - lastVoteTime < RATE_LIMIT_WINDOW)) {
        return res.status(429).json({ error: "Voting from this IP is temporarily restricted." });
    }

    // 3. Update Vote Count
    const data = getVotes();
    if (data.options.hasOwnProperty(option)) {
        data.options[option]++;
        saveVotes(data);

        // Security Measures
        ipCache.set(clientIp, now); // Log IP
        res.cookie('has_voted', 'true', { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: false }); // Set Cookie (1 year)

        return res.json({ success: true, message: "Vote cast successfully!", results: data.options });
    } else {
        return res.status(400).json({ error: "Invalid option selected." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
