#!/bin/bash
# codex-autosync.sh – Automatisches Commit & Push von Codex-Änderungen

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=== Codex Auto-Sync gestartet ===${NC}"

# Prüfen, ob wir in einem Git-Repo sind
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Fehler: Das aktuelle Verzeichnis ist kein Git-Repository.${NC}"
    exit 1
fi

BRANCH=$(git branch --show-current)
echo -e "Aktueller Branch: ${GREEN}$BRANCH${NC}"

# Neueste Änderungen von GitHub holen (verhindert Konflikte)
git pull --ff-only
if [ $? -ne 0 ]; then
    echo -e "${RED}Fehler beim git pull. Bitte manuell prüfen.${NC}"
    exit 1
fi

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

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Erfolgreich gepusht!${NC}"
else
    echo -e "${RED}Fehler beim Push. Bitte Zugang prüfen.${NC}"
    exit 1
fi

echo -e "${GREEN}=== Codex Auto-Sync abgeschlossen ===${NC}"
