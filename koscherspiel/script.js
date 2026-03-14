const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const levelDisplay = document.getElementById("level");
const highscoreDisplay = document.getElementById("highscore");
const coinsDisplay = document.getElementById("coins");
const powerupStateDisplay = document.getElementById("powerupState");
const leaderboardList = document.getElementById("leaderboardList");
const leaderboardTitle = document.getElementById("leaderboardTitle");
const leaderboardDescription = document.getElementById("leaderboardDescription");
const leaderboardMeta = document.getElementById("leaderboardMeta");
const leagueTabs = document.getElementById("leagueTabs");
const currentLeagueBadge = document.getElementById("currentLeagueBadge");
const currentLeagueRange = document.getElementById("currentLeagueRange");
const leagueSummaryText = document.getElementById("leagueSummaryText");
const statusDisplay = document.getElementById("status");
const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");
const gameOverScreen = document.getElementById("gameOver");
const resultText = document.getElementById("resultText");
const coinResult = document.getElementById("coinResult");
const restartButton = document.getElementById("restartButton");
const leaderboardOptIn = document.getElementById("leaderboardOptIn");
const leaderboardPrompt = document.getElementById("leaderboardPrompt");
const leaderboardAuthHint = document.getElementById("leaderboardAuthHint");
const playerNameLabel = document.getElementById("playerNameLabel");
const playerNameInput = document.getElementById("playerName");
const saveLeaderboardButton = document.getElementById("saveLeaderboardButton");
const skipLeaderboardButton = document.getElementById("skipLeaderboardButton");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const shopList = document.getElementById("shopList");
const abilityShopList = document.getElementById("abilityShopList");
const cartShopTab = document.getElementById("cartShopTab");
const abilityShopTab = document.getElementById("abilityShopTab");
const authUsernameInput = document.getElementById("authUsername");
const authPasswordInput = document.getElementById("authPassword");
const signInButton = document.getElementById("signInButton");
const signUpButton = document.getElementById("signUpButton");
const signOutButton = document.getElementById("signOutButton");
const authStatus = document.getElementById("authStatus");
const accountModeBadge = document.getElementById("accountModeBadge");

const fallbackFoods = {
    kosherFoods: [
        { name: "Apfel", image: "images/koschere/apple.png" },
        { name: "Karotte", image: "images/koschere/carrot.png" },
        { name: "Brokkoli", image: "images/koschere/Brokkoli.png" },
    ],
    nonKosherFoods: [
        { name: "Schweinesteak", image: "images/nicht-koschere/Schweinesteak.png" }
    ]
};

const foodEmojiMap = {
    apfel: "🍎",
    apple: "🍎",
    banane: "🍌",
    birne: "🍐",
    kirsche: "🍒",
    erdbeere: "🍓",
    blaubeere: "🫐",
    trauben: "🍇",
    zitrone: "🍋",
    melone: "🍈",
    wassermelone: "🍉",
    avocado: "🥑",
    tomate: "🍅",
    paprika: "🫑",
    gurke: "🥒",
    salat: "🥬",
    kartoffel: "🥔",
    zwiebel: "🧅",
    knoblauch: "🧄",
    pilz: "🍄",
    brot: "🍞",
    bagel: "🥯",
    falafel: "🧆",
    carrot: "🥕",
    karotte: "🥕",
    brokkoli: "🥦",
    schweinesteak: "🥩",
    speck: "🥓",
    schinken: "🍖",
    wurst: "🌭",
    garnele: "🍤",
    tintenfisch: "🦑",
    hummer: "🦞",
    austern: "🦪",
    schnecke: "🐌"
};

const kosherEmojiFallback = ["🍎", "🍐", "🍊", "🍋", "🍇", "🍉", "🍓", "🫐", "🥕", "🥦", "🥬", "🥔", "🫑", "🥒", "🍅", "🍄", "🧅", "🍞", "🥯", "🧆"];
const nonKosherEmojiFallback = ["🥩", "🥓", "🍖", "🌭", "🍤", "🦑", "🦞", "🦪"];

const kosherEmojiFoods = [
    { name: "Banane", emoji: "🍌" },
    { name: "Birne", emoji: "🍐" },
    { name: "Kirsche", emoji: "🍒" },
    { name: "Erdbeere", emoji: "🍓" },
    { name: "Blaubeeren", emoji: "🫐" },
    { name: "Trauben", emoji: "🍇" },
    { name: "Zitrone", emoji: "🍋" },
    { name: "Melone", emoji: "🍈" },
    { name: "Wassermelone", emoji: "🍉" },
    { name: "Avocado", emoji: "🥑" },
    { name: "Tomate", emoji: "🍅" },
    { name: "Paprika", emoji: "🫑" },
    { name: "Gurke", emoji: "🥒" },
    { name: "Salat", emoji: "🥬" },
    { name: "Kartoffel", emoji: "🥔" },
    { name: "Zwiebel", emoji: "🧅" },
    { name: "Pilz", emoji: "🍄" },
    { name: "Brot", emoji: "🍞" },
    { name: "Bagel", emoji: "🥯" },
    { name: "Falafel", emoji: "🧆" }
];

const nonKosherEmojiFoods = [
    { name: "Schweinesteak", emoji: "🥩" },
    { name: "Speck", emoji: "🥓" },
    { name: "Schinken", emoji: "🍖" },
    { name: "Wurst", emoji: "🌭" },
    { name: "Garnele", emoji: "🍤" },
    { name: "Tintenfisch", emoji: "🦑" },
    { name: "Hummer", emoji: "🦞" },
    { name: "Austern", emoji: "🦪" },
    { name: "Schnecke", emoji: "🐌" }
];

const emojiFoodSpawnChance = 0.72;

const cartSkins = [
    { key: "classic", label: "Klassisch", image: "einkaufswägen/Klassisch.png", cost: 0, power: "Kein Bonus", description: "Standard-Wagen ohne Spezialeffekt." },
    { key: "sky", label: "Himmelblau", image: "einkaufswägen/Himmelblau.png", cost: 15, power: "Schutzchance", description: "25% Chance, bei nicht-koscherem Essen kein Leben zu verlieren." },
    { key: "mint", label: "Mint", image: "einkaufswägen/Mint.png", cost: 100, power: "Extra-Punkt", description: "+1 zusätzlicher Punkt bei jedem koscheren Fang." },
    { key: "rose", label: "Rose", image: "einkaufswägen/Rose.png", cost: 35, power: "Münz-Boost", description: "Am Ende 50% mehr Münzen erhalten." },
    { key: "violet", label: "Violett", image: "einkaufswägen/Violett.png", cost: 45, power: "Zweite Chance", description: "Einmal pro Runde: statt Game Over mit 1 Leben weiterspielen." },
    { key: "jumper", label: "Springer", image: "einkaufswägen/Springer.png", cost: 60, power: "Sprung", description: "Mit Leertaste/W/↑ springen und nicht-koscheren Treffern ausweichen." },
    { key: "ultimate", label: "Ultimate", image: "einkaufswägen/Ultimate.png", cost: 700, power: "Ultra-Kombi", description: "Alle Wagenfähigkeiten kombiniert und verstärkt: 2,5x Punkte, 30% Schutzchance, +75% Münzen, 2 zweite Chancen und Sprung." }
];

const cartSkinKeys = cartSkins.map((skin) => skin.key);
const coinRatePerPoint = 0.5;
const maxStoredCoins = 9999;
const abilityDefs = [
    {
        key: "powerupMastery",
        label: "Power-Up-Meisterschaft",
        description: "Power-Ups halten pro Upgrade 10% länger an.",
        maxLevel: 6,
        costPerLevel: 20,
        statLabel: "Dauer-Bonus",
        valuePerLevel: 0.1,
        maxValue: 0.6,
        valueFormatter: (value) => `+${Math.round(value * 100)}%`
    },
    {
        key: "nonKosherShield",
        label: "Nicht-koscher Schutz",
        description: "5% mehr Wahrscheinlichkeit, dass kein Herz abgezogen wird, wenn du nicht-koschere Dinge einfängst.",
        maxLevel: 8,
        costPerLevel: 20,
        statLabel: "Schutz jetzt",
        valuePerLevel: 0.05,
        maxValue: 0.4,
        valueFormatter: (value) => `${Math.round(value * 100)}%`
    },
    {
        key: "speedBoost",
        label: "Schnelligkeit",
        description: "Du bewegst den Wagen pro Level 4% schneller.",
        maxLevel: 6,
        costPerLevel: 25,
        statLabel: "Tempo-Bonus",
        valuePerLevel: 0.04,
        maxValue: 0.24,
        valueFormatter: (value) => `+${Math.round(value * 100)}%`
    },
    {
        key: "kosherFocus",
        label: "Koscher-Fokus",
        description: "Chance auf +1 Bonuspunkt bei koscheren Fängen.",
        maxLevel: 5,
        costPerLevel: 30,
        statLabel: "Bonuspunkt-Chance",
        valuePerLevel: 0.1,
        maxValue: 0.5,
        valueFormatter: (value) => `${Math.round(value * 100)}%`
    },
    {
        key: "scoreMultiplier",
        label: "Multiplikator",
        description: "Jedes Upgrade erhöht deinen Punkte-Multiplikator um 0,1 bis maximal x2,0.",
        maxLevel: 10,
        costPerLevel: 1000,
        statLabel: "Punkte-Multiplikator",
        valuePerLevel: 0.1,
        maxValue: 1,
        valueFormatter: (value) => `x${(1 + value).toFixed(1).replace(".", ",")}`
    },
    {
        key: "powerupMastery",
        label: "Power-Up-Meisterschaft",
        description: "Power-Ups halten pro Upgrade 10% länger an.",
        maxLevel: 6,
        costPerLevel: 20,
        statLabel: "Dauer-Bonus",
        valuePerLevel: 0.1,
        maxValue: 0.6,
        valueFormatter: (value) => `+${Math.round(value * 100)}%`
    }
];

const uniqueAbilityDefs = abilityDefs.filter((ability, index, list) => {
    return list.findIndex((entry) => entry.key === ability.key) === index;
});

const powerupTypes = [
    { key: "shield", label: "Schutz", icon: "🛡️", colorClass: "powerup-shield" },
    { key: "slow", label: "Zeitlupe", icon: "⏱️", colorClass: "powerup-slow" },
    { key: "double", label: "Doppel-Punkte", icon: "✨", colorClass: "powerup-double" },
    { key: "life", label: "Extra-Leben", icon: "❤️", colorClass: "powerup-life" },
    { key: "grow", label: "Großer Wagen", icon: "🛒", colorClass: "powerup-grow" },
    { key: "magnet", label: "Magnet", icon: "🧲", colorClass: "powerup-magnet" }
];

function readFoodData() {
    const foodDataElement = document.getElementById("foodData");

    if (!foodDataElement) {
        return fallbackFoods;
    }

    try {
        const parsed = JSON.parse(foodDataElement.textContent);

        if (!Array.isArray(parsed.kosherFoods) || !Array.isArray(parsed.nonKosherFoods)) {
            return fallbackFoods;
        }

        const kosherFoods = parsed.kosherFoods.filter((food) => food && food.image);
        const nonKosherFoods = parsed.nonKosherFoods.filter((food) => food && food.image);

        if (kosherFoods.length === 0 || nonKosherFoods.length === 0) {
            return fallbackFoods;
        }

        return { kosherFoods, nonKosherFoods };
    } catch {
        return fallbackFoods;
    }
}

const { kosherFoods, nonKosherFoods } = readFoodData();

const basePlayerWidth = 52;
const playerSpeed = 340;
const itemWidth = 40;
const powerupDurationMs = 6000;
const growMultiplier = 1.45;
const magnetPullSpeed = 280;
const leaderboardSize = 20;
const gravity = 1200;
const jumpVelocity = 500;
const leagueRotationDays = 3;
const promotionSlots = 5;
const demotionSlots = 5;
const ultimateRequiredCarts = ["sky", "mint", "rose", "violet", "jumper"];
const unlockAllCartsCheatSequence = "koscherwagen";
const guestLeagueDef = { key: "guest", label: "Gast" };
const leagueDefs = [
    { key: "bronze", label: "Bronze", minScore: 0 },
    { key: "silver", label: "Silber", minScore: 10 },
    { key: "gold", label: "Gold", minScore: 20 },
    { key: "sapphire", label: "Saphir", minScore: 35 },
    { key: "ruby", label: "Rubin", minScore: 50 },
    { key: "emerald", label: "Smaragd", minScore: 70 },
    { key: "amethyst", label: "Amethyst", minScore: 90 },
    { key: "pearl", label: "Perle", minScore: 115 },
    { key: "obsidian", label: "Obsidian", minScore: 140 },
    { key: "diamond", label: "Diamant", minScore: 170 }
];

const keys = {
    left: false,
    right: false
};

const authState = {
    client: null,
    user: null,
    profile: null,
    syncTimerId: null,
    syncInFlight: false,
    syncQueued: false,
    suspendSync: false,
    processing: false,
    statusText: "",
    statusType: "normal"
};

let state = null;
let loopId = null;
let lastTime = 0;
let statusTimeoutId = null;
let activeLeagueKey = guestLeagueDef.key;
let currentLeagueSnapshot = null;

function getStoredHighscore() {
    try {
        return Number(localStorage.getItem("koscher_highscore") || 0);
    } catch {
        return 0;
    }
}

function persistHighscore(value) {
    try {
        localStorage.setItem("koscher_highscore", String(value));
    } catch {
        // Ignorieren: Spiel soll auch ohne localStorage funktionieren.
    }

    requestProfileSync();
}

function sanitizeCoinValue(value) {
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(maxStoredCoins, Math.round(value * 10) / 10));
}

function sanitizeScoreValue(value) {
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.round(value));
}

function getLeagueByKey(leagueKey) {
    return leagueDefs.find((league) => league.key === leagueKey) || leagueDefs[0];
}

function getLeagueLabel(leagueKey) {
    if (leagueKey === guestLeagueDef.key) {
        return guestLeagueDef.label;
    }

    return getLeagueByKey(leagueKey).label;
}

function normalizeLeagueSnapshotEntry(entry, index = 0) {
    if (!entry || typeof entry !== "object") {
        return null;
    }

    const rank = Math.max(1, Math.floor(Number(entry.rank) || index + 1));
    const score = sanitizeScoreValue(Number(entry.score));
    const nameSource = typeof entry.username === "string"
        ? entry.username
        : (typeof entry.name === "string" ? entry.name : "");
    const userId = typeof entry.user_id === "string"
        ? entry.user_id
        : (typeof entry.userId === "string" ? entry.userId : "");

    return {
        rank,
        score,
        name: sanitizeGuestName(nameSource),
        userId,
        isCurrentUser: Boolean(entry.is_current_user ?? entry.isCurrentUser)
    };
}

function createEmptyLeagueSnapshot(overrides = {}) {
    const entriesSource = Array.isArray(overrides.entries) ? overrides.entries : [];
    const guest = Boolean(overrides.guest ?? true);
    const leagueKey = guest
        ? guestLeagueDef.key
        : getLeagueByKey(overrides.leagueKey || leagueDefs[0].key).key;

    return {
        leagueKey,
        leagueGroup: Math.max(1, Math.floor(Number(overrides.leagueGroup) || 1)),
        cycleId: Math.max(0, Math.floor(Number(overrides.cycleId) || 0)),
        cycleEndsAt: typeof overrides.cycleEndsAt === "string" ? overrides.cycleEndsAt : "",
        guest,
        entries: entriesSource
            .map((entry, index) => normalizeLeagueSnapshotEntry(entry, index))
            .filter(Boolean)
            .slice(0, leaderboardSize)
    };
}

function normalizeLeagueSnapshot(rawSnapshot, fallback = {}) {
    if (!rawSnapshot || typeof rawSnapshot !== "object") {
        return createEmptyLeagueSnapshot(fallback);
    }

    const rawLeagueKey = typeof rawSnapshot.leagueKey === "string"
        ? rawSnapshot.leagueKey
        : (typeof rawSnapshot.league_key === "string" ? rawSnapshot.league_key : "");
    const guest = Boolean(
        rawSnapshot.guest
        ?? rawSnapshot.is_guest
        ?? (rawLeagueKey === guestLeagueDef.key)
        ?? fallback.guest
    );
    const entries = Array.isArray(rawSnapshot.entries) ? rawSnapshot.entries : [];

    return createEmptyLeagueSnapshot({
        leagueKey: guest ? guestLeagueDef.key : rawLeagueKey,
        leagueGroup: rawSnapshot.leagueGroup ?? rawSnapshot.league_group ?? fallback.leagueGroup,
        cycleId: rawSnapshot.cycleId ?? rawSnapshot.cycle_id ?? fallback.cycleId,
        cycleEndsAt: rawSnapshot.cycleEndsAt ?? rawSnapshot.cycle_ends_at ?? fallback.cycleEndsAt,
        guest,
        entries
    });
}

function getCurrentLeagueSnapshot() {
    if (!currentLeagueSnapshot) {
        currentLeagueSnapshot = createEmptyLeagueSnapshot({ guest: !authState.user });
    }

    return currentLeagueSnapshot;
}

function formatLeagueDeadline(timestamp) {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function setCurrentLeagueSnapshot(snapshot) {
    currentLeagueSnapshot = normalizeLeagueSnapshot(snapshot, { guest: !authState.user });
    activeLeagueKey = currentLeagueSnapshot.leagueKey;
}

function getLeagueForScore(score) {
    const normalizedScore = sanitizeScoreValue(score);
    return leagueDefs.reduce((currentLeague, candidateLeague) => {
        if (normalizedScore >= candidateLeague.minScore) {
            return candidateLeague;
        }
        return currentLeague;
    }, leagueDefs[0]);
}

function getLeagueRangeLabel(leagueKey) {
    const league = getLeagueByKey(leagueKey);
    const leagueIndex = leagueDefs.findIndex((entry) => entry.key === league.key);
    const nextLeague = leagueDefs[leagueIndex + 1];

    if (!nextLeague) {
        return `Ab ${league.minScore} Punkten`;
    }

    return `${league.minScore} bis ${nextLeague.minScore - 1} Punkte`;
}

function stripDiacritics(value) {
    return String(value || "")
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "");
}

function normalizeUsername(rawValue) {
    return stripDiacritics(rawValue)
        .toLocaleLowerCase("de-DE")
        .replace(/[^a-z0-9._-]+/g, "")
        .replace(/^[._-]+|[._-]+$/g, "")
        .slice(0, 20);
}

function validateUsername(username) {
    return /^[a-z0-9._-]{3,20}$/.test(username);
}

function sanitizeGuestName(value) {
    const cleaned = String(value || "")
        .replace(/[<>]/g, "")
        .trim()
        .slice(0, 20);

    return cleaned || "Anonym";
}

function getAccountUsername() {
    const profileUsername = authState.profile?.username;
    if (validateUsername(profileUsername || "")) {
        return profileUsername;
    }

    const metadataUsername = authState.user?.user_metadata?.username;
    const normalizedMetadata = normalizeUsername(metadataUsername || "");
    if (validateUsername(normalizedMetadata)) {
        return normalizedMetadata;
    }

    return "";
}

function setAuthStatusMessage(text, type = "normal") {
    authState.statusText = text;
    authState.statusType = type;
    renderAuthUI();
}

function withProfileSyncSuspended(callback) {
    authState.suspendSync = true;
    try {
        return callback();
    } finally {
        authState.suspendSync = false;
    }
}

function getSupabaseConfig() {
    const url = document
        .querySelector('meta[name="koscher-supabase-url"]')
        ?.getAttribute("content")
        ?.trim();
    const key = document
        .querySelector('meta[name="koscher-supabase-key"]')
        ?.getAttribute("content")
        ?.trim();
    const leaderboardTable = document
        .querySelector('meta[name="koscher-supabase-table"]')
        ?.getAttribute("content")
        ?.trim() || "leaderboard";
    const profileTable = document
        .querySelector('meta[name="koscher-supabase-profile-table"]')
        ?.getAttribute("content")
        ?.trim() || "profiles";
    const emailDomain = document
        .querySelector('meta[name="koscher-supabase-email-domain"]')
        ?.getAttribute("content")
        ?.trim() || "koscherspiel.local";

    if (!url || !key) {
        return null;
    }

    return {
        url: url.replace(/\/+$/, ""),
        key,
        leaderboardTable,
        profileTable,
        emailDomain
    };
}

function usernameToEmail(username) {
    const config = getSupabaseConfig();
    const normalizedUsername = normalizeUsername(username);
    if (!config || !validateUsername(normalizedUsername)) {
        return "";
    }

    return `${normalizedUsername}@${config.emailDomain}`;
}

function getStoredUltimateCheatEnabled() {
    try {
        return localStorage.getItem("koscher_ultimate_cheat") === "true";
    } catch {
        return false;
    }
}

function persistUltimateCheatEnabled(enabled) {
    try {
        localStorage.setItem("koscher_ultimate_cheat", enabled ? "true" : "false");
    } catch {
        // Ignorieren: Cheat bleibt dann nur temporär.
    }

    requestProfileSync();

    return enabled;
}

function getStoredCoins() {
    if (getStoredUltimateCheatEnabled()) {
        return maxStoredCoins;
    }

    try {
        const parsed = Number(localStorage.getItem("koscher_coins") || 0);
        return sanitizeCoinValue(parsed);
    } catch {
        return 0;
    }
}

function persistCoins(value) {
    if (getStoredUltimateCheatEnabled()) {
        try {
            localStorage.setItem("koscher_coins", String(maxStoredCoins));
        } catch {
            // Ignorieren: Münzen bleiben dann nur temporär.
        }
        requestProfileSync();
        return maxStoredCoins;
    }

    const normalized = sanitizeCoinValue(value);
    try {
        localStorage.setItem("koscher_coins", String(normalized));
    } catch {
        // Ignorieren: Münzen bleiben dann nur temporär.
    }
    requestProfileSync();
    return normalized;
}

function getStoredUnlockedCarts() {
    try {
        const parsed = JSON.parse(localStorage.getItem("koscher_unlocked_carts") || "[]");
        const unlocked = new Set(["classic"]);
        if (Array.isArray(parsed)) {
            parsed.forEach((key) => {
                if (cartSkinKeys.includes(key)) {
                    unlocked.add(key);
                }
            });
        }
        return Array.from(unlocked);
    } catch {
        return ["classic"];
    }
}

function persistUnlockedCarts(unlockedCartKeys) {
    const sanitized = Array.from(new Set(["classic", ...unlockedCartKeys.filter((key) => cartSkinKeys.includes(key))]));
    try {
        localStorage.setItem("koscher_unlocked_carts", JSON.stringify(sanitized));
    } catch {
        // Ignorieren: Freischaltungen bleiben nur temporär.
    }
    requestProfileSync();
    return sanitized;
}

function getSelectedCart() {
    try {
        const selected = localStorage.getItem("koscher_selected_cart") || "classic";
        return cartSkinKeys.includes(selected) ? selected : "classic";
    } catch {
        return "classic";
    }
}

function persistSelectedCart(cartKey) {
    const nextCart = cartSkinKeys.includes(cartKey) ? cartKey : "classic";
    try {
        localStorage.setItem("koscher_selected_cart", nextCart);
    } catch {
        // Ignorieren: Auswahl bleibt nur temporär.
    }
    requestProfileSync();
    return nextCart;
}

function formatCoins(value) {
    return sanitizeCoinValue(value).toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 1 });
}

function normalizeLeaderboardEntry(entry) {
    if (typeof entry === "number") {
        return {
            userId: "",
            name: "Anonym",
            score: sanitizeScoreValue(entry),
            leagueKey: getLeagueForScore(entry).key,
            updatedAt: ""
        };
    }

    if (!entry || typeof entry !== "object") {
        return null;
    }

    const score = sanitizeScoreValue(Number(entry.score));
    const leagueKey = getLeagueByKey(entry.league_key || entry.leagueKey || getLeagueForScore(score).key).key;
    const userId = typeof entry.user_id === "string"
        ? entry.user_id
        : (typeof entry.userId === "string" ? entry.userId : "");
    const nameSource = typeof entry.username === "string"
        ? entry.username
        : (typeof entry.name === "string" ? entry.name : "");
    const updatedAt = typeof entry.updated_at === "string"
        ? entry.updated_at
        : (typeof entry.updatedAt === "string" ? entry.updatedAt : "");

    return {
        userId,
        name: sanitizeGuestName(nameSource),
        score,
        leagueKey,
        updatedAt
    };
}

function normalizeLeaderboardEntries(rawEntries) {
    if (!Array.isArray(rawEntries)) {
        return [];
    }

    const bestEntriesByIdentity = new Map();

    rawEntries
        .map(normalizeLeaderboardEntry)
        .filter(Boolean)
        .forEach((entry) => {
            const identityKey = entry.userId
                ? `user:${entry.userId}`
                : `guest:${entry.name.toLocaleLowerCase("de-DE")}`;
            const existing = bestEntriesByIdentity.get(identityKey);

            if (!existing || entry.score > existing.score || (entry.score === existing.score && entry.updatedAt > existing.updatedAt)) {
                bestEntriesByIdentity.set(identityKey, {
                    ...entry,
                    leagueKey: getLeagueForScore(entry.score).key
                });
            }
        });

    return Array.from(bestEntriesByIdentity.values()).sort((a, b) => b.score - a.score);
}

function mergeLeaderboardEntries(...entrySets) {
    return normalizeLeaderboardEntries(entrySets.flat());
}

function getStoredLeaderboardEntries() {
    return [];
}

function persistLeaderboardLocally(entries) {
    return normalizeLeaderboardEntries(entries);
}

function leaderboardEntriesForLeague(entries, leagueKey = activeLeagueKey) {
    return normalizeLeaderboardEntries(entries)
        .filter((entry) => entry.leagueKey === getLeagueByKey(leagueKey).key)
        .slice(0, leaderboardSize);
}

function normalizeAbilitiesPayload(abilities) {
    return uniqueAbilityDefs.reduce((acc, ability) => {
        const rawLevel = Number(abilities?.[ability.key]);
        acc[ability.key] = clamp(Math.floor(Number.isFinite(rawLevel) ? rawLevel : 0), 0, ability.maxLevel);
        return acc;
    }, {});
}

function normalizeProfileData(rawProfile = {}, fallbackUsername = "") {
    const normalizedUsername = normalizeUsername(rawProfile.username || fallbackUsername || "");
    const unlockedSource = rawProfile.unlocked_carts ?? rawProfile.unlockedCarts;
    const unlockedCarts = Array.from(new Set(["classic", ...(Array.isArray(unlockedSource) ? unlockedSource : []).filter((key) => cartSkinKeys.includes(key))]));
    const selectedSource = rawProfile.selected_cart ?? rawProfile.selectedCart;
    const selectedCart = unlockedCarts.includes(selectedSource) ? selectedSource : "classic";
    const ultimateCheatEnabled = Boolean(rawProfile.ultimate_cheat_enabled ?? rawProfile.ultimateCheatEnabled);
    const normalizedCoins = ultimateCheatEnabled
        ? maxStoredCoins
        : sanitizeCoinValue(Number(rawProfile.coins));

    return {
        username: validateUsername(normalizedUsername) ? normalizedUsername : "",
        highscore: sanitizeScoreValue(Number(rawProfile.highscore)),
        coins: normalizedCoins,
        unlockedCarts,
        abilities: normalizeAbilitiesPayload(rawProfile.abilities),
        selectedCart,
        ultimateCheatEnabled
    };
}

function getLocalProfileSnapshot() {
    return normalizeProfileData({
        username: getAccountUsername(),
        highscore: getStoredHighscore(),
        coins: getStoredCoins(),
        unlockedCarts: getStoredUnlockedCarts(),
        abilities: getStoredAbilities(),
        selectedCart: getSelectedCart(),
        ultimateCheatEnabled: getStoredUltimateCheatEnabled()
    }, getAccountUsername());
}

function persistProfileSnapshotLocally(profileData) {
    const normalizedProfile = normalizeProfileData(profileData, getAccountUsername());

    withProfileSyncSuspended(() => {
        persistUltimateCheatEnabled(normalizedProfile.ultimateCheatEnabled);
        persistHighscore(normalizedProfile.highscore);
        persistCoins(normalizedProfile.coins);
        persistUnlockedCarts(normalizedProfile.unlockedCarts);
        persistAbilities(normalizedProfile.abilities);
        persistSelectedCart(normalizedProfile.selectedCart);
    });

    return normalizedProfile;
}

function refreshPersistentViews() {
    if (state && !state.running) {
        state = createInitialState();
        state.running = false;
        applyCartSkinClass();
        renderIdleHUD();
        renderShop();
        centerPlayerIdle();
    } else if (!state) {
        renderIdleHUD();
        renderShop();
        centerPlayerIdle();
    } else {
        updateHUD();
        renderShop();
    }

    updateLeagueSummary();
}

function updateLeagueSummary() {
    const snapshot = getCurrentLeagueSnapshot();
    const leagueLabel = getLeagueLabel(snapshot.leagueKey);
    const formattedDeadline = formatLeagueDeadline(snapshot.cycleEndsAt);
    const cycleHint = formattedDeadline
        ? `Nächster Wechsel: ${formattedDeadline}.`
        : `Wechselrhythmus: alle ${leagueRotationDays} Tage.`;

    if (currentLeagueBadge) {
        currentLeagueBadge.textContent = leagueLabel;
        currentLeagueBadge.setAttribute("data-league", snapshot.leagueKey);
    }

    if (currentLeagueRange) {
        currentLeagueRange.textContent = snapshot.guest
            ? `20 Plätze · Bereinigung alle ${leagueRotationDays} Tage`
            : `Gruppe ${snapshot.leagueGroup} · 20 Plätze`;
    }

    if (leagueSummaryText) {
        leagueSummaryText.textContent = snapshot.guest
            ? `Gäste spielen nur in der Gast-Liga. Sie wird alle ${leagueRotationDays} Tage bereinigt. ${cycleHint}`
            : `Du siehst nur deine aktuelle ${leagueLabel}-Liga. Platz 1 bis ${promotionSlots} steigt auf, Platz ${leaderboardSize - demotionSlots + 1} bis ${leaderboardSize} steigt alle ${leagueRotationDays} Tage ab. ${cycleHint}`;
    }
}

function updateLeaderboardHeader() {
    const snapshot = getCurrentLeagueSnapshot();
    const leagueLabel = getLeagueLabel(snapshot.leagueKey);
    const formattedDeadline = formatLeagueDeadline(snapshot.cycleEndsAt);

    if (leaderboardTitle) {
        leaderboardTitle.textContent = snapshot.guest
            ? "Gast-Liga"
            : `${leagueLabel}-Liga`;
    }

    if (leaderboardDescription) {
        leaderboardDescription.textContent = snapshot.guest
            ? `Nur für Gäste. Die Liste wird alle ${leagueRotationDays} Tage bereinigt${formattedDeadline ? `, nächste Bereinigung: ${formattedDeadline}` : ""}.`
            : `Deine aktuelle 20er-Liga${formattedDeadline ? `, nächster Wechsel: ${formattedDeadline}` : ""}.`;
    }

    if (leaderboardMeta) {
        leaderboardMeta.textContent = `Top ${leaderboardSize}`;
    }
}

function renderLeagueTabs() {
    if (leagueTabs) {
        leagueTabs.innerHTML = "";
        leagueTabs.classList.add("hidden");
    }
}

function renderLeaderboard(entries = getCurrentLeagueSnapshot().entries) {
    if (!leaderboardList) return;

    leaderboardList.innerHTML = "";
    updateLeaderboardHeader();

    if (entries.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.textContent = getCurrentLeagueSnapshot().guest
            ? "Noch keine Einträge in der Gast-Liga"
            : "Noch keine Einträge in deiner Liga";
        leaderboardList.appendChild(emptyItem);
        return;
    }

    entries.slice(0, leaderboardSize).forEach((entry) => {
        const item = document.createElement("li");
        item.textContent = `${entry.rank}. ${entry.name}: ${entry.score} Punkte`;

        if (entry.isCurrentUser) {
            item.classList.add("current-user");
        }

        leaderboardList.appendChild(item);
    });
}

function canUseSupabaseClient() {
    return Boolean(authState.client && getSupabaseConfig());
}

function requestProfileSync(options = {}) {
    const immediate = Boolean(options.immediate);

    if (!authState.user || !canUseSupabaseClient() || authState.suspendSync) {
        return;
    }

    if (authState.syncTimerId) {
        window.clearTimeout(authState.syncTimerId);
    }

    authState.syncTimerId = window.setTimeout(() => {
        authState.syncTimerId = null;
        syncProfileToSupabase();
    }, immediate ? 0 : 500);
}

async function syncProfileToSupabase() {
    if (!authState.user || !canUseSupabaseClient() || authState.suspendSync) {
        return;
    }

    if (authState.syncInFlight) {
        authState.syncQueued = true;
        return;
    }

    const config = getSupabaseConfig();
    const username = getAccountUsername();
    if (!config || !validateUsername(username)) {
        return;
    }

    authState.syncInFlight = true;
    renderAuthUI();

    try {
        const snapshot = getLocalProfileSnapshot();
        const payload = {
            id: authState.user.id,
            username,
            highscore: snapshot.highscore,
            coins: snapshot.coins,
            unlocked_carts: snapshot.unlockedCarts,
            abilities: snapshot.abilities,
            selected_cart: snapshot.selectedCart,
            ultimate_cheat_enabled: snapshot.ultimateCheatEnabled,
            updated_at: new Date().toISOString()
        };

        const { error } = await authState.client
            .from(config.profileTable)
            .upsert(payload, { onConflict: "id" });

        if (error) {
            throw error;
        }

        authState.profile = normalizeProfileData(payload, username);
        if (!authState.statusText || authState.statusType !== "error") {
            authState.statusText = `Angemeldet als ${username}. Dein Fortschritt wird synchronisiert.`;
            authState.statusType = "normal";
        }
    } catch {
        authState.statusText = "Supabase-Profil konnte gerade nicht synchronisiert werden.";
        authState.statusType = "error";
    } finally {
        authState.syncInFlight = false;
        renderAuthUI();

        if (authState.syncQueued) {
            authState.syncQueued = false;
            requestProfileSync({ immediate: true });
        }
    }
}

async function loadProfileFromSupabase() {
    if (!authState.user || !canUseSupabaseClient()) {
        return null;
    }

    const config = getSupabaseConfig();
    const { data, error } = await authState.client
        .from(config.profileTable)
        .select("username, highscore, coins, unlocked_carts, abilities, selected_cart, ultimate_cheat_enabled")
        .eq("id", authState.user.id)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
}

function applyAuthenticatedProfile(rawProfile) {
    const fallbackUsername = getAccountUsername();
    const localProfile = getLocalProfileSnapshot();
    const remoteProfile = normalizeProfileData(rawProfile || {}, fallbackUsername);
    const mergedUnlockedCarts = Array.from(new Set([
        "classic",
        ...localProfile.unlockedCarts,
        ...remoteProfile.unlockedCarts
    ].filter((key) => cartSkinKeys.includes(key))));
    const mergedAbilities = uniqueAbilityDefs.reduce((acc, ability) => {
        acc[ability.key] = Math.max(localProfile.abilities[ability.key] || 0, remoteProfile.abilities[ability.key] || 0);
        return acc;
    }, {});
    const mergedProfile = normalizeProfileData({
        username: remoteProfile.username || localProfile.username || fallbackUsername,
        highscore: Math.max(localProfile.highscore, remoteProfile.highscore),
        coins: Math.max(localProfile.coins, remoteProfile.coins),
        unlockedCarts: mergedUnlockedCarts,
        abilities: mergedAbilities,
        selectedCart: remoteProfile.selectedCart && mergedUnlockedCarts.includes(remoteProfile.selectedCart)
            ? remoteProfile.selectedCart
            : (localProfile.selectedCart && mergedUnlockedCarts.includes(localProfile.selectedCart) ? localProfile.selectedCart : "classic"),
        ultimateCheatEnabled: localProfile.ultimateCheatEnabled || remoteProfile.ultimateCheatEnabled
    }, fallbackUsername);

    authState.profile = mergedProfile;
    persistProfileSnapshotLocally(mergedProfile);
    renderLeagueTabs();
    refreshPersistentViews();
    requestProfileSync({ immediate: true });
}

function renderAuthUI() {
    const supabaseConfigured = Boolean(getSupabaseConfig());
    const signedIn = Boolean(authState.user);
    const username = getAccountUsername();

    if (accountModeBadge) {
        accountModeBadge.classList.remove("online", "syncing");
        accountModeBadge.textContent = supabaseConfigured ? "Gast-Liga" : "Offline";

        if (signedIn) {
            accountModeBadge.textContent = authState.syncInFlight ? "Synchronisiert..." : `Online: ${username}`;
            accountModeBadge.classList.add(authState.syncInFlight ? "syncing" : "online");
        }
    }

    if (authUsernameInput) {
        if (signedIn) {
            authUsernameInput.value = username;
            authUsernameInput.disabled = false;
            authUsernameInput.readOnly = true;
        } else {
            authUsernameInput.readOnly = false;
            authUsernameInput.disabled = authState.processing || !supabaseConfigured;
        }
    }

    if (authPasswordInput) {
        if (signedIn) {
            authPasswordInput.value = "";
            authPasswordInput.disabled = true;
            authPasswordInput.placeholder = "Angemeldet";
        } else {
            authPasswordInput.disabled = authState.processing || !supabaseConfigured;
            authPasswordInput.placeholder = "Mindestens 6 Zeichen";
        }
    }

    if (signInButton) {
        signInButton.classList.toggle("hidden", signedIn);
        signInButton.disabled = authState.processing || !supabaseConfigured;
    }

    if (signUpButton) {
        signUpButton.classList.toggle("hidden", signedIn);
        signUpButton.disabled = authState.processing || !supabaseConfigured;
    }

    if (signOutButton) {
        signOutButton.classList.toggle("hidden", !signedIn);
        signOutButton.disabled = authState.processing;
    }

    if (authStatus) {
        authStatus.classList.toggle("error", authState.statusType === "error");

        if (!supabaseConfigured) {
            authStatus.textContent = "Supabase ist noch nicht vollständig konfiguriert. Die Ligafunktion ist deshalb derzeit nicht verfügbar.";
        } else if (authState.statusText) {
            authStatus.textContent = authState.statusText;
        } else if (signedIn) {
            authStatus.textContent = `Angemeldet als ${username}. Highscore, Münzen, Käufe und Liga werden mit Supabase geteilt.`;
        } else {
            authStatus.textContent = `Nicht angemeldet. Gäste spielen in einer separaten Liga, die alle ${leagueRotationDays} Tage bereinigt wird.`;
        }
    }

    configureLeaderboardOptIn();
}

async function handleAuthSession(session) {
    authState.user = session?.user || null;

    if (!authState.user) {
        authState.profile = null;
        if (authState.statusType !== "error") {
            authState.statusText = "";
            authState.statusType = "normal";
        }
        renderAuthUI();
        renderLeagueTabs();
        loadLeaderboard();
        return;
    }

    try {
        const remoteProfile = await loadProfileFromSupabase();
        applyAuthenticatedProfile(remoteProfile);
        setAuthStatusMessage(`Angemeldet als ${getAccountUsername()}.`, "normal");
    } catch {
        authState.profile = getLocalProfileSnapshot();
        requestProfileSync({ immediate: true });
        refreshPersistentViews();
        setAuthStatusMessage("Anmeldung erfolgreich, aber das Supabase-Profil konnte noch nicht geladen werden.", "error");
    }

    renderAuthUI();
    loadLeaderboard();
}

function initializeSupabase() {
    const config = getSupabaseConfig();
    if (!config) {
        renderAuthUI();
        return;
    }

    if (!window.supabase?.createClient) {
        setAuthStatusMessage("Die Supabase-Bibliothek konnte nicht geladen werden.");
        return;
    }

    authState.client = window.supabase.createClient(config.url, config.key, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    });

    authState.client.auth.onAuthStateChange((_event, session) => {
        handleAuthSession(session);
    });

    authState.client.auth.getSession()
        .then(({ data, error }) => {
            if (error) {
                throw error;
            }

            handleAuthSession(data.session || null);
        })
        .catch(() => {
            setAuthStatusMessage("Supabase-Session konnte nicht geladen werden.", "error");
            renderAuthUI();
        });
}

async function signInWithUsername() {
    const username = normalizeUsername(authUsernameInput?.value || "");
    const password = authPasswordInput?.value || "";
    const email = usernameToEmail(username);

    if (authUsernameInput) {
        authUsernameInput.value = username;
    }

    if (!validateUsername(username)) {
        setAuthStatusMessage("Benutzernamen dürfen nur Kleinbuchstaben, Zahlen, Punkt, Unterstrich oder Bindestrich enthalten und müssen 3 bis 20 Zeichen lang sein.", "error");
        return;
    }

    if (password.length < 6) {
        setAuthStatusMessage("Das Passwort muss mindestens 6 Zeichen lang sein.", "error");
        return;
    }

    authState.processing = true;
    renderAuthUI();

    try {
        const { error } = await authState.client.auth.signInWithPassword({ email, password });
        if (error) {
            throw error;
        }

        if (authPasswordInput) {
            authPasswordInput.value = "";
        }

        setAuthStatusMessage(`Willkommen zurück, ${username}.`, "normal");
    } catch {
        setAuthStatusMessage("Anmeldung fehlgeschlagen. Prüfe Benutzername und Passwort.", "error");
    } finally {
        authState.processing = false;
        renderAuthUI();
    }
}

async function signUpWithUsername() {
    const username = normalizeUsername(authUsernameInput?.value || "");
    const password = authPasswordInput?.value || "";
    const email = usernameToEmail(username);

    if (authUsernameInput) {
        authUsernameInput.value = username;
    }

    if (!validateUsername(username)) {
        setAuthStatusMessage("Benutzernamen dürfen nur Kleinbuchstaben, Zahlen, Punkt, Unterstrich oder Bindestrich enthalten und müssen 3 bis 20 Zeichen lang sein.", "error");
        return;
    }

    if (password.length < 6) {
        setAuthStatusMessage("Das Passwort muss mindestens 6 Zeichen lang sein.", "error");
        return;
    }

    authState.processing = true;
    renderAuthUI();

    try {
        const { data, error } = await authState.client.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username
                }
            }
        });

        if (error) {
            throw error;
        }

        if (authPasswordInput) {
            authPasswordInput.value = "";
        }

        if (data.session) {
            setAuthStatusMessage(`Konto ${username} wurde erstellt. Du bist jetzt angemeldet.`, "normal");
        } else {
            setAuthStatusMessage("Konto erstellt. Falls keine Sitzung geöffnet wurde, deaktiviere in Supabase die E-Mail-Bestätigung für diese Login-Art.", "error");
        }
    } catch {
        setAuthStatusMessage("Konto konnte nicht erstellt werden. Der Benutzername ist möglicherweise schon vergeben.", "error");
    } finally {
        authState.processing = false;
        renderAuthUI();
    }
}

async function signOutAccount() {
    if (!authState.client) return;

    authState.processing = true;
    renderAuthUI();

    try {
        const { error } = await authState.client.auth.signOut();
        if (error) {
            throw error;
        }

        authState.profile = null;
        setAuthStatusMessage("Du bist jetzt abgemeldet.", "normal");
    } catch {
        setAuthStatusMessage("Abmeldung fehlgeschlagen.", "error");
    } finally {
        authState.processing = false;
        renderAuthUI();
    }
}

async function loadLeaderboardFromSupabase() {
    if (!canUseSupabaseClient()) {
        return createEmptyLeagueSnapshot({ guest: !authState.user });
    }

    const rpcName = authState.user
        ? "koscher_get_my_league_snapshot"
        : "koscher_get_guest_league_snapshot";
    const { data, error } = await authState.client.rpc(rpcName);

    if (error) {
        throw error;
    }

    return normalizeLeagueSnapshot(data, { guest: !authState.user });
}

async function loadLeaderboard() {
    renderLeagueTabs();
    updateLeaderboardHeader();

    if (!canUseSupabaseClient()) {
        setCurrentLeagueSnapshot(createEmptyLeagueSnapshot({ guest: !authState.user }));
        renderLeaderboard([]);
        return;
    }

    try {
        const snapshot = await loadLeaderboardFromSupabase();
        setCurrentLeagueSnapshot(snapshot);
        updateLeagueSummary();
        renderLeaderboard(snapshot.entries);
    } catch {
        setCurrentLeagueSnapshot(createEmptyLeagueSnapshot({ guest: !authState.user, leagueKey: activeLeagueKey }));
        updateLeagueSummary();
        renderLeaderboard([]);
    }
}

async function saveLeaderboardToSupabase(score) {
    if (!authState.user || !canUseSupabaseClient()) {
        throw new Error("Kein Supabase-Login vorhanden.");
    }

    const { data, error } = await authState.client.rpc("koscher_submit_authenticated_score", {
        input_score: sanitizeScoreValue(score)
    });

    if (error) {
        throw error;
    }

    return normalizeLeagueSnapshot(data, { guest: false });
}

async function saveGuestLeaderboardToSupabase(name, score) {
    if (!canUseSupabaseClient()) {
        throw new Error("Keine Serververbindung verfügbar.");
    }

    const { data, error } = await authState.client.rpc("koscher_submit_guest_score", {
        input_username: sanitizeGuestName(name),
        input_score: sanitizeScoreValue(score)
    });

    if (error) {
        throw error;
    }

    return normalizeLeagueSnapshot(data, { guest: true, leagueKey: guestLeagueDef.key });
}

async function saveLeaderboard(name, score) {
    const normalizedScore = sanitizeScoreValue(score);

    try {
        const snapshot = authState.user && validateUsername(getAccountUsername())
            ? await saveLeaderboardToSupabase(normalizedScore)
            : await saveGuestLeaderboardToSupabase(name, normalizedScore);

        setCurrentLeagueSnapshot(snapshot);
        updateLeagueSummary();
        renderLeaderboard(snapshot.entries);

        return {
            savedOnServer: true,
            leagueKey: snapshot.leagueKey,
            guest: snapshot.guest
        };
    } catch {
        return {
            savedOnServer: false,
            leagueKey: authState.user ? activeLeagueKey : guestLeagueDef.key,
            guest: !authState.user
        };
    }
}

function getStoredAbilities() {
    const defaults = uniqueAbilityDefs.reduce((acc, ability) => {
        acc[ability.key] = 0;
        return acc;
    }, {});
    try {
        const parsed = JSON.parse(localStorage.getItem("koscher_abilities") || "{}");
        if (!parsed || typeof parsed !== "object") {
            return defaults;
        }

        return uniqueAbilityDefs.reduce((acc, ability) => {
            const rawLevel = Number(parsed[ability.key]);
            acc[ability.key] = clamp(Math.floor(Number.isFinite(rawLevel) ? rawLevel : 0), 0, ability.maxLevel);
            return acc;
        }, { ...defaults });
    } catch {
        return defaults;
    }
}

function persistAbilities(abilities) {
    const normalized = uniqueAbilityDefs.reduce((acc, ability) => {
        const rawLevel = Number(abilities[ability.key]);
        acc[ability.key] = clamp(Math.floor(Number.isFinite(rawLevel) ? rawLevel : 0), 0, ability.maxLevel);
        return acc;
    }, {});

    try {
        localStorage.setItem("koscher_abilities", JSON.stringify(normalized));
    } catch {
        // Ignorieren: Upgrades bleiben nur temporär.
    }

    requestProfileSync();
    return normalized;
}

function createInitialState() {
    const unlockedCarts = getStoredUnlockedCarts();
    const preferredCart = getSelectedCart();
    const selectedCart = unlockedCarts.includes(preferredCart) ? preferredCart : "classic";

    return {
        running: true,
        leaderboardSubmitted: false,
        score: 0,
        coins: getStoredCoins(),
        ultimateCheatEnabled: getStoredUltimateCheatEnabled(),
        lives: 3,
        level: 1,
        playerX: 0,
        playerY: 0,
        jumpVelocityY: 0,
        isMoving: false,
        spawnTimer: 0,
        items: [],
        highscore: getStoredHighscore(),
        abilities: getStoredAbilities(),
        currentShopTab: "abilities",
        selectedCart,
        unlockedCarts,
        cartSecondChancesUsed: 0,
        activePowerups: {
            shield: 0,
            slow: 0,
            double: 0,
            grow: 0,
            magnet: 0
        }
    };
}

function gameWidth() {
    return game.clientWidth;
}

function gameHeight() {
    return game.clientHeight;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function abilityByKey(key) {
    return uniqueAbilityDefs.find((ability) => ability.key === key);
}

function getAbilityLevel(key) {
    if (!state) return 0;
    const ability = abilityByKey(key);
    if (!ability) return 0;
    return clamp(Math.floor(Number(state.abilities[key]) || 0), 0, ability.maxLevel);
}

function getAbilityValue(key, level = getAbilityLevel(key)) {
    const ability = abilityByKey(key);
    if (!ability) return 0;

    const value = level * ability.valuePerLevel;
    if (typeof ability.maxValue === "number") {
        return Math.min(ability.maxValue, value);
    }
    return value;
}

function currentCartSkin() {
    if (!state) return cartSkins[0];
    return cartSkins.find((skin) => skin.key === state.selectedCart) || cartSkins[0];
}

function applyCartSkinClass() {
    if (!player) return;

    player.classList.remove(...cartSkinKeys.map((key) => `cart-skin-${key}`));
    const skin = currentCartSkin();
    player.classList.add(`cart-skin-${skin.key}`);
    player.style.setProperty("--cart-image", `url('${skin.image}')`);
}

function switchShopTab(tabKey) {
    if (!state || !["carts", "abilities"].includes(tabKey)) return;
    state.currentShopTab = tabKey;
    renderShop();
}

function renderShop() {
    if (!shopList || !abilityShopList || !state) return;

    const cartsTabActive = state.currentShopTab !== "abilities";
    shopList.classList.toggle("hidden", !cartsTabActive);
    abilityShopList.classList.toggle("hidden", cartsTabActive);

    if (cartShopTab) {
        cartShopTab.classList.toggle("active", cartsTabActive);
        cartShopTab.setAttribute("aria-selected", String(cartsTabActive));
    }
    if (abilityShopTab) {
        abilityShopTab.classList.toggle("active", !cartsTabActive);
        abilityShopTab.setAttribute("aria-selected", String(!cartsTabActive));
    }

    shopList.innerHTML = "";

    cartSkins.forEach((skin) => {
        const item = document.createElement("article");
        item.className = "shop-item";

        const unlocked = state.unlockedCarts.includes(skin.key);
        const selected = state.selectedCart === skin.key;
        const affordable = state.coins >= skin.cost;
        const hasPrerequisites = hasCartPrerequisites(skin.key);
        const canBuy = affordable && hasPrerequisites;

        if (selected) item.classList.add("selected");
        if (!unlocked && !canBuy) item.classList.add("locked");

        let status = unlocked ? (selected ? "Ausgewählt" : "Freigeschaltet") : `Preis: ${formatCoins(skin.cost)} Münzen`;
        if (!unlocked && !hasPrerequisites && skin.key === "ultimate") {
            status = "Voraussetzung: Kaufe zuerst alle anderen Wagen.";
        }
        const buttonLabel = unlocked ? (selected ? "Aktiv" : "Auswählen") : "Kaufen";

        item.innerHTML = `
            <h3>${skin.label}</h3>
            <p class="shop-power">Kraft: ${skin.power}</p>
            <p class="shop-description">${skin.description}</p>
            <p class="shop-status">${status}</p>
            <button type="button" data-cart-key="${skin.key}">${buttonLabel}</button>
        `;

        const button = item.querySelector("button");
        if (button) {
            button.disabled = selected || (!unlocked && !canBuy);
        }

        shopList.appendChild(item);
    });

    abilityShopList.innerHTML = "";
    uniqueAbilityDefs.forEach((ability) => {
        const currentLevel = getAbilityLevel(ability.key);
        const currentValue = getAbilityValue(ability.key, currentLevel);
        const nextValue = getAbilityValue(ability.key, currentLevel + 1);
        const formatValue = ability.valueFormatter || ((value) => String(value));
        const maxed = currentLevel >= ability.maxLevel;
        const affordable = state.coins >= ability.costPerLevel;

        const item = document.createElement("article");
        item.className = "shop-item";
        if (maxed) item.classList.add("selected");
        if (!maxed && !affordable) item.classList.add("locked");

        const status = maxed
            ? `Max. erreicht (${formatValue(currentValue)})`
            : `Level ${currentLevel}/${ability.maxLevel} · Nächstes Upgrade: ${formatValue(nextValue)}`;

        item.innerHTML = `
            <h3>${ability.label}</h3>
            <p class="shop-power">${ability.statLabel}: ${formatValue(currentValue)}</p>
            <p class="shop-description">${ability.description}</p>
            <p class="shop-status">${status}</p>
            <button type="button" data-ability-key="${ability.key}">${maxed ? "Max" : `Upgrade (${formatCoins(ability.costPerLevel)} Münzen)`}</button>
        `;

        const button = item.querySelector("button");
        if (button) button.disabled = maxed || !affordable;

        abilityShopList.appendChild(item);
    });
}

function hasCartPrerequisites(cartKey) {
    if (!state) return false;
    if (cartKey !== "ultimate") return true;

    return ultimateRequiredCarts.every((requiredKey) => state.unlockedCarts.includes(requiredKey));
}

function buyAbility(abilityKey) {
    if (!state) return;
    const ability = abilityByKey(abilityKey);
    if (!ability) return;

    const currentLevel = state.abilities[abilityKey] || 0;
    if (currentLevel >= ability.maxLevel) {
        setStatus("Dieses Upgrade ist bereits auf Maximum.");
        return;
    }
    if (state.coins < ability.costPerLevel) {
        setStatus("Nicht genug Münzen.", "danger");
        return;
    }

    state.coins = persistCoins(state.coins - ability.costPerLevel);
    state.abilities[abilityKey] = currentLevel + 1;
    state.abilities = persistAbilities(state.abilities);
    updateHUD();
    renderShop();
    setStatus(`${ability.label} verbessert!`);
}

function selectCart(cartKey) {
    if (!state) return;
    if (!state.unlockedCarts.includes(cartKey)) return;

    state.selectedCart = persistSelectedCart(cartKey);
    applyCartSkinClass();
    renderShop();
    setStatus(`Aktiver Wagen: ${currentCartSkin().label}`);
}

function buyCart(cartKey) {
    if (!state) return;

    const skin = cartSkins.find((entry) => entry.key === cartKey);
    if (!skin) return;

    if (state.unlockedCarts.includes(cartKey)) {
        selectCart(cartKey);
        return;
    }

    if (state.coins < skin.cost) {
        setStatus("Nicht genug Münzen.", "danger");
        return;
    }

    if (!hasCartPrerequisites(cartKey)) {
        setStatus("Du musst zuerst alle anderen Wagen kaufen.", "danger");
        return;
    }

    state.coins = persistCoins(state.coins - skin.cost);
    state.unlockedCarts = persistUnlockedCarts([...state.unlockedCarts, cartKey]);
    state.selectedCart = persistSelectedCart(cartKey);
    applyCartSkinClass();
    updateHUD();
    renderShop();
    setStatus(`${skin.label} gekauft!`);
}

function activePowerupLabel() {
    if (!state) return "Keins";

    const now = Date.now();
    const active = powerupTypes
        .filter((type) => state.activePowerups[type.key] > now)
        .map((type) => type.label);

    return active.length > 0 ? active.join(", ") : "Keins";
}

function updateHUD() {
    if (!state) return;
    scoreDisplay.textContent = String(state.score);
    livesDisplay.textContent = String(state.lives);
    levelDisplay.textContent = String(state.level);
    highscoreDisplay.textContent = String(state.highscore);
    if (coinsDisplay) coinsDisplay.textContent = formatCoins(state.coins);
    powerupStateDisplay.textContent = activePowerupLabel();
    updateLeagueSummary(state.highscore);
}

function renderIdleHUD() {
    scoreDisplay.textContent = "0";
    livesDisplay.textContent = "3";
    levelDisplay.textContent = "1";
    highscoreDisplay.textContent = String(getStoredHighscore());
    if (coinsDisplay) coinsDisplay.textContent = formatCoins(getStoredCoins());
    powerupStateDisplay.textContent = "Keins";
    updateLeagueSummary(getStoredHighscore());
}

function configureLeaderboardOptIn(score = state?.score || 0) {
    if (!leaderboardOptIn) return;

    const snapshot = getCurrentLeagueSnapshot();
    const leagueLabel = getLeagueLabel(snapshot.leagueKey);
    const accountUsername = getAccountUsername();
    const signedIn = Boolean(authState.user && validateUsername(accountUsername));

    if (leaderboardPrompt) {
        leaderboardPrompt.textContent = signedIn
            ? `Dein Lauf wird in deiner aktuellen ${leagueLabel}-Liga gespeichert. Möchtest du ihn als ${accountUsername} eintragen?`
            : `Ohne Login wird dein Lauf in der Gast-Liga gespeichert. Diese wird alle ${leagueRotationDays} Tage bereinigt.`;
    }

    if (playerNameLabel) {
        playerNameLabel.textContent = signedIn ? "Account" : "Gastname";
    }

    if (playerNameInput) {
        if (signedIn) {
            playerNameInput.value = accountUsername;
            playerNameInput.readOnly = true;
            playerNameInput.disabled = false;
            playerNameInput.placeholder = accountUsername;
        } else {
            playerNameInput.readOnly = false;
            playerNameInput.disabled = false;
            playerNameInput.placeholder = "Name eingeben";
        }
    }

    if (leaderboardAuthHint) {
        leaderboardAuthHint.classList.toggle("error", false);
        leaderboardAuthHint.textContent = signedIn
            ? `Es zählt dein bester Lauf im aktuellen ${leagueRotationDays}-Tage-Zyklus. Platz 1 bis ${promotionSlots} steigt auf, Platz ${leaderboardSize - demotionSlots + 1} bis ${leaderboardSize} steigt ab.`
            : `Ohne Login spielst du nur in der Gast-Liga. Auch dort werden Einträge nicht lokal gespeichert.`;
    }

    if (saveLeaderboardButton) {
        saveLeaderboardButton.textContent = signedIn
            ? `In ${leagueLabel} speichern`
            : "In Gast-Liga speichern";
    }

    if (skipLeaderboardButton) {
        skipLeaderboardButton.textContent = signedIn ? "Ohne Eintrag" : "Überspringen";
    }
}

function setStatus(text, type = "normal") {
    if (!statusDisplay) return;

    statusDisplay.textContent = text;
    statusDisplay.classList.remove("hidden", "danger");

    if (type === "danger") {
        statusDisplay.classList.add("danger");
    }

    if (statusTimeoutId) {
        window.clearTimeout(statusTimeoutId);
    }

    statusTimeoutId = window.setTimeout(() => {
        statusDisplay.classList.add("hidden");
    }, 900);
}

function currentPlayerWidth() {
    if (!state) return basePlayerWidth;
    return hasPowerup("grow") ? basePlayerWidth * growMultiplier : basePlayerWidth;
}

function syncPlayerSize() {
    player.style.width = `${currentPlayerWidth()}px`;
}

function positionPlayer() {
    syncPlayerSize();
    player.style.transform = `translate(${state.playerX}px, ${state.playerY}px)`;
}

function centerPlayerIdle() {
    player.style.width = `${basePlayerWidth}px`;
    const centeredX = (gameWidth() - basePlayerWidth) / 2;
    player.style.transform = `translate(${Math.max(0, centeredX)}px, 0)`;
}

function clearItems() {
    game.querySelectorAll(".item").forEach((itemEl) => itemEl.remove());
    if (state) {
        state.items = [];
    }
}

function currentSpawnInterval() {
    return Math.max(420, 1000 - (state.level - 1) * 80);
}

function hasPowerup(powerupKey) {
    return state.activePowerups[powerupKey] > Date.now();
}

function currentFallSpeed() {
    const baseSpeed = 120 + (state.level - 1) * 22;
    return hasPowerup("slow") ? baseSpeed * 0.68 : baseSpeed;
}

function getFoodEmoji(name = "", isKosher = true) {
    const normalized = String(name).toLocaleLowerCase("de-DE").replace(/\s+/g, "");
    if (foodEmojiMap[normalized]) {
        return foodEmojiMap[normalized];
    }

    const emojiList = isKosher ? kosherEmojiFallback : nonKosherEmojiFallback;
    return emojiList[Math.floor(Math.random() * emojiList.length)] || "🍽️";
}

function spawnPowerup() {
    const type = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
    return {
        isPowerup: true,
        powerupType: type.key,
        className: `item powerup ${type.colorClass}`,
        icon: type.icon,
        label: type.label
    };
}

function spawnFood() {
    const isKosher = Math.random() < 0.82;

    if (Math.random() < emojiFoodSpawnChance) {
        const emojiFoods = isKosher ? kosherEmojiFoods : nonKosherEmojiFoods;
        const selectedEmojiFood = emojiFoods[Math.floor(Math.random() * emojiFoods.length)];

        return {
            isPowerup: false,
            isKosher,
            className: "item",
            label: selectedEmojiFood.name,
            emoji: selectedEmojiFood.emoji,
            emojiOnly: true
        };
    }

    const foodList = isKosher ? kosherFoods : nonKosherFoods;
    const selectedFood = foodList[Math.floor(Math.random() * foodList.length)];

    return {
        isPowerup: false,
        isKosher,
        className: "item",
        image: selectedFood.image,
        label: selectedFood.name,
        emoji: getFoodEmoji(selectedFood.name, isKosher),
        emojiOnly: Math.random() < 0.45
    };
}

function spawnItem() {
    const itemEl = document.createElement("div");
    const spawned = Math.random() < 0.12 ? spawnPowerup() : spawnFood();
    itemEl.className = spawned.className;

    const x = Math.random() * (gameWidth() - itemWidth);
    const y = -40;

    if (spawned.isPowerup) {
        itemEl.textContent = spawned.icon;
        itemEl.setAttribute("role", "img");
        itemEl.setAttribute("aria-label", spawned.label);
    } else if (spawned.emojiOnly) {
        itemEl.classList.add("emoji-item");
        itemEl.textContent = spawned.emoji || "🍽️";
    } else {
        const img = document.createElement("img");
        img.src = spawned.image;
        img.alt = spawned.label;
        itemEl.appendChild(img);
    }

    itemEl.style.transform = `translate(${x}px, ${y}px)`;
    game.appendChild(itemEl);

    state.items.push({
        el: itemEl,
        x,
        y,
        isPowerup: spawned.isPowerup,
        powerupType: spawned.powerupType,
        isKosher: spawned.isKosher
    });
}

function intersects(a, b) {
    return !(
        a.x + a.width < b.x ||
        a.x > b.x + b.width ||
        a.y + a.height < b.y ||
        a.y > b.y + b.height
    );
}

function activatePowerup(powerupKey) {
    const durationBonus = getAbilityValue("powerupMastery");
    const powerupDuration = powerupDurationMs * (1 + durationBonus);
    state.activePowerups[powerupKey] = Date.now() + powerupDuration;
    const powerup = powerupTypes.find((type) => type.key === powerupKey);
    setStatus(`Power-Up aktiv: ${powerup.label}`);
    updateHUD();
}

function consumeShieldIfActive() {
    if (!hasPowerup("shield")) {
        return false;
    }

    state.activePowerups.shield = 0;
    setStatus("Schutzschild hat dich gerettet!");
    updateHUD();
    return true;
}

function hasCartPower(cartKey) {
    return Boolean(state && state.selectedCart === cartKey);
}

function cartSavedDamage() {
    if (!hasCartPower("sky") && !hasCartPower("ultimate")) {
        return false;
    }

    const saveChance = hasCartPower("ultimate") ? 0.30 : 0.25;
    if (Math.random() < saveChance) {
        const cartName = hasCartPower("ultimate") ? "Ultimate" : "Himmelblau";
        setStatus(`${cartName} hat den Schaden abgewehrt!`);
        return true;
    }

    return false;
}

function abilitySavedDamage() {
    const chance = getAbilityValue("nonKosherShield");
    if (chance <= 0) return false;

    if (Math.random() < chance) {
        setStatus(`Upgrade-Schutz ausgelöst (${Math.round(chance * 100)}%)!`);
        return true;
    }

    return false;
}

function handleCatch(item, index) {
    if (item.isPowerup) {
        if (item.powerupType === "life") {
            state.lives += 1;
            setStatus("+1 Leben durch Power-Up!");
            updateHUD();
        } else {
            activatePowerup(item.powerupType);
        }
        removeItem(index);
        return;
    }

    if (item.isKosher) {
        const scoreMultiplier = 1 + getAbilityValue("scoreMultiplier");
        const basePoints = hasPowerup("double") ? 2 : 1;
        const points = hasCartPower("ultimate") ? basePoints * 2.5 : basePoints + (hasCartPower("mint") ? 1 : 0);
        const focusChance = getAbilityValue("kosherFocus");
        const bonusPoint = focusChance > 0 && Math.random() < focusChance ? 1 : 0;
        const gainedScore = (points + bonusPoint) * scoreMultiplier;
        state.score += gainedScore;
        const multiplierText = scoreMultiplier > 1 ? ` (Multiplikator x${scoreMultiplier.toFixed(1).replace(".", ",")})` : "";
        setStatus(`+${gainedScore} Koscher${bonusPoint ? " (Fokus-Bonus!)" : ""}${multiplierText}!`);
    } else if (!consumeShieldIfActive() && !cartSavedDamage() && !abilitySavedDamage()) {
        state.lives -= 1;
        state.score = Math.max(0, state.score - 1);
        setStatus("-1 Leben: Nicht koscher!", "danger");
    }

    removeItem(index);
    recalcLevel();

    updateHUD();

    if (state.lives <= 0 && !tryCartSecondChance()) {
        endGame("Keine Leben mehr.");
    }
}

function handleMissed(item, index) {
    if (!item.isPowerup && item.isKosher && !consumeShieldIfActive()) {
        state.lives -= 1;
        setStatus("Koscher verpasst!", "danger");
        updateHUD();
    }

    removeItem(index);

    if (state.lives <= 0 && !tryCartSecondChance()) {
        endGame("Zu viele koschere Lebensmittel verpasst.");
    }
}

function removeItem(index) {
    const [removed] = state.items.splice(index, 1);
    if (removed) {
        removed.el.remove();
    }
}

function tryCartSecondChance() {
    const hasSecondChance = hasCartPower("violet") || hasCartPower("ultimate");
    if (!hasSecondChance || state.lives > 0) {
        return false;
    }

    const maxSecondChances = hasCartPower("ultimate") ? 2 : 1;
    if (state.cartSecondChancesUsed >= maxSecondChances) return false;

    state.cartSecondChancesUsed += 1;
    state.lives = 1;
    const cartName = hasCartPower("ultimate") ? "Ultimate" : "Violett";
    setStatus(`${cartName} rettet dich: zweite Chance!`, "danger");
    updateHUD();
    return true;
}

function recalcLevel() {
    state.level = Math.floor(state.score / 8) + 1;
}

function currentPlayerSpeed() {
    if (!state) return playerSpeed;

    const speedAbilityMultiplier = 1 + getAbilityValue("speedBoost");
    const levelSpeedBoost = state.level < 5 ? playerSpeed : playerSpeed + (state.level - 4) * 28;
    const boostedLevelSpeed = levelSpeedBoost * speedAbilityMultiplier;
    const fallSpeed = currentFallSpeed();
    const crossDistance = Math.max(1, gameWidth() - currentPlayerWidth());
    const fallDistance = Math.max(1, gameHeight() + itemWidth);
    const minimumCatchableSpeed = (crossDistance / fallDistance) * fallSpeed * 1.2;

    return Math.max(boostedLevelSpeed, minimumCatchableSpeed);
}

function jumpPlayer() {
    if (!state || !state.running) return;
    if (!hasCartPower("jumper") && !hasCartPower("ultimate")) return;
    if (state.playerY < 0) return;

    state.jumpVelocityY = -jumpVelocity;
    setStatus("Sprung!");
}

function updateJump(deltaSeconds) {
    if (!state) return;

    state.jumpVelocityY += gravity * deltaSeconds;
    state.playerY += state.jumpVelocityY * deltaSeconds;

    if (state.playerY > 0) {
        state.playerY = 0;
        state.jumpVelocityY = 0;
    }
}

function updatePlayer(deltaSeconds) {
    const move = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
    state.isMoving = move !== 0;

    if (move !== 0) {
        state.playerX += move * currentPlayerSpeed() * deltaSeconds;
        state.playerX = clamp(state.playerX, 0, gameWidth() - currentPlayerWidth());
    }

    updateJump(deltaSeconds);
    positionPlayer();
}

function updateItems(deltaSeconds) {
    const playerRect = {
        x: state.playerX,
        y: gameHeight() - 14 - 36 + state.playerY,
        width: currentPlayerWidth(),
        height: 36
    };

    for (let i = state.items.length - 1; i >= 0; i -= 1) {
        const item = state.items[i];

        if (!item.isPowerup && item.isKosher && hasPowerup("magnet") && state.isMoving) {
            const targetX = state.playerX + (currentPlayerWidth() - itemWidth) / 2;
            const dx = targetX - item.x;
            const magnetStep = Math.min(Math.abs(dx), magnetPullSpeed * deltaSeconds);
            item.x += Math.sign(dx) * magnetStep;
            item.x = clamp(item.x, 0, gameWidth() - itemWidth);
        }

        item.y += currentFallSpeed() * deltaSeconds;
        item.el.style.transform = `translate(${item.x}px, ${item.y}px)`;

        const itemRect = {
            x: item.x,
            y: item.y,
            width: itemWidth,
            height: itemWidth
        };

        if (intersects(itemRect, playerRect)) {
            handleCatch(item, i);
            continue;
        }

        if (item.y > gameHeight()) {
            handleMissed(item, i);
        }
    }
}

function clearExpiredPowerups() {
    const now = Date.now();
    let changed = false;

    powerupTypes.forEach((type) => {
        if (state.activePowerups[type.key] > 0 && state.activePowerups[type.key] <= now) {
            state.activePowerups[type.key] = 0;
            changed = true;
        }
    });

    if (changed) {
        updateHUD();
    }
}

function updateSpawn(deltaSeconds) {
    state.spawnTimer += deltaSeconds * 1000;
    const interval = currentSpawnInterval();

    if (state.spawnTimer >= interval) {
        state.spawnTimer = 0;
        spawnItem();
    }
}

function gameLoop(timestamp) {
    if (!state.running) return;

    if (!lastTime) lastTime = timestamp;
    const deltaSeconds = Math.min((timestamp - lastTime) / 1000, 0.033);
    lastTime = timestamp;

    clearExpiredPowerups();
    updatePlayer(deltaSeconds);
    updateSpawn(deltaSeconds);
    updateItems(deltaSeconds);

    loopId = window.requestAnimationFrame(gameLoop);
}

function endGame(reason) {
    state.running = false;
    keys.left = false;
    keys.right = false;

    if (loopId) {
        window.cancelAnimationFrame(loopId);
        loopId = null;
    }

    if (statusTimeoutId) {
        window.clearTimeout(statusTimeoutId);
        statusTimeoutId = null;
    }
    if (statusDisplay) statusDisplay.classList.add("hidden");

    state.score = sanitizeScoreValue(state.score);
    if (state.score > state.highscore) {
        state.highscore = state.score;
        persistHighscore(state.highscore);
    }

    if (leaderboardOptIn) {
        if (state.score > 0) {
            configureLeaderboardOptIn(state.score);
            leaderboardOptIn.classList.remove("hidden");
        } else {
            leaderboardOptIn.classList.add("hidden");
        }
    }

    let earnedCoins = state.score * coinRatePerPoint;
    if (hasCartPower("ultimate")) {
        earnedCoins *= 1.75;
    } else if (hasCartPower("rose")) {
        earnedCoins *= 1.5;
    }
    earnedCoins = Math.round(earnedCoins * 10) / 10;

    state.coins = persistCoins(state.coins + earnedCoins);
    updateHUD();
    renderShop();

    if (resultText) resultText.textContent = `${reason} Dein Ergebnis: ${state.score} Punkte.`;
    if (coinResult) {
        const boostText = hasCartPower("ultimate")
            ? " (inkl. Ultimate-Bonus)"
            : (hasCartPower("rose") ? " (inkl. Rose-Bonus)" : "");
        coinResult.textContent = `+${formatCoins(earnedCoins)} Münzen${boostText}. Gesamt: ${formatCoins(state.coins)}.`;
    }
    if (gameOverScreen) gameOverScreen.classList.remove("hidden");
}

function startGame() {
    if (loopId) {
        window.cancelAnimationFrame(loopId);
        loopId = null;
    }
    if (statusTimeoutId) {
        window.clearTimeout(statusTimeoutId);
        statusTimeoutId = null;
    }

    clearItems();
    state = createInitialState();
    applyCartSkinClass();
    updateHUD();
    renderShop();

    if (startScreen) startScreen.classList.add("hidden");
    if (gameOverScreen) gameOverScreen.classList.add("hidden");
    if (leaderboardOptIn) leaderboardOptIn.classList.add("hidden");
    if (playerNameInput) {
        playerNameInput.value = getAccountUsername() || "";
        playerNameInput.disabled = false;
        playerNameInput.readOnly = Boolean(authState.user && getAccountUsername());
    }
    if (saveLeaderboardButton) saveLeaderboardButton.disabled = false;
    if (skipLeaderboardButton) skipLeaderboardButton.disabled = false;
    if (statusDisplay) statusDisplay.classList.add("hidden");
    if (coinResult) coinResult.textContent = "";
    configureLeaderboardOptIn();

    state.playerX = (gameWidth() - basePlayerWidth) / 2;
    state.playerY = 0;
    state.jumpVelocityY = 0;
    positionPlayer();

    lastTime = 0;
    loopId = window.requestAnimationFrame(gameLoop);
}

function setDirection(direction, active) {
    if (!state || !state.running) return;
    keys[direction] = active;
}

function activateUnlockAllCartsCheat() {
    if (!state) return;

    const maxedAbilities = uniqueAbilityDefs.reduce((acc, ability) => {
        acc[ability.key] = ability.maxLevel;
        return acc;
    }, {});

    state.ultimateCheatEnabled = persistUltimateCheatEnabled(true);
    state.unlockedCarts = persistUnlockedCarts(cartSkinKeys);
    state.selectedCart = persistSelectedCart("ultimate");
    state.abilities = persistAbilities(maxedAbilities);
    state.coins = persistCoins(maxStoredCoins);
    applyCartSkinClass();
    updateHUD();
    renderShop();
    setStatus("Geheimer Code aktiviert: Alle Wagen, Max-Fähigkeiten und unendliche Münzen!");
}

function bindButtonHold(button, direction) {
    const down = (event) => {
        event.preventDefault();
        setDirection(direction, true);
    };
    const up = (event) => {
        event.preventDefault();
        setDirection(direction, false);
    };

    button.addEventListener("pointerdown", down);
    button.addEventListener("pointerup", up);
    button.addEventListener("pointerleave", up);
    button.addEventListener("pointercancel", up);

    button.addEventListener("touchstart", down, { passive: false });
    button.addEventListener("touchend", up, { passive: false });
    button.addEventListener("touchcancel", up, { passive: false });
}

function bindTouchFieldControl() {
    const touchToDirection = (touchX) => {
        const gameRect = game.getBoundingClientRect();
        const relativeX = touchX - gameRect.left;
        return relativeX < gameRect.width / 2 ? "left" : "right";
    };

    const onTouchStart = (event) => {
        if (!state || !state.running) return;
        if (event.target.closest("button")) return;

        event.preventDefault();
        const direction = touchToDirection(event.touches[0].clientX);
        keys.left = direction === "left";
        keys.right = direction === "right";
    };

    const onTouchMove = (event) => {
        if (!state || !state.running) return;
        event.preventDefault();

        const direction = touchToDirection(event.touches[0].clientX);
        keys.left = direction === "left";
        keys.right = direction === "right";
    };

    const onTouchEnd = () => {
        keys.left = false;
        keys.right = false;
    };

    game.addEventListener("touchstart", onTouchStart, { passive: false });
    game.addEventListener("touchmove", onTouchMove, { passive: false });
    game.addEventListener("touchend", onTouchEnd);
    game.addEventListener("touchcancel", onTouchEnd);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        setDirection("left", true);
    }
    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        setDirection("right", true);
    }
    if (event.key === " " || event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
        event.preventDefault();
        jumpPlayer();
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        setDirection("left", false);
    }
    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        setDirection("right", false);
    }
});

if (restartButton) {
    restartButton.addEventListener("click", startGame);
}
if (startButton) {
    startButton.addEventListener("click", startGame);
}

if (saveLeaderboardButton && skipLeaderboardButton && playerNameInput && leaderboardOptIn) {
    saveLeaderboardButton.addEventListener("click", async () => {
        if (!state) return;
        if (state.leaderboardSubmitted) return;

        state.leaderboardSubmitted = true;
        saveLeaderboardButton.disabled = true;
        skipLeaderboardButton.disabled = true;
        playerNameInput.disabled = true;
        const playerName = authState.user ? getAccountUsername() : playerNameInput.value.trim();
        const result = await saveLeaderboard(playerName || "Anonym", state.score);
        leaderboardOptIn.classList.add("hidden");

        if (result.savedOnServer) {
            const savedLeagueLabel = getLeagueLabel(result.leagueKey);
            setStatus(result.guest ? "In die Gast-Liga eingetragen!" : `In die ${savedLeagueLabel}-Liga eingetragen!`);
            return;
        }

        setStatus("Ligaplatz konnte gerade nicht gespeichert werden.", "danger");
    });

    skipLeaderboardButton.addEventListener("click", () => {
        if (!state || state.leaderboardSubmitted) return;

        const enteredCode = playerNameInput.value.trim().toLowerCase();
        const shouldActivateCheat = enteredCode === unlockAllCartsCheatSequence;

        state.leaderboardSubmitted = true;
        saveLeaderboardButton.disabled = true;
        skipLeaderboardButton.disabled = true;
        playerNameInput.disabled = true;
        leaderboardOptIn.classList.add("hidden");

        if (shouldActivateCheat) {
            activateUnlockAllCartsCheat();
        }
    });
}

if (signInButton) {
    signInButton.addEventListener("click", () => {
        if (!authState.client) {
            setAuthStatusMessage("Supabase ist noch nicht verbunden.", "error");
            return;
        }

        signInWithUsername();
    });
}

if (signUpButton) {
    signUpButton.addEventListener("click", () => {
        if (!authState.client) {
            setAuthStatusMessage("Supabase ist noch nicht verbunden.", "error");
            return;
        }

        signUpWithUsername();
    });
}

if (signOutButton) {
    signOutButton.addEventListener("click", () => {
        signOutAccount();
    });
}

if (authPasswordInput) {
    authPasswordInput.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;

        event.preventDefault();
        if (!authState.client) {
            setAuthStatusMessage("Supabase ist noch nicht verbunden.", "error");
            return;
        }

        signInWithUsername();
    });
}

if (shopList) {
    shopList.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-cart-key]");
        if (!button) return;

        const cartKey = button.getAttribute("data-cart-key");
        if (!cartKey) return;

        if (state && state.unlockedCarts.includes(cartKey)) {
            selectCart(cartKey);
            return;
        }

        buyCart(cartKey);
    });
}

if (abilityShopList) {
    abilityShopList.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-ability-key]");
        if (!button) return;

        const abilityKey = button.getAttribute("data-ability-key");
        if (!abilityKey) return;
        buyAbility(abilityKey);
    });
}

if (cartShopTab) {
    cartShopTab.addEventListener("click", () => switchShopTab("carts"));
}
if (abilityShopTab) {
    abilityShopTab.addEventListener("click", () => switchShopTab("abilities"));
}

if (leftBtn) {
    bindButtonHold(leftBtn, "left");
}
if (rightBtn) {
    bindButtonHold(rightBtn, "right");
}
if (game) {
    bindTouchFieldControl();
}

window.addEventListener("resize", () => {
    if (!state) {
        centerPlayerIdle();
        return;
    }
    state.playerX = clamp(state.playerX, 0, gameWidth() - currentPlayerWidth());
    positionPlayer();
});

setCurrentLeagueSnapshot(createEmptyLeagueSnapshot({ guest: true, leagueKey: guestLeagueDef.key }));
state = createInitialState();
state.running = false;
applyCartSkinClass();
renderIdleHUD();
renderShop();
renderLeagueTabs();
configureLeaderboardOptIn();
renderAuthUI();
initializeSupabase();
loadLeaderboard();
centerPlayerIdle();
