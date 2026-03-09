#!/bin/bash
# codex-autosync.sh – Verbesserte Version mit strengerer Fehlerkontrolle

set -e  # Skript beenden, wenn ein Befehl fehlschlägt

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=== Codex Auto-Sync gestartet ===${NC}"

# Prüfen, ob wir in einem Git-Repo sind
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Fehler: Kein Git-Repository im aktuellen Verzeichnis.${NC}"
    exit 1
fi

# Prüfen, ob Benutzeridentität gesetzt ist (sonst bricht git commit später ab)
if [ -z "$(git config user.name)" ] || [ -z "$(git config user.email)" ]; then
    echo -e "${RED}Fehler: Git-Benutzeridentität nicht gesetzt.${NC}"
    echo "Bitte führe folgende Befehle aus (mit deinen Daten):"
    echo '  git config user.name "Dein Name"'
    echo '  git config user.email "deine.email@example.com"'
    echo "Oder global: mit --global"
    exit 1
fi

BRANCH=$(git branch --show-current)
echo -e "Aktueller Branch: ${GREEN}$BRANCH${NC}"

# Neueste Änderungen holen
git pull --ff-only

# Prüfen, ob es lokale Änderungen gibt
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${GREEN}Keine lokalen Änderungen.${NC}"
    exit 0
fi

echo -e "${YELLOW}Folgende Änderungen werden committet:${NC}"
git status -s

git add .
git commit -m "Auto-Sync von Codex am $(date '+%Y-%m-%d %H:%M:%S')"
git push origin $BRANCH

echo -e "${GREEN}Erfolgreich gepusht!${NC}"
echo -e "${GREEN}=== Codex Auto-Sync abgeschlossen ===${NC}"
